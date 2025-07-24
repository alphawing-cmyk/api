from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import date, timedelta


class StatsParams(BaseModel):
    ticker_id: int
    from_date: date = date.today() - timedelta(days=100)
    to_date: date = date.today()
    indicators: List[dict[str, Any]] = Field(default_factory=
        lambda: [{"name": "MA", "period": "50"}]
    )
    source: str = "POLYGON"

class GitLab(BaseModel):
	namespace: str
	repo: str

class Github(BaseModel):
	owner: str
	repo: str
	token: Optional[str] = None