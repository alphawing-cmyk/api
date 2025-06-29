/*
* ======== Calculation functions for OHLC data =======
 */

package utils

import (
	db "api/db/sqlc"
	"fmt"
	"math"
	"strconv"
)

func parseNum(num string) (float64, error) {
	return strconv.ParseFloat(num, 64)
}

func RSI(data []db.Historical, period int) ([]float64, error) {
	if len(data) < period+1 {
		return nil, fmt.Errorf("not enough data to compute RSI")
	}

	var rsis []float64
	var gains, losses float64

	// Calculate initial average gain and loss
	for i := 1; i <= period; i++ {
		currClose, err1 := parseNum(data[i].Close)
		prevClose, err2 := parseNum(data[i-1].Close)
		if err1 != nil || err2 != nil {
			return nil, fmt.Errorf("error parsing close price at index %d: %v %v", i, err1, err2)
		}

		change := currClose - prevClose
		if change > 0 {
			gains += change
		} else {
			losses -= change
		}
	}
	avgGain := gains / float64(period)
	avgLoss := losses / float64(period)

	// First RSI
	rs := avgGain / avgLoss
	firstRSI := 100 - (100 / (1 + rs))
	rsis = append(rsis, firstRSI)

	// Subsequent RSI values
	for i := period + 1; i < len(data); i++ {
		currClose, err1 := parseNum(data[i].Close)
		prevClose, err2 := parseNum(data[i-1].Close)
		if err1 != nil || err2 != nil {
			return nil, fmt.Errorf("error parsing close price at index %d: %v %v", i, err1, err2)
		}

		change := currClose - prevClose
		var gain, loss float64
		if change > 0 {
			gain = change
		} else {
			loss = -change
		}

		avgGain = (avgGain*(float64(period-1)) + gain) / float64(period)
		avgLoss = (avgLoss*(float64(period-1)) + loss) / float64(period)

		rs := avgGain / avgLoss
		rsi := 100 - (100 / (1 + rs))
		rsis = append(rsis, rsi)
	}

	// Prepend zeroes to align output length
	prefix := make([]float64, period)
	rsis = append(prefix, rsis...)

	return rsis, nil
}

func MA(data []db.Historical, period int) ([]float64, error) {
	if len(data) < period {
		return nil, fmt.Errorf("not enough data for SMA")
	}
	var sma []float64
	for i := 0; i <= len(data)-period; i++ {
		sum := 0.0
		for j := i; j < i+period; j++ {
			val, err := parseNum(data[j].Close)
			if err != nil {
				return nil, err
			}
			sum += val
		}
		sma = append(sma, sum/float64(period))
	}
	return sma, nil
}

func EMA(data []db.Historical, period int) ([]float64, error) {
	if len(data) < period {
		return nil, fmt.Errorf("not enough data for EMA")
	}
	var ema []float64
	multiplier := 2.0 / float64(period+1)

	// First EMA = SMA
	sum := 0.0
	for i := 0; i < period; i++ {
		val, err := parseNum(data[i].Close)
		if err != nil {
			return nil, err
		}
		sum += val
	}
	prevEMA := sum / float64(period)
	ema = append(ema, prevEMA)

	for i := period; i < len(data); i++ {
		price, err := parseNum(data[i].Close)
		if err != nil {
			return nil, err
		}
		currentEMA := (price-prevEMA)*multiplier + prevEMA
		ema = append(ema, currentEMA)
		prevEMA = currentEMA
	}

	// Align output length with input by prepending NaNs
	prefix := make([]float64, period-1)
	for i := range prefix {
		prefix[i] = math.NaN()
	}
	return append(prefix, ema...), nil
}

func ATR(data []db.Historical, period int) ([]float64, error) {
	if len(data) < period+1 {
		return nil, fmt.Errorf("not enough data for ATR")
	}
	var trs []float64
	for i := 1; i < len(data); i++ {
		high, err1 := parseNum(data[i].High)
		low, err2 := parseNum(data[i].Low)
		prevClose, err3 := parseNum(data[i-1].Close)
		if err1 != nil || err2 != nil || err3 != nil {
			return nil, fmt.Errorf("error parsing high/low/close at index %d", i)
		}
		tr := math.Max(high-low, math.Max(math.Abs(high-prevClose), math.Abs(low-prevClose)))
		trs = append(trs, tr)
	}

	var atrs []float64
	// First ATR = SMA of TRs
	sum := 0.0
	for i := 0; i < period; i++ {
		sum += trs[i]
	}
	prevATR := sum / float64(period)
	atrs = append(atrs, prevATR)

	for i := period; i < len(trs); i++ {
		currentATR := (prevATR*(float64(period-1)) + trs[i]) / float64(period)
		atrs = append(atrs, currentATR)
		prevATR = currentATR
	}

	// Align output with input length
	prefix := make([]float64, period)
	for i := range prefix {
		prefix[i] = math.NaN()
	}
	return append(prefix, atrs...), nil
}

