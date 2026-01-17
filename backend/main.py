from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from database import Base,engine
from dependencies import get_current_user

app=FastAPI(title="LinkedIn Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)


app.include_router(auth_router)


@app.get("/")
def home():
    return {"message":"BACKEND START"}

@app.get("/users/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id":current_user.id,
        "email":current_user.email,
        "is_actibe":current_user.is_active
    }
