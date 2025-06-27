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
	fmt.Println("Connected:", ping)

	defer dbConn.Close()
	queries := db.New(dbConn)

	defer dbConn.Close()

	router := routes.NewRouter(queries)
	port := os.Getenv("API_PORT")

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

func scheduleTask(task func(), period int, duration time.Duration) {
	for {
		now := time.Now()
		nextRun := time.Date(
			now.Year(),
			now.Month(),
			now.Day(),
			now.Hour(),
			now.Minute(),
			now.Second(),
			now.Nanosecond(),
			now.Location())

		if now.After(nextRun) {
			nextRun = nextRun.Add(time.Duration(period) * duration)
		}
		time.Sleep(time.Until(nextRun))
		task()
		time.Sleep(time.Duration(period) * duration)
	}
}
