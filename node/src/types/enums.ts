enum RoleEnum {
  Demo = "demo",
  Client = "client",
  Admin = "admin",
  Service = "service",
}

enum BrokerEnum {
  TRADESTATION = "tradestation",
  ALPACA = "alpaca",
  KRAKEN = "kraken",
  COINBASE = "coinbase",
  INTERACTIVE_BROKERS = "interactive_brokers",
  OANDA = "oanda",
}

enum AccountTypeEnum {
  SERVICE_ACCOUNT = "service_account",
  LIVE_ACCOUNT = "live_account",
  PAPER_ACCOUNT = "paper_account",
}

enum ApiStatusEnum {
  active = "active",
  disabled = "disabled"
}

export { RoleEnum, BrokerEnum, AccountTypeEnum, ApiStatusEnum };