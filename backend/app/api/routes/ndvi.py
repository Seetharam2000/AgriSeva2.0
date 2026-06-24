import json
from pathlib import Path
from fastapi import APIRouter, Query, HTTPException


router = APIRouter()

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "ndvi_samples.json"


def ndvi_value(nir: float, red: float) -> float:
    if nir + red == 0:
        return 0.0
    return (nir - red) / (nir + red)


def ndvi_label(value: float) -> str:
    if value >= 0.6:
        return "Healthy"
    if value >= 0.35:
        return "Moderate stress"
    return "High stress"


def load_samples():
    with open(DATA_PATH, "r", encoding="utf-8") as handle:
        return json.load(handle)


@router.get("/health-status")
def health_status(farm_id: str = Query(...)):
    samples = load_samples()
    sample = next((s for s in samples if s["farm_id"] == farm_id), None)
    if not sample:
        raise HTTPException(status_code=404, detail="Farm not found")
    value = ndvi_value(sample["nir"], sample["red"])
    return {
        "farm_id": farm_id,
        "ndvi": round(value, 3),
        "health": ndvi_label(value),
    }


@router.get("/map")
def ndvi_map(region: str = Query(...), crop: str = Query(...)):
    samples = load_samples()
    filtered = [s for s in samples if s["region"] == region and s["crop"] == crop]
    results = []
    for sample in filtered:
        value = ndvi_value(sample["nir"], sample["red"])
        results.append(
            {
                "farm_id": sample["farm_id"],
                "lat": sample["lat"],
                "lon": sample["lon"],
                "ndvi": round(value, 3),
                "health": ndvi_label(value),
            }
        )
    return {"region": region, "crop": crop, "points": results}
