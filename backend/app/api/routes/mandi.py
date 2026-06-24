from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
import random

router = APIRouter()

# Sample mandis per state (name, base price per qtl, distance km, logistics ₹)
MANDIS_BY_REGION = {
    "Maharashtra": [
        ("Nagpur Mandi", 1820, 18, 90),
        ("Wardha Mandi", 1760, 42, 160),
        ("Bhandara Mandi", 1885, 58, 210),
        ("Pune Mandi", 1950, 120, 320),
        ("Nashik Mandi", 1890, 200, 380),
        ("Mumbai (APMC)", 2100, 280, 450),
    ],
    "Karnataka": [
        ("Bengaluru (APMC)", 1920, 0, 0),
        ("Mysuru Mandi", 1780, 140, 220),
        ("Belagavi Mandi", 1750, 500, 520),
        ("Dharwad Mandi", 1770, 430, 400),
    ],
    "Tamil Nadu": [
        ("Chennai (Koyambedu)", 2050, 0, 0),
        ("Coimbatore Mandi", 1880, 480, 380),
        ("Madurai Mandi", 1820, 450, 360),
    ],
    "Gujarat": [
        ("Ahmedabad (APMC)", 1850, 0, 0),
        ("Rajkot Mandi", 1790, 230, 280),
        ("Surat Mandi", 1920, 265, 320),
    ],
    "Rajasthan": [
        ("Jaipur Mandi", 1780, 0, 0),
        ("Kota Mandi", 1720, 250, 240),
        ("Udaipur Mandi", 1750, 400, 350),
    ],
    "Uttar Pradesh": [
        ("Lucknow Mandi", 1740, 0, 0),
        ("Kanpur Mandi", 1710, 80, 120),
        ("Varanasi Mandi", 1760, 280, 220),
    ],
    "Madhya Pradesh": [
        ("Bhopal Mandi", 1790, 0, 0),
        ("Indore Mandi", 1840, 190, 200),
        ("Jabalpur Mandi", 1770, 330, 260),
    ],
    "West Bengal": [
        ("Kolkata (Burdwan)", 1980, 0, 0),
        ("Siliguri Mandi", 1850, 560, 420),
    ],
    "Andhra Pradesh": [
        ("Hyderabad (Gaddiannaram)", 1880, 0, 0),
        ("Vijayawada Mandi", 1820, 270, 220),
        ("Tirupati Mandi", 1790, 550, 380),
    ],
    "Telangana": [
        ("Hyderabad (APMC)", 1900, 0, 0),
        ("Warangal Mandi", 1760, 140, 150),
    ],
    "Punjab": [
        ("Ludhiana Mandi", 1720, 0, 0),
        ("Amritsar Mandi", 1740, 140, 160),
        ("Jalandhar Mandi", 1710, 155, 170),
    ],
    "Haryana": [
        ("Gurugram (Gurgaon) Mandi", 1860, 0, 0),
        ("Hisar Mandi", 1730, 165, 180),
        ("Karnal Mandi", 1750, 130, 150),
    ],
    "Bihar": [
        ("Patna Mandi", 1710, 0, 0),
        ("Muzaffarpur Mandi", 1690, 80, 100),
        ("Gaya Mandi", 1700, 100, 120),
    ],
    "Kerala": [
        ("Thiruvananthapuram Mandi", 2050, 0, 0),
        ("Kochi Mandi", 1980, 200, 220),
    ],
    "Odisha": [
        ("Bhubaneswar Mandi", 1830, 0, 0),
        ("Cuttack Mandi", 1810, 25, 60),
    ],
}

# Crop price multiplier (relative to base; base ≈ Tomato)
CROP_MULTIPLIER = {
    "tomato": 1.0,
    "potato": 0.65,
    "onion": 0.85,
    "brinjal": 0.7,
    "okra": 1.1,
    "cauliflower": 0.9,
    "cabbage": 0.5,
    "carrot": 0.8,
    "green chilli": 1.4,
    "capsicum": 1.2,
    "cucumber": 0.6,
    "bottle gourd": 0.55,
    "bitter gourd": 0.95,
    "pumpkin": 0.5,
    "spinach": 0.7,
    "banana": 0.4,
    "mango": 1.0,
    "apple": 2.0,
    "orange": 0.9,
    "grapes": 1.5,
    "pomegranate": 1.8,
    "papaya": 0.45,
    "guava": 0.6,
    "pineapple": 0.7,
    "watermelon": 0.4,
    "muskmelon": 0.55,
}


def _get_mandis_for_region(region: str, crop: str):
    region_key = region.strip()
    for key, mandis in MANDIS_BY_REGION.items():
        if key.lower() == region_key.lower():
            mult = CROP_MULTIPLIER.get(crop.strip().lower(), 1.0)
            # Slight random variation per crop/region
            out = []
            for name, base, dist, log in mandis:
                price = max(100, round(base * mult * (0.97 + random.random() * 0.06)))
                out.append({
                    "name": name,
                    "price_per_qtl": price,
                    "price": f"₹{price}/qtl",
                    "distance_km": dist,
                    "distance": f"{dist} km",
                    "logistics_rs": log,
                    "logistics": f"₹{log}",
                })
            return out
    # Default: Maharashtra
    return _get_mandis_for_region("Maharashtra", crop)


@router.get("/compare")
def mandi_compare(
    crop: str = Query(..., description="Crop name"),
    region: str = Query(..., description="State/region name"),
):
    mandis = _get_mandis_for_region(region, crop)
    return {
        "crop": crop,
        "region": region,
        "mandis": mandis,
    }
