from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # env
    env: str | None = "dev"
    
    # Database
    db_name: str | None = None
    db_user: str | None = None
    db_password: str | None = None
    db_host: str | None = None
    db_port: int | None = None

    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: str | None = None

    # Secrets
    jwt_secret: str | None = ""
    aes_256_secret: str | None = ""
    remix_cookie_secret: str | None = ""

    # API Keys
    polygon_key: str | None = ""
 
    # Tokens and Expiry (optional)
    access_token_expire_minutes: int = 30
    refresh_token_expire_minutes: int = 10080

    # Optional Mailgun
    mailgun_api_key: str | None = None
    mailgun_sender: str | None = None
    mailgun_domain: str | None = None

    # Optional RabbitMQ
    rabbitmq_url: str | None = None

    class Config:
        env_file = ".env"
        extra    = "allow"


# Instantiate the settings
settings = Settings()

