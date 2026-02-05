from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

from app.store import store


router = APIRouter()


class RegisterData(BaseModel):
    farmer_id: str
    data_hash: str
    description: str


@router.post("/register-data")
def register_data(payload: RegisterData):
    log = payload.model_dump()
    log["event"] = "register"
    log["timestamp"] = datetime.utcnow().isoformat()
    # Demo only: a real implementation would call the smart contract via web3.
    store.blockchain_logs.append(log)
    return {"status": "registered", "log": log}


@router.get("/access-log")
def access_log():
    return {"logs": store.blockchain_logs}
