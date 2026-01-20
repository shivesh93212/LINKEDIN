from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Connection,User
from schemas import ConnectionResponse
from dependencies import get_current_user


router=APIRouter(prefix="/connections",tags=["connections"])


# send connection request

@router.post("/send/{user_id}",response_model=ConnectionResponse)
def send_request(user_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    if user_id==current_user.id:
        raise HTTPException(400,"You cannot connect with yourself")
    
    receiver=db.query(User).filter(User.id==user_id).first()

    if not receiver:
        raise HTTPException(404,"User not Found")
    
    existing=db.query(Connection).filter(
        ((Connection.sender_id==current_user.id)&
         (Connection.receiver_id==user_id))|
         ((Connection.sender_id==user_id)&
          (Connection.receiver_id==current_user.id))
    ).first()

    if existing:
        raise HTTPException(400,"Connection request already exists")
    
    connection =Connection(
        sender_id=current_user.id,
        receiver_id=user_id
    )

    db.add(connection)
    db.commit()
    db.refresh(connection)

    return connection

# accept request

@router.post("/accept/{request_id}",response_model=ConnectionResponse)
def accept_request(request_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    connection=db.query(Connection).filter(Connection.id==request_id,
                                    Connection.receiver_id==current_user.id,
                                           Connection.status=="pending").first()
    
    if not connection:
        raise HTTPException(404,"Connection request not Found")
    
    connection.status="accepted"
    db.commit()
    db.refresh(connection)

    return connection

# reject request

@router.post("/reject/{request_id}",response_model=ConnectionResponse)
def reject_request(request_id:int,current_user=Depends(get_current_user),db:Session=Depends(get_db)):

    connection=db.query(Connection).filter(
        Connection.id==request_id,
        Connection.receiver_id==current_user.id,
        Connection.status=="pending"
    ).first()

    if not connection:
        raise HTTPException(404,"Connection request not Found")
    
    connection.status="rejected"
    db.commit()
    db.refresh(connection)

    return connection

# my pending request

@router.get("/requests",response_model=list[ConnectionResponse])
def pending_request(current_user=Depends(get_current_user),db:Session=Depends(get_db)):

    return db.query(Connection).filter(Connection.receiver_id==current_user.id,Connection.status=="pending").all()

# my connection

@router.get("/my",response_model=list[ConnectionResponse])
def my_connection(current_user=Depends(get_current_user),db:Session=Depends(get_db)):
   return db.query(Connection).filter(
        (
            (Connection.sender_id == current_user.id) |
            (Connection.receiver_id == current_user.id)
        ),
        Connection.status == "accepted"
    ).all()