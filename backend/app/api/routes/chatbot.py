from fastapi import APIRouter, HTTPException
import httpx
from pydantic import BaseModel

from app.core.config import settings


router = APIRouter()


class ChatbotRequest(BaseModel):
    message: str


def get_fallback_reply(text: str) -> str:
    """Improved fallback responses when AI API is unavailable."""
    value = text.lower().strip()
    
    # Greetings
    if any(word in value for word in ["hello", "hi", "hey", "namaste"]):
        return "Hello! I'm Agriseva Assistant. How can I help you with farming, crop prices, weather, or market information?"
    
    # Selling questions
    if "sell" in value:
        if "when" in value or "best time" in value:
            return "Check the Price Forecast page for the best selling window. Generally, prices are higher during peak demand seasons."
        if "today" in value:
            return "Check current prices in Mandi Compare. Compare prices across different mandis to get the best deal."
        if "tomorrow" in value:
            return "Prices may vary. Check Price Forecast for predictions. Waiting might give better profit if prices are rising."
        return "To sell crops: 1) Check Mandi Compare for best prices, 2) Use Price Forecast for timing, 3) Check Weather Alerts for logistics planning."
    
    # Price questions
    if any(word in value for word in ["price", "cost", "rate", "rate per", "₹", "rupee"]):
        if "tomato" in value:
            return "Tomato prices vary by region and season. Check Price Forecast or Mandi Compare for current rates in your area."
        if "onion" in value:
            return "Onion prices fluctuate. Use Mandi Compare to see prices across different mandis in your region."
        return "Crop prices vary by region and season. Use the Price Forecast page for predictions or Mandi Compare for current rates."
    
    # Weather questions
    if any(word in value for word in ["weather", "rain", "rainfall", "temperature", "humidity"]):
        return "Check the Weather Alerts page for current weather conditions and risk signals in your region. This helps plan harvesting and logistics."
    
    # Crop health
    if any(word in value for word in ["ndvi", "crop health", "disease", "pest", "healthy"]):
        return "Use the Crop Health Map (NDVI) page to see satellite-derived vegetation health for your area. This helps identify areas needing intervention."
    
    # Auction
    if "auction" in value:
        return "Go to Auction Listings to view live auctions and place bids. You can create your own auction listing too."
    
    # Calendar/season
    if any(word in value for word in ["calendar", "season", "sowing", "harvest", "when to plant"]):
        return "Check the Crop Calendar page. Enter your crop and region to get a personalized farming calendar with sowing, irrigation, and harvest dates."
    
    # Soil
    if any(word in value for word in ["soil", "fertilizer", "fertiliser", "nutrient"]):
        return "Use the Soil Advisory page. Enter your soil type, crop, and region to get fertilizer recommendations."
    
    # Transport/logistics
    if any(word in value for word in ["transport", "logistics", "vehicle", "truck", "delivery"]):
        return "Check Transport Pooling to share logistics costs with nearby farmers. You can create or join transport pools."
    
    # Mandi/market
    if any(word in value for word in ["mandi", "market", "where to sell"]):
        return "Use Mandi Compare to see prices across different mandis. Compare prices, distance, and logistics costs to find the best option."
    
    # General help
    if any(word in value for word in ["help", "what can you do", "features", "options"]):
        return "I can help with: 1) Crop prices and forecasts, 2) Weather alerts, 3) Crop health (NDVI), 4) Farming calendar, 5) Soil advisory, 6) Mandi comparison, 7) Transport pooling, 8) Auctions. Ask me anything!"
    
    # Default
    return "I'm here to help with farming questions! Ask about crop prices, weather, soil, mandi rates, transport, or farming calendar. For specific features, check the navigation menu."


@router.post("/")
async def chatbot_reply(payload: ChatbotRequest):
    """Chatbot endpoint that uses Groq AI if available, otherwise falls back to rule-based responses."""
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    message = payload.message.strip()
    
    # Try Groq API if key is available
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
                                    "You are Agriseva Assistant, a helpful AI guide for Indian farmers. "
                                    "You help with: crop prices, weather alerts, farming calendar, soil advisory, "
                                    "mandi comparison, transport pooling, and auctions. "
                                    "Answer clearly, concisely, and practically. Use Indian context (₹, qtl, mandi, etc.). "
                                    "If asked about features, guide them to use the app's pages. "
                                    "Be friendly and supportive."
                                ),
                            },
                            {"role": "user", "content": message},
                        ],
                        "temperature": 0.7,
                        "max_tokens": 300,
                    },
                )
                response.raise_for_status()
                data = response.json()
                if data.get("choices") and len(data["choices"]) > 0:
                    reply = data["choices"][0]["message"]["content"]
                    return {"reply": reply.strip()}
        except httpx.TimeoutException:
            return {"reply": get_fallback_reply(message)}
        except httpx.HTTPStatusError as e:
            # Log error but don't expose API details
            if e.response.status_code == 401:
                return {"reply": get_fallback_reply(message)}
            return {"reply": get_fallback_reply(message)}
        except Exception:
            # Any other error, use fallback
            return {"reply": get_fallback_reply(message)}
    
    # Fallback to rule-based responses
    return {"reply": get_fallback_reply(message)}
