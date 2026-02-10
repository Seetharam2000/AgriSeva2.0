from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    auth,
    farmer,
    prices,
    weather,
    ndvi,
    auction,
    blockchain,
    feedback,
)
from app.core.config import settings


app = FastAPI(
    title="Agriseva Farm-to-Market Intelligence API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.CORS_ALLOW_ALL else settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(farmer.router, prefix="/farmer", tags=["farmer"])
app.include_router(prices.router, prefix="/prices", tags=["prices"])
app.include_router(weather.router, prefix="/weather", tags=["weather"])
app.include_router(ndvi.router, prefix="/ndvi", tags=["ndvi"])
app.include_router(auction.router, prefix="/auction", tags=["auction"])
app.include_router(blockchain.router, prefix="/blockchain", tags=["blockchain"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Agriseva MVP API is running",
    }
