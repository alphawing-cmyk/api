from pydantic import BaseModel, EmailStr, model_validator, EmailStr
from enum import Enum
from typing import Optional, List, Self
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


class RegisterBody(BaseModel):
    username: str
    firstName: str
    lastName: str
    email: EmailStr
    company: Optional[str] = None
    password: str
    confirmPassword: str
    isActive: Optional[bool] = True
    role: Role = Role.demo
    imgPath: Optional[str] = None

    @model_validator(mode='after')
    def passwords_match(self) -> Self:
        if self.password != self.confirmPassword:
            raise ValueError("Passwords do not match")
        return self


class ForgotPasswordBody(BaseModel):
    email: str
    origin: str


class ResetPasswordBody(BaseModel):
    password: str
    token: str


class UpdateUserBody(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    password: Optional[str] = None
