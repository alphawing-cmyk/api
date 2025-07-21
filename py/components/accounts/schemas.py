from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, conint, field_validator
from datetime import datetime, date
from typing import Union
from enum import Enum
from components.utils import decrypt, encrypt


class BrokerEnum(str, Enum):
    tradestation        = "tradestation"
    alpaca              = "alpaca"
    kraken              = "kraken"
    coinbase            = "coinbase"
    interactive_brokers = "interactive_brokers"
    oanda               = "oanda"


class AccountTypeEnum(str, Enum):
    service_account  = "service_account"
    live_account     = "live_account"
    paper_account    = "paper_account"


class AdminAddAccountSchema(BaseModel):
    account_num: str
    user_id: int
    nickname: Optional[str] = None
    broker: BrokerEnum
    date_opened: Optional[date] = None
    initial_balance: Optional[float] = None
    current_balance: Optional[float] = None
    account_type: AccountTypeEnum = Field(default=AccountTypeEnum.paper_account)
    auto_trade: bool = Field(default=False)


    @field_validator('account_num')
    def encrypt_account_num(cls, v:str):
        return encrypt(v)
    
    

class ClientAddAccountSchema(BaseModel):
    account_num: str
    nickname: Optional[str] = None
    broker: BrokerEnum
    date_opened: Optional[date] = None
    initial_balance: Optional[float] = None
    current_balance: Optional[float] = None
    account_type: AccountTypeEnum = Field(default=AccountTypeEnum.paper_account)
    auto_trade: bool = Field(default=False)


    @field_validator('account_num')
    def encrypt_account_num(cls, v:str):
        return encrypt(v)


class AccountUserInfo(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str

    class Config:
        from_attributes = True

class AccountSchema(BaseModel):
    id: int
    user_id: int
    account_num: str
    nickname: Optional[str] = None
    broker: BrokerEnum
    date_opened: Optional[date] = None
    initial_balance: Optional[float] = None
    current_balance: Optional[float] = None
    account_type: AccountTypeEnum
    auto_trade: bool
    user: AccountUserInfo

    @field_validator('account_num')
    def decrypt_account_num(cls, v:str):
        return decrypt(v)

    class Config:
        from_attributes = True

class GetAccountsQueryParams(BaseModel):
    page: conint(ge=1)
    size: conint(ge=1, le=100)
    nickname: Optional[str] = None

class UpdateAdminAccountSchema(BaseModel):
    id: int
    account_num: Optional[str] = None
    nickname: Optional[str] = None
    broker: Optional[BrokerEnum] = None
    date_opened: Optional[date] = None
    initial_balance: Optional[float] = None
    current_balance: Optional[float] = None
    account_type: Optional[AccountTypeEnum] = Field(default=AccountTypeEnum.paper_account)
    auto_trade: Optional[bool] = Field(default=False)
    user_id: Optional[int] = None


    @field_validator('account_num')
    def encrypt_account_num(cls, v:str):
        if v is not None:
            return encrypt(v)
        return v

    class Config:
        extra = "forbid"


class UpdateClientAccountSchema(BaseModel):
    id: int
    account_num: Optional[str] = None
    nickname: Optional[str] = None
    broker: Optional[BrokerEnum] = None
    date_opened: Optional[date] = None
    initial_balance: Optional[float] = None
    current_balance: Optional[float] = None
    account_type: Optional[AccountTypeEnum] = Field(default=AccountTypeEnum.paper_account)
    auto_trade: Optional[bool] = Field(default=False)

    @field_validator('account_num')
    def encrypt_account_num(cls, v:str):
        return encrypt(v)

    class Config:
        extra = "forbid"

class DeleteAccountSchema(BaseModel):
    id: int

    class Config:
        extra = "forbid"

class BrokersResponse(BaseModel):
    success: bool
    brokers: Optional[List[dict]] = None
    message: Optional[str] = None
    error: Optional[str] = None
