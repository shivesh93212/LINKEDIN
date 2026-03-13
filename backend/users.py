from fastapi import APIRouter,Depends,HTTPException,UploadFile,File
from database import get_db
from models import Profile,Connection,User
from schemas import ProfileCreate,ProfileResponse,ProfileUpdate
from dependencies import get_current_user
from sqlalchemy.orm import Session
import uuid
import shutil
import os



router=APIRouter(prefix="/users",tags=["users"])

# create profile and update


@router.get("/me")
def get_current_user_profile( db:Session=Depends(get_db),current_user=Depends(get_current_user)):
    profile=db.query(Profile).filter(
        Profile.user_id==current_user.id
    ).first()

    

    followers_count=db.query(Connection).filter(
        Connection.receiver_id==current_user.id,
        Connection.status=="accepted"
    ).count()
    following_count=db.query(Connection).filter(
        Connection.sender_id==current_user.id,
        Connection.status=="accepted"
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

        "followers_count": followers_count,
        "following_count": following_count
    }

# update profile

@router.put("/me")
def update_profile(data:ProfileUpdate ,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    profile=db.query(Profile).filter(Profile.user_id==current_user.id).first()

    if not profile:
        profile=Profile(user_id=current_user.id)
        db.add(profile)
    
    if data.name:
        profile.name = data.name

    if data.headline:
        profile.headline = data.headline

    if data.about:
        profile.about = data.about

    if data.skills:
        profile.skills = data.skills

    if data.experience:
        profile.experience = data.experience

    if data.education:
        profile.education = data.education

    if data.location:
        profile.location = data.location

    db.commit()
    db.refresh(profile)

    return{
        "message":"Profile updated successfully",
        "profile":profile
    }


@router.post("/profile",response_model=ProfileResponse)
def create_update_profile(data:ProfileCreate,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    profile=db.query(Profile).filter(Profile.user_id==current_user.id).first()
    
    if profile:
        for key,value in data.dict().items():
            setattr(profile,key,value)
    else:
        profile=Profile(
            user_id=current_user.id,
            **data.dict()
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)

    if profile is None:
           raise HTTPException(
        status_code=500,
        detail="Profile creation failed"
    )

    return profile
    
# get profile

@router.get("/profile",response_model=ProfileResponse)
def get_my_profile(current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    profile=db.query(Profile).filter(Profile.user_id==current_user.id).first()

    if not profile:
        profile = Profile(
            user_id=current_user.id,
            name=current_user.name  
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return profile

# get user profile basis of user_id



@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(404, "User not found")

    followers_count = db.query(Connection).filter(
        Connection.receiver_id == user_id,
        Connection.status == "accepted"
    ).count()

    following_count = db.query(Connection).filter(
        Connection.sender_id == user_id,
        Connection.status == "accepted"
    ).count()

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "profile_photo": profile.profile_photo if profile else None,
        "followers_count": followers_count,
        "following_count": following_count
    }

# image upload

UPLOAD_DIR="uploads/profile"
os.makedirs(UPLOAD_DIR,exist_ok=True)

@router.post("/profile/photo")
def upload_profile_photo(file:UploadFile=File(...),current_user=Depends(get_current_user),db:Session=Depends(get_db)):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")
    
    filename=f"{uuid.uuid4()}_{file.filename}"
    file_path=os.path.join(UPLOAD_DIR,filename)
    try:

        with open(file_path,"wb") as buffer:
            shutil.copyfileobj(file.file,buffer)
    finally:
        file.file.close()

    profile=db.query(Profile).filter(Profile.user_id==current_user.id).first()

    if not profile:
        raise HTTPException(404,"Profile Not Found")
    
    profile.profile_photo = f"uploads/profile/{filename}"

    db.commit()
    db.refresh(profile)

    return{
        "message":"Profile photo uploaded",
        "photo_url": profile.profile_photo
    }

