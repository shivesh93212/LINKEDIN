from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Connection,User
from schemas import ConnectionResponse
from dependencies import get_current_user
from notifications import create_notification


router=APIRouter(prefix="/connections",tags=["connections"])


# send connection request

@router.post("/send/{user_id}", response_model=ConnectionResponse)
def send_request(
    user_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):   
    print("CURRENT USER:", current_user.id)
    print("TARGET USER:", user_id)
    if user_id == current_user.id:
        raise HTTPException(400, "You cannot connect with yourself")

    receiver = db.query(User).filter(User.id == user_id).first()
    if not receiver:
        raise HTTPException(404, "User not found")

    existing = db.query(Connection).filter(
        ((Connection.sender_id == current_user.id) &
         (Connection.receiver_id == user_id)) |
        ((Connection.sender_id == user_id) &
         (Connection.receiver_id == current_user.id))
    ).first()

    print("EXISTING:", existing)

    if existing:
        if existing.status == "pending":
            raise HTTPException(400, "Request already pending")

        if existing.status == "accepted":
            raise HTTPException(400, "Already connected")

        if existing.status == "rejected":
            # Allow resend by deleting old rejected record
            db.delete(existing)
            db.commit()

    connection = Connection(
        sender_id=current_user.id,
        receiver_id=user_id,
        status="pending"
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

    create_notification(
        db=db,
        user_id=connection.sender_id,    # original sender
        actor_id=current_user.id,        # acceptor
        type="connection_accepted",
        reference_id=connection.id
    )

    return {"message": "Connection accepted"}

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


@router.get("/status/{user_id}")
def get_status(user_id: int,
               current_user=Depends(get_current_user),
               db: Session = Depends(get_db)):

    connection = db.query(Connection).filter(
        (
            (Connection.sender_id == current_user.id) &
            (Connection.receiver_id == user_id)
        ) |
        (
            (Connection.sender_id == user_id) &
            (Connection.receiver_id == current_user.id)
        )
    ).first()

    if not connection:
        return {"status": "none"}

    # If current user sent request
    if connection.sender_id == current_user.id and connection.status == "pending":
        return {"status": "pending", "request_id": connection.id}

    # If current user received request
    if connection.receiver_id == current_user.id and connection.status == "pending":
        return {"status": "received", "request_id": connection.id}

    return {"status": connection.status}


@router.get("/user/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    return user