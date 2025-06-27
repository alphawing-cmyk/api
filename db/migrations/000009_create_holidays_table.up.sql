CREATE TABLE holidays (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    exchange VARCHAR(200),
    name VARCHAR(200),
    status VARCHAR(200)
);
CREATE INDEX idx_holidays_id ON holidays(id);
CREATE INDEX idx_holidays_date ON holidays(date);
