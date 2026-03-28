from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Like,Post
from schemas import LikeResponse
from dependencies import get_current_user
from notifications import create_notification


router=APIRouter(prefix="/likes",tags=["likes"])

# like post

@router.post("/{post_id}")
def toggle_like(
    post_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):  
    print("CURRENT USER:", current_user)
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    ).first()
 
    # 🔹 If already liked → Unlike
    if existing:
        db.delete(existing)
        db.commit()
        return {
            "liked": False,
            "message": "Post unliked"
        }

    # 🔹 If not liked → Like
    like = Like(
        user_id=current_user.id,
        post_id=post_id
    )
    db.add(like)
    db.commit()

    # 🔔 Notification
    if post.user_id != current_user.id:
        create_notification(
            db=db,
            user_id=post.user_id,
            actor_id=current_user.id,
            type="like",
            reference_id=post.id
        )

    return {
        "liked": True,
        "message": "Post liked"
    }


# like count

@router.get("/count/{post_id}")
def like_count(post_id:int,db:Session=Depends(get_db)):
    return{
        "post_id":post_id,
        "likes":db.query(Like).filter(Like.post_id==post_id).count()
    }

@router.get("/status/{post_id}")
def like_status(
    post_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    ).first()

    return {"liked": bool(like)}


