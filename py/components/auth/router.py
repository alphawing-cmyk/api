from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from components.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from .utils import RBAChecker, ValidateJWT, generate_jwt_keys
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, update
from sqlalchemy.orm import joinedload, selectinload
from .schamas import UserSchema, LoginBody
from .models import User
import bcrypt
from components.utils import get_cookie_options

router = APIRouter()


@router.post(
    "/login",
)
async def login(data: LoginBody, session: AsyncSession = Depends(get_session)):
    query = select(User).where(User.username == data.username)
    result = await session.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "message": "Invalid Credentials"}
        )
    
    isValid = bcrypt.checkpw(data.password.encode(), user.password.encode())
    
    # Load the role and email attributes explicitly before committing
    user_role = user.role.value
    user_email = user.email 
    user_username = user.username
    
    if not isValid:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "message": "Invalid Credentials"}
        )
    
    keys = generate_jwt_keys(user)
    salt = bcrypt.gensalt()
    encryptedRefresh = bcrypt.hashpw(keys['refreshToken'].encode(), salt=salt)
    
    stmt = update(User).where(User.id == user.id).values(refresh_token=encryptedRefresh.decode("utf-8"))
    await session.execute(stmt)
    await session.commit()

    response_data = {
        "success": True,
        "message": "Successfully logged in.",
        "data": {
            "role": user_role,
            "accessToken": keys["accessToken"],
            "refreshToken": keys["refreshToken"],
            "email": user_email,
            "username": user_username,
        }
    }

    response = JSONResponse(content=response_data, status_code=status.HTTP_200_OK)
    response.set_cookie(key="accessToken", value=keys["accessToken"], **get_cookie_options())
    response.set_cookie(key="refreshToken", value=keys["refreshToken"], **get_cookie_options())
    return response

@router.get(
    "/users", 
    response_model=Page[UserSchema],
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def get_users(session: AsyncSession = Depends(get_session)):
    query    = select(User).options(joinedload(User.user_permissions))
    return await paginate(session,query=query)