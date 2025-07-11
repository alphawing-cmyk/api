from fastapi import APIRouter, Depends, HTTPException
from components.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from .utils import RBAChecker, ValidateJWT, generate_jwt_keys
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload
from .schamas import UserSchema, LoginBody
from .models import User
import bcrypt

router = APIRouter()


@router.post(
    "/login",
)
async def login(data: LoginBody, session: AsyncSession = Depends(get_session)):
    query       = select(User).where(User.username == data.username)
    result      = await session.execute(query)
    user        = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "message": "Invalid Credentials"}
        )
    
    isValid = bcrypt.checkpw(data.password.encode(), user.password.encode())

    if not isValid:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "message": "Invalid Credentials"}
        )
    
    keys = generate_jwt_keys(user)
    print(keys)
    return 200


@router.get(
    "/users", 
    response_model=Page[UserSchema],
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def get_users(session: AsyncSession = Depends(get_session)):
    query    = select(User).options(joinedload(User.user_permissions))
    return await paginate(session,query=query)