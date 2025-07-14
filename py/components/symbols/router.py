from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from components.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from components.auth.utils import RBAChecker
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, update, or_
from sqlalchemy.orm import joinedload, selectinload
import bcrypt
from components.utils import get_cookie_options
from components.services.emailer import Emailer
from typing import Optional

router = APIRouter()