func MAFromFloat64(data []float64, period int) []float64 {
	if len(data) < period {
		return nil
	}

	var ma []float64
	for i := 0; i <= len(data)-period; i++ {
		sum := 0.0
		for j := i; j < i+period; j++ {
			sum += data[j]
		}
		ma = append(ma, sum/float64(period))
	}

	// Pad beginning with NaNs for alignment
	prefix := make([]float64, period-1)
	for i := range prefix {
		prefix[i] = math.NaN()
	}
	return append(prefix, ma...)
}

func EMAFromFloat64(data []float64, period int) []float64 {
	var ema []float64
	if len(data) < period {
		return nil
	}
	multiplier := 2.0 / float64(period+1)

	// Initial SMA
	sum := 0.0
	for i := 0; i < period; i++ {
		sum += data[i]
	}
	prevEMA := sum / float64(period)
	ema = append(ema, prevEMA)

	for i := period; i < len(data); i++ {
		currentEMA := (data[i]-prevEMA)*multiplier + prevEMA
		ema = append(ema, currentEMA)
		prevEMA = currentEMA
	}

	// Pad with NaNs to match input length
	prefix := make([]float64, period-1)
	for i := range prefix {
		prefix[i] = math.NaN()
	}
	return append(prefix, ema...)
}

type MACDResult struct {
	MACDLine   []float64
	SignalLine []float64
	Histogram  []float64
}

func MACD(data []db.Historical) (*MACDResult, error) {
	if len(data) < 35 { // 26 + 9 minimum
		return nil, fmt.Errorf("not enough data to compute MACD")
	}

	// Compute EMA(12)
	ema12, err := EMA(data, 12)
	if err != nil {
		return nil, fmt.Errorf("error computing EMA(12): %v", err)
	}

	// Compute EMA(26)
	ema26, err := EMA(data, 26)
	if err != nil {
		return nil, fmt.Errorf("error computing EMA(26): %v", err)
	}

	// Calculate MACD Line = EMA(12) - EMA(26)
	var macdLine []float64
	for i := range data {
		if i >= len(ema12) || i >= len(ema26) {
			macdLine = append(macdLine, math.NaN())
			continue
		}
		if math.IsNaN(ema12[i]) || math.IsNaN(ema26[i]) {
			macdLine = append(macdLine, math.NaN())
		} else {
			macdLine = append(macdLine, ema12[i]-ema26[i])
		}
	}

	// Compute Signal Line = EMA(9) of MACD Line
	signalLine := EMAFromFloat64(macdLine, 9)

	// Compute Histogram = MACD Line - Signal Line
	var histogram []float64
	for i := range macdLine {
		if i >= len(signalLine) || math.IsNaN(macdLine[i]) || math.IsNaN(signalLine[i]) {
			histogram = append(histogram, math.NaN())
		} else {
			histogram = append(histogram, macdLine[i]-signalLine[i])
		}
	}

	return &MACDResult{
		MACDLine:   macdLine,
		SignalLine: signalLine,
		Histogram:  histogram,
	}, nil
}

func Volatility(data []db.Historical, period int) ([]float64, error) {
	if len(data) < period+1 {
		return nil, fmt.Errorf("not enough data to compute volatility")
	}

	var closes []float64
	for i, h := range data {
		val, err := parseNum(h.Close)
		if err != nil {
			return nil, fmt.Errorf("invalid close at index %d: %v", i, err)
		}
		closes = append(closes, val)
	}
	return VolatilityFromFloat64(closes, period), nil
}

func VolatilityFromFloat64(prices []float64, period int) []float64 {
	if len(prices) < period+1 {
		return nil
	}

	var vols []float64
	logReturns := make([]float64, len(prices)-1)

	// Compute log returns
	for i := 1; i < len(prices); i++ {
		if prices[i] <= 0 || prices[i-1] <= 0 {
			logReturns[i-1] = 0
		} else {
			logReturns[i-1] = math.Log(prices[i] / prices[i-1])
		}
	}

	// Compute rolling standard deviation
	for i := 0; i <= len(logReturns)-period; i++ {
		sum := 0.0
		for j := i; j < i+period; j++ {
			sum += logReturns[j]
		}
		mean := sum / float64(period)

		variance := 0.0
		for j := i; j < i+period; j++ {
			diff := logReturns[j] - mean
			variance += diff * diff
		}
		stddev := math.Sqrt(variance / float64(period))
		vols = append(vols, stddev)
	}

	// Pad with NaNs
	prefix := make([]float64, period)
	for i := range prefix {
		prefix[i] = math.NaN()
	}
	return append(prefix, vols...)
}
