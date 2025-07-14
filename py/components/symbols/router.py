from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi import APIRouter, Depends, Request
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, func, String
from sqlalchemy.ext.asyncio import AsyncSession
from components.database import get_session
from components.auth.utils import RBAChecker, ValidateJWT
from .schemas import SymbolSchema
from .models import Tickers


router = APIRouter()


@router.get(
    "/all", 
    response_model=Page[SymbolSchema],
    dependencies=[Depends(RBAChecker(roles=['admin','client','demo'], permissions=None))]
)
async def get_tickers(
    request: Request,
    session: AsyncSession = Depends(get_session), 
    user: dict = Depends(ValidateJWT)
):
    queryParams = dict(request.query_params)
    query       = select(Tickers) \
                    .order_by(Tickers.name)

    if "name" in queryParams:
        query = query.filter(func.cast(Tickers.name, String).ilike(f"%{queryParams['name']}%"))

    return await paginate(session,query=query)