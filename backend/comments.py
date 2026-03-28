from fastapi import APIRouter,Depends,HTTPException
from database import get_db
from dependencies import get_current_user
from models import Post,Comment,User
from schemas import CommentResponse,CommentCreate
from sqlalchemy.orm import Session
from notifications import create_notification
from sqlalchemy.orm import joinedload

router=APIRouter(prefix="/comments",tags=["comments"])

# add comment on post

@router.post("/{post_id}",response_model=CommentResponse)
def add_comment_and_reply(post_id:int,data:CommentCreate,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    post=db.query(Post).filter(Post.id==post_id).first()
    
    if not post:
        raise HTTPException(404,"Post not Found")
    
    if data.parent_id:
        parent=db.query(Comment).filter(
            Comment.id==data.parent_id,
            Comment.post_id==post_id
        ).first()

        if not parent:
            raise HTTPException(404,"Parent comment not found")
        

    comment=Comment(
        post_id=post_id,
        user_id=current_user.id,
        content=data.content,
        parent_id=data.parent_id
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    if post.user_id != current_user.id:
        create_notification(
            db=db,
            user_id=post.user_id,
            actor_id=current_user.id,
            type="comment",
            reference_id=comment.id
        )

    return comment

# get comment on post

@router.get("/{post_id}",response_model=list[CommentResponse])
def get_comment_by_post_id(post_id:int,db:Session=Depends(get_db)):

    comments=db.query(Comment)\
        .options(joinedload(Comment.user).joinedload(User.profile))\
        .filter(Comment.post_id==post_id)\
        .order_by(Comment.created_at)\
        .all()
    
    
    

    return comments

# Delete own comment

@router.delete("/{comment_id}")
def delete_comment(comment_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    comment=db.query(Comment).filter(Comment.id==comment_id,Comment.user_id==current_user.id).first()

    if not comment:
        raise HTTPException(404,"Comment not Found")
    
    db.delete(comment)
    db.commit()

    return {"message":"comment deleted"}

