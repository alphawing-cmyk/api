package utils

import (
	db "api/db/sqlc"
	"api/logging"
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/rabbitmq/amqp091-go"
	"github.com/redis/go-redis/v9"
)

func ValidationErrors(validatorInstance *validator.Validate, data interface{}) map[string]string {
	vErrors := validatorInstance.Struct(data)
	var validationErrors map[string]string = map[string]string{}

	if vErrors != nil {
		for _, e := range vErrors.(validator.ValidationErrors) {
			validationErrors[e.Field()] = e.Error()
		}
		return validationErrors

	} else {
		return nil
	}
}

func DBConnectionString() (string, error) {
	var connStr string

	if os.Getenv("ENV") == "dev" {
		connStr = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_NAME"),
		)
	} else if os.Getenv("ENV") == "prod" {
		cwd, err := os.Getwd()

		if err != nil {
			logging.ColorFatal("Could not find current working directory")
			return "", err
		}
		sslCertPath := fmt.Sprintf("%s/server.crt", cwd)
		connStr = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=require&sslrootcert=%s",
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_NAME"),
			sslCertPath,
		)
	} else {
		connStr = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_NAME"),
		)
	}

	return connStr, nil
}

func GenerateForgetToken() (string, time.Time, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", time.Time{}, err
	}

	token := hex.EncodeToString(bytes)
	expiresAt := time.Now().Add(1 * time.Hour)

	return token, expiresAt, nil
}

func SetupAMQPExchange(channel *amqp091.Channel, queries *db.Queries) error {

	// Declare the 'vault' exchange (fanout type)
	err := channel.ExchangeDeclare(
		"vault",  // Exchange name
		"fanout", // Exchange type
		true,     // Durable
		false,    // Auto delete
		false,    // Internal
		false,    // No wait
		nil,      // Arguments
	)
	if err != nil {
		return errors.New("failed to declare exchange")
	}

	// Grab all services
	ctx := context.Background()
	services, err := queries.GetAllServices(ctx)

	if err != nil {
		fmt.Println(err)
		logging.ColorFatal("Could not fetch services")
	}

	for _, service := range services {
		_, err = channel.QueueDeclare(service.Username, true, false, false, false, amqp091.Table{
			"x-expires": 18000000,
		})
		if err != nil {
			log.Fatalf("Failed to declare queue %s: %v", service.Username, err)
		}
		err = channel.QueueBind(service.Username, "", "vault", false, nil)
		if err != nil {
			log.Fatalf("Failed to bind queue %s: %v", service.Username, err)
		}
	}

	return nil
}

func SetupRedisChannels(rdb *redis.Client, queries *db.Queries) error {
	ctx := context.Background()

	// Set all services
	services, err := queries.GetAllServices(ctx)
	if err != nil {
		logging.ColorFatal(err)
		return err
	}
	for _, service := range services {
		key := fmt.Sprintf("channel_%s", service.Username)
		err := rdb.Set(ctx, key, "initialized", 5*time.Hour).Err()

		if err != nil {
			log.Fatalf("Failed to set metadata for channel %s: %v", service.Username, err)
			return err
		}
	}
	return nil
}

func PublishRedisMessage(rdb *redis.Client, user db.User, channel string, message map[string]interface{}) error {
	ctx := context.Background()
	if user.Role == "service" {
		jsonMessage, err := json.Marshal(message)

		if err != nil {
			logging.ColorFatal(err)
			return err
		}

		err = rdb.Publish(ctx, fmt.Sprintf("channel_%s", user.Username), jsonMessage).Err()
		if err != nil {
			logging.ColorFatal(err)
			return err
		}
	}

	return nil
}

func NullToStr(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}

func ScheduleTask(task func(), period int, duration time.Duration) {
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
