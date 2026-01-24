from fastapi import APIRouter,Depends,Query
from sqlalchemy.orm import Session
from database import get_db
from models import User, Profile, Post
from schemas import ProfileResponse, PostResponse

router = APIRouter(prefix="/search", tags=["search"])

# user search

@router.get("/users",response_model=list[ProfileResponse])
def search_user(q:str=Query(...,min_length=1),db:Session=Depends(get_db)):

    return db.query(Profile).filter(
        (Profile.name.ilike(f"%{q}%")) |
        (Profile.headline.ilike(f"%{q}%"))|
        (Profile.skills.ilike(f"%{q}%"))
    ).all()

# post search
@router.get("/search/posts",response_model=list[PostResponse])
def search_post(q:str=Query(...,min_length=1),page:int=1,limit:int=10,db:Session=Depends(get_db)):
    
    offset=(page-1)*limit
    
    return db.query(Post).filter(
        Post.content.ilike(f"%{q}%")
    ).order_by(Post.created_at.desc()) \
     .limit(limit)\
     .offset(offset) \
     .all()
