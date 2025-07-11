from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional, List
from datetime import datetime

class Role(str, Enum):
    demo = "demo"
    client = "client"
    admin = "admin"
    service = "service"

class UserPermission(BaseModel):
    userId: Optional[int] = None
    permissionId: Optional[int] = None
    grantedAt: Optional[datetime] = None

class UserSchema(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    company: str | None
    is_active: Optional[bool] = None
    role: Role
    img_path: Optional[str] = None
    refresh_token: Optional[str] = None
    forgot_token: Optional[str] = None
    user_permissions: List[UserPermission] = []

    class Config:
        from_attributes = True

class LoginBody(BaseModel):
    username: str
    password: str
