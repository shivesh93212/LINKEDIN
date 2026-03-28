from sqlalchemy import Column,String,Integer,Boolean,ForeignKey,DateTime,UniqueConstraint,Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy import UniqueConstraint



class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,nullable=False)
    email=Column(String,unique=True,index=True)
    password=Column(String)
    is_active=Column(Boolean,default=True)
    role=Column(String,default="user")
    
    posts=relationship("Post",back_populates="user")
    profile = relationship("Profile", back_populates="user", uselist=False)
    
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
    profile_photo=Column(String,default="uploads/profile/dummy_image.png")

    user = relationship("User", back_populates="profile")


class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("sender_id", "receiver_id", name="unique_connection"),
    )
    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])

class Post(Base):
    __tablename__="posts"

    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"))
    content=Column(String,nullable=False)
    image_url=Column(String,nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at=Column(DateTime(timezone=True),server_default=func.now())

    user = relationship("User",back_populates="posts")
    likes = relationship("Like", backref="post")
    comments = relationship("Comment", backref="post")


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

    # for reply
    parent_id=Column(Integer,ForeignKey("comments.id"),nullable=True)
    user=relationship("User")
    replies = relationship("Comment")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    
class Message(Base):
    __tablename__="messages"

    id=Column(Integer,primary_key=True,index=True)
    sender_id=Column(Integer,ForeignKey("users.id"))
    receiver_id=Column(Integer,ForeignKey("users.id"))
    content=Column(String,nullable=False)
    is_read=Column(Boolean,default=False)
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    
    sender=relationship("User",foreign_keys=[sender_id])
    receiver=relationship("User",foreign_keys=[receiver_id])


class Notification(Base):
    __tablename__="notification"

    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"))
    actor_id=Column(Integer,ForeignKey("users.id"))
    type=Column(String,nullable=False)
    reference_id=Column(Integer,nullable=True)
    is_read=Column(Boolean,default=False)
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    user = relationship("User", foreign_keys=[user_id])
    actor = relationship("User", foreign_keys=[actor_id])


class Report(Base):
    __tablename__="reports"

    id=Column(Integer,primary_key=True,index=True)
    reporter_id=Column(Integer,ForeignKey("users.id"))
    target_user_id=Column(Integer,nullable=True)
    post_id=Column(Integer,nullable=True)
    reason=Column(String)
    created_at=Column(DateTime(timezone=True),server_default=func.now())

    __table_args__=(
        UniqueConstraint("reporter_id","post_id",name="unque_post_report"),
    )
