from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, text, func, update
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from components.database import get_session
from components.auth.utils import RBAChecker, ValidateJWT
from components.auth.models import User
from .schemas import (
    AdminAddAccountSchema, 
    AccountSchema, 
    ClientAddAccountSchema,
    UpdateAdminAccountSchema,
    UpdateClientAccountSchema,
    DeleteAccountSchema,
)
from .models import Account

router = APIRouter()


@router.post(
    "/admin/add",
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=None))]
)
async def add_account(
    data: AdminAddAccountSchema,
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(ValidateJWT)
):
    
    try:
        account = Account(
            user_id = data.user_id,
            account_num = data.account_num,
            nickname = data.nickname,
            broker = data.broker.name,
            date_opened = data.date_opened,
            current_balance = data.current_balance,
            account_type = data.account_type.name,
            auto_trade = data.auto_trade
        )

        session.add(account)
        await session.commit()
        await session.refresh(account)
        account = AccountSchema.from_orm(account).model_dump()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "Successfully added account",
                "data": jsonable_encoder(account)
            },
        )

    except Exception as e:
        await session.rollback()
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not process, please try again"
        )

@router.post(
    "/client/add",
    dependencies=[Depends(RBAChecker(roles=['admin','demo','client'], permissions=None))]
)
async def add_account(
    data: ClientAddAccountSchema,
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(ValidateJWT)
):
    
    try:
        account = Account(
            user_id = user.get("id"),
            account_num = data.account_num,
            nickname = data.nickname,
            broker = data.broker.name,
            date_opened = data.date_opened,
            current_balance = data.current_balance,
            account_type = data.account_type.name,
            auto_trade = data.auto_trade
        )

        session.add(account)
        await session.commit()
        await session.refresh(account)
        account = AccountSchema.from_orm(account).model_dump()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "Successfully added account",
                "data": jsonable_encoder(account)
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
    dependencies=[Depends(RBAChecker(roles=['admin','client','demo'], permissions=None))]
)
async def get_stats(
    session: AsyncSession = Depends(get_session),     
    user: dict = Depends(ValidateJWT)
):
    try:
        user_id = user.get("id")

        # Raw SQL query for account counts
        sql = text("""
            SELECT
              COALESCE(SUM(CASE WHEN account_type = 'service_account' THEN 1 ELSE 0 END), 0) AS total_service_account,
              COALESCE(SUM(CASE WHEN account_type = 'live_account' THEN 1 ELSE 0 END), 0) AS total_live_account,
              COALESCE(SUM(CASE WHEN account_type = 'paper_account' THEN 1 ELSE 0 END), 0) AS total_paper_account,
              COUNT(*) AS total_accounts
            FROM accounts
            WHERE user_id = :user_id
        """)
        result = await session.execute(sql, {"user_id": user_id})
        counts = result.fetchone()

        # Aggregate balances
        current_balance_result = await session.execute(
            select(func.sum(Account.current_balance)).where(Account.user_id == user_id)
        )
        current_balance = current_balance_result.scalar() or 0.0

        initial_balance_result = await session.execute(
            select(func.sum(Account.initial_balance)).where(Account.user_id == user_id)
        )
        initial_balance = initial_balance_result.scalar() or 0.0

        # Calculate account growth
        account_growth = (
            (current_balance / initial_balance) * 100 if initial_balance > 0 else 0.0
        )

        return {
            "total_service_account": counts.total_service_account,
            "total_live_account": counts.total_live_account,
            "total_paper_account": counts.total_paper_account,
            "total_accounts": counts.total_accounts,
            "current_balance": float(current_balance),
            "initial_balance": float(initial_balance),
            "account_growth": round(account_growth, 2),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@router.put(
    "/admin/update", 
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=["ADMIN_UPDATE_ACCOUNT"]))]
)
async def admin_update_account(
        data: UpdateAdminAccountSchema, 
        session: AsyncSession = Depends(get_session)
):
    try:
          # === Step 1: Find account ===
        result = await session.execute(select(Account).where(Account.id == data.id))
        account = result.scalar_one_or_none()

        if account is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "error": "Account is not found."}
            )

        # === Step 2: Prepare update data ===
        update_data = data.model_dump(exclude_none=True)


        # === Step 3: Run update query ===
        stmt = (
            update(Account)
            .where(Account.id == data.id)
            .values(**update_data)
            .execution_options(synchronize_session="fetch")
        )
        await session.execute(stmt)
        await session.commit()

        # === Step 4: Fetch and return updated Ticker ===
        await session.refresh(account)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "Successfully updated account"
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@router.put(
    "/client/update", 
    dependencies=[Depends(RBAChecker(roles=['admin','client','demo'], permissions=None))]
)
async def client_update_account(
        data: UpdateClientAccountSchema, 
        session: AsyncSession = Depends(get_session),
        user: dict = Depends(ValidateJWT)
):
    try:
        user_id = user.get("id")


        # === Step 1: Find account ===
        result  = await session.execute(select(Account).where(Account.id == data.id))
        account = result.scalar_one_or_none()

        if account is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "error": "Account is not found."
                }
            )
        
        if account.user_id != int(user_id):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "error": "Account does not belong to this user."
                }
            )

        # === Step 2: Prepare update data ===
        update_data = data.model_dump(exclude_none=True)


        # === Step 3: Run update query ===
        stmt = (
            update(Account)
            .where(Account.id == data.id)
            .values(**update_data)
            .execution_options(synchronize_session="fetch")
        )
        await session.execute(stmt)
        await session.commit()

        # === Step 4: Fetch and return updated Ticker ===
        await session.refresh(account)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "Successfully updated account"
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@router.delete(
    "/admin/delete", 
    dependencies=[Depends(RBAChecker(roles=['admin'], permissions=["ADMIN_DELETE_ACCOUNT"]))]
)
async def admin_delete_account(
    data: DeleteAccountSchema,
    session: AsyncSession = Depends(get_session),
):
    try:
        query  = select(Account).where(Account.id == data.id)
        result = await session.execute(query)
        account = result.scalars().first()

        if account is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "success": False,
                    "message": "Account not found"
                },
            )

        await session.delete(account)
        await session.commit()

        return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "message": "Successfully deleted account"
                },
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@router.delete(
    "/client/delete", 
    dependencies=[Depends(RBAChecker(roles=['admin','client','demo'], permissions=None))]
)
async def client_delete_account(
    data: DeleteAccountSchema,
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(ValidateJWT)
):
    user_id = user.get("id")

    try:
        query   = select(Account).where(Account.id == data.id).where(Account.user_id == user_id)
        result  = await session.execute(query)
        account = result.scalars().first()

        if account is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "success": False,
                    "message": "Account not found"
                },
            )

        await session.delete(account)
        await session.commit()

        return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "message": "Successfully deleted account"
                },
            )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

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
        query = query.filter(Account.nickname.ilike(f"%{queryParams['nickname']}%"))


    return await paginate(session,query=query)


@router.get(
    "/brokers",
    dependencies=[Depends(RBAChecker(roles=["admin", "client", "demo"], permissions=None))]
)
async def get_brokers(
    session: AsyncSession = Depends(get_session),
):
    try:
        sql = text("""
            SELECT enumlabel
            FROM pg_enum
            JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
            WHERE typname = 'Broker'
            ORDER BY enumsortorder;
        """)
        result = await session.execute(sql)
        enum_values = result.fetchall()

        brokers = [row.enumlabel for row in enum_values]

        return {
            "success": True,
            "brokers": brokers,
            "message": "Got broker values successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")