from enum import Enum
from sqlalchemy import  String, ForeignKey, Text, Enum as SAENUM, func, Boolean
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from components.database import Base


class Role(Enum):
    demo    = "demo"
    client  = "client"
    admin   = "admin"
    service = "service"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int]                                                = mapped_column(primary_key=True, autoincrement=True, index=True)
    username: Mapped[str]                                          = mapped_column(String(255))
    first_name: Mapped[str]                                        = mapped_column(String(255))
    last_name: Mapped[str]                                         = mapped_column(String(255))
    email: Mapped[str]                                             = mapped_column(String(255))
    company: Mapped[Optional[str]]                                 = mapped_column(String(255), nullable=True)
    password: Mapped[str]                                          = mapped_column(String(255))
    is_active: Mapped[Optional[bool]]                              = mapped_column(Boolean(), nullable=True)
    role: Mapped[Role]                                             = mapped_column(SAENUM(Role, name="Role"), nullable=False)
    img_path: Mapped[Optional[str]]                                = mapped_column(Text)
    refresh_token: Mapped[Optional[str]]                           = mapped_column(String(255))
    forgot_token: Mapped[Optional[str]]                            = mapped_column(String(255))
    user_permissions: Mapped[List["UserPermission"]]               = relationship(back_populates="user")
    # accounts: Mapped[List["components.accounts.models.Account"]] = relationship("Account", back_populates="user")
    # apis: Mapped[List["components.api.models.Api"]]              = relationship("Api", back_populates="user")


class Permission(Base):
    __tablename__ = "Permission"

    id: Mapped[int]                        = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]                      = mapped_column(String, unique=True)
    description: Mapped[Optional[str]]     = mapped_column(String)
    permission: Mapped["UserPermission"]   = relationship(back_populates="permissions")

    
class UserPermission(Base):
    __tablename__ = "UserPermission"

    userId: Mapped[int]                    = mapped_column(ForeignKey("users.id"), primary_key=True, name="userId")
    permissionId: Mapped[int]              = mapped_column(ForeignKey("Permission.id"), primary_key=True, name="permissionId")
    grantedAt: Mapped[datetime]            = mapped_column(default=func.now(), name="grantedAt")
    user: Mapped["User"]                    = relationship(back_populates="user_permissions")
    permissions: Mapped[List["Permission"]] = relationship(back_populates="permission")
    def __repr__(self) -> str:
        return f"UserPermission(user_id={self.userId}, permission_id={self.permissionId}"