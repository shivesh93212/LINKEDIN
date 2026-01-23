from fastapi import APIRouter,Depends,HTTPException,UploadFile,File
from database import get_db
from schemas import PostResponse,PostCreate
from models import Post,Connection
from dependencies import get_current_user
from sqlalchemy.orm import Session
import os
import uuid
import shutil


POST_UPLOAD_DIR = "uploads/posts"
os.makedirs(POST_UPLOAD_DIR, exist_ok=True)


router=APIRouter(prefix="/posts",tags=["posts"])

# create post

@router.post("/",response_model=PostResponse)
def create_post(data:PostCreate,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    post=Post(
        user_id=current_user.id,
        content=data.content
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return post

# my post

@router.get("/my",response_model=list[PostResponse])
def my_posts(current_user=Depends(get_current_user),db:Session=Depends(get_db)):

    post=db.query(Post).filter(Post.user_id==current_user.id).order_by(Post.created_at.desc()).all()
    
    return post


# Feed 

@router.get("/feed",response_model=list[PostResponse])
def feed(current_user=Depends(get_current_user),db:Session=Depends(get_db)):

    connections=db.query(Connection).filter(
        (
            (Connection.sender_id==current_user.id)|
            (Connection.receiver_id==current_user.id)
        ),
        Connection.status=="accepted"
    ).all()

    connection_ids=[
        c.sender_id if c.sender_id!=current_user.id else c.receiver_id
        for c in connections
    ]

    user_ids=connection_ids+[current_user.id]

    return db.query(Post).filter(
        Post.user_id.in_(user_ids)
    ).order_by(Post.created_at.desc()).all()




#delete post

@router.delete("/{post_id}")
def delete_post(post_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    post=db.query(Post).filter(Post.id==post_id,Post.user_id==current_user.id).first()

    if not post:
        raise HTTPException(404,"Post Not Found")
    
    db.delete(post)
    db.commit()

    return {"message":"Post Deleted"}


# post image upload

@router.post("/{post_id}/image")
def upload_post_image(
    post_id:int,
    file:UploadFile=File(...),
    current_user=Depends(get_current_user),
    db:Session=Depends(get_db)
):
    post=db.query(Post).filter(Post.id==post_id,Post.user_id==current_user.id).first()

    if not post:
        raise HTTPException(404,"Post not Found or not authorized")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(400,"Only image files allowed")
    
    filename=f"{uuid.uuid4()}_{file.filename}"
    file_path=os.path.join(POST_UPLOAD_DIR,filename)

    try:

        with open(file_path,"wb") as buffer:
            shutil.copyfileobj(file.file,buffer)
    finally:
        file.file.close()

        post.image_url=f"uplodas/posts/{filename}"
        db.commit()
        db.refresh(post)

    return {
        "message":"Post image uploaded successfully",
        "image_url":post.image_url
    }

