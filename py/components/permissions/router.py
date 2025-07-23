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
from components.auth.models import Permission, UserPermission
from .schemas import (
    AddPermission,
    UpdatePermission,
    DeletePermission,
    PermissionUserLink
)


router = APIRouter()


@router.get(
    "/all",
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def get_all_permissions(session: AsyncSession = Depends(get_session)):
    try:
        result = await session.execute(select(Permission))
        return {"data": result.scalars().all()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get(
        "/user/{id}", 
        dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def get_permissions_for_user(id: int, session: AsyncSession = Depends(get_session)):
    try:
        result = await session.execute(
            select(UserPermission).where(UserPermission.user_id == id).options(
                joinedload(UserPermission.permissions)
            )
        )
        return {"data": result.scalars().all()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post(
    "/add",
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def add_permission(
    body: AddPermission, 
    session: AsyncSession = Depends(get_session)
):
    try:
        existing = await session.execute(select(Permission).where(Permission.name == body.name))
        if existing.scalar_one_or_none():
            return {"status": False, "message": "Permission already exists", "data": body}

        new_permission = Permission(name=body.name, description=body.description)
        session.add(new_permission)
        await session.commit()
        return {"success": True, "message": "Successfully added permission", "data": body}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.put(
    "/update",
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def update_permission(
    body: UpdatePermission, 
    session: AsyncSession = Depends(get_session)
):
    try:
        permission = await session.get(Permission, body.id)
        if not permission:
            raise HTTPException(status_code=404, detail="Permission not found")

        permission.name = body.name
        permission.description = body.description
        session.add(permission)
        await session.commit()
        return {"success": True, "message": "Successfully updated permission", "data": body}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/delete",
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def delete_permission(body: DeletePermission, session: AsyncSession = Depends(get_session)):
    try:
        permission = await session.get(Permission, body.id)
        if not permission:
            raise HTTPException(status_code=404, detail="Permission not found")

        await session.delete(permission)
        await session.commit()
        return {"success": True, "message": "Successfully deleted permission", "data": body}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post(
    "/user/add",
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def add_permission_to_user(
    body: PermissionUserLink, 
    session: AsyncSession = Depends(get_session)
):
    try:
        result = await session.execute(
            select(UserPermission)
            .where(
                UserPermission.user_id == body.userId,
                UserPermission.permission_id == body.permissionId
            ).options(joinedload(UserPermission.permissions))
        )
        if result.scalar_one_or_none():
            return {
                "status": False,
                "message": "Permission already set for user",
                "data": body,
            }

        link = UserPermission(user_id=body.userId, permission_id=body.permissionId)
        session.add(link)
        await session.commit()
        return {
            "success": True,
            "message": "Successfully added permission to user",
            "data": body,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/user/delete",
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def delete_permission_from_user(
    body: PermissionUserLink, 
    session: AsyncSession = Depends(get_session)
):
    try:
        result = await session.execute(
            select(UserPermission).where(
                UserPermission.user_id == body.userId,
                UserPermission.permission_id == body.permissionId
            )
        )
        link = result.scalar_one_or_none()
        if not link:
            raise HTTPException(status_code=404, detail="Permission link not found")

        await session.delete(link)
        await session.commit()
        return {
            "success": True,
            "message": "Successfully removed permission from user",
            "data": body,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))