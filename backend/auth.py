from fastapi import APIRouter,Depends,HTTPException
from security import create_access_token
from passlib.context import CryptContext
from database import get_db
from schemas import UserCreate,UserLogin,Token
from sqlalchemy.orm import Session
from models import User
from fastapi.security import OAuth2PasswordRequestForm

router=APIRouter(prefix="/auth",tags=["auth"])

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")


@router.post("/signup")
def signup(user:UserCreate,db:Session=Depends(get_db)):
    user_email=db.query(User).filter(User.email==user.email).first()

    if user_email:
        raise HTTPException(400,"Email aleready registered")
    
    hashed=pwd_context.hash(user.password[:72])
    new_user=User(
        name=user.name,
        email=user.email,
        password=hashed
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message":"User Created Successfully!"}

@router.post("/login",response_model=Token)
def login(data:OAuth2PasswordRequestForm = Depends(),db:Session=Depends(get_db)):
    user_email=db.query(User).filter(User.email==data.username).first()

    if not user_email:
        raise HTTPException(400,"Email Not Found")
    
    if not pwd_context.verify(data.password,str(user_email.password)):
        raise HTTPException(404,"Wrong Password")
    
    token=create_access_token({"user_id":user_email.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        # "user_id": user_email.id,
        # "name": user_email.name,
        # "email": user_email.email,
        # "role": user_email.role
    }
    