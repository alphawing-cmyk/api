from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Union

class AddSymbolBody(BaseModel):
    symbol: str
    name: str
    industry: Optional[str] = None
    market: str
    market_cap: Optional[str] = None
    alt_names: Optional[List[Dict[str, Any]]] = None

class UpdateSymbolBody(BaseModel):
    id: int
    symbol: Optional[str] = None
    name: Optional[str] = None
    industry: Optional[str] = None
    market: Optional[str] = None
    market_cap: Optional[str] = None
    alt_names: Optional[List[Dict[str, Any]]] = None

class DeleteSymbolBody(BaseModel):
    id: int

class SymbolSchema(BaseModel):
    id: int
    symbol: str
    name: str
    alt_names: Optional[Union[Dict, List]] = None 
    industry: Optional[str] = Field(None, max_length=255)
    market: str
    market_cap: Optional[str] = Field(None, max_length=255)

class SymbolDataSchema(BaseModel):
    min_close: Optional[float] = None
    max_close: Optional[float] = None
    wk52_close_low: Optional[float] = None
    wk52_close_high: Optional[float] = None
    wk52_daily_close: Optional[List[float]] = None
    latest_data: Optional[datetime] = None
    last_close: Optional[float] = None
    last_open: Optional[float] = None
    last_daily_range: Optional[float] = None
    symbol: Optional[str] = None
    name: Optional[str] = None

    class Config:
        from_attributes = True
