from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

from app.store import store


router = APIRouter()


class AuctionCreate(BaseModel):
    auction_id: str
    crop: str
    quantity_kg: float
    base_price: float
    region: str


class BidCreate(BaseModel):
    auction_id: str
    bidder: str
    price: float


@router.post("/create")
def create_auction(payload: AuctionCreate):
    auction = payload.model_dump()
    auction["bids"] = []
    auction["created_at"] = datetime.utcnow().isoformat()
    store.auctions.append(auction)
    return {"status": "created", "auction": auction}


@router.post("/bid")
def place_bid(payload: BidCreate):
    for auction in store.auctions:
        if auction["auction_id"] == payload.auction_id:
            bid = payload.model_dump()
            bid["created_at"] = datetime.utcnow().isoformat()
            auction["bids"].append(bid)
            return {"status": "bid_received", "bid": bid}
    return {"status": "not_found"}


@router.get("/live")
def live_auctions():
    return {"auctions": store.auctions}
