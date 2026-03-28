from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from database import get_db
from schemas import PostResponse, PostCreate
from models import Post, Connection, Profile
from dependencies import get_current_user
from sqlalchemy.orm import Session
from notifications import create_notification

import cloudinary.uploader
import cloudinary_config


router = APIRouter(prefix="/posts", tags=["posts"])


# ✅ CREATE POST
@router.post("/", response_model=PostResponse)
def create_post(
    data: PostCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = Post(
        user_id=current_user.id,
        content=data.content
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    connections = db.query(Connection).filter(
        (
            (Connection.sender_id == current_user.id) |
            (Connection.receiver_id == current_user.id)
        ),
        Connection.status == "accepted"
    ).all()

    connection_ids = [
        c.sender_id if c.sender_id != current_user.id else c.receiver_id
        for c in connections
    ]

    for user_id in connection_ids:
        create_notification(
            db=db,
            user_id=user_id,
            actor_id=current_user.id,
            type="new_post",
            reference_id=post.id
        )

    return post


# ✅ MY POSTS
@router.get("/my", response_model=list[PostResponse])
def my_posts(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    posts = db.query(Post).filter(
        Post.is_deleted == False
    ).order_by(Post.created_at.desc()).all()

    return posts


# ✅ FEED
@router.get("/feed", response_model=list[PostResponse])
def feed(
    page: int = Query(1, ge=1),
    limit: int = Query(10, le=50),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit

    connections = db.query(Connection).filter(
        (
            (Connection.sender_id == current_user.id) |
            (Connection.receiver_id == current_user.id)
        ),
        Connection.status == "accepted"
    ).all()

    connection_ids = [
        c.sender_id if c.sender_id != current_user.id else c.receiver_id
        for c in connections
    ]

    user_ids = connection_ids + [current_user.id]

    posts = db.query(Post).filter(
        Post.user_id.in_(user_ids),
        Post.is_deleted == False
    ).order_by(Post.created_at.desc()) \
     .limit(limit) \
     .offset(offset) \
     .all()

    result = []

    for post in posts:
        profile = db.query(Profile).filter(
            Profile.user_id == post.user_id
        ).first()

        result.append({
            "id": post.id,
            "content": post.content,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "user": {
                "id": post.user.id,
                "name": post.user.name,
                "profile_photo": profile.profile_photo if profile else None,
                "skills": profile.skills if profile else None
            }
        })

    return result


# ✅ DELETE POST
@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(404, "Post Not Found")

    db.delete(post)
    db.commit()

    return {"message": "Post Deleted"}


# ✅ IMAGE UPLOAD (🔥 CLOUDINARY FINAL)
@router.post("/{post_id}/image")
def upload_post_image(
    post_id: int,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(404, "Post not found")

    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files allowed")

    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder="posts"
        )

        image_url = result["secure_url"]

        post.image_url = image_url
        db.commit()
        db.refresh(post)

        return {
            "message": "Image uploaded successfully",
            "image_url": image_url
        }

    except Exception as e:
        print("🔥 ERROR:", e)
        raise HTTPException(500, str(e))


# ✅ ALL POSTS
@router.get("/all", response_model=list[PostResponse])
def all_posts(db: Session = Depends(get_db)):

    posts = db.query(Post).filter(
        Post.is_deleted == False
    ).order_by(Post.created_at.desc()).all()

    result = []

    for post in posts:
        profile = db.query(Profile).filter(
            Profile.user_id == post.user_id
        ).first()

        result.append({
            "id": post.id,
            "content": post.content,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "user": {
                "id": post.user.id,
                "name": post.user.name,
                "profile_photo": profile.profile_photo if profile else None,
                "skills": profile.skills if profile else None
            }
        })

    return result