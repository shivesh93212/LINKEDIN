from fastapi import APIRouter,Depends,HTTPException
from database import get_db
from dependencies import get_current_user
from models import Post,Comment
from schemas import CommentResponse,CommentCreate
from sqlalchemy.orm import Session

router=APIRouter(prefix="/comments",tags=["comments"])

# add comment on post

@router.post("/{post_id}",response_model=CommentResponse)
def add_comment(post_id:int,data:CommentCreate,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    post=db.query(Post).filter(Post.id==post_id).first()
    
    if not post:
        raise HTTPException(404,"Post not Found")
    
    comment=Comment(
        post_id=post_id,
        user_id=current_user.id,
        content=data.content
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment

# get comment on post

@router.get("/{post_id}",response_model=list[CommentResponse])
def get_comment_by_post_id(post_id:int,db:Session=Depends(get_db)):


    return db.query(Comment).filter(
        Comment.post_id==post_id
    ).order_by(Comment.created_at.asc()).all()

# Delete own comment

@router.delete("/{comment_id}")
def delete_comment(comment_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    comment=db.query(Comment).filter(Comment.id==comment_id,Comment.user_id==current_user.id).first()

    if not comment:
        raise HTTPException(404,"Comment not Found")
    
    db.delete(comment)
    db.commit()

    return {"message":"comment deleted"}
