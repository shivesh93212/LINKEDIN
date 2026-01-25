from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models import Notification
from schemas import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["notifications"])

# Helper Function

def create_notification(
        db:Session,
        user_id:int,
        actor_id:int,
        type:str,
        reference_id:int|None=None
):
    notification=Notification(
        user_id=user_id,
        actor_id=actor_id,
        type=type,
        reference_id=reference_id
    )
    db.add(notification)
    db.commit()

# get my notification

@router.get("/",response_model=list[NotificationResponse])
def get_notification(current_user=Depends(get_current_user),db:Session=Depends(get_current_user)):
    notification=db.query(Notification).filter(Notification.user_id==current_user.id).order_by(Notification.created_at.desc()).all()

    return notification

# mark notification as read

@router.post("/read/{notification_id}")
def mark_read_notification(notification_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    notification=db.query(Notification).filter(Notification.id==notification_id,Notification.user_id==current_user.id).first()

    if not notification:
        raise HTTPException(404,"Notification not Found")
    
    notification.is_read=True
    db.commit()

    return notification

