from pydantic import BaseModel, EmailStr, model_validator, EmailStr, Field, field_validator
from enum import Enum
from typing import Optional, List, Self, Dict, Any
from datetime import datetime, date

class Role(str, Enum):
    demo = "demo"
    client = "client"
    admin = "admin"
    service = "service"


class UserPermission(BaseModel):
    userId: Optional[int] = None
    permissionId: Optional[int] = None
    grantedAt: Optional[datetime] = None


class UserSchema(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    company: str | None
    is_active: Optional[bool] = None
    role: Role
    img_path: Optional[str] = None
    refresh_token: Optional[str] = None
    forgot_token: Optional[str] = None
    watchlist:  Optional[List[Dict[str, Any]]] = None
    user_permissions: List[UserPermission] = []

    class Config:
        from_attributes = True


class LoginBody(BaseModel):
    username: str
    password: str


class RegisterBody(BaseModel):
    username: str
    firstName: str
    lastName: str
    email: EmailStr
    company: Optional[str] = None
    password: str
    confirmPassword: str
    isActive: Optional[bool] = True
    role: Role = Role.demo
    imgPath: Optional[str] = None

    @model_validator(mode='after')
    def passwords_match(self) -> Self:
        if self.password != self.confirmPassword:
            raise ValueError("Passwords do not match")
        return self


class ForgotPasswordBody(BaseModel):
    email: str
    origin: str


class ResetPasswordBody(BaseModel):
    password: str
    token: str


class UpdateUserBody(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    password: Optional[str] = None

class ReviewIn(BaseModel):
	first_name: str
	last_name: str
	message: str
	rating: int = Field(None, ge=1, le=5)
	user_id: Optional[int] = None


class ReviewOut(BaseModel):
	id: int
	first_name: str
	last_name: str
	message: str
	rating: int = Field(None, ge=1, le=5)
	date_created: date

	
	class Config:
		from_attributes = True
          

class WatchlistInSchema(BaseModel):
    symbol: str
    market: str

class HistoricalItem(BaseModel):
    ticker_id: Optional[int] = None
    symbol: Optional[str] = None
    market: Optional[str] = None
    industry: Optional[str] = None
    custom_id: Optional[str] = None
    milliseconds: Optional[int] = None
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: Optional[float] = None
    adj_close: Optional[float] = None
    volume: Optional[int] = None
    vwap: Optional[float] = None
    timestamp: Optional[datetime] = None
    transactions: Optional[int] = None
    source: Optional[str] = None

    @field_validator("open", "high", "low", "close", "adj_close", mode="before")
    def round_open_price(cls, v):
        if v is None:
             return v
        try:
            return round(float(v), 2)
        except Exception as e:
             return v
        
    class Config:
          extra = "allow"

class WatchlistOutSchema(BaseModel):
    market: str
    symbol: str
    historical: Optional[List[HistoricalItem]] = []


class WatchlistDeleteSchema(BaseModel):
    symbol: str
    market: str
