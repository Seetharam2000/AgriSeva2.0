from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.services.pricing import load_price_history, train_and_predict, summarize_history


router = APIRouter()


class PredictRequest(BaseModel):
    crop: str
    region: str


@router.get("/history")
def price_history(crop: str = Query(...), region: str = Query(...)):
    df = load_price_history(crop, region)
    if df.empty:
        raise HTTPException(status_code=404, detail="No history for crop/region")
    return {
        "crop": crop,
        "region": region,
        "history": df.to_dict(orient="records"),
        "summary": summarize_history(df),
    }


@router.post("/predict")
def price_predict(payload: PredictRequest):
    try:
        result = train_and_predict(payload.crop, payload.region)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {
        "crop": payload.crop,
        "region": payload.region,
        "forecast": result.forecast,
        "best_selling_window": result.best_window,
        "confidence": result.confidence,
    }
