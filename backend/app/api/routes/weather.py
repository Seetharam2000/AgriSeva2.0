from datetime import datetime
from fastapi import APIRouter, Query
import httpx

from app.core.config import settings


router = APIRouter()

# Map Indian states/regions to a city for OpenWeather geo lookup (state names often don't resolve)
REGION_TO_CITY = {
    "andhra pradesh": "Hyderabad",
    "arunachal pradesh": "Itanagar",
    "assam": "Guwahati",
    "bihar": "Patna",
    "chhattisgarh": "Raipur",
    "goa": "Panaji",
    "gujarat": "Ahmedabad",
    "haryana": "Chandigarh",
    "himachal pradesh": "Shimla",
    "jharkhand": "Ranchi",
    "karnataka": "Bengaluru",
    "kerala": "Thiruvananthapuram",
    "madhya pradesh": "Bhopal",
    "maharashtra": "Mumbai",
    "manipur": "Imphal",
    "meghalaya": "Shillong",
    "mizoram": "Aizawl",
    "nagaland": "Kohima",
    "odisha": "Bhubaneswar",
    "punjab": "Chandigarh",
    "rajasthan": "Jaipur",
    "sikkim": "Gangtok",
    "tamil nadu": "Chennai",
    "telangana": "Hyderabad",
    "tripura": "Agartala",
    "uttar pradesh": "Lucknow",
    "uttarakhand": "Dehradun",
    "west bengal": "Kolkata",
    "delhi": "New Delhi",
    "jammu and kashmir": "Srinagar",
    "ladakh": "Leh",
    "puducherry": "Puducherry",
}


def _mock_weather(region: str):
    return {
        "region": region,
        "temp_c": 29.4,
        "humidity": 64,
        "rainfall_mm": 3.2,
        "source": "mock",
    }


@router.get("/current")
async def current_weather(region: str = Query(..., description="Region or state name")):
    if not (region and region.strip()):
        return _mock_weather(region or "Unknown")

    region_clean = region.strip()
    if not settings.OPENWEATHER_API_KEY:
        return _mock_weather(region_clean)

    # Use state-to-city mapping so OpenWeather can resolve the location
    query = REGION_TO_CITY.get(region_clean.lower(), region_clean)
    query = f"{query},IN"

    try:
        async with httpx.AsyncClient() as client:
            geo_resp = await client.get(
                "https://api.openweathermap.org/geo/1.0/direct",
                params={"q": query, "limit": 1, "appid": settings.OPENWEATHER_API_KEY},
                timeout=10,
            )
            geo_resp.raise_for_status()
            geo_data = geo_resp.json()

            if not geo_data or not isinstance(geo_data, list):
                return _mock_weather(region_clean)

            lat = geo_data[0].get("lat")
            lon = geo_data[0].get("lon")
            if lat is None or lon is None:
                return _mock_weather(region_clean)

            resp = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": settings.OPENWEATHER_API_KEY,
                    "units": "metric",
                },
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()
    except Exception:
        return _mock_weather(region_clean)

    main = data.get("main") or {}
    rain = data.get("rain") or {}
    return {
        "region": region_clean,
        "temp_c": main.get("temp", 29.4),
        "humidity": main.get("humidity", 64),
        "rainfall_mm": rain.get("1h", 0) or rain.get("3h", 0) or 0,
        "source": "openweathermap",
    }


@router.get("/risk-alerts")
def weather_risk_alerts(
    crop: str = Query(..., description="Crop name"),
    region: str = Query(..., description="Region/state name"),
):
    alerts = []
    crop_lower = (crop or "").strip().lower()
    region_lower = (region or "").strip().lower()

    # Crop-specific risks
    if crop_lower in {"rice", "paddy"}:
        alerts.append("High humidity risk: monitor for fungal issues (blast, sheath blight).")
    if crop_lower in {"tomato", "brinjal", "capsicum", "chilli", "green chilli"}:
        alerts.append("Tomato/brinjal family: watch for late blight and fruit borer in wet conditions.")
    if crop_lower in {"potato"}:
        alerts.append("Potato: avoid waterlogging; risk of late blight in humid weather.")
    if crop_lower in {"onion"}:
        alerts.append("Onion: excess rain can cause bulb rot; ensure good drainage.")
    if crop_lower in {"mango", "banana", "papaya", "guava"}:
        alerts.append("Fruit crops: heavy rain can cause fruit drop and pest buildup.")
    if crop_lower in {"cotton"}:
        alerts.append("Cotton: avoid picking during rain; boll rot risk in humid spells.")
    if crop_lower in {"wheat", "barley"}:
        alerts.append("Cereals: avoid irrigation close to harvest to reduce lodging.")

    # Region/climate-specific risks (match state or city names)
    if any(x in region_lower for x in ["maharashtra", "nashik", "nagpur", "pune"]):
        alerts.append("Heat stress possible in peak summer; schedule irrigation in early morning.")
    if any(x in region_lower for x in ["rajasthan", "gujarat", "haryana", "punjab"]):
        alerts.append("Low humidity and high evapotranspiration; increase irrigation frequency if needed.")
    if any(x in region_lower for x in ["kerala", "west bengal", "assam", "odisha"]):
        alerts.append("High rainfall region: monitor drainage and fungal disease pressure.")
    if any(x in region_lower for x in ["himachal", "uttarakhand", "jammu", "ladakh", "sikkim"]):
        alerts.append("Cold/frost risk in winter; protect sensitive crops during cold spells.")

    if not alerts:
        alerts.append("No major weather-related risks detected for this crop and region.")

    return {
        "crop": crop or "",
        "region": region or "",
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "alerts": alerts,
    }
