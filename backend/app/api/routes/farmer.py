from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db.mongo import get_collection
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


def seed_demo_data():
    farmers_col = get_collection("farmers")
    crops_col = get_collection("crops")
    if not farmers_col or not crops_col:
        return
    if farmers_col.count_documents({}) > 0:
        return
    farmers_col.insert_many(
        [
            {
                "farmer_id": "FARM-001",
                "name": "Seetha Raman",
                "region": "Tamil Nadu",
                "phone": "9000000001",
            },
            {
                "farmer_id": "FARM-002",
                "name": "Ravi Kumar",
                "region": "Maharashtra",
                "phone": "9000000002",
            },
            {
                "farmer_id": "FARM-003",
                "name": "Anita Sharma",
                "region": "Punjab",
                "phone": "9000000003",
            },
        ]
    )
    crops_col.insert_many(
        [
            {
                "farmer_id": "FARM-001",
                "crop": "Tomato",
                "acreage": 2.5,
                "expected_harvest_date": "2026-03-15",
                "created_at": datetime.utcnow().isoformat(),
            },
            {
                "farmer_id": "FARM-002",
                "crop": "Onion",
                "acreage": 3.0,
                "expected_harvest_date": "2026-03-22",
                "created_at": datetime.utcnow().isoformat(),
            },
        ]
    )


@router.post("/register")
def register_farmer(payload: FarmerRegister):
    farmers_col = get_collection("farmers")
    if farmers_col:
        if farmers_col.find_one({"farmer_id": payload.farmer_id}):
            raise HTTPException(status_code=409, detail="Farmer already exists")
        farmers_col.insert_one(payload.model_dump())
        return {"status": "registered", "farmer": payload.model_dump()}

    if payload.farmer_id in store.farmers:
        raise HTTPException(status_code=409, detail="Farmer already exists")
    store.farmers[payload.farmer_id] = payload.model_dump()
    return {"status": "registered", "farmer": payload.model_dump()}


@router.post("/crop")
def register_crop(payload: CropCreate):
    farmers_col = get_collection("farmers")
    crops_col = get_collection("crops")
    if farmers_col and crops_col:
        if not farmers_col.find_one({"farmer_id": payload.farmer_id}):
            raise HTTPException(status_code=404, detail="Farmer not found")
        crop_entry = payload.model_dump()
        crop_entry["created_at"] = datetime.utcnow().isoformat()
        crops_col.insert_one(crop_entry)
        return {"status": "crop_added", "crop": crop_entry}

    if payload.farmer_id not in store.farmers:
        raise HTTPException(status_code=404, detail="Farmer not found")
    crop_entry = payload.model_dump()
    crop_entry["created_at"] = datetime.utcnow().isoformat()
    store.crops.append(crop_entry)
    return {"status": "crop_added", "crop": crop_entry}


@router.get("/dashboard")
def farmer_dashboard():
    farmers_col = get_collection("farmers")
    crops_col = get_collection("crops")
    if farmers_col and crops_col:
        seed_demo_data()
        farmers = list(farmers_col.find({}, {"_id": 0}))
        crops = list(crops_col.find({}, {"_id": 0}))
        return {
            "farmers": farmers,
            "crops": crops,
            "total_farmers": len(farmers),
            "total_crops": len(crops),
        }

    return {
        "farmers": list(store.farmers.values()),
        "crops": store.crops,
        "total_farmers": len(store.farmers),
        "total_crops": len(store.crops),
    }
