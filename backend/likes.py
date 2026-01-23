from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Like,Post
from schemas import LikeResponse
from dependencies import get_current_user

router=APIRouter(prefix="/likes",tags=["likes"])

# like post

@router.post("/post_id",response_model=LikeResponse)
def like_post(post_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    post=db.query(Post).filter(Post.id==post_id).first()

    if not post:
        raise HTTPException(404,"Post not found")
    
    existing=db.query(Like).filter(
        Like.user_id==current_user.id,
        Like.post_id==post_id
    ).first()
    
    if existing:
        raise HTTPException(400,"Post already liked")
    
    like=Like(
        user_id=current_user.id,
        post_id=post_id
    )

    db.add(like)
    db.commit()
    db.refresh(like)

    return like

# unlike post

@router.post("/{post_id}")
def unlike_post(post_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    post=db.query(Post).filter(Post.id==post_id).first()

    if not post:
        raise HTTPException(404,"Post not found")
    
    like=db.query(Like).filter(
        Like.user_id==current_user.id,
        Like.post_id==post_id
    ).first()

    if not like:
        raise HTTPException(404,"Already Unlike Post")
    
    db.delete(like)
    db.commit()

    return {"message":"Post Unliked"}

# like count

@router.get("/count/{post_id}")
def like_count(post_id:int,db:Session=Depends(get_db)):
    return{
        "post_id":post_id,
        "likes":db.query(Like).filter(Like.post_id==post_id).count()
    }


