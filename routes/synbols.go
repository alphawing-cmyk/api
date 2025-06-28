package routes

import (
	"api/constants"
	"api/middleware"
	"context"
	"encoding/json"
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

type SymbolBody struct {
	Symbol    string `json:"symbol"`
	Name      string `json:"name"`
	Industry  string `json:"industry,omitempty"`
	Market    string `json:"market"`
	MarketCap string `json:"market_cap,omitempty"`
}

func (s *ServiceHandler) getSymbols(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	tickers, err := s.db.queries.GetTickersByMarket(ctx, "STOCK")

	if err != nil {
		http.Error(w, "Could not fetch tickers", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tickers); err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		return
	}
}
