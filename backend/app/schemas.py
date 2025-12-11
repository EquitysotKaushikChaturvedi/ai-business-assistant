from pydantic import BaseModel
from typing import Optional

class BusinessBase(BaseModel):
    name: str
    description: str
    services: str
    address: Optional[str] = None
    contact: Optional[str] = None
    operating_hours: Optional[str] = None

class BusinessCreate(BusinessBase):
    pass

class Business(BusinessBase):
    id: int
    user_id: int
    created_at: str

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: str
    business: Optional[Business] = None

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
