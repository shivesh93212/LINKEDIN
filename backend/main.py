from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from database import Base,engine
from dependencies import get_current_user
from fastapi.staticfiles import StaticFiles
from models import User, Profile,Connection,Post
from auth import router as auth_router
from users import router as users_router
from connections import router as connection_router
from posts import router as post_router
from likes import router as like_router
from comments import router as comment_router
from search import router as search_router
from chat import router as chat_router
from chat_ws import router as chat_ws_router
from notifications import router as notification_router
from admin import router as admin_router
from reports import router as report_router



app=FastAPI(title="LinkedIn Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
app.include_router(post_router)
app.include_router(like_router)
app.include_router(comment_router)
app.include_router(search_router)
app.include_router(chat_router)
app.include_router(chat_ws_router)
app.include_router(notification_router)
app.include_router(report_router)
app.include_router(admin_router)