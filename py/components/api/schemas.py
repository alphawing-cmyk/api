from pydantic import BaseModel, field_validator
from pydantic_core import PydanticCustomError
from typing import Optional
from enum import Enum
from datetime import datetime, timezone
from components.utils import decrypt, encrypt
from components.accounts.models import BrokerEnum, AccountTypeEnum


class Broker(str,Enum):
    tradestation        = "tradestation"
    alpaca              = "alpaca"
    kraken              = "kraken"
    coinbase            = "coinbase"
    interactive_brokers = "interactive_brokers"
    oanda               = "oanda"

class AccountType(str, Enum):
     service_account = "service_account"
     live_account    = "live_account"
     paper_account   = "paper_account"

class ApiStatusType(str, Enum):
     active     = "active"
     disabled   = "disabled"


class ApiUserInfo(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str

    class Config:
        from_attributes = True

class ApiStatusEnum(str, Enum):
    active = "active"
    disabled = "disabled"

class AddApiBody(BaseModel):
    user_id: int
    platform: BrokerEnum
    service_level: AccountTypeEnum
    api_key: Optional[str] = None
    secret: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    expiration: Optional[datetime] = None
    state: Optional[str] = None
    scope: Optional[str] = None
    status: ApiStatusEnum
    nickname: Optional[str] = None

    @field_validator('api_key')
    def encrypt_api_key(cls, v:str):
        if v != None and len(v) >=1:
            return encrypt(v)
        else:
            return v
    
    @field_validator('secret')
    def encrypt_secret(cls, v:str):
        if v != None and len(v) >=1:
            return encrypt(v)
        else:
            return v
    
    @field_validator('access_token')
    def encrypt_access_token(cls, v:str):
        if v != None and len(v) >=1:
            return encrypt(v)
        else:
            return v
        
    @field_validator('expiration', mode='before')
    def add_utc_to_expiration(cls, v):
        if v is None:
            return None

        if isinstance(v, str):
            # Note - We need to make this TZ aware
            return datetime.fromisoformat(v).replace(tzinfo=None)
        return v
            
    
    @field_validator('refresh_token')
    def encrypt_refresh_token(cls, v:str):
        if v != None and len(v) >=1:
            return encrypt(v)
        else:
            return v

class DeleteApiBody(BaseModel):
    id: int


class UpdateApiBody(BaseModel):
    id: int
    platform: BrokerEnum
    service_level: AccountTypeEnum
    api_key: Optional[str] = None
    secret: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    expiration: Optional[datetime] = None
    state: Optional[str] = None
    scope: Optional[str] = None
    status: ApiStatusEnum
    nickname: Optional[str] = None

    @field_validator('api_key')
    def encrypt_api_key(cls, v:str):
        if v != None and len(v) >=1:
            return encrypt(v)
        else:
            return v
    
    @field_validator('secret')
    def encrypt_secret(cls, v:str):
        if v != None and len(v) >=1:
            return encrypt(v)
        else:
            return v
    
    @field_validator('access_token')
    def encrypt_access_token(cls, v:str):
        if v != None and len(v) >=1:
            return encrypt(v)
        else:
            return v
        
    @field_validator('expiration', mode='before')
    def add_utc_to_expiration(cls, v):
        if v is None:
            return None

        if isinstance(v, str):
            # Note - We need to make this TZ aware
            return datetime.fromisoformat(v).replace(tzinfo=None)
        return v
            
    
    @field_validator('refresh_token')
    def encrypt_refresh_token(cls, v:str):
        if v != None and len(v) >=1:
            return encrypt(v)
        else:
            return v


class ApiOutSchema(BaseModel):
    id: int
    user_id: int
    service_level: AccountType
    platform: Broker
    api_key:  Optional[str] = None
    secret: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    expiration: Optional[datetime] = None
    state:  Optional[str] = None
    scope:  Optional[str] = None
    user: ApiUserInfo
    status: ApiStatusType
    nickname: Optional[str] = None

    @field_validator('api_key')
    def decrypt_api_key(cls, v:str):
        if v != None and len(v) >=1:
            return decrypt(v)
        else:
            return v
    
    @field_validator('secret')
    def decrypt_secret(cls, v:str):
        if v != None and len(v) >=1:
            return decrypt(v)
        else:
            return v
    
    @field_validator('access_token')
    def decrypt_access_token(cls, v:str):
        if v != None and len(v) >=1:
            return decrypt(v)
        else:
            return v
    
    @field_validator('refresh_token')
    def decrypt_refresh_token(cls, v:str):
        if v != None and len(v) >=1:
            return decrypt(v)
        else:
            return v
        
    class Config:
        from_attributes = True
