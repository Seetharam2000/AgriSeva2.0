import json
import os
import sys
from pathlib import Path

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from ml.price_predictor import predict_prices

DATA_DIR = PROJECT_ROOT / "data"

app = FastAPI(title="AgriSeva MVP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    crop: str
    region: str
    horizon_days: int = 14


@app.get("/")
def health_check():
    return {"status": "ok", "message": "AgriSeva decision assistant API"}


@app.post("/prices/predict")
def prices_predict(payload: PredictRequest):
    try:
        return predict_prices(payload.crop, payload.region, payload.horizon_days)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/weather/risk-alerts")
def weather_risk_alerts(region: str):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    coordinates = {
        "Madurai": (9.9252, 78.1198),
        "Coimbatore": (11.0168, 76.9558),
        "Salem": (11.6643, 78.1460),
        "Thanjavur": (10.7867, 79.1378),
    }

    if api_key and region in coordinates:
        lat, lon = coordinates[region]
        url = (
            "https://api.openweathermap.org/data/2.5/forecast"
            f"?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        )
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        rainfall_events = [
            item
            for item in data.get("list", [])
            if item.get("rain", {}).get("3h", 0) >= 10
        ]

        if rainfall_events:
            days_ahead = rainfall_events[0]["dt_txt"].split(" ")[0]
            return {
                "risk_level": "High",
                "message": f"Heavy rainfall expected around {days_ahead} — consider delaying harvest."
            }

        return {
            "risk_level": "Low",
            "message": "No heavy rainfall predicted in the next 5 days."
        }

    return {
        "risk_level": "Moderate",
        "message": "Light rains possible in 3–5 days — monitor harvest timing."
    }


@app.get("/ndvi/health-status")
def ndvi_health_status(crop: str, region: str):
    file_path = DATA_DIR / "ndvi_samples.json"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="NDVI data missing")

    ndvi_data = json.loads(file_path.read_text())
    ndvi_value = ndvi_data.get(region, {}).get(crop)
    if ndvi_value is None:
        ndvi_value = 0.5

    if ndvi_value >= 0.65:
        status = "Healthy"
    elif ndvi_value >= 0.5:
        status = "Moderate Stress"
    else:
        status = "High Stress"

    return {"ndvi_value": ndvi_value, "status": status}


@app.get("/market/compare")
def market_compare(crop: str, region: str):
    file_path = DATA_DIR / "market_prices.json"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Market data missing")

    market_data = json.loads(file_path.read_text()).get(region, [])
    if not market_data:
        return {"crop": crop, "region": region, "markets": []}

    markets = []
    for market in market_data:
        net_profit = market["price"] - market["transport_cost"]
        markets.append(
            {
                **market,
                "net_profit": net_profit,
                "is_best": False
            }
        )

    best_market = max(markets, key=lambda item: item["net_profit"])
    for market in markets:
        if market["name"] == best_market["name"]:
            market["is_best"] = True

    return {"crop": crop, "region": region, "markets": markets}
