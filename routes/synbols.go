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
	"time"

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
	subrouter.Handle("/market",
		middleware.RBAC(roles...)(http.HandlerFunc(s.getSymbolsByType)),
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
	Open         float64   `json:"open"`
	High         float64   `json:"high"`
	Low          float64   `json:"low"`
	Close        float64   `json:"close"`
	AdjClose     float64   `json:"adj_close"`
	Volume       int64     `json:"volume"`
	VWAP         float64   `json:"vwap"`
	Transactions int32     `json:"transactions"`
	Source       string    `json:"source"`
	Market       string    `json:"market"`
}

func (s *ServiceHandler) getHistoricalBySymbol(w http.ResponseWriter, r *http.Request) {
	symbol := r.URL.Query().Get("symbol")
	fromStr := r.URL.Query().Get("from")
	toStr := r.URL.Query().Get("to")

	if symbol == "" || fromStr == "" || toStr == "" {
		http.Error(w, "Missing query parameters: symbol, from, to", http.StatusBadRequest)
		return
	}

	from, err := time.Parse("2006-01-02", fromStr)
	if err != nil {
		http.Error(w, "Invalid 'from' format. Use YYYY-MM-DD", http.StatusBadRequest)
		return
	}

	to, err := time.Parse("2006-01-02", toStr)
	if err != nil {
		http.Error(w, "Invalid 'to' format. Use YYYY-MM-DD", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	rows, err := s.db.queries.GetHistoricalBySymbolAndTimestampRange(ctx, symbol, from, to)
	if err != nil {
		log.Printf("Failed to fetch historical data for %s: %v", symbol, err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	result := make([]HistoricalDTO, 0, len(rows))
	for _, row := range rows {
		result = append(result, HistoricalDTO{
			Timestamp:    row.Timestamp,
			Symbol:       row.Symbol,
			Open:         row.Open,
			High:         row.High,
			Low:          row.Low,
			Close:        row.Close,
			AdjClose:     row.AdjClose,
			Volume:       row.Volume,
			VWAP:         row.Vwap,
			Transactions: row.Transactions,
			Source:       row.Source,
			Market:       row.Market,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
