from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, Optional


router = APIRouter()

SOIL_TYPES = ["Loamy", "Clay", "Sandy", "Red", "Black"]


class SoilAdvisoryRequest(BaseModel):
    soil_type: str
    crop: str
    region: Optional[str] = None


def get_soil_advisory(soil_type: str, crop: str, region: Optional[str] = None) -> Dict:
    """
    Return soil-to-fertilizer advisory based on soil type, crop, and optional region.
    """
    soil_type = soil_type.strip() or "Loamy"
    crop = crop.strip() or "Tomato"
    region = (region or "").strip()

    # Base recommendations by soil type
    soil_profiles = {
        "Loamy": {
            "organic_matter": "Medium to High",
            "drainage": "Good",
            "ph_range": "6.0–7.0",
            "general_note": "Well-balanced; suitable for most crops.",
        },
        "Clay": {
            "organic_matter": "Medium",
            "drainage": "Poor",
            "ph_range": "6.5–7.5",
            "general_note": "Add organic matter and ensure drainage.",
        },
        "Sandy": {
            "organic_matter": "Low",
            "drainage": "Very Good",
            "ph_range": "5.5–6.5",
            "general_note": "Needs more organic matter and frequent irrigation.",
        },
        "Red": {
            "organic_matter": "Low to Medium",
            "drainage": "Moderate",
            "ph_range": "5.0–6.5",
            "general_note": "Common in peninsular India; lime if acidic.",
        },
        "Black": {
            "organic_matter": "Medium to High",
            "drainage": "Moderate",
            "ph_range": "7.0–8.5",
            "general_note": "High CEC; good for cotton, sugarcane, cereals.",
        },
    }

    profile = soil_profiles.get(soil_type, soil_profiles["Loamy"])

    # Crop-specific fertilizer suggestions (kg/acre approximate)
    crop_fertilizers = {
        "Tomato": "NPK 19-19-19 (50 kg/acre) + FYM 8–10 t/acre",
        "Potato": "NPK 120:80:80 (N:P₂O₅:K₂O kg/ha); split application",
        "Onion": "NPK 60:40:40 (N:P₂O₅:K₂O kg/ha) + micronutrients",
        "Brinjal": "NPK 90:60:60 (N:P₂O₅:K₂O kg/ha) + FYM",
        "Okra": "NPK 50:25:25 (N:P₂O₅:K₂O kg/ha)",
        "Cauliflower": "NPK 150:80:60 (N:P₂O₅:K₂O kg/ha) + boron",
        "Cabbage": "NPK 120:60:40 (N:P₂O₅:K₂O kg/ha)",
        "Carrot": "NPK 40:80:80 (N:P₂O₅:K₂O kg/ha); low N for root",
        "Green Chilli": "NPK 60:40:40 (N:P₂O₅:K₂O kg/ha)",
        "Capsicum": "NPK 80:50:50 (N:P₂O₅:K₂O kg/ha)",
        "Cucumber": "NPK 50:40:40 (N:P₂O₅:K₂O kg/ha)",
        "Bottle Gourd": "NPK 40:40:40 (N:P₂O₅:K₂O kg/ha) + FYM",
        "Bitter Gourd": "NPK 50:50:50 (N:P₂O₅:K₂O kg/ha)",
        "Pumpkin": "NPK 40:40:40 (N:P₂O₅:K₂O kg/ha)",
        "Spinach": "NPK 40:20:20 (N:P₂O₅:K₂O kg/ha); nitrogen for leafy growth",
        "Banana": "NPK 200:50:300 (N:P₂O₅:K₂O kg/ha) in splits",
        "Mango": "NPK 400:200:200 g/tree/year + micronutrients",
        "Apple": "NPK 500:250:250 g/tree (temperate regions)",
        "Orange": "NPK 300:150:150 g/tree/year",
        "Grapes": "NPK 100:50:50 (N:P₂O₅:K₂O kg/ha) + foliar",
        "Pomegranate": "NPK 600:250:250 g/tree/year",
        "Papaya": "NPK 200:100:100 (N:P₂O₅:K₂O kg/ha)",
        "Guava": "NPK 250:250:250 g/tree/year",
        "Pineapple": "NPK 12:4:16 (N:P₂O₅:K₂O g/plant)",
        "Watermelon": "NPK 50:50:50 (N:P₂O₅:K₂O kg/ha)",
        "Muskmelon": "NPK 50:50:50 (N:P₂O₅:K₂O kg/ha)",
    }

    suggested_fertilizer = crop_fertilizers.get(crop, "NPK 20-20-20 (45 kg/acre) + FYM 5 t/acre")

    # Soil-type adjustment to fertilizer advice
    if soil_type == "Clay":
        suggested_fertilizer += ". Use split doses; avoid waterlogging."
    elif soil_type == "Sandy":
        suggested_fertilizer += ". Split applications; increase organic matter."
    elif soil_type == "Red":
        suggested_fertilizer += ". Apply lime if pH < 5.5; add zinc if deficient."
    elif soil_type == "Black":
        suggested_fertilizer += ". Good retention; fewer splits possible."

    # Build recommendations list for frontend
    recommendations = [
        {"label": "Soil Type", "value": soil_type},
        {"label": "Organic Matter", "value": profile["organic_matter"]},
        {"label": "Drainage", "value": profile["drainage"]},
        {"label": "pH Range", "value": profile["ph_range"]},
        {"label": "Suggested Fertilizer", "value": suggested_fertilizer},
        {"label": "Note", "value": profile["general_note"]},
    ]

    return {
        "soil_type": soil_type,
        "crop": crop,
        "region": region or None,
        "recommendations": recommendations,
        "generated_at": datetime.utcnow().isoformat() + "Z",
    }


@router.post("/")
def soil_advisory_post(payload: SoilAdvisoryRequest):
    """Get soil advisory by soil type, crop, and optional region (POST)."""
    if payload.soil_type not in SOIL_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid soil_type. Choose from: {', '.join(SOIL_TYPES)}",
        )
    try:
        return get_soil_advisory(payload.soil_type, payload.crop, payload.region)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating advisory: {str(e)}")


@router.get("/")
def soil_advisory_get(
    soil_type: str = Query(..., description="Soil type"),
    crop: str = Query(..., description="Crop name"),
    region: Optional[str] = Query(None, description="Region/State"),
):
    """Get soil advisory by soil type, crop, and optional region (GET)."""
    if soil_type not in SOIL_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid soil_type. Choose from: {', '.join(SOIL_TYPES)}",
        )
    try:
        return get_soil_advisory(soil_type, crop, region)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating advisory: {str(e)}")
