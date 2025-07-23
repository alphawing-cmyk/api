from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, text, func, update, String
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from components.database import get_session
from components.auth.utils import RBAChecker, ValidateJWT
from fastapi.encoders import jsonable_encoder
import pandas as pd
from .schemas import StatsParams
from components.symbols.models import Historical


router = APIRouter()

@router.post(
    "/data",
    dependencies=[
        Depends(RBAChecker(roles=['admin', 'client'], permissions=None))]
)
async def get_data(
    params: StatsParams,
    session: AsyncSession = Depends(get_session),
):
    stmt = select(
        Historical.id, 
        Historical.custom_id, 
        Historical.ticker_id, 
        Historical.symbol,
        Historical.milliseconds,
        Historical.duration,
        Historical.open,
        Historical.low,
        Historical.open,
        Historical.close,
        Historical.adj_close,
        Historical.vwap,
        Historical.timestamp,
        Historical.transactions,
        Historical.source,
        Historical.market
    ) \
    .where(Historical.timestamp >= params.from_date) \
    .where(Historical.timestamp <= params.to_date) \
    .where(Historical.ticker_id == params.ticker_id) \
    .where(Historical.source == params.source)
    
    results = await session.execute(stmt)
    data    = results.mappings().all()
    df      = pd.DataFrame(data)
    return df.to_dict(orient='records')

