from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from components.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from .utils import RBAChecker, ValidateJWT, generate_jwt_keys, forgotToken, ValidateJWTByToken
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, update, or_
from sqlalchemy.orm import joinedload, selectinload
from .schemas import (
    UserSchema,
    LoginBody,
    RegisterBody,
    ForgotPasswordBody,
    ResetPasswordBody,
    UpdateUserBody
)
from .models import User
import bcrypt
from components.utils import get_cookie_options
from components.services.emailer import Emailer
from typing import Optional

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
        return JSONResponse(
            status_code=401,
            content={"success": False,
                     "error": "Invalid credentials, please try again."}
        )

    keys = generate_jwt_keys(user)
    salt = bcrypt.gensalt()
    encryptedRefresh = bcrypt.hashpw(keys['refreshToken'].encode(), salt=salt)

    stmt = update(User).where(User.id == user.id).values(
        refresh_token=encryptedRefresh.decode("utf-8"))
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

    response = JSONResponse(content=response_data,
                            status_code=status.HTTP_200_OK)
    response.set_cookie(key="accessToken",
                        value=keys["accessToken"], **get_cookie_options())
    response.set_cookie(key="refreshToken",
                        value=keys["refreshToken"], **get_cookie_options())
    return response


@router.post("/register")
async def register(
    data: RegisterBody,
    session: AsyncSession = Depends(get_session)
):
    try:
        # === Check if user already exists ===
        query = select(User).where(
            or_(User.username == data.username, User.email == data.email))
        result = await session.execute(query)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"success": False, "error": "User already exists"}
            )

        # === Hash password and create new user ===
        hashed_password = bcrypt.hashpw(
            data.password.encode(), bcrypt.gensalt()).decode("utf-8")
        new_user = User(
            username=data.username,
            first_name=data.firstName,
            last_name=data.lastName,
            email=data.email,
            company=data.company,
            password=hashed_password,
            is_active=data.isActive,
            role=data.role.name,
            img_path=data.imgPath
        )

        session.add(new_user)
        await session.commit()

        # === Prepare response without sensitive fields ===
        user_dict = data.model_dump()
        user_dict.pop("password", None)
        user_dict.pop("confirmPassword", None)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"success": True, "data": user_dict}
        )

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "error": str(e)}
        )


@router.post("/forgot")
async def forgot_password(
    data: ForgotPasswordBody,
    session: AsyncSession = Depends(get_session)
):
    try:
        # === Check if user exists ===
        result = await session.execute(select(User).where(User.email == data.email))
        user = result.scalar_one_or_none()

        if not user:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"success": False, "error": "Not authorized."}
            )

        # === Generate token and send email ===
        res = await forgotToken(data.email, session=session)
        reset_link = f"{data.origin}/reset/{res['token']}"
        print(reset_link)

        emailer = Emailer()
        emailer.generate_password_reset([data.email], reset_link)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"success": True, "message": "Successfully processed"}
        )

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False,
                    "error": "Could not process, please try again"}
        )


@router.post("/reset")
async def reset_password(
    data: ResetPasswordBody,
    session: AsyncSession = Depends(get_session)
):
    try:
        # === Check if user exists ===
        result = await session.execute(select(User).where(User.forgot_token == data.token))
        user = result.scalar_one_or_none()

        if user is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"success": False,
                         "error": "User account is not found."}
            )

        # Update user credentials
        user.forgot_token = None
        user.password = bcrypt.hashpw(
            data.password.encode(), bcrypt.gensalt()).decode("utf-8")
        session.add(user)
        await session.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"success": True,
                     "message": "Successfully updated password."}
        )

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False,
                    "error": "Could not process, please try again"}
        )


@router.post(
    "/update",
    dependencies=[
        Depends(RBAChecker(roles=['admin', 'demo', 'client'], permissions=None))]
)
async def update_user(
    data: UpdateUserBody,
    session: AsyncSession = Depends(get_session),
):
    try:
        # === Step 1: Find user by email ===
        result = await session.execute(select(User).where(User.email == data.email))
        user = result.scalar_one_or_none()

        if user is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"success": False,
                         "error": "User account is not found."}
            )

        # === Step 2: Ensure username is not taken (if updating username) ===
        if data.username and data.username != user.username:
            check_result = await session.execute(
                select(User).where(User.username == data.username)
            )
            if check_result.scalar_one_or_none():
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"success": False,
                             "error": "Username is already taken."}
                )

        # === Step 3: Prepare update data ===
        update_data = data.dict(exclude_none=True)
        if "password" in update_data:
            update_data["password"] = bcrypt.hashpw(
                update_data["password"].encode(), bcrypt.gensalt()
            ).decode("utf-8")

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
            select(User)
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
    "/identify",
    response_model=Optional[UserSchema],
    dependencies=[
        Depends(RBAChecker(roles=['admin', 'demo', 'client'], permissions=None))]
)
async def identify_user(
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    try:
        params = ValidateJWT(request=request)
        user_id = params.get("id")

        if user_id:
            stmt = select(User).options(joinedload(
                User.user_permissions)).where(User.id == user_id)
            result = await session.execute(stmt)
            user = result.scalars().first()

            if user:
                return user
        else:
            return None

    except HTTPException as e:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False,
                     "message": "Error identifying user from token."}
        )


@router.get(
    "/refresh",
    dependencies=[
        Depends(RBAChecker(roles=['admin', 'client', 'demo'], permissions=None))]
)
async def refresh_token(
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    try:
        token = request.cookies.get("refreshToken")
        params = ValidateJWTByToken(token)
        user = None

        if "id" in params:
            query = select(User).where(User.id == params["id"])
            result = await session.execute(query)
            user = result.scalar_one_or_none()

        if user is None:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"success": False,
                         "message": "Invalid refresh token, operation not permitted"}
            )

        # Check if refresh token is valid on backend
        isValidToken = bcrypt.checkpw(
            token.encode(), user.refresh_token.encode())
        if not isValidToken:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"success": False,
                         "message": "Invalid refresh token, operation not permitted"}
            )

        keys = generate_jwt_keys(user)
        response_data = {
            "success": True,
            "message": "Successfully refreshed access token",
            "accessToken": keys.get("accessToken"),
            "refreshToken": keys.get("refreshToken"),
            "role": user.role.value,
            "email": user.email,
            "username": user.username,
        }
        response = JSONResponse(content=response_data,
                                status_code=status.HTTP_200_OK)
        response.set_cookie(key="accessToken",
                            value=keys["accessToken"], **get_cookie_options())
        response.set_cookie(key="refreshToken",
                            value=keys["refreshToken"], **get_cookie_options())
        
        return response

    except Exception as e:
        print(e)


@router.get(
    "/users",
    response_model=Page[UserSchema],
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def get_users(session: AsyncSession = Depends(get_session)):
    query = select(User).options(joinedload(User.user_permissions))
    return await paginate(session, query=query)
