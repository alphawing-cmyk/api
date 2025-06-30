-- name: GetExchanges :many
SELECT * FROM "exchanges";

-- name: GetRoles :many
SELECT e.enumlabel AS role
FROM pg_catalog.pg_type t
JOIN pg_catalog.pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'Role';

-- name: CheckUserExists :one
SELECT EXISTS (
  SELECT 1 FROM users
  WHERE username = $1
     OR email = $2
);

-- name: CreateUser :one
INSERT INTO users (
  username,
  first_name,
  last_name,
  email,
  company,
  password,
  is_active,
  role
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, username, first_name, last_name, email, company, is_active, role;

-- name: GetUserById :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: GetUserByUsername :one
SELECT * FROM USERS
WHERE username = $1;

-- name: GetUserByEmail :one
SELECT * FROM USERS
WHERE email = $1;

-- name: GetUserByForgotToken :one
SELECT * FROM USERS
WHERE forgot_token = $1;

-- name: UpdateRefreshToken :exec
UPDATE users
SET refresh_token = $1
WHERE id = $2;

-- name: UpdateForgotToken :exec
UPDATE users
SET forgot_token = $1
WHERE id = $2;

-- name: UpdatePasswordByToken :exec
UPDATE users
SET password = $1,
    forgot_token = NULL
WHERE forgot_token = $2;

-- name: InsertKv :exec
INSERT INTO kv (
  key, value,user_id
) VALUES (
  $1, $2, $3
)
RETURNING *;

-- name: GetKvById :one
SELECT * FROM kv
WHERE id = $1;

-- name: GetKvByUser :many
SELECT * FROM kv
WHERE user_id = $1;

-- name: DeleteKvById :exec
DELETE FROM kv
WHERE id = $1;

-- name: UpdateKv :exec
UPDATE kv
SET
    key = $2,
    value = $3,
    user_id = $4
WHERE id = $1;

-- name: GetPaginatedKv :many
SELECT 
  id,
  key,
  value,
  user_id
FROM kv
ORDER BY id
LIMIT $1 
OFFSET $2;

-- name: CountKv :one
SELECT 
  count(*) as num_records
FROM kv;

-- name: GetAllServices :many
SELECT * FROM users
WHERE role = 'service';

-- name: GetTickers :many
SELECT * FROM tickers;

-- name: GetTickersByMarket :many
SELECT * FROM tickers
WHERE market = $1;

-- name: GetTickersByName :one
SELECT * FROM tickers
WHERE symbol = $1;

-- name: InsertHistoricalBar :one
INSERT INTO historical (
    custom_id,
    symbol,
    milliseconds,
    duration,
    open,
    low,
    high,
    close,
    adj_close,
    volume,
    vwap,
    "timestamp",
    transactions,
    source,
    market
) VALUES (
    $1,  -- custom_id
    $2,  -- symbol
    $3,  -- milliseconds
    $4,  -- duration
    $5,  -- open
    $6,  -- low
    $7,  -- high
    $8,  -- close
    $9,  -- adj_close
    $10, -- volume
    $11, -- vwap
    $12, -- timestamp
    $13, -- transactions
    $14, -- source
    $15  -- market
)
ON CONFLICT (custom_id) DO NOTHING
RETURNING *;

-- name: GetExchange :one
SELECT * FROM exchanges
WHERE asset_class = $1 
AND name = $2;


-- name: InsertExchange :one
INSERT INTO exchanges (
   acronym,
   asset_class,
   name, 
   type,
   url
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
)
RETURNING *;

-- name: GetHoliday :one
SELECT * FROM holidays
WHERE date=$1;

-- name: InsertHoliday :one
INSERT INTO holidays (
   date,
   exchange,
   name,
   status
) VALUES (
  $1,
  $2,
  $3,
  $4
)
RETURNING *;

-- name: GetHistoricalBySymbolAndTimestampRange :many
SELECT timestamp, symbol, open, high, low, close, adj_close, volume, vwap, transactions, source, market
FROM historical
WHERE symbol = $1 AND timestamp BETWEEN $2 AND $3
ORDER BY timestamp ASC;
