from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models import Notification,Profile
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

@router.get("/", response_model=list[NotificationResponse])
def get_notification(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    notifications = db.query(Notification)\
        .filter(Notification.user_id == current_user.id)\
        .order_by(Notification.created_at.desc())\
        .all()

    result = []

    for n in notifications:

        profile = db.query(Profile).filter(
            Profile.user_id == n.actor_id
        ).first()

        result.append({
            "id": n.id,
            "user_id": n.user_id,        # ✅ add
            "actor_id": n.actor_id,      # ✅ add
            "type": n.type,
            "reference_id": n.reference_id,
            "is_read": n.is_read,
            "created_at": n.created_at,
            "actor": {
                "id": n.actor.id if n.actor else None,
                "name": n.actor.name if n.actor else "Unknown",
                "profile_photo": profile.profile_photo if profile else None
            }
        })

    return result

# mark notification as read

@router.post("/read/{notification_id}")
def mark_read_notification(notification_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    notification=db.query(Notification).filter(Notification.id==notification_id,Notification.user_id==current_user.id).first()

    if not notification:
        raise HTTPException(404,"Notification not Found")
    
    notification.is_read=True
    db.commit()

    return notification

@router.get("/unread-count")
def unread_count(current_user=Depends(get_current_user),
                 db:Session=Depends(get_db)):
    count =db.query(Notification).filter(
        Notification.user_id==current_user.id,
        Notification.is_read==False
    ).count()
    
    return {"count":count}

@router.post("/mark-all-read")
def mark_all_read(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})

    db.commit()

    return {"message": "All notifications marked as read"}