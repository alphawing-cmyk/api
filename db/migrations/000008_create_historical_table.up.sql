CREATE TABLE historical (
    id SERIAL PRIMARY KEY,
    custom_id VARCHAR(255) UNIQUE NOT NULL,
    symbol VARCHAR(255) NOT NULL,
    milliseconds BIGINT DEFAULT 0,
    duration VARCHAR(20),
    open DECIMAL(30,15) NOT NULL,
    low DECIMAL(30,15) NOT NULL,
    high DECIMAL(30,15) NOT NULL,
    close DECIMAL(30,15) NOT NULL,
    adj_close DECIMAL(30,15),
    volume DECIMAL(20,2) DEFAULT 0,
    vwap DECIMAL(30,15) DEFAULT 0,
    timestamp TIMESTAMP NOT NULL,
    transactions INT DEFAULT 0,
    source VARCHAR(30) NOT NULL,
    market VARCHAR(30) NOT NULL,
    FOREIGN KEY (symbol) REFERENCES tickers(symbol)
);
CREATE INDEX idx_historical_id ON historical(id);
CREATE INDEX idx_historical_timestamp ON historical(timestamp);
CREATE INDEX idx_historical_custom_id ON historical(custom_id);
