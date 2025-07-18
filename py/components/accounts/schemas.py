from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, conint, field_validator
from datetime import datetime, date
from typing import Union
from enum import Enum
from components.utils import decrypt, encrypt


class Broker(str, Enum):
    TRADESTATION        = "tradestation"
    ALPACA              = "alpaca"
    KRAKEN              = "kraken"
    COINBASE            = "coinbase"
    INTERACTIVE_BROKERS = "interactive_brokers"
    OANDA               = "oanda"


class AccountType(str, Enum):
    SERVICE_ACCOUNT  = "service_account"
    LIVE_ACCOUNT     = "live_account"
    PAPER_ACCOUNT    = "paper_account"


class AdminAddAccountSchema(BaseModel):
    account_num: str
    user_id: int
    nickname: Optional[str] = None
    broker: Broker
    date_opened: Optional[date] = None
    initial_balance: Optional[float] = None
    current_balance: Optional[float] = None
    account_type: AccountType = Field(default=AccountType.PAPER_ACCOUNT)
    auto_trade: bool = Field(default=False)


    @field_validator('account_num')
    def encrypt_account_num(cls, v:str):
        return encrypt(v)
    
    

class ClientAddAccountSchema(BaseModel):
    accountNum: str
    nickname: Optional[str] = None
    broker: Broker
    dateOpened: Optional[str] = None
    initialBalance: Optional[float] = None
    currentBalance: Optional[float] = None
    accountType: AccountType = Field(default=AccountType.PAPER_ACCOUNT)
    autoTrade: bool = Field(default=False)

    class Config:
        extra = "allow"

class AccountUserInfo(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str

class AccountSchema(BaseModel):
    id: int
    userId: int
    accountNum: str
    nickname: Optional[str] = None
    broker: Broker
    dateOpened: Optional[datetime] = None
    initialBalance: Optional[float] = None
    currentBalance: Optional[float] = None
    accountType: AccountType
    autoTrade: bool
    user: AccountUserInfo

    @field_validator('accountNum')
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
    accountNum: Optional[str] = None
    nickname: Optional[str] = None
    broker: Optional[Broker] = None
    dateOpened: Optional[str] = None
    initialBalance: Optional[float] = None
    currentBalance: Optional[float] = None
    accountType: Optional[AccountType] = Field(default=AccountType.PAPER_ACCOUNT)
    autoTrade: Optional[bool] = Field(default=False)
    userId: Optional[int] = None

    class Config:
        extra = "forbid"


class UpdateClientAccountSchema(BaseModel):
    id: int
    accountNum: Optional[str] = None
    nickname: Optional[str] = None
    broker: Optional[Broker] = None
    dateOpened: Optional[str] = None
    initialBalance: Optional[float] = None
    currentBalance: Optional[float] = None
    accountType: Optional[AccountType] = Field(default=AccountType.PAPER_ACCOUNT)
    autoTrade: Optional[bool] = Field(default=False)

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
