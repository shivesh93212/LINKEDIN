from sqlalchemy import Column,String,Integer,Boolean,ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    email=Column(String,unique=True,index=True)
    password=Column(String)
    is_active=Column(Boolean,default=True)

class Profile(Base):
    __tablename__ = "profiles"
    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"),unique=True)
    name=Column(String,nullable=False)
    headline=Column(String)
    about=Column(String)
    skills=Column(String)
    experience=Column(String)
    education=Column(String)
    location=Column(String)
    profile_photo=Column(String)

    user = relationship("User", backref="profile")