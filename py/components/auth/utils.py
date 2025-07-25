from fastapi import Request, HTTPException, Depends, status
import jwt
import base64
import json
import secrets
from config import settings
from typing import List, Optional
from .models import User, UserPermission
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from components.database import get_session
from datetime import datetime, timedelta
from config import settings


def DecodeBase64Token(token: str) -> dict | None:
    try:
        token = token.replace('-', '+').replace('_', '/')
        padding = len(token) % 4
        if padding:
            token += '=' * (4 - padding)

        decoded_bytes = base64.b64decode(token)
        decoded_str = decoded_bytes.decode('utf-8')
        result = json.loads(decoded_str)
        return {'valid': True, 'claims': result}
    except Exception as e:
        return {'valid': False, 'claims': None}


def ValidateJWTByToken(token: str)-> dict | None:
    try:
        params = jwt.decode(token, settings.jwt_secret, algorithms=['HS256'])
        return params
    except Exception as e:
        return None
        
def ValidateJWT(request: Request):
    if request.headers.get('bearer') != None:
        token  = request.headers.get('bearer')
        try:
         params = jwt.decode(token, settings.jwt_secret, algorithms=['HS256'])
         return params
        except jwt.DecodeError:
           raise HTTPException(status_code=401, detail="Not Authorized")
        except jwt.InvalidTokenError:
           raise HTTPException(status_code=401, detail="Not Authorized")
        except Exception as e:
            raise HTTPException(status_code=401, detail="Not Authorized")
        
    if request.cookies.get('remix') != None:
        cookie  = request.cookies.get('remix')
        parsed  = DecodeBase64Token(cookie)

        try:
         params = jwt.decode(parsed.get("accessToken"), settings.jwt_secret, algorithms=['HS256'])
         return params
        except jwt.DecodeError:
           raise HTTPException(status_code=401, detail="Not Authorized")
        except jwt.InvalidTokenError:
           raise HTTPException(status_code=401, detail="Not Authorized")
        except Exception as e:
            raise HTTPException(status_code=401, detail="Not Authorized")
        
    if request.cookies.get('accessToken') != None:
        token  = request.cookies.get('accessToken')
        try:
            params = jwt.decode(token, settings.jwt_secret, algorithms=['HS256'])
            return params
        except jwt.DecodeError:
           raise HTTPException(status_code=401, detail="Not Authorized")
        except jwt.InvalidTokenError:
           raise HTTPException(status_code=401, detail="Not Authorized")
        except Exception as e:
            raise HTTPException(status_code=401, detail="Not Authorized")

def RBAChecker(roles: List[str], permissions: Optional[List[str]] = None):
    async def check_role(payload: dict = Depends(ValidateJWT), session: AsyncSession= Depends(get_session)):
        if payload is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Operation not permitted")
        if payload.get("role") not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Operation not permitted")
        if permissions != None:
            res  = await session.execute(select(User).where(User.id == payload.get("id"))
                            .options(selectinload(User.user_permissions)
                            .selectinload(UserPermission.permissions))
                        )
            user            = res.scalar_one_or_none()
            userPermissions = [p.permissions.name for p in user.user_permissions]
            isValid         = set(permissions).issubset(userPermissions)

            if not isValid:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Operation not permitted")

    return check_role



def generate_jwt_keys(user: User) -> dict:
    try:
        secret      = settings.jwt_secret if settings.jwt_secret != "" else ""
        access_exp  = int(settings.access_token_expire_minutes 
                        if settings.access_token_expire_minutes else 10) * 60
        refresh_exp = int(settings.refresh_token_expire_minutes 
                         if settings.refresh_token_expire_minutes else 10080) * 60

        access_token = jwt.encode(
            {
                "id": user.id,
                "role": user.role.value,
                "exp": datetime.utcnow() + timedelta(seconds=access_exp)
            },
            secret,
            algorithm="HS256"
        )
        refresh_token = jwt.encode(
            {
                "id": user.id,
                "role": user.role.value,
                "exp": datetime.utcnow() + timedelta(seconds=refresh_exp)
            },
            secret,
            algorithm="HS256"
        )

        return {"accessToken": access_token, "refreshToken": refresh_token}

    except Exception as e:
        raise RuntimeError(f"JWT generation failed: {e}")


async def forgotToken(
    email: str, 
    session: AsyncSession
):
    query      = select(User).where(User.email == email)
    res        = await session.execute(query)
    user       = res.scalar_one_or_none()
    token      = secrets.token_hex(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)

    if user:
        user.forgot_token = token
        session.add(user)
        await session.commit()
    

    return {'token': token, 'expiresAt': expires_at}
    
        
    
