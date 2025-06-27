package routes

import (
	db "api/db/sqlc"

	"github.com/gorilla/mux"
	"github.com/rabbitmq/amqp091-go"
	"github.com/redis/go-redis/v9"
)

type DBHandler struct {
	queries *db.Queries
}
type AmqpHandler struct {
	conn    *amqp091.Connection
	channel *amqp091.Channel
}
type RedisHandler struct {
	client *redis.Client
}

type ServiceHandler struct {
	db  *DBHandler
	rdp *RedisHandler
}

func NewRouter(
	queries *db.Queries,
	redisClient *redis.Client,
) *mux.Router {
	r := mux.NewRouter()
	h := &DBHandler{
		queries: queries,
	}
	rdp := &RedisHandler{
		client: redisClient,
	}
	serviceHandler := &ServiceHandler{
		db:  h,
		rdp: rdp,
	}

	authRoutes(r, serviceHandler)
	kvRoutes(r, serviceHandler)
	return r
}
