from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from app.store import store


router = APIRouter()


class PoolCreate(BaseModel):
    from_place: str
    to_place: str
    date_time: str
    capacity: Optional[str] = "2 tractors"


class PoolJoin(BaseModel):
    pool_id: str


def _seed_pools_if_empty():
    if not store.transport_pools:
        store.transport_pools.extend([
            {
                "id": "pool-1",
                "route": "Nashik → Pune",
                "from_place": "Nashik",
                "to_place": "Pune",
                "seats": "2 tractors",
                "date": "Tomorrow 6:00 AM",
                "date_time": "",
                "capacity": "2 tractors",
                "joined": 0,
                "created_at": datetime.utcnow().isoformat(),
            },
            {
                "id": "pool-2",
                "route": "Nagpur → Bhandara",
                "from_place": "Nagpur",
                "to_place": "Bhandara",
                "seats": "1 truck",
                "date": "Today 4:00 PM",
                "date_time": "",
                "capacity": "1 truck",
                "joined": 0,
                "created_at": datetime.utcnow().isoformat(),
            },
            {
                "id": "pool-3",
                "route": "Indore → Ujjain",
                "from_place": "Indore",
                "to_place": "Ujjain",
                "seats": "3 mini-trucks",
                "date": "Friday 7:30 AM",
                "date_time": "",
                "capacity": "3 mini-trucks",
                "joined": 0,
                "created_at": datetime.utcnow().isoformat(),
            },
        ])


@router.get("/")
def list_pools(
    from_place: Optional[str] = Query(None, description="Filter by origin"),
    to_place: Optional[str] = Query(None, description="Filter by destination"),
):
    """List transport pools, optionally filtered by from/to."""
    _seed_pools_if_empty()
    pools = list(store.transport_pools)
    if from_place:
        from_place_lower = from_place.strip().lower()
        pools = [p for p in pools if (p.get("from_place") or "").lower() == from_place_lower or from_place_lower in (p.get("route") or "").lower()]
    if to_place:
        to_place_lower = to_place.strip().lower()
        pools = [p for p in pools if (p.get("to_place") or "").lower() == to_place_lower or to_place_lower in (p.get("route") or "").lower()]
    return {"pools": pools}


@router.post("/")
def create_pool(payload: PoolCreate):
    """Create a new transport pool."""
    if not store.transport_pools:
        _seed_pools_if_empty()
    pool_id = f"pool-{len(store.transport_pools) + 1}-{datetime.utcnow().strftime('%H%M%S')}"
    route = f"{payload.from_place.strip()} → {payload.to_place.strip()}"
    pool = {
        "id": pool_id,
        "route": route,
        "from_place": payload.from_place.strip(),
        "to_place": payload.to_place.strip(),
        "seats": payload.capacity or "2 tractors",
        "date": payload.date_time.strip() or "TBD",
        "date_time": payload.date_time.strip(),
        "capacity": payload.capacity or "2 tractors",
        "joined": 0,
        "created_at": datetime.utcnow().isoformat(),
    }
    store.transport_pools.append(pool)
    return {"status": "created", "pool": pool}


@router.post("/join")
def join_pool(payload: PoolJoin):
    """Join an existing transport pool."""
    _seed_pools_if_empty()
    for pool in store.transport_pools:
        if pool.get("id") == payload.pool_id:
            pool["joined"] = pool.get("joined", 0) + 1
            return {"status": "joined", "pool_id": payload.pool_id, "route": pool.get("route", "")}
    raise HTTPException(status_code=404, detail="Pool not found")
