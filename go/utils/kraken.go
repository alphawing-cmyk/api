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
	"time"
)

const KRAKEN_V0_URL = "https://api.kraken.com/0"

type ServerTimeResponse struct {
	Error  []interface{} `json:"error"`
	Result TimeResult    `json:"result"`
}

type TimeResult struct {
	UnixTime int64  `json:"unixtime"`
	RFC1123  string `json:"rfc1123"`
}

func KrakenGetServerTime() (*ServerTimeResponse, error) {
	client := &http.Client{}
	url := fmt.Sprintf("%s/public/Time", KRAKEN_V0_URL)
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}
	req.Header.Add("Accept", "application/json")

	res, err := client.Do(req)
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
	var response ServerTimeResponse
	json.Unmarshal(body, &response)
	return &response, nil
}

type StatusResponse struct {
	Error  []interface{} `json:"error"`
	Result StatusResult  `json:"result"`
}

type StatusResult struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
}

func KrakenGetSystemStatus() (*StatusResponse, error) {
	client := &http.Client{}
	url := fmt.Sprintf("%s/public/SystemStatus", KRAKEN_V0_URL)
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}
	req.Header.Add("Accept", "application/json")

	res, err := client.Do(req)
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
	var response StatusResponse
	json.Unmarshal(body, &response)
	return &response, nil
}

type AssetResponse struct {
	Error  []interface{}       `json:"error"`
	Result map[string]Currency `json:"result"`
}

type Currency struct {
	AssetClass      string  `json:"aclass"`
	AltName         string  `json:"altname"`
	Decimals        int     `json:"decimals"`
	DisplayDecimals int     `json:"display_decimals"`
	CollateralValue float64 `json:"collateral_value"`
	Status          string  `json:"status"`
}

func KrakenGetAssetInfo() (*AssetResponse, error) {
	client := &http.Client{}
	url := fmt.Sprintf("%s/public/Assets", KRAKEN_V0_URL)
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}
	req.Header.Add("Accept", "application/json")

	res, err := client.Do(req)
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
	var response AssetResponse
	json.Unmarshal(body, &response)
	return &response, nil
}

type TradingPairResponse struct {
	Error  []interface{}          `json:"error"`
	Result map[string]TradingPair `json:"result"`
}

type TradingPair struct {
	AltName            string      `json:"altname"`
	WSName             string      `json:"wsname"`
	AclassBase         string      `json:"aclass_base"`
	Base               string      `json:"base"`
	AclassQuote        string      `json:"aclass_quote"`
	Quote              string      `json:"quote"`
	Lot                string      `json:"lot"`
	CostDecimals       int         `json:"cost_decimals"`
	PairDecimals       int         `json:"pair_decimals"`
	LotDecimals        int         `json:"lot_decimals"`
	LotMultiplier      int         `json:"lot_multiplier"`
	LeverageBuy        []int       `json:"leverage_buy"`
	LeverageSell       []int       `json:"leverage_sell"`
	Fees               [][]float64 `json:"fees"`
	FeesMaker          [][]float64 `json:"fees_maker"`
	FeeVolumeCurrency  string      `json:"fee_volume_currency"`
	MarginCall         int         `json:"margin_call"`
	MarginStop         int         `json:"margin_stop"`
	OrderMin           string      `json:"ordermin"`
	CostMin            string      `json:"costmin"`
	TickSize           string      `json:"tick_size"`
	Status             string      `json:"status"`
	LongPositionLimit  int         `json:"long_position_limit"`
	ShortPositionLimit int         `json:"short_position_limit"`
}

func KrakenGetTradingPairs() (*TradingPairResponse, error) {
	client := &http.Client{}
	url := fmt.Sprintf("%s/public/Assets", KRAKEN_V0_URL)
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}
	req.Header.Add("Accept", "application/json")

	res, err := client.Do(req)
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
	var response TradingPairResponse
	json.Unmarshal(body, &response)
	return &response, nil
}

type TickerResponse struct {
	Error  []interface{}               `json:"error"`
	Result map[string]KrakenTickerInfo `json:"result"`
}

type KrakenTickerInfo struct {
	Ask       []string `json:"a"`
	Bid       []string `json:"b"`
	LastTrade []string `json:"c"`
	Volume    []string `json:"v"`
	VWAP      []string `json:"p"`
	Trades    []int    `json:"t"`
	Low       []string `json:"l"`
	High      []string `json:"h"`
	OpenPrice string   `json:"o"`
}

