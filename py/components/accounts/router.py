from fastapi import APIRouter, Depends, HTTPException, status, Request, Body
from fastapi.responses import JSONResponse
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, func, String, Select, update
from sqlalchemy.ext.asyncio import AsyncSession
from components.database import get_session
from components.auth.utils import RBAChecker, ValidateJWT
from typing import Union, List
from .schemas import AdminAddAccountSchema

router = APIRouter()


@router.post(
    "/add",
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def add_ticker(
    data: AdminAddAccountSchema  = Body(...),
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(ValidateJWT)
):
    
    try:
        await session.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "added": successes,
                "skipped": failures,
            },
        )

    except Exception as e:
        await session.rollback()
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not process, please try again"
        )


@router.get(
    "/admin/all", 
    response_model=Page[AccountSchema],
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def get_accounts(session: AsyncSession = Depends(get_session)):
    query  = select(Account).options(selectinload(Account.user).lazyload(User.user_permissions))
    return await paginate(session,query=query)

@router.get(
    "/client/all", 
    response_model=Page[AccountSchema],
    dependencies=[Depends(RBAChecker(roles=['admin','client','demo'], permissions=None))]
)
async def get_accounts_by_user(
    request: Request,
    session: AsyncSession = Depends(get_session), 
    user: dict = Depends(ValidateJWT)
):
    queryParams = dict(request.query_params)
    query       = select(Account) \
                        .filter(Account.userId == user['id']) \
                        .options(joinedload(Account.user)) \
                        .order_by(Account.id)

    if "nickname" in queryParams:
        query = query.filter(Account.nickname.ilike(f"%{queryParams["nickname"]}%"))

    return await paginate(session,query=query)