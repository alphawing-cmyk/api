from fastapi import APIRouter, Depends, HTTPException, status, Request, Body
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
from .schemas import  AddApiBody, ApiOutSchema, DeleteApiBody


router = APIRouter()

@router.post(
    "/add",
    dependencies=[Depends(RBAChecker(roles=['admin', 'client', 'demo'], permissions=None))]
)
async def add_api_record(
    data: AddApiBody,
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(ValidateJWT)
):

    user_id = user.get("id")
    role    = user.get("role")

    try:

        api = Api(
            user_id = user_id if role != "admin" else data.user_id,
            platform= data.platform,
            service_level = data.service_level, 
            api_key= data.api_key,
            secret = data.secret,
            access_token = data.access_token,
            refresh_token = data.refresh_token,
            expiration = data.expiration,
            state = data.state,
            scope = data.scope,
            status = data.status,
            nickname = data.nickname
        )

        session.add(api)
        await session.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "Successfully added new api record"
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
    "/stats",
    dependencies=[Depends(RBAChecker(roles=["admin", "client", "demo"], permissions=None))]
)
async def get_brokers(
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(ValidateJWT)
):
    try:
        stats = {"active": 0, "disabled": 0, "total": 0}

        result = await session.execute(
            text(
                """
                SELECT status, count(status) as status_count
                FROM api
                WHERE user_id = :user_id
                GROUP BY status
                """
            ),
            {"user_id": user.get("id")},
        )
        rows = result.mappings().all()

        for r in rows:
            if r["status"] == "active":
                stats["active"] = r["status_count"]
            elif r["status"] == "disabled":
                stats["disabled"] = r["status_count"]

        stats["total"] = stats["active"] + stats["disabled"]

        return {
            "success": True,
            "stats": stats,
            "message": "Got successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@router.delete(
    "/delete",
    dependencies=[
        Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def delete_ticker(
    data: DeleteApiBody,
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(ValidateJWT)
):
    # Look up the api record
    result = await session.execute(select(Api).where(Api.id == data.id).where(Api.user_id == user.get("id")))
    api    = result.scalar_one_or_none()

    if not api:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "success": False,
                "message": "Api record not found."
            },
        )

    # Delete and commit
    await session.delete(api)
    await session.commit()

    return {"message": "Api record deleted successfully"}



# stmt   = select(Api).where(Api.id == data.id)
# result = await session.execute(stmt)
# api    = result.scalar_one_or_none()


# if api is None:
#     return JSONResponse(
#     status_code=status.HTTP_404_NOT_FOUND,
#     content={
#         "success": True,
#         "message": "Api record not found"
#     },
# )

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
        query = query.filter(Api.nickname.ilike(f"%{queryParams['nickname']}%"))

    return await paginate(session,query=query)