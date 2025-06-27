package routes

import (
	db "api/db/sqlc"

	"github.com/gorilla/mux"
	"github.com/rabbitmq/amqp091-go"
)

type DBHandler struct {
	queries *db.Queries
}
type AmqpHandler struct {
	conn    *amqp091.Connection
	channel *amqp091.Channel
}

type ServiceHandler struct {
	db   *DBHandler
	amqp *AmqpHandler
}

func NewRouter(
	queries *db.Queries,
) *mux.Router {
	r := mux.NewRouter()
	h := &DBHandler{
		queries: queries,
	}
	serviceHandler := &ServiceHandler{
		db: h,
	}

	authRoutes(r, serviceHandler)
	kvRoutes(r, serviceHandler)
	return r
}
