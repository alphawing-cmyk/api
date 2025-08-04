package main

import (
	db "api/db/sqlc"
	"api/logging"
	"api/routes"
	"api/utils"
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load(".env")
	ctx := context.Background()

	if err != nil {
		logging.ColorFatal("Error loading .env file")
		return
	}

	connStr, err := utils.DBConnectionString()

	if err != nil {
		logging.ColorFatal("Could not create database connection string")
		return
	}

	dbConn, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Could not connect to postgres database")
	}
	dbIndex, err := strconv.Atoi(os.Getenv("REDIS_DB"))
	if err != nil {
		log.Fatalf("Invalid REDIS_RB value: %v", err)
	}

	// Setup redis instance
	rdb := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_URL"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       dbIndex,
	})

	if err != nil {
		logging.ColorFatal(err.Error())
		return
	}

	ping, err := rdb.Ping(ctx).Result()
	if err != nil {
		panic(err)
	}
	fmt.Println("Connected to redis instance PING:", ping)
	queries := db.New(dbConn)

	// Setup redis channels
	err = utils.SetupRedisChannels(rdb, queries)
	if err != nil {
		panic(err)
	}

	// Initialize tasks
	InitializeTasks(queries)

	router := routes.NewRouter(queries, rdb)
	port := os.Getenv("API_PORT")
	defer dbConn.Close()

	if port != "" {
		fmt.Printf("Running on http://localhost:%s\n", port)
		err := http.ListenAndServe(":"+port, router)
		if err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	} else {
		fmt.Printf("Running on http://localhost:8100")
		http.ListenAndServe(":"+port, router)
	}

}

func InitializeTasks(queries *db.Queries) {
	go utils.ScheduleTask(func() {
		exchanges, err := utils.PolygonFetchExchanges("stocks", os.Getenv("POLYGON_KEY"))
		if err != nil {
			logging.ColorFatal(err.Error())
			return
		}
		utils.PolygonStoreExchanges(*exchanges, queries)
		log.Println("Exchanges updated.")
	}, 24, time.Hour)

	go utils.ScheduleTask(func() {
		holidays, err := utils.PolygonFetchHolidays(os.Getenv("POLYGON_KEY"))
		if err != nil {
			logging.ColorFatal(err.Error())
			return
		}
		utils.PolygonStoreHolidays(*holidays, queries)
		log.Println("Holidays updated.")
	}, 24, time.Hour)

	go utils.ScheduleTask(func() {
		// Store historical
		ctx := context.Background()
		tickers, err := queries.GetTickersByMarket(ctx, "STOCK")
		if err != nil {
			logging.ColorFatal(err.Error())
			return
		}

		var symbols []string

		for _, ticker := range tickers {
			symbols = append(symbols, ticker.Symbol)
		}

		fmt.Println(symbols)

		data, err := utils.PolygonFetchAggregateBarsAsync(
			symbols,
			1,
			"minute",
			time.Now().AddDate(0, 0, -10),
			time.Now(),
			os.Getenv("POLYGON_KEY"),
		)

		if err != nil {
			logging.ColorFatal(err.Error())
			return
		}
		utils.PolygonStoreAggregatedResults(data, queries)
		log.Println("Historical data updated.")
	}, 10, time.Minute)

	go utils.ScheduleTask(func() {
		// Store historical
		ctx := context.Background()
		tickers, err := queries.GetTickersByMarket(ctx, "CRYPTO")
		if err != nil {
			logging.ColorFatal(err.Error())
			return
		}

		var symbols []string

		for _, ticker := range tickers {
			symbols = append(symbols, ticker.Symbol)
		}

		fmt.Println("Crypto symbols are: ")
		fmt.Println(symbols)
		for _, ticker := range tickers {
			historicalData, err := utils.KrakenGetOHCLInfo(ticker.Symbol)

			if err != nil {
				continue
			}
			fmt.Println(historicalData.Result)
			utils.StoreKrakenOHLCData(*historicalData, queries)
		}
	}, 10, time.Minute)
}
