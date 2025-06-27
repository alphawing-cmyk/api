CREATE TABLE exchanges (
    id SERIAL PRIMARY KEY,
    acronym VARCHAR(200),
    asset_class VARCHAR(200),
    name VARCHAR(200),
    type VARCHAR(200),
    url TEXT
);
CREATE INDEX idx_exchanges_id ON exchanges(id);
