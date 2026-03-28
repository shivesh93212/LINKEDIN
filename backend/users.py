from fastapi import APIRouter,Depends,HTTPException,UploadFile,File
from database import get_db
from models import Profile,Connection,User
from schemas import ProfileCreate,ProfileResponse,ProfileUpdate
from dependencies import get_current_user
from sqlalchemy.orm import Session
import uuid
import shutil
import os

# 🔥 ADD THIS
import cloudinary.uploader
from cloudinary_config import cloudinary


router=APIRouter(prefix="/users",tags=["users"])

# create profile and update


@router.get("/me")
def get_current_user_profile( db:Session=Depends(get_db),current_user=Depends(get_current_user)):
    profile=db.query(Profile).filter(
        Profile.user_id==current_user.id
    ).first()

    connections_count = db.query(Connection).filter(
    Connection.status == "accepted",
    ((Connection.sender_id == current_user.id) | (Connection.receiver_id == current_user.id))
    ).count()

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,

        "headline": profile.headline if profile else None,
        "about": profile.about if profile else None,
        "skills": profile.skills if profile else None,
        "experience": profile.experience if profile else None,
        "education": profile.education if profile else None,
        "location": profile.location if profile else None,

        "profile_photo": profile.profile_photo if profile else None,

        "connections_count": connections_count
    }

# update profile

@router.put("/me")
def update_profile(
    data: ProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    profile = db.query(Profile).filter(
        Profile.user_id == current_user.id
    ).first()

    if not profile:
        profile = Profile(
            user_id=current_user.id,
            name=current_user.name
        )
        db.add(profile)

    if data.name is not None:
        current_user.name = data.name
        profile.name = data.name

    if data.headline is not None:
        profile.headline = data.headline

    if data.about is not None:
        profile.about = data.about

    if data.skills is not None:
        profile.skills = data.skills

    if data.experience is not None:
        profile.experience = data.experience

    if data.education is not None:
        profile.education = data.education

    if data.location is not None:
        profile.location = data.location

    db.commit()
    db.refresh(profile)

    return {
        "message": "Profile updated successfully"
    }

# image upload

UPLOAD_DIR="uploads/profile"
os.makedirs(UPLOAD_DIR,exist_ok=True)

@router.post("/profile/photo")
def upload_profile_photo(file:UploadFile=File(...),current_user=Depends(get_current_user),db:Session=Depends(get_db)):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    # 🔥 ONLY THIS PART CHANGED (Cloudinary)
    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder="profile_photos"
        )
        image_url = result["secure_url"]
    finally:
        file.file.close()

    profile=db.query(Profile).filter(Profile.user_id==current_user.id).first()

    if not profile:
        profile = Profile(
            user_id=current_user.id,
            name=current_user.name
        )
        db.add(profile)
    
    # 🔥 SAVE CLOUDINARY URL
    profile.profile_photo = image_url

    db.commit()
    db.refresh(profile)

    return{
        "message":"Profile photo uploaded",
        "photo_url": profile.profile_photo
    }

@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(404, "User not found")

    connections_count = db.query(Connection).filter(
    Connection.status == "accepted",
    ((Connection.sender_id == user_id) | (Connection.receiver_id == user_id))
    ).count()

    return {
    "id": user.id,
    "name": user.name,
    "email": user.email,
    "headline": profile.headline if profile else None,
    "about": profile.about if profile else None,
    "skills": profile.skills if profile else None,
    "experience": profile.experience if profile else None,
    "education": profile.education if profile else None,
    "location": profile.location if profile else None,
    "profile_photo": profile.profile_photo if profile else None,
    "connections_count":connections_count
}