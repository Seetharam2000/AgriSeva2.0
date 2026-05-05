import json
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
import pandas as pd

DATA_DIR = Path(__file__).resolve().parents[1] / "data"


def _load_price_history(crop: str) -> pd.DataFrame:
    file_path = DATA_DIR / f"prices_{crop.lower()}.csv"
    if not file_path.exists():
        raise FileNotFoundError(f"Missing price history for {crop}")
    df = pd.read_csv(file_path)
    df["date"] = pd.to_datetime(df["date"])
    return df.sort_values("date")


def _seasonal_adjustment(day_index: int) -> float:
    return 8 * np.sin(day_index / 6.0)


def predict_prices(crop: str, region: str, horizon_days: int = 14):
    history = _load_price_history(crop)
    history = history.tail(21)

    x = np.arange(len(history))
    y = history["price"].values
    slope, intercept = np.polyfit(x, y, 1)

    last_date = history["date"].iloc[-1]
    forecast = []
    for i in range(1, horizon_days + 1):
        trend_price = intercept + slope * (len(history) - 1 + i)
        seasonal = _seasonal_adjustment(i)
        price = max(0, trend_price + seasonal)
        forecast.append(
            {
                "date": (last_date + timedelta(days=i)).strftime("%Y-%m-%d"),
                "price": round(float(price), 2)
            }
        )

    history_points = [
        {"date": row["date"].strftime("%Y-%m-%d"), "price": float(row["price"])}
        for _, row in history.iterrows()
    ]

    trend = "Upward" if slope > 0.2 else "Stable" if slope >= -0.2 else "Downward"
    avg_forecast = np.mean([point["price"] for point in forecast])
    avg_recent = np.mean(history["price"])

    if avg_forecast >= avg_recent * 1.03:
        recommendation = "Hold"
        confidence = 71
        explanation = "Prices show an upward trend with seasonal support."
    elif avg_forecast <= avg_recent * 0.98:
        recommendation = "Sell Now"
        confidence = 76
        explanation = "Recent prices soften and near-term forecast dips."
    else:
        recommendation = "High Risk"
        confidence = 60
        explanation = "Market is flat with mixed rainfall influence."

    return {
        "crop": crop,
        "region": region,
        "trend": trend,
        "recommendation": recommendation,
        "confidence": confidence,
        "explanation": explanation,
        "history": history_points,
        "forecast": forecast
    }


if __name__ == "__main__":
    result = predict_prices("Tomato", "Madurai", 14)
    print(json.dumps(result, indent=2))
