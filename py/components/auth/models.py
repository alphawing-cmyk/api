from enum import Enum
from sqlalchemy import  String, ForeignKey, Text, Enum as SAENUM, func, Boolean, Date, Integer
from datetime import datetime, date
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
    accounts: Mapped[List["components.accounts.models.Account"]]   = relationship("Account", back_populates="user")
    apis: Mapped[List["components.api.models.Api"]]                = relationship("Api", back_populates="user")


class Permission(Base):
    __tablename__ = "permissions"

    id: Mapped[int]                        = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]                      = mapped_column(String, unique=True)
    description: Mapped[Optional[str]]     = mapped_column(String)
    permission: Mapped["UserPermission"]   = relationship(back_populates="permissions")

    
class UserPermission(Base):
    __tablename__ = "user_permissions"

    user_id: Mapped[int]                    = mapped_column(ForeignKey("users.id"), primary_key=True, name="user_id")
    permission_id: Mapped[int]              = mapped_column(ForeignKey("permissions.id"), primary_key=True, name="permission_id")
    granted_at: Mapped[datetime]            = mapped_column(default=func.now(), name="granted_at")
    user: Mapped["User"]                    = relationship(back_populates="user_permissions")
    permissions: Mapped[List["Permission"]] = relationship(back_populates="permission")
    def __repr__(self) -> str:
        return f"UserPermission(user_id={self.user_id}, permission_id={self.permission_id}"
    
class Reviews(Base):
    __tablename__              = "reviews"
    id: Mapped[int]            = mapped_column(primary_key=True, index=True)
    first_name: Mapped[str]    = mapped_column(String(length=255), nullable=False)
    last_name: Mapped[str]     = mapped_column(String(length=255), nullable=False)
    message: Mapped[str]       = mapped_column(Text, nullable=False)
    rating: Mapped[int]        = mapped_column(Integer, nullable=False)
    user_id: Mapped[int]       = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    date_created: Mapped[date] = mapped_column(Date, default=func.now(), nullable=False)

    def __repr__(self):
        return f"{self.__tablename__} | name = {self.first_name} {self.last_name} | rating = {self.rating}"