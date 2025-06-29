package routes

import (
	"api/constants"
	"api/logging"
	"api/middleware"
	"api/utils"
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func symbolRoutes(r *mux.Router, s *ServiceHandler) {
	subrouter := r.PathPrefix("/symbols").Subrouter()

	roles := []constants.ServiceEnum{
		constants.ServiceEnum("ADMIN"),
		constants.ServiceEnum("SERVICE"),
		constants.ServiceEnum("DEMO"),
	}

	subrouter.Handle("/all",
		middleware.RBAC(roles...)(http.HandlerFunc(s.getSymbols)),
	).Methods("GET")
}

type AltName struct {
	Name   *string `json:"name"`
	Source *string `json:"source"`
}

type TickerDTO struct {
	ID        int32     `json:"id"`
	Symbol    string    `json:"symbol"`
	Name      string    `json:"name"`
	AltNames  []AltName `json:"alt_names"`
	Industry  string    `json:"industry"`
	Market    string    `json:"market"`
	MarketCap string    `json:"market_cap"`
}

func (s *ServiceHandler) getSymbols(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	tickers, err := s.db.queries.GetTickersByMarket(ctx, "STOCK")

	var result []TickerDTO
	for _, t := range tickers {
		var altNames []AltName
		if t.AltNames.Valid {
			if err := json.Unmarshal(t.AltNames.RawMessage, &altNames); err != nil {
				log.Printf("failed to unmarshal alt_names for symbol %s: %v", t.Symbol, err)
				altNames = []AltName{
					{Name: nil, Source: nil},
				}
			}
		}

		result = append(result, TickerDTO{
			ID:        t.ID,
			Symbol:    t.Symbol,
			Name:      t.Name,
			AltNames:  altNames,
			Industry:  utils.NullToStr(t.Industry),
			Market:    t.Market,
			MarketCap: utils.NullToStr(t.MarketCap),
		})
	}
	if err != nil {
		http.Error(w, "Could not fetch tickers", http.StatusBadRequest)
		return
	}

	jsonBody, err := json.Marshal(result)
	if err != nil {
		logging.ColorFatal(err)
		http.Error(w, "Error converting data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBody)
}
