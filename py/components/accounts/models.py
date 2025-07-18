from sqlalchemy import  (
    String, 
    ForeignKey, 
    Numeric, 
    DateTime, 
    Integer, 
    JSON, Enum as SAENUM, 
    Boolean
)
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from components.database import Base
from typing import Optional
from .schemas import BrokerEnum, AccountTypeEnum


class Account(Base):
    __tablename__                               = 'Account'
    id: Mapped[int]                             = mapped_column(Integer, primary_key=True, autoincrement=True)
    userId: Mapped[int]                         = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    accountNum: Mapped[str]                     = mapped_column(String)
    nickname: Mapped[Optional[str]]             = mapped_column(String(255))
    broker: Mapped[BrokerEnum]                  = mapped_column(SAENUM(BrokerEnum), nullable=False)
    dateOpened: Mapped[Optional[datetime]]      = mapped_column(DateTime)
    initialBalance: Mapped[Optional[Numeric]]   = mapped_column(Numeric(15, 2), default=0.00)
    currentBalance: Mapped[Optional[Numeric]]   = mapped_column(Numeric(15, 2), default=0.00)
    accountType: Mapped[AccountTypeEnum]        = mapped_column()
    autoTrade: Mapped[bool]                     = mapped_column(Boolean, default=False)
    user                                        = relationship("components.auth.models.User", back_populates="accounts")


    def __repr__(self):
        return f"User ID: {self.userId} | Account Num:  {self.accountNum} | Auto Trade:  {self.autoTrade}"