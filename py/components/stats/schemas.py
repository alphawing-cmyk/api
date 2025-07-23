from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import date, timedelta


class StatsParams(BaseModel):
    ticker_id: int
    from_date: date = date.today() - timedelta(days=100)
    to_date: date = date.today()
    indicators: List[dict[str, Any]] = Field(default_factory=
        lambda: [{"name": "ma", "period": "50"}, {"name": "ma", "period": "200"}]
    )
    source: str = "POLYGON"
