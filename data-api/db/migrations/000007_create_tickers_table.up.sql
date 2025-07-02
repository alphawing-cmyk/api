CREATE TABLE tickers (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    alt_names JSON,
    industry VARCHAR(255),
    market VARCHAR(255) NOT NULL,
    market_cap VARCHAR(255)
);
CREATE INDEX idx_tickers_id ON tickers(id);
CREATE INDEX idx_tickers_symbol ON tickers(symbol);
