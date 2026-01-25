from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User,Report,Post,Comment
from schemas import ReportResponse
from dependencies import admin_required


router=APIRouter(prefix="/admin",tags=["admin"])

# get all reports

@router.get("/reports",response_model=list[ReportResponse])
def get_all_reports(admin=Depends(admin_required),db:Session=Depends(get_db)):

    return db.query(Report).order_by(Report.created_at.desc()).all()

# block user

@router.post("/user/{user_id}/block")
def block_user(user_id:int,admin=Depends(admin_required),db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==user_id).first()

    if not user:
        raise HTTPException(404,"user not found")
    
    user.is_active=False
    db.commit()

    return {"message":"user blocked"}

# unblock user

@router.post("/user/{user_id}/unblock")
def unblock_user(user_id:int,admin=Depends(admin_required),db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==user_id).first()

    if not user:
        raise HTTPException(404,"User not Found")
    

    user.is_active=True
    db.commit()

    return {"message":"user unblocked"}

# delete post by admin

@router.post("/posts/{post_id}")
def admin_delete_post(post_id:int,admin=Depends(admin_required),db:Session=Depends(get_db)):
    post=db.query(Post).filter(Post.id==post_id).first()

    if not post:
        raise HTTPException(404,"Post not found")
    
    db.delete(post)
    db.commit()

    return {"message":"post deleted by admin"}

# comment delete

@router.post("/comments/{comment_id}")
def admin_delete_comment(comment_id:int,admin=Depends(admin_required),db:Session=Depends(get_db)):
    comment=db.query(Comment).filter(Comment.id==comment_id).first()

    if not comment:
        raise HTTPException(404,"Comment not Found")
    
    db.delete(comment)
    db.commit()

    return{"message":"comment deleted by admin"}

