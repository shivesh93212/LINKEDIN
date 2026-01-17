from sqlalchemy import Column,String,Integer,Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    email=Column(String,unique=True,index=True)
    password=Column(String)
    is_active=Column(Boolean,default=True)