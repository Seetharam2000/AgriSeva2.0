from datetime import datetime
from fastapi import APIRouter, Query
import httpx

from app.core.config import settings


router = APIRouter()


@router.get("/current")
async def current_weather(region: str = Query(...)):
    if not settings.OPENWEATHER_API_KEY:
        return {
            "region": region,
            "temp_c": 29.4,
            "humidity": 64,
            "rainfall_mm": 3.2,
            "source": "mock",
        }

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "q": region,
                "appid": settings.OPENWEATHER_API_KEY,
                "units": "metric",
            },
            timeout=10,
        )
        data = resp.json()
    return {
        "region": region,
        "temp_c": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "rainfall_mm": data.get("rain", {}).get("1h", 0),
        "source": "openweathermap",
    }


@router.get("/risk-alerts")
def weather_risk_alerts(crop: str = Query(...), region: str = Query(...)):
    # Demo alert logic based on mock thresholds.
    alerts = []
    if crop.lower() in {"rice", "paddy"}:
        alerts.append("High humidity risk: monitor for fungal issues")
    if region.lower() in {"nagpur", "nashik"}:
        alerts.append("Heat stress risk in the next 72 hours")

    return {
        "crop": crop,
        "region": region,
        "generated_at": datetime.utcnow().isoformat(),
        "alerts": alerts or ["No major risks detected"],
    }
