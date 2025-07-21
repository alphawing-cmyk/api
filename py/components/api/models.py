from sqlalchemy import  String, ForeignKey, DateTime, Integer, Enum as SAENUM
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from enum import Enum
from components.accounts.models import BrokerEnum, AccountTypeEnum
from components.database import Base
from enum import Enum

class ApiStatusType(Enum):
     active     = "active"
     disabled   = "disabled"


class Api(Base):
    __tablename__                          = 'api'
    id: Mapped[int]                        = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int]                   = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    platform: Mapped[Enum]                 = mapped_column(SAENUM(BrokerEnum, name="Broker"))  
    service_level: Mapped[Enum]            = mapped_column(SAENUM(AccountTypeEnum, name="AccountType"))  
    api_key: Mapped[Optional[str]]         = mapped_column(String)
    secret: Mapped[Optional[str]]          = mapped_column(String)
    access_token: Mapped[Optional[str]]    = mapped_column(String)
    refresh_token: Mapped[Optional[str]]   = mapped_column(String)
    expiration: Mapped[Optional[datetime]] = mapped_column(DateTime)
    state: Mapped[Optional[str]]           = mapped_column(String)
    scope: Mapped[Optional[str]]           = mapped_column(String)
    status: Mapped[Enum]                   = mapped_column(SAENUM(ApiStatusType, name="ApiStatusType"))  
    nickname: Mapped[str]                  = mapped_column(String)
    user                                   = relationship("components.auth.models.User", back_populates="apis")


    def __repr__(self):
        return f"Api(id={self.id}, userId={self.userId}, platform={self.platform})"