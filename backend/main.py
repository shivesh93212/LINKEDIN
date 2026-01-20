from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from database import Base,engine
from dependencies import get_current_user
from fastapi.staticfiles import StaticFiles
from models import User, Profile
from auth import router as auth_router
from users import router as users_router
from connections import router as connection_router

app=FastAPI(title="LinkedIn Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message":"BACKEND START"}

@app.get("/users/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id":current_user.id,
        "email":current_user.email,
        "is_active":current_user.is_active
    }

app.mount("/uploads",StaticFiles(directory="uploads"),name="uploads")

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(connection_router)