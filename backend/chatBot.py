from fastapi import APIRouter
from groq import Groq
import os
from dotenv import load_dotenv
from schemas import ChatRequest

load_dotenv()

router = APIRouter(prefix="/ai", tags=["ai"])

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@router.post("/chat")
def chat(req: ChatRequest):

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": req.prompt}
            ]
        )

        return {
            "response": completion.choices[0].message.content
        }

    except Exception as e:
        print("Groq error:", e)
        return {"response": "AI temporarily unavailable"}