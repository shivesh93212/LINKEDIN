from pydantic import BaseModel,EmailStr

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
        orm_mode=True