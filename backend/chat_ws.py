from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Message
from websocket_manager import ConnectionManager
from jose import jwt, JWTError
import os
from notifications import create_notification
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
manager = ConnectionManager()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def get_user_from_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except JWTError:
        return None


# chat

@router.websocket("/ws/chat")
async def websocket_chat(
    websocket: WebSocket,
    db: Session = Depends(get_db)
):

    token = websocket.query_params.get("token")

    if not token:
        await websocket.close()
        return

    user_id = get_user_from_token(token)

    if not user_id:
        await websocket.close()
        return

    await manager.connect(user_id, websocket)

    try:
        while True:

            data = await websocket.receive_json()

            # 🔹 message send
            if data.get("type") == "message":

                receiver_id = data["receiver_id"]
                content = data["content"]

                message = Message(
                    sender_id=user_id,
                    receiver_id=receiver_id,
                    content=content
                )

                db.add(message)
                db.commit()
                db.refresh(message)

                if receiver_id != user_id:
                    create_notification(
                        db=db,
                        user_id=receiver_id,
                        actor_id=user_id,
                        type="message",
                        reference_id=message.id
                    )

                payload = {
                    "type": "message",   # ✅ important
                    "id": message.id,
                    "sender_id": user_id,
                    "receiver_id": receiver_id,
                    "content": content,
                    "is_read": False,
                    "created_at": str(message.created_at)
                }

                await manager.send_message(receiver_id, payload)
                await manager.send_message(user_id, payload)

            # 🔹 seen event
            elif data.get("type") == "seen":

                message_id = data.get("message_id")
                # print("SEEN EVENT RECEIVED:", message_id)
                message = db.query(Message).filter(
                    Message.id == message_id
                ).first()

                if message:
                    message.is_read = True
                    db.commit()

                    payload = {
                        "type": "seen",
                        "message_id": message_id
                    }
                    print("SEEN EVENT RECEIVED:", message_id)
                    await manager.send_message(message.sender_id, payload)
                    print("SEEN EVENT RECEIVED:", message_id)
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)