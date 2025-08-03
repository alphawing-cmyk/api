from sqlalchemy import  String, ForeignKey, BigInteger, Numeric, DateTime, Integer, Date, Text, JSON
from datetime import datetime, date as dtDate
from sqlalchemy.orm import Mapped, mapped_column, relationship
from components.database import Base
from typing import List

class Tickers(Base):
    __tablename__                          = "tickers"
    id: Mapped[int]                        = mapped_column(primary_key=True, index=True)
    symbol: Mapped[str]                    = mapped_column(String(length=255), nullable=False, unique=True, index=True)
    name: Mapped[str]                      = mapped_column(String(length=255), nullable=False)
    alt_names: Mapped[dict]                = mapped_column(JSON, nullable=True) 
    industry: Mapped[str]                  = mapped_column(String(length=255), nullable=True)
    market: Mapped[str]                    = mapped_column(String(length=255), nullable=False)
    market_cap: Mapped[str]                = mapped_column(String(length=255), nullable=True)
    historical: Mapped[List["Historical"]] = relationship(back_populates="ticker", cascade="all, delete-orphan")

    def as_dict(self):
        return {"id": self.id, 
                "symbol": self.symbol, 
                "name": self.name, 
                "industry": self.industry, 
                "market": self.market,
                "market_cap": self.market_cap}

    def __repr__(self):
        return f"{self.__tablename__} | ticker = {self.symbol} | name = {self.name} | market = {self.market}"


class Historical(Base):
    __tablename__               = "historical"
    id: Mapped[int]             = mapped_column(primary_key=True, index=True)
    custom_id: Mapped[str]      = mapped_column(String(length=255), unique=True, index=True)
    ticker_id: Mapped[int]      = mapped_column(ForeignKey("tickers.id", ondelete="CASCADE"), nullable=False)
    symbol: Mapped[str]         = mapped_column(String(length=255), nullable=False)
    milliseconds: Mapped[int]   = mapped_column(BigInteger, nullable=True, default=0)
    duration: Mapped[str]       = mapped_column(String(length=20), nullable=True)
    open: Mapped[float]         = mapped_column(Numeric(precision=30, scale=15))
    low: Mapped[float]          = mapped_column(Numeric(precision=30, scale=15))
    high: Mapped[float]         = mapped_column(Numeric(precision=30, scale=15))
    close: Mapped[float]        = mapped_column(Numeric(precision=30, scale=15))
    adj_close: Mapped[float]    = mapped_column(Numeric(precision=30, scale=15), nullable=True)
    volume: Mapped[float]       = mapped_column(Numeric(precision=20, scale=2), default=0)
    vwap: Mapped[float]         = mapped_column(Numeric(precision=30, scale=15), default=0)
    timestamp: Mapped[datetime] = mapped_column(DateTime, index=True)
    transactions: Mapped[int]   = mapped_column(Integer,default=0)
    source: Mapped[str]         = mapped_column(String(length=30), nullable=False)
    market: Mapped[str]         = mapped_column(String(length=30), nullable=False)
    ticker: Mapped["Tickers"]   = relationship("Tickers", back_populates="historical")

    def __repr__(self):
        return f"{self.symbol} | {self.timestamp} | {self.duration}"

class Holidays(Base):
    __tablename__               = "holidays"
    id: Mapped[int]             = mapped_column(primary_key=True, index=True)
    date: Mapped[dtDate]        = mapped_column(Date, index=True)
    exchange: Mapped[str]       = mapped_column(String(length=200), nullable=True)
    name: Mapped[str]           = mapped_column(String(length=200), nullable=True)
    status: Mapped[str]         = mapped_column(String(length=200), nullable=True)

    def __repr__(self):
        return f"{self.name} | {self.exchange} | {self.date}"


class Exchanges(Base):
    __tablename__    = "exchanges"
    id: Mapped[int]  = mapped_column(primary_key=True, index=True)
    acronym          = mapped_column(String(length=200), nullable=True)
    asset_class      = mapped_column(String(length=200), nullable=True)
    name             = mapped_column(String(length=200), nullable=True)
    type             = mapped_column(String(length=200), nullable=True)
    url              = mapped_column(Text, nullable=True)
    
    def __repr__(self):
        return f"{self.acronym} | {self.name}"
