from sqlalchemy import Column,String,Integer,Boolean,ForeignKey,DateTime,UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
from sqlalchemy.sql import func


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

class Connection(Base):
    __tablename__="connections"
    
    id=Column(Integer,primary_key=True,index=True)
    sender_id=Column(Integer,ForeignKey("users.id"))
    receiver_id=Column(Integer,ForeignKey("users.id"))
    status=Column(String,default="pending")
    created_at=Column(DateTime(timezone=True),server_default=func.now())

class Post(Base):
    __tablename__="posts"

    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"))
    content=Column(String,nullable=False)
    image_url=Column(String,nullable=True)
    created_at=Column(DateTime(timezone=True),server_default=func.now())

class Like(Base):
    __tablename__="likes"

    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"))
    post_id=Column(Integer,ForeignKey("posts.id"))
    created_at=Column(DateTime(timezone=True),server_default=func.now())

    __table_args__=(
        UniqueConstraint("user_id","post_id",name="unique_user_post_like"),
    )

class Comment(Base):
    __tablename__="comments"

    id=Column(Integer,primary_key=True,index=True)
    post_id=Column(Integer,ForeignKey("posts.id"))
    user_id=Column(Integer,ForeignKey("users.id"))
    content=Column(String,nullable=False)
    created_at=Column(DateTime(timezone=True),server_default=func.now())