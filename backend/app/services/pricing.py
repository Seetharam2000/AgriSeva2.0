from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Any

import pandas as pd
from prophet import Prophet


DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "agmarknet_sample.csv"


@dataclass
class PredictionResult:
    forecast: list[dict]
    best_window: dict
    confidence: float


def load_price_history(crop: str, region: str) -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH, parse_dates=["date"])
    return df[(df["crop"] == crop) & (df["region"] == region)].copy()


def train_and_predict(crop: str, region: str, periods: int = 30) -> PredictionResult:
    df = load_price_history(crop, region)
    if df.empty:
        raise ValueError("No history available for crop/region")

    # Prophet expects ds/y columns. We include regressors for weather.
    model = Prophet()
    model.add_regressor("rainfall")
    model.add_regressor("temperature")

    train_df = df.rename(columns={"date": "ds", "price": "y"})[
        ["ds", "y", "rainfall", "temperature"]
    ]
    model.fit(train_df)

    future = model.make_future_dataframe(periods=periods, freq="D")
    future = future.merge(
        df[["date", "rainfall", "temperature"]].rename(columns={"date": "ds"}),
        on="ds",
        how="left",
    )
    future["rainfall"] = future["rainfall"].fillna(df["rainfall"].mean())
    future["temperature"] = future["temperature"].fillna(df["temperature"].mean())

    forecast = model.predict(future)
    forecast_tail = forecast.tail(periods)

    best_row = forecast_tail.loc[forecast_tail["yhat"].idxmax()]
    best_window = {
        "date": best_row["ds"].date().isoformat(),
        "expected_price": round(float(best_row["yhat"]), 2),
    }

    # Simple confidence score: normalized inverse of prediction interval width.
    interval = (forecast_tail["yhat_upper"] - forecast_tail["yhat_lower"]).mean()
    avg_price = forecast_tail["yhat"].mean()
    confidence = max(0.2, min(0.95, 1 - (interval / max(avg_price, 1))))

    return PredictionResult(
        forecast=[
            {
                "date": row["ds"].date().isoformat(),
                "predicted_price": round(float(row["yhat"]), 2),
                "lower": round(float(row["yhat_lower"]), 2),
                "upper": round(float(row["yhat_upper"]), 2),
            }
            for _, row in forecast_tail.iterrows()
        ],
        best_window=best_window,
        confidence=round(float(confidence), 2),
    )


def summarize_history(df: pd.DataFrame) -> Dict[str, Any]:
    return {
        "min_price": float(df["price"].min()),
        "max_price": float(df["price"].max()),
        "avg_price": float(df["price"].mean()),
    }
