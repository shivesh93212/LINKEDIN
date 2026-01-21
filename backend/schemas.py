from pydantic import BaseModel,EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    email:EmailStr
    password:str


class UserLogin(BaseModel):
    email:EmailStr
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str="bearer"

class ProfileCreate(BaseModel):
    name:str
    headline:str|None=None
    about:str|None=None
    skills:str|None=None
    experience:str|None=None
    education:str|None=None
    location:str|None=None

class ProfileResponse(BaseModel):
    id:int
    user_id:int

    class Config:
      from_attributes = True


class ConnectionResponse(BaseModel):
    id:int
    sender_id:int
    receiver_id:int
    created_at:datetime

    class Config:
      from_attributes = True

class PostCreate(BaseModel):
    content:str

class PostResponse(BaseModel):
    id:int
    user_id:int
    content:str
    image_url:str|None
    created_at:datetime

    class Config:
      from_attributes = True
