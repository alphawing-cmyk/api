from fastapi import FastAPI, WebSocket, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from config import settings
from redis import Redis
from components.auth.router import router as auth_router
from components.symbols.router import router as symbols_router
from components.accounts.router import router as accounts_router
from components.api.router import router as api_router
from components.permissions.router import router as permissions_router
from components.stats.router import router as stats_router

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    print("Engaging lifespan")

    redis = Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        db=settings.redis_db,
        password=settings.redis_password,
        decode_responses=True,
    )
    print(redis.ping())
    app.state.redis = redis

    try:
        yield
    finally:
        print("Disengaging lifespan")



app     = FastAPI(lifespan=lifespan)
origins = [
    "http://localhost",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth_router,
    prefix="",
    tags=["Auth"],
)

app.include_router(
    symbols_router,
    prefix="/symbol",
    tags=["Symbols"],
)

app.include_router(
    accounts_router,
    prefix="/account",
    tags=["Accounts"],
)

app.include_router(
    api_router,
    prefix="/api",
    tags=["Api"],
)

app.include_router(
    permissions_router,
    prefix="/permissions",
    tags=["Permissions"],
)

app.include_router(
    stats_router,
    prefix="/stats",
    tags=["Stats"],
)

add_pagination(app)
