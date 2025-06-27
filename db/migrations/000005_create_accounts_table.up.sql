CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    account_num VARCHAR(255) NOT NULL,
    nickname VARCHAR(255),
    broker "Broker" NOT NULL,
    date_opened DATE,
    initial_balance DECIMAL(15, 2) DEFAULT 0.00,
    current_balance DECIMAL(15, 2) DEFAULT 0.00,
    account_type "AccountType" NOT NULL,
    auto_trade BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_accounts_id ON accounts(id);