func KrakenGetTickerInfo() (*KrakenTickerInfo, error) {
	client := &http.Client{}
	url := fmt.Sprintf("%s/public/Assets", KRAKEN_V0_URL)
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}
	req.Header.Add("Accept", "application/json")

	res, err := client.Do(req)
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
	var response KrakenTickerInfo
	json.Unmarshal(body, &response)
	return &response, nil
}

type KrakenOHLCResponse struct {
	Error  []interface{}
	Result []KrakenOHLC
	Last   int64
}

type KrakenOHLCRawResponse struct {
	Error  []interface{}              `json:"error"`
	Result map[string][][]interface{} `json:"result"`
	Last   int64                      `json:"last"`
}

type KrakenOHLC struct {
	Milliseconds float64
	Open         string
	High         string
	Low          string
	Close        string
	VWAP         string
	Volume       string
	TradeCount   float64
	Ticker       string
	Duration     string
	Timestamp    time.Time
}

func KrakenGetOHCLInfo(pair string) (*KrakenOHLCResponse, error) {
	client := &http.Client{}
	url := fmt.Sprintf("%s/public/OHLC?pair=%s", KRAKEN_V0_URL, pair)
	fmt.Println(url)
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		logging.ColorFatal(err.Error())
		return nil, err
	}
	req.Header.Add("Accept", "application/json")

	res, err := client.Do(req)
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
	var response KrakenOHLCRawResponse
	json.Unmarshal(body, &response)

	var tickers []KrakenOHLC

	for _, record := range response.Result {
		var ohlc KrakenOHLC

		for _, row := range record {
			for idx, value := range row {
				switch idx {
				case 0:
					if v, ok := value.(float64); ok {
						ohlc.Milliseconds = v
						ohlc.Timestamp = time.UnixMilli(int64(v))
					}
				case 1:
					if v, ok := value.(string); ok {
						ohlc.Open = v
					}
				case 2:
					if v, ok := value.(string); ok {
						ohlc.High = v
					}
				case 3:
					if v, ok := value.(string); ok {
						ohlc.Low = v
					}
				case 4:
					if v, ok := value.(string); ok {
						ohlc.Close = v
					}

				case 5:
					if v, ok := value.(string); ok {
						ohlc.VWAP = v
					}

				case 6:
					if v, ok := value.(string); ok {
						ohlc.Volume = v
					}

				case 7:
					if v, ok := value.(float64); ok {
						ohlc.TradeCount = v
					}
				}
			}
			ohlc.Ticker = pair
			ohlc.Duration = "1 Minute"
			tickers = append(tickers, ohlc)
		}
	}

	return &KrakenOHLCResponse{
		Error:  response.Error,
		Result: tickers,
		Last:   response.Last,
	}, nil
}

func StoreKrakenOHLCData(results KrakenOHLCResponse, queries *db.Queries) {
	ctx := context.Background()

	for _, ohlcv := range results.Result {
		ticker, err := queries.GetTickersByName(ctx, ohlcv.Ticker)

		if err != nil {
			fmt.Println(err.Error())
			logging.ColorFatal(fmt.Sprintf("Skipped ticker %s", ticker.Name))
			continue
		}

		params := db.InsertHistoricalBarParams{
			CustomID:     fmt.Sprintf("%d-%s-%d-%s", ticker.ID, ticker.Name, int64(ohlcv.Milliseconds), ohlcv.Duration),
			TickerID:     sql.NullInt32{Int32: int32(ticker.ID), Valid: true},
			Symbol:       ohlcv.Ticker,
			Milliseconds: sql.NullInt64{Int64: int64(ohlcv.Milliseconds), Valid: true},
			Duration:     sql.NullString{String: ohlcv.Duration, Valid: true},
			Timestamp:    time.Unix(int64(ohlcv.Milliseconds), 0).UTC(),
			Open:         ohlcv.Open,
			High:         ohlcv.High,
			Low:          ohlcv.Low,
			Close:        ohlcv.Close,
			Volume:       sql.NullString{String: ohlcv.Volume, Valid: true},
			Vwap:         sql.NullString{String: ohlcv.VWAP, Valid: true},
			Transactions: sql.NullInt32{Int32: int32(ohlcv.TradeCount), Valid: true},
			Source:       "KRAKEN",
			Market:       ticker.Market,
		}

		_, err = queries.InsertHistoricalBar(ctx, params)

		if err != nil {
			logging.ColorFatal(fmt.Sprintf("Could not insert %s", ohlcv.Ticker))
			continue
		}
	}
}
