from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.store import store


router = APIRouter()


class FarmerRegister(BaseModel):
    farmer_id: str
    name: str
    region: str
    phone: str


class CropCreate(BaseModel):
    farmer_id: str
    crop: str
    acreage: float
    expected_harvest_date: str


@router.post("/register")
def register_farmer(payload: FarmerRegister):
    if payload.farmer_id in store.farmers:
        raise HTTPException(status_code=409, detail="Farmer already exists")
    store.farmers[payload.farmer_id] = payload.dict()
    return {"status": "registered", "farmer": payload.dict()}


@router.post("/crop")
def register_crop(payload: CropCreate):
    if payload.farmer_id not in store.farmers:
        raise HTTPException(status_code=404, detail="Farmer not found")
    crop_entry = payload.dict()
    crop_entry["created_at"] = datetime.utcnow().isoformat()
    store.crops.append(crop_entry)
    return {"status": "crop_added", "crop": crop_entry}


@router.get("/dashboard")
def farmer_dashboard():
    return {
        "farmers": list(store.farmers.values()),
        "crops": store.crops,
        "total_farmers": len(store.farmers),
        "total_crops": len(store.crops),
    }
