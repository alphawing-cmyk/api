CREATE TYPE "Role" AS ENUM ('demo', 'client', 'admin', 'service');
CREATE TYPE "Broker" AS ENUM ('tradestation', 'alpaca', 'kraken', 'coinbase', 'interactive_brokers', 'oanda');
CREATE TYPE "AccountType" AS ENUM ('service_account', 'live_account', 'paper_account');
CREATE TYPE "ApiStatusType" AS ENUM ('active', 'disabled');
