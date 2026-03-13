from pydantic import BaseModel,EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    name:str
    email:EmailStr
    password:str


class UserLogin(BaseModel):
    email:EmailStr
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str="bearer"
    user_id:int

class ProfileCreate(BaseModel):
    name:str
    headline:str|None=None
    about:str|None=None
    skills:str|None=None
    experience:str|None=None
    education:str|None=None
    location:str|None=None

class ProfileUpdate(BaseModel):
   name:Optional[str]=None
   headline:Optional[str]=None
   about:Optional[str]=None
   skills:Optional[str]=None
   experience:Optional[str]=None
   education:Optional[str]=None
   location:Optional[str]=None

class ProfileResponse(BaseModel):
    id:int
    user_id:int
    name:str
    profile_photo: str | None = None
    
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

class PostUser(BaseModel):
   id:int
   name:str
   profile_photo:str | None=None

   class Config:
      from_attributes=True


class PostResponse(BaseModel):
    id:int
    content:str
    image_url:str|None
    created_at:datetime
    user:PostUser

    user:PostUser
    
    class Config:
      from_attributes = True

class LikeResponse(BaseModel):
   id:int
   user_id:int
   post_id:int
   created_at:datetime

   class Config:
      from_attributes=True


class CommentCreate(BaseModel):
   content:str
   parent_id:int | None=None
   
class CommentResponse(BaseModel):
   id:int
   post_id:int
   user_id:int
   content:str
   parent_id:int | None
   created_at:datetime

   class Config:
      from_attributes=True

class MessageCreate(BaseModel):
   receiver_id:int
   content:str

class MessageResponse(BaseModel):
   id:int
   sender_id:int
   receiver_id:int
   content:str
   is_read:bool
   created_at:datetime

   class Config:
      from_attributes=True


class NotificationResponse(BaseModel):
   id:int
   user_id:int
   actor_id:int
   type:str
   reference_id:int|None
   is_read:bool
   created_at:datetime

   class Config:
      from_attributes=True
   
class ReportCreate(BaseModel):
   reason:str

class ReportActionResponse(BaseModel):
    message: str
    auto_action: str | None = None


class ReportResponse(BaseModel):
   id:int
   reporter_id:int
   target_user_id:int
   post_id:int
   reason:str
   created_at:datetime

   class Config:
      from_attributes=True