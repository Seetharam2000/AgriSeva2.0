from __future__ import annotations

from pymongo import MongoClient

from app.core.config import settings


_client: MongoClient | None = None


def get_db():
    if not settings.MONGO_URI:
        return None
    global _client
    if _client is None:
        _client = MongoClient(settings.MONGO_URI)
    return _client.get_database(settings.MONGO_DB)


def get_collection(name: str):
    db = get_db()
    if db is None:
        return None
    return db[name]
