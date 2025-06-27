package main

import (
	"api/logging"
	"api/routes"
	"api/utils"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	db "api/db/sqlc"

	_ "github.com/lib/pq"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load(".env")

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
		logging.ColorFatal(err.Error())
		return
	}
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
