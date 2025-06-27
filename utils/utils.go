package utils

import (
	db "api/db/sqlc"
	"api/logging"
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/rabbitmq/amqp091-go"
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
