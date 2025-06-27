CREATE TABLE api (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    platform "Broker" NOT NULL,
    service_level "AccountType" NOT NULL,
    api_key TEXT,
    secret TEXT,
    access_token TEXT,
    refresh_token TEXT,
    expiration TIMESTAMP,
    state TEXT,
    scope TEXT,
    status "ApiStatusType" DEFAULT 'active',
    nickname VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_api_id ON api(id);
