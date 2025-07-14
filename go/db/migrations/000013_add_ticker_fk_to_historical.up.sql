-- Add ticker_id column to historical table
ALTER TABLE historical
ADD COLUMN ticker_id INTEGER;

-- Add foreign key constraint
ALTER TABLE historical
ADD CONSTRAINT fk_historical_ticker
FOREIGN KEY (ticker_id) REFERENCES tickers(id)
ON DELETE CASCADE;