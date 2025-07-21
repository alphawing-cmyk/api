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
from components.auth.models import User
from .models import Api
from .schemas import  ApiOutSchema


router = APIRouter()



@router.get(
    "/all", 
    response_model=Page[ApiOutSchema],
    dependencies=[Depends(RBAChecker(roles=['admin','client','demo'], permissions=None))]
)
async def get_api_records_by_user(
    request: Request,
    session: AsyncSession = Depends(get_session), 
    user: dict = Depends(ValidateJWT)
):
    queryParams = dict(request.query_params)
    query       = select(Api) \
                        .filter(Api.user_id == user['id']) \
                        .options(joinedload(Api.user)) \
                        .order_by(Api.id)

    if "platform" in queryParams:
        query = query.filter(func.cast(Api.platform, String).ilike(f"%{queryParams['platform']}%"))

    if "nickname" in queryParams:
        query = query.filter(Api.nickname.ilike(f"%{queryParams["nickname"]}%"))

    return await paginate(session,query=query)