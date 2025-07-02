package routes

import (
	"api/constants"
	db "api/db/sqlc"
	"api/logging"
	"api/middleware"
	"api/utils"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

func symbolRoutes(r *mux.Router, s *ServiceHandler) {
	subrouter := r.PathPrefix("/symbols").Subrouter()

	subrouter.Handle("/all",
		middleware.RBAC(constants.AllRoles...)(http.HandlerFunc(s.getSymbols)),
	).Methods("GET")
	subrouter.Handle("/market",
		middleware.RBAC(constants.AllRoles...)(http.HandlerFunc(s.getSymbolsByType)),
	).Methods("GET")
	subrouter.Handle("/historical/symbol",
		middleware.RBAC(constants.AllRoles...)(http.HandlerFunc(s.getHistoricalBySymbol)),
	).Methods("GET")
	subrouter.Handle("/strategy/calcualte",
		middleware.RBAC(constants.AllRoles...)(http.HandlerFunc(s.calculateStrategyData)),
	).Methods("POST")
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
	tickers, err := s.db.queries.GetTickers(ctx)

	result := make([]TickerDTO, 0)

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

func (s *ServiceHandler) getSymbolsByType(w http.ResponseWriter, r *http.Request) {
	market := r.URL.Query().Get("market")

	ctx := context.Background()
	tickers, err := s.db.queries.GetTickersByMarket(ctx, market)

	result := make([]TickerDTO, 0)
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

type HistoricalDTO struct {
	Timestamp    time.Time `json:"timestamp"`
	Symbol       string    `json:"symbol"`
	Open         *float64  `json:"open"`
	High         *float64  `json:"high"`
	Low          *float64  `json:"low"`
	Close        *float64  `json:"close"`
	AdjClose     *float64  `json:"adj_close"`
	Volume       *int64    `json:"volume"`
	VWAP         *float64  `json:"vwap"`
	Transactions int32     `json:"transactions"`
	Source       string    `json:"source"`
	Market       string    `json:"market"`
}

func (s *ServiceHandler) getHistoricalBySymbol(w http.ResponseWriter, r *http.Request) {
	symbol := r.URL.Query().Get("symbol")
	fromStr := r.URL.Query().Get("from")
	toStr := r.URL.Query().Get("to")

	log.Printf("Received historical data request — symbol: %s, from: %s, to: %s", symbol, fromStr, toStr)

	if symbol == "" || fromStr == "" || toStr == "" {
		http.Error(w, "Missing query parameters: symbol, from, to", http.StatusBadRequest)
		return
	}

	from, err := time.Parse(time.RFC3339, fromStr)
	if err != nil {
		http.Error(w, "Invalid 'from' format. Use RFC3339 format: YYYY-MM-DDTHH:MM:SS±HH:MM", http.StatusBadRequest)
		return
	}

	to, err := time.Parse(time.RFC3339, toStr)
	if err != nil {
		http.Error(w, "Invalid 'to' format. Use RFC3339 format: YYYY-MM-DDTHH:MM:SS±HH:MM", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	params := db.GetHistoricalBySymbolAndTimestampRangeParams{
		Symbol:      symbol,
		Timestamp:   from,
		Timestamp_2: to,
	}
	rows, err := s.db.queries.GetHistoricalBySymbolAndTimestampRange(ctx, params)
	if err != nil {
		log.Printf("Failed to fetch historical data for %s: %v", symbol, err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	result := make([]HistoricalDTO, 0, len(rows))
	fmt.Printf("The number of rows is %d\n", len(rows))
	for _, row := range rows {
		result = append(result, HistoricalDTO{
			Timestamp:    row.Timestamp,
			Symbol:       row.Symbol,
			Open:         utils.StringToFloat(row.Open),
			High:         utils.StringToFloat(row.High),
			Low:          utils.StringToFloat(row.Low),
			Close:        utils.StringToFloat(row.Close),
			AdjClose:     utils.StringToFloat(row.AdjClose.String),
			Volume:       utils.StringToInt64(row.Volume.String),
			VWAP:         utils.StringToFloat(row.Vwap.String),
			Transactions: row.Transactions.Int32,
			Source:       row.Source,
			Market:       row.Market,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// Create a function that calculates whatever indicator is needed like MA

type StrategyBody struct {
	Strategy string          `json:"strategy" validate:"required"`
	FromStr  string          `json:"from" validate:"required"`
	ToStr    string          `json:"to" validate:"required"`
	Params   json.RawMessage `json:"params" validate:"required"`
}

func (s *ServiceHandler) calculateStrategyData(w http.ResponseWriter, r *http.Request) {
	symbol := r.URL.Query().Get("symbol")
	fromStr := r.URL.Query().Get("from")
	toStr := r.URL.Query().Get("to")

	log.Printf("Received historical data request — symbol: %s, from: %s, to: %s", symbol, fromStr, toStr)

	if symbol == "" || fromStr == "" || toStr == "" {
		http.Error(w, "Missing query parameters: symbol, from, to", http.StatusBadRequest)
		return
	}

	from, err := time.Parse(time.RFC3339, fromStr)
	if err != nil {
		http.Error(w, "Invalid 'from' format. Use RFC3339 format: YYYY-MM-DDTHH:MM:SS±HH:MM", http.StatusBadRequest)
		return
	}

	to, err := time.Parse(time.RFC3339, toStr)
	if err != nil {
		http.Error(w, "Invalid 'to' format. Use RFC3339 format: YYYY-MM-DDTHH:MM:SS±HH:MM", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	params := db.GetHistoricalBySymbolAndTimestampRangeParams{
		Symbol:      symbol,
		Timestamp:   from,
		Timestamp_2: to,
	}
	rows, err := s.db.queries.GetHistoricalBySymbolAndTimestampRange(ctx, params)
	if err != nil {
		log.Printf("Failed to fetch historical data for %s: %v", symbol, err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
}

func calcStrategy(
	strategy string,
	data []db.Historical,
) ([]float64, error) {

	switch {
	case strategy == "MA":
		results, err := utils.MA(data, 14)

		if err != nil {
			return nil, err
		}
		return results, nil
	}

	return nil, nil
}
