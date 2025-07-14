from fastapi import FastAPI, WebSocket, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from config import settings
from redis import Redis
from components.auth.router import router as auth_router
from components.symbols.router import router as symbols_router

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



add_pagination(app)
