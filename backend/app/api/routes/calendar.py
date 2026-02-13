from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Dict


router = APIRouter()


class CalendarRequest(BaseModel):
    crop: str
    region: str


# Crop calendar data based on crop type and region
def get_crop_calendar(crop: str, region: str) -> List[Dict]:
    """
    Generate crop calendar based on crop type and region.
    Different crops have different growing seasons, and regions have different climates.
    """
    current_year = datetime.now().year
    current_month = datetime.now().month
    
    # Base calendars for different crop types
    crop_calendars = {
        "Tomato": {
            "sowing": {"months": [10, 11, 12, 1, 2], "duration_days": 15},
            "irrigation": {"frequency_days": 7, "start_offset": 30},
            "fertilization": {"offset": 45, "duration": 10},
            "pest_watch": {"offset": 60, "duration": 30},
            "harvest": {"offset": 90, "duration": 45}
        },
        "Potato": {
            "sowing": {"months": [10, 11, 12], "duration_days": 20},
            "irrigation": {"frequency_days": 5, "start_offset": 25},
            "fertilization": {"offset": 40, "duration": 15},
            "pest_watch": {"offset": 50, "duration": 40},
            "harvest": {"offset": 100, "duration": 30}
        },
        "Onion": {
            "sowing": {"months": [10, 11, 12, 1], "duration_days": 20},
            "irrigation": {"frequency_days": 8, "start_offset": 20},
            "fertilization": {"offset": 50, "duration": 10},
            "pest_watch": {"offset": 70, "duration": 30},
            "harvest": {"offset": 120, "duration": 20}
        },
        "Brinjal": {
            "sowing": {"months": [6, 7, 8, 9], "duration_days": 15},
            "irrigation": {"frequency_days": 6, "start_offset": 25},
            "fertilization": {"offset": 40, "duration": 12},
            "pest_watch": {"offset": 55, "duration": 35},
            "harvest": {"offset": 85, "duration": 60}
        },
        "Okra": {
            "sowing": {"months": [2, 3, 4, 5, 6], "duration_days": 10},
            "irrigation": {"frequency_days": 4, "start_offset": 15},
            "fertilization": {"offset": 30, "duration": 8},
            "pest_watch": {"offset": 40, "duration": 25},
            "harvest": {"offset": 50, "duration": 90}
        },
        "Cauliflower": {
            "sowing": {"months": [7, 8, 9, 10], "duration_days": 20},
            "irrigation": {"frequency_days": 6, "start_offset": 30},
            "fertilization": {"offset": 45, "duration": 15},
            "pest_watch": {"offset": 60, "duration": 30},
            "harvest": {"offset": 90, "duration": 30}
        },
        "Cabbage": {
            "sowing": {"months": [7, 8, 9, 10, 11], "duration_days": 20},
            "irrigation": {"frequency_days": 7, "start_offset": 25},
            "fertilization": {"offset": 40, "duration": 12},
            "pest_watch": {"offset": 55, "duration": 35},
            "harvest": {"offset": 85, "duration": 40}
        },
        "Carrot": {
            "sowing": {"months": [8, 9, 10, 11], "duration_days": 15},
            "irrigation": {"frequency_days": 5, "start_offset": 20},
            "fertilization": {"offset": 35, "duration": 10},
            "pest_watch": {"offset": 50, "duration": 25},
            "harvest": {"offset": 75, "duration": 30}
        },
        "Green Chilli": {
            "sowing": {"months": [1, 2, 3, 6, 7, 8], "duration_days": 12},
            "irrigation": {"frequency_days": 5, "start_offset": 20},
            "fertilization": {"offset": 35, "duration": 10},
            "pest_watch": {"offset": 50, "duration": 40},
            "harvest": {"offset": 70, "duration": 120}
        },
        "Capsicum": {
            "sowing": {"months": [6, 7, 8, 9], "duration_days": 15},
            "irrigation": {"frequency_days": 6, "start_offset": 25},
            "fertilization": {"offset": 40, "duration": 12},
            "pest_watch": {"offset": 55, "duration": 30},
            "harvest": {"offset": 80, "duration": 60}
        },
        "Cucumber": {
            "sowing": {"months": [1, 2, 3, 6, 7, 8], "duration_days": 10},
            "irrigation": {"frequency_days": 3, "start_offset": 15},
            "fertilization": {"offset": 25, "duration": 8},
            "pest_watch": {"offset": 35, "duration": 20},
            "harvest": {"offset": 45, "duration": 60}
        },
        "Banana": {
            "sowing": {"months": [6, 7, 8], "duration_days": 30},
            "irrigation": {"frequency_days": 7, "start_offset": 0},
            "fertilization": {"offset": 60, "duration": 20},
            "pest_watch": {"offset": 90, "duration": 60},
            "harvest": {"offset": 300, "duration": 60}
        },
        "Mango": {
            "sowing": {"months": [6, 7, 8], "duration_days": 30},
            "irrigation": {"frequency_days": 10, "start_offset": 0},
            "fertilization": {"offset": 90, "duration": 30},
            "pest_watch": {"offset": 120, "duration": 90},
            "harvest": {"offset": 1080, "duration": 90}
        }
    }
    
    # Region-specific adjustments (days to add/subtract based on climate)
    region_adjustments = {
        "Maharashtra": 0,
        "Karnataka": 0,
        "Tamil Nadu": -15,  # Warmer, earlier seasons
        "Kerala": -20,
        "Andhra Pradesh": -10,
        "Telangana": -5,
        "Gujarat": 5,
        "Rajasthan": 10,  # Colder, later seasons
        "Punjab": 15,
        "Haryana": 10,
        "Uttar Pradesh": 5,
        "Bihar": 0,
        "West Bengal": -5,
        "Odisha": -5,
        "Madhya Pradesh": 5,
        "Chhattisgarh": 0,
        "Jharkhand": 0,
    }
    
    # Get base calendar for crop or use default
    calendar = crop_calendars.get(crop, {
        "sowing": {"months": [6, 7, 8], "duration_days": 15},
        "irrigation": {"frequency_days": 7, "start_offset": 30},
        "fertilization": {"offset": 45, "duration": 10},
        "pest_watch": {"offset": 60, "duration": 30},
        "harvest": {"offset": 90, "duration": 45}
    })
    
    adjustment = region_adjustments.get(region, 0)
    
    # Calculate dates based on current date
    base_date = datetime(current_year, current_month, 15)
    
    # Find next suitable sowing month
    sowing_months = calendar["sowing"]["months"]
    next_sowing_month = None
    for month in sorted(sowing_months):
        if month >= current_month:
            next_sowing_month = month
            break
    if next_sowing_month is None:
        next_sowing_month = min(sowing_months)
        base_date = datetime(current_year + 1, next_sowing_month, 15)
    else:
        base_date = datetime(current_year, next_sowing_month, 15)
    
    sowing_start = base_date + timedelta(days=adjustment)
    sowing_end = sowing_start + timedelta(days=calendar["sowing"]["duration_days"])
    
    irrigation_start = sowing_start + timedelta(days=calendar["irrigation"]["start_offset"] + adjustment)
    irrigation_end = irrigation_start + timedelta(days=calendar["irrigation"]["frequency_days"] * 2)
    
    fertilization_start = sowing_start + timedelta(days=calendar["fertilization"]["offset"] + adjustment)
    fertilization_end = fertilization_start + timedelta(days=calendar["fertilization"]["duration"])
    
    pest_start = sowing_start + timedelta(days=calendar["pest_watch"]["offset"] + adjustment)
    pest_end = pest_start + timedelta(days=calendar["pest_watch"]["duration"])
    
    harvest_start = sowing_start + timedelta(days=calendar["harvest"]["offset"] + adjustment)
    harvest_end = harvest_start + timedelta(days=calendar["harvest"]["duration"])
    
    # Generate notes based on crop and region
    notes = {
        "Sowing": f"Optimal sowing window for {crop} in {region}. Ensure soil moisture is adequate.",
        "Irrigation": f"Regular irrigation every {calendar['irrigation']['frequency_days']} days. Monitor soil moisture.",
        "Fertilization": f"Apply balanced NPK fertilizer. {crop}-specific nutrient requirements.",
        "Pest Watch": f"Monitor for common pests. Use integrated pest management (IPM) practices.",
        "Harvest": f"Harvest window for {crop}. Check maturity indicators before harvesting."
    }
    
    schedule = [
        {
            "stage": "Sowing",
            "date": f"{sowing_start.strftime('%b %d')} - {sowing_end.strftime('%b %d')}",
            "note": notes["Sowing"],
            "start_date": sowing_start.isoformat(),
            "end_date": sowing_end.isoformat()
        },
        {
            "stage": "Irrigation",
            "date": f"{irrigation_start.strftime('%b %d')} - {irrigation_end.strftime('%b %d')}",
            "note": notes["Irrigation"],
            "start_date": irrigation_start.isoformat(),
            "end_date": irrigation_end.isoformat()
        },
        {
            "stage": "Fertilization",
            "date": f"{fertilization_start.strftime('%b %d')} - {fertilization_end.strftime('%b %d')}",
            "note": notes["Fertilization"],
            "start_date": fertilization_start.isoformat(),
            "end_date": fertilization_end.isoformat()
        },
        {
            "stage": "Pest Watch",
            "date": f"{pest_start.strftime('%b %d')} - {pest_end.strftime('%b %d')}",
            "note": notes["Pest Watch"],
            "start_date": pest_start.isoformat(),
            "end_date": pest_end.isoformat()
        },
        {
            "stage": "Harvest",
            "date": f"{harvest_start.strftime('%b %d')} - {harvest_end.strftime('%b %d')}",
            "note": notes["Harvest"],
            "start_date": harvest_start.isoformat(),
            "end_date": harvest_end.isoformat()
        }
    ]
    
    return schedule


@router.post("/")
def get_crop_calendar_endpoint(payload: CalendarRequest):
    """Get crop calendar based on crop type and region"""
    try:
        schedule = get_crop_calendar(payload.crop, payload.region)
        return {
            "crop": payload.crop,
            "region": payload.region,
            "schedule": schedule,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating calendar: {str(e)}")


@router.get("/")
def get_crop_calendar_query(
    crop: str = Query(..., description="Crop name"),
    region: str = Query(..., description="Region/State name")
):
    """Get crop calendar based on crop type and region (query params)"""
    try:
        schedule = get_crop_calendar(crop, region)
        return {
            "crop": crop,
            "region": region,
            "schedule": schedule,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating calendar: {str(e)}")
