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
from .schemas import Broker, AccountType


class Account(Base):
    __tablename__                                = 'accounts'
    id: Mapped[int]                              = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int]                         = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    account_num: Mapped[str]                     = mapped_column(String)
    nickname: Mapped[Optional[str]]              = mapped_column(String(255))
    broker: Mapped[Broker]                       = mapped_column(SAENUM(Broker, name="Broker"), nullable=False)
    date_opened: Mapped[Optional[datetime]]      = mapped_column(DateTime)
    initial_balance: Mapped[Optional[Numeric]]   = mapped_column(Numeric(15, 2), default=0.00)
    current_balance: Mapped[Optional[Numeric]]   = mapped_column(Numeric(15, 2), default=0.00)
    account_type: Mapped[AccountType]            = mapped_column(SAENUM(AccountType, name="AccountType"), nullable=False)
    auto_trade: Mapped[bool]                     = mapped_column(Boolean, default=False)
    user                                         = relationship("components.auth.models.User", back_populates="accounts")


    def __repr__(self):
        return f"User ID: {self.userId} | Account Num:  {self.accountNum} | Auto Trade:  {self.autoTrade}"