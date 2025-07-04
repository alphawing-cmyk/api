CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN,
    role "Role" NOT NULL,
    img_path TEXT,
    refresh_token VARCHAR(255),
    forgot_token VARCHAR(255)
);
CREATE INDEX ix_users_id ON users(id);
