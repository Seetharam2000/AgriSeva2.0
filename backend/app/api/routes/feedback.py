from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

from app.store import store


router = APIRouter()


class FeedbackRequest(BaseModel):
    name: str
    role: str
    message: str


@router.post("/")
def submit_feedback(payload: FeedbackRequest):
    entry = payload.dict()
    entry["created_at"] = datetime.utcnow().isoformat()
    store.feedbacks.append(entry)
    return {"msg": "Feedback stored"}
