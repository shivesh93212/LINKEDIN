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
from jobs import router as jobs_router
from chatBot import router as chat_bot_router
from upload import router as upload_router



app=FastAPI(title="ProLinker Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # temporary
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    Base.metadata.create_all(bind=engine)
    print("DB Connected ✅")
except Exception as e:
    print("DB Error ❌:", e)

print("APP STARTING...")

@app.get("/")
def home():
    return {"message":"BACKEND START"}


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
app.include_router(jobs_router)
app.include_router(chat_bot_router)
app.include_router(upload_router)