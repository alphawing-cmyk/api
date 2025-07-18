from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, conint, field_validator
from datetime import datetime
from typing import Union
from enum import Enum
from components.utils import decrypt


class BrokerEnum(str, Enum):
    TRADESTATION        = "tradestation"
    ALPACA              = "alpaca"
    KRAKEN              = "kraken"
    COINBASE            = "coinbase"
    INTERACTIVE_BROKERS = "interactive_brokers"
    OANDA               = "oanda"


class AccountTypeEnum(str, Enum):
    SERVICE_ACCOUNT  = "service_account"
    LIVE_ACCOUNT     = "live_account"
    PAPER_ACCOUNT    = "paper_account"


class AdminAddAccountSchema(BaseModel):
    accountNum: str
    userId: int
    nickname: Optional[str] = None
    broker: BrokerEnum
    dateOpened: Optional[str] = None
    initialBalance: Optional[float] = None
    currentBalance: Optional[float] = None
    accountType: AccountTypeEnum = Field(default=AccountTypeEnum.PAPER_ACCOUNT)
    autoTrade: bool = Field(default=False)

class ClientAddAccountSchema(BaseModel):
    accountNum: str
    nickname: Optional[str] = None
    broker: BrokerEnum
    dateOpened: Optional[str] = None
    initialBalance: Optional[float] = None
    currentBalance: Optional[float] = None
    accountType: AccountTypeEnum = Field(default=AccountTypeEnum.PAPER_ACCOUNT)
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
    broker: BrokerEnum
    dateOpened: Optional[datetime] = None
    initialBalance: Optional[float] = None
    currentBalance: Optional[float] = None
    accountType: AccountTypeEnum
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
    broker: Optional[BrokerEnum] = None
    dateOpened: Optional[str] = None
    initialBalance: Optional[float] = None
    currentBalance: Optional[float] = None
    accountType: Optional[AccountTypeEnum] = Field(default=AccountTypeEnum.PAPER_ACCOUNT)
    autoTrade: Optional[bool] = Field(default=False)
    userId: Optional[int] = None

    class Config:
        extra = "forbid"


class UpdateClientAccountSchema(BaseModel):
    id: int
    accountNum: Optional[str] = None
    nickname: Optional[str] = None
    broker: Optional[BrokerEnum] = None
    dateOpened: Optional[str] = None
    initialBalance: Optional[float] = None
    currentBalance: Optional[float] = None
    accountType: Optional[AccountTypeEnum] = Field(default=AccountTypeEnum.PAPER_ACCOUNT)
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
