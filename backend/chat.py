from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models import Message, User
from schemas import MessageCreate, MessageResponse
from sqlalchemy import or_,and_


router = APIRouter(prefix="/chat", tags=["chat"])

# send message 

@router.post("/send",response_model=MessageResponse)
def send_message(data:MessageCreate,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    if data.receiver_id==current_user.id:
        raise HTTPException(400,"You cannot message yourself")
    
    receiver=db.query(User).filter(User.id==data.receiver_id).first()

    if not receiver:
        raise HTTPException(404,"User not Found")
    
    message=Message(
        sender_id=current_user.id,
        receiver_id=data.receiver_id,
        content=data.content
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message

# return list of the chat

@router.get("/list")
def chat_list(current_user=Depends(get_current_user), db: Session = Depends(get_db)):

    messages = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id
        )
    ).order_by(Message.created_at.desc()).all()

    users = {}
    user_ids = set()

    for msg in messages:
        other_user_id = msg.receiver_id if msg.sender_id == current_user.id else msg.sender_id

        if other_user_id not in users:
            users[other_user_id] = msg
            user_ids.add(other_user_id)

    # fetch users
    user_data = db.query(User).filter(User.id.in_(user_ids)).all()
    user_map = {u.id: u for u in user_data}

    result = []

    for uid, msg in users.items():
        user = user_map.get(uid)

        if not user:
            continue

        profile_photo = None
        if user.profile:
            profile_photo = user.profile.profile_photo

        result.append({
            "user_id": user.id,
            "name": user.name,
            "profile_photo": profile_photo,
            "last_message": msg.content,
            "created_at": msg.created_at
        })

    return result

# get chat between two users

@router.get("/{user_id}",response_model=list[MessageResponse])
def get_chat(user_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):

    return db.query(Message).filter(
        or_(
            and_(
                Message.sender_id==current_user.id,
                Message.receiver_id==user_id
            ),
            and_(
                Message.sender_id==user_id,
                Message.receiver_id==current_user.id
            )

        )
    ).order_by(Message.created_at.asc()).all()

# mark message as read

@router.post("/read/{message_id}")
def mark_as_read(message_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    message=db.query(Message).filter(Message.id==message_id,Message.receiver_id==current_user.id).first()

    if not message:
        raise HTTPException(404,"Messade not Found")
    
    
    message.is_read=True

    db.commit()

    return {"message":"Seen"}
