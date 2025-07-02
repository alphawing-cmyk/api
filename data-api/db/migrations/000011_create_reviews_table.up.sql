CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    rating INT NOT NULL,
    user_id INT NOT NULL,
    date_created TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_reviews_id ON reviews(id);
