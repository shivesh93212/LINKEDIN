from fastapi import APIRouter,Depends,HTTPException,UploadFile,File
from database import get_db
from models import Profile
from schemas import ProfileCreate,ProfileResponse
from dependencies import get_current_user
from sqlalchemy.orm import Session
import uuid
import shutil
import os



router=APIRouter(prefix="/users",tags=["users"])

# create profile and update

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
        raise HTTPException(404,"Profile Not Found")
    
    return profile

# get user profile basis of user_id

@router.get("/{user_id}",response_model=ProfileResponse)
def get_user_profile(user_id:int,db:Session=Depends(get_db)):
    
    profile=db.query(Profile).filter(Profile.user_id==user_id).first()

    if not profile:
        raise HTTPException(404,"Profile Not Found")
    
    return profile

# image upload

UPLOAD_DIR="uploads"
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
    
    profile.profile_photo = file_path

    db.commit()
    db.refresh(profile)

    return{
        "message":"Profile photo uploaded",
        "photo_url":f"/uploads/{filename}"
    }