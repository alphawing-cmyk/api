from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, func, String, Select, update
from sqlalchemy.ext.asyncio import AsyncSession
from components.database import get_session
from components.auth.utils import RBAChecker, ValidateJWT
from .schemas import SymbolSchema, UpdateSymbolBody
from .models import Tickers


router = APIRouter()

@router.post(
    "/update", 
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def update_ticker(
    data: UpdateSymbolBody,
    session: AsyncSession = Depends(get_session), 
    user: dict = Depends(ValidateJWT)
):

    try:
        # === Step 1: Find ticker ===
        result = await session.execute(select(Tickers).where(Tickers.id == data.id))
        ticker = result.scalar_one_or_none()

        if ticker is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                        "success": False,
                         "error": "User account is not found."}
            )

    
        # === Step 2: Prepare update data ===
        update_data = data.model_dump(exclude_none=True)
     
        # === Step 4: Run update query ===
        stmt = (
            update(User)
            .where(User.id == user.id)
            .values(**update_data)
            .execution_options(synchronize_session="fetch")
        )
        await session.execute(stmt)
        await session.commit()

        # === Step 5: Fetch and return updated user ===
        # Refresh the user object to get updated data
        await session.refresh(user)

        # If you need to load relationships, use this:
        result = await session.execute(
            select(Tickers)
            .options(selectinload(User.user_permissions))
            .where(User.id == user.id)
        )
        updated_user = result.scalar_one()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "user": {
                    "id": updated_user.id,
                    "username": updated_user.username,
                    "firstName": updated_user.first_name,
                    "lastName": updated_user.last_name,
                    "email": updated_user.email,
                    "company": updated_user.company,
                },
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