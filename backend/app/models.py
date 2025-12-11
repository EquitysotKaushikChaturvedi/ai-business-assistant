from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(String, default=lambda: str(datetime.datetime.utcnow()))

    business = relationship("Business", back_populates="owner", uselist=False)

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    description = Column(Text)
    services = Column(Text)
    address = Column(String, nullable=True)
    contact = Column(String, nullable=True)
    operating_hours = Column(String, nullable=True)
    created_at = Column(String, default=lambda: str(datetime.datetime.utcnow()))

    owner = relationship("User", back_populates="business")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String) # "user" or "assistant"
    content = Column(Text)
    timestamp = Column(String, default=lambda: str(datetime.datetime.utcnow()))

    user = relationship("User", back_populates="chat_messages")

User.chat_messages = relationship("ChatMessage", back_populates="user")
