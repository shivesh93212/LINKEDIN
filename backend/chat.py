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

# get char between two users

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
    message=db.query(Message).filter(Message.id==message_id).first()

    if not message:
        raise HTTPException(404,"Messade not Found")
    
    
    message.is_read=True

    db.commit()

    return {"message":"Seen"}



    