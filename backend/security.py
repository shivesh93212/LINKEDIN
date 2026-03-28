from datetime import datetime , timedelta
from dotenv import load_dotenv
import os
from jose import jwt,JWTError

       

load_dotenv()

SECRET_KEY=str(os.getenv("SECRET_KEY"))
ALGORITHM=str(os.getenv("ALGORITHM"))

if not SECRET_KEY or not ALGORITHM:
    raise RuntimeError("SECRET_KEY or ALGORITHM Not Found")

def create_access_token(data:dict,expire_minutes=200):
    to_encode=data.copy()
    expire=datetime.utcnow()+timedelta(minutes=expire_minutes)
    to_encode["exp"]=expire

    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

def decode_token(token:str):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
    


