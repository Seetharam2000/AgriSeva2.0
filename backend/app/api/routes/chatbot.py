from fastapi import APIRouter
import httpx
from pydantic import BaseModel

from app.core.config import settings


router = APIRouter()


class ChatbotRequest(BaseModel):
    message: str


def get_reply(text: str) -> str:
    value = text.lower()
    if "sell" in value and "tomorrow" in value:
        return "Prices are expected to rise tomorrow. Waiting may give you better profit."
    if "sell today" in value:
        return "Selling today is a good option as prices are stable."
    if "weather" in value:
        return "Check Weather Alerts for risk signals in your region."
    if "ndvi" in value or "crop health" in value:
        return "NDVI health is available under Crop Health Map."
    if "auction" in value:
        return "Open Auction Listings to view live bids."
    return "Ask me about selling crops, weather alerts, NDVI health, or auctions."


@router.post("/")
async def chatbot_reply(payload: ChatbotRequest):
    if settings.GROQ_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "llama3-8b-8192",
                        "messages": [
                            {
                                "role": "system",
                                "content": (
                                    "You are Agriseva Assistant, a helpful guide for farmers. "
                                    "Answer clearly and concisely with practical advice."
                                ),
                            },
                            {"role": "user", "content": payload.message},
                        ],
                        "temperature": 0.4,
                        "max_tokens": 256,
                    },
                )
                response.raise_for_status()
                data = response.json()
                reply = data["choices"][0]["message"]["content"]
                return {"reply": reply}
        except Exception:
            pass

    return {"reply": get_reply(payload.message)}
