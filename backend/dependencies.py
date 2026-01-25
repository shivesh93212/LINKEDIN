from fastapi import Depends ,HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from security import decode_token
from models import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
        token:str=Depends(oauth2_scheme),
        db:Session=Depends(get_db)
):
    payload=decode_token(token)
    if payload is None:
        raise HTTPException(401,"Invalid or expire token")
    
    user_id=payload.get("user_id")
    if user_id is None:
        raise HTTPException(401,"Invalid Token Payload")
    
    user=db.query(User).filter(User.id==user_id).first()
    if not user:
        raise HTTPException(404,"User Not Found")
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is blocked"
        )
    
    return user

def admin_required(
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access only"
        )
    return current_user