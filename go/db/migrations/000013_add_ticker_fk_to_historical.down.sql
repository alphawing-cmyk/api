-- Drop the foreign key constraint
ALTER TABLE historical
DROP CONSTRAINT IF EXISTS fk_historical_ticker;

-- Drop the ticker_id column
ALTER TABLE historical
DROP COLUMN IF EXISTS ticker_id;
