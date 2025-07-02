package utils

import (
	db "api/db/sqlc"
	"api/logging"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

const POLYGON_V1_URL = "https://api.polygon.io/v1"
const POLYGON_V2_URL = "https://api.polygon.io/v2"
const POLYGON_V3_URL = "https://api.polygon.io/v3"

type Response struct {
	URL   string          `json:"url"`
	Data  json.RawMessage `json:"data"`
	Error error           `json:"-"`
}

type AggregateBarResponse struct {
	Ticker       string  `json:"ticker"`
	QueryCount   int64   `json:"queryCount"`
	ResultsCount int64   `json:"resultsCount"`
	Adjusted     bool    `json:"adjusted"`
	OHLCV        []OHLCV `json:"results"`
	Duration     string
}

type OHLCV struct {
	Volume         int     `json:"v"`
	VolumeWeighted float64 `json:"vw"`
	Open           float64 `json:"o"`
	Close          float64 `json:"c"`
	High           float64 `json:"h"`
	Low            float64 `json:"l"`
	Timestamp      int64   `json:"t"`
	NumberOfTrades int     `json:"n"`
}

func PolygonFetchAggregateBars(
	ticker string,
	multiplier int,
	timespan string,
	from time.Time,
	to time.Time,
	apiKey string,
) {
	url := fmt.Sprintf("%s/aggs/ticker/%s/range/%d/%s/%s/%s?adjusted=true&sort=asc&apiKey=%s",
		POLYGON_V2_URL,
		ticker,
		multiplier,
		timespan,
		from.Format("2006-01-02"),
		to.Format("2006-01-02"),
		apiKey,
	)
	res, err := http.Get(url)

	if err != nil {
		logging.ColorFatal(err.Error())
		return
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)

	if err != nil {
		logging.ColorFatal(err.Error())
		return
	}

	var response AggregateBarResponse
	json.Unmarshal(body, &response)
}

func PolygonFetchAggregateBarsAsync(
	tickers []string,
	multiplier int,
	timespan string,
	from time.Time,
	to time.Time,
	apiKey string,
) ([]AggregateBarResponse, error) {
	maxConcurrency := 5
	limiter := make(chan struct{}, maxConcurrency)
	var wg sync.WaitGroup
	results := make(chan Response, len(tickers))

	for _, ticker := range tickers {
		wg.Add(1)
		limiter <- struct{}{}

		url := fmt.Sprintf("%s/aggs/ticker/%s/range/%d/%s/%s/%s?adjusted=true&sort=asc&apiKey=%s",
			POLYGON_V2_URL,
			ticker,
			multiplier,
			timespan,
			from.Format("2006-01-02"),
			to.Format("2006-01-02"),
			apiKey,
		)

		go func(url string) {
			defer wg.Done()
			defer func() { <-limiter }()
			result := Response{URL: url}
			res, err := http.Get(url)

			if err != nil {
				logging.ColorFatal(err.Error())
			}

			defer res.Body.Close()
			body, err := io.ReadAll(res.Body)

			if err != nil {
				logging.ColorFatal(err.Error())
			}
			result.Data = json.RawMessage(body)
			results <- result

		}(url)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	var allResults []AggregateBarResponse

	for result := range results {
		if result.Error != nil {
			fmt.Printf("Error for %s: %v\n", result.URL, result.Error)
			continue
		}

		var response AggregateBarResponse
		json.Unmarshal(result.Data, &response)
		response.Duration = fmt.Sprintf("%d %s", multiplier, timespan)
		allResults = append(allResults, response)
		fmt.Printf("Successfully processed response from: %s\n", result.URL)
	}

	return allResults, nil
}

func PolygonStoreAggregatedResults(results []AggregateBarResponse, queries *db.Queries) {
	ctx := context.Background()

	for _, datum := range results {
		fmt.Println(datum.Ticker)
		ticker, err := queries.GetTickersByName(ctx, datum.Ticker)

		if err != nil {
			fmt.Println(err.Error())
			logging.ColorFatal(fmt.Sprintf("Skipped ticker %s", ticker.Name))
			continue
		}

		for _, ohlcv := range datum.OHLCV {
			params := db.InsertHistoricalBarParams{
				CustomID: fmt.Sprintf("%d-%s-%d-%s", ticker.ID, ticker.Name, ohlcv.Timestamp, datum.Duration),
				Symbol:   datum.Ticker,
				Milliseconds: sql.NullInt64{Int64: int64(ohlcv.Timestamp),
					Valid: true},
				Duration:     sql.NullString{String: datum.Duration, Valid: true},
				Timestamp:    time.UnixMilli(int64(ohlcv.Timestamp)),
				Open:         fmt.Sprintf("%f", ohlcv.Open),
				High:         fmt.Sprintf("%f", ohlcv.High),
				Low:          fmt.Sprintf("%f", ohlcv.Low),
				Close:        fmt.Sprintf("%f", ohlcv.Close),
				Volume:       sql.NullString{String: fmt.Sprintf("%d", ohlcv.Volume), Valid: true},
				Vwap:         sql.NullString{String: fmt.Sprintf("%f", ohlcv.VolumeWeighted), Valid: true},
				Transactions: sql.NullInt32{Int32: int32(ohlcv.NumberOfTrades), Valid: true},
				Source:       "POLYGON",
				Market:       ticker.Market,
			}

			_, err := queries.InsertHistoricalBar(
				ctx,
				params,
			)

			if err != nil {
				// logging.ColorFatal(fmt.Sprintf("Could not insert %s", datum.Ticker))
				continue
			}
		}
	}
}

type ExchangesResponse struct {
	Exchanges []Exchange `json:"results"`
}

type Exchange struct {
	ID            int64  `json:"id"`
	Type          string `json:"type"`
	AssetClass    string `json:"asset_class"`
	Locale        string `json:"locale"`
	Name          string `json:"name"`
	Acronym       string `json:"acronym"`
	MIC           string `json:"mic"`
	OperatingMIC  string `json:"operating_mic"`
	ParticipantID string `json:"participant_id"`
	URL           string `json:"url"`
}

func PolygonFetchExchanges(
	asset_class string,
	apiKey string,
) (*ExchangesResponse, error) {

	url := fmt.Sprintf("%s/reference/exchanges?asset_class=%s&sort=asc&apiKey=%s",
		POLYGON_V3_URL,
		asset_class,
		apiKey,
	)

	res, err := http.Get(url)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}

	var response ExchangesResponse
	json.Unmarshal(body, &response)
	return &response, nil
}

func PolygonStoreExchanges(results ExchangesResponse, queries *db.Queries) {
	ctx := context.Background()

	for _, exch := range results.Exchanges {
		params := db.GetExchangeParams{
			Name:       sql.NullString{String: exch.Name, Valid: true},
			AssetClass: sql.NullString{String: exch.AssetClass, Valid: true},
		}

		_, err := queries.GetExchange(ctx, params)

		if err != nil {
			params := db.InsertExchangeParams{
				Acronym:    sql.NullString{String: exch.Acronym, Valid: true},
				AssetClass: sql.NullString{String: exch.AssetClass, Valid: true},
				Name:       sql.NullString{String: exch.Name, Valid: true},
				Type:       sql.NullString{String: exch.Type, Valid: true},
				Url:        sql.NullString{String: exch.URL, Valid: true},
			}
			_, err := queries.InsertExchange(ctx, params)

			if err != nil {
				logging.ColorFatal(fmt.Sprintf("Could not store %s", exch.Name))
				continue
			}
		}

	}

}

type MarketHolidayResponse struct {
	Holidays []MarketHoliday
}

type MarketHoliday struct {
	Close    string `json:"close"`
	Date     string `json:"date"`
	Exchange string `json:"exchange"`
	Name     string `json:"name"`
	Open     string `json:"open"`
	Status   string `json:"status"`
}

func PolygonFetchHolidays(apiKey string) (*MarketHolidayResponse, error) {

	url := fmt.Sprintf("%s/marketstatus/upcoming?apiKey=%s",
		POLYGON_V1_URL,
		apiKey,
	)

	res, err := http.Get(url)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}

	var response []MarketHoliday
	json.Unmarshal(body, &response)

	var marketHolidyResponse MarketHolidayResponse
	marketHolidyResponse.Holidays = response
	return &marketHolidyResponse, nil
}

func PolygonStoreHolidays(results MarketHolidayResponse, queries *db.Queries) {
	ctx := context.Background()

	for _, holiday := range results.Holidays {

		date, err := time.Parse("2006-01-02", holiday.Date)

		if err != nil {
			logging.ColorFatal(err.Error())
			continue
		}

		_, err = queries.GetHoliday(ctx, date)

		if err != nil {
			params := db.InsertHolidayParams{
				Date:     date,
				Exchange: sql.NullString{String: holiday.Exchange, Valid: true},
				Name:     sql.NullString{String: holiday.Name, Valid: true},
				Status:   sql.NullString{String: holiday.Status, Valid: true},
			}
			_, err := queries.InsertHoliday(ctx, params)

			if err != nil {
				logging.ColorFatal(fmt.Sprintf("Could not store Name: %s, Exchange: %s", holiday.Name, holiday.Exchange))
				continue
			}
		}

	}
}
