# AgriSeva Farmer Decision Assistant (MVP)

AgriSeva is **not a trading platform**. It is a farmer-focused decision assistant that turns raw signals into actionable recommendations.

## What is built

- **React dashboard** with farmer profile, region selection, summary cards, forecast chart, and alerts.
- **FastAPI backend** with minimal, mock-friendly APIs.
- **AI When-to-Sell Advisor** using simple regression + seasonality.
- **Weather-aware risk alerts** using OpenWeatherMap (real API) with fallback mock.
- **NDVI crop health indicator** using static NDVI samples.
- **Micro-region market comparison** and **transport vs net profit** (light demo).

## What is mocked

- NDVI data (static sample values)
- Market prices and transport costs
- Authentication (not implemented)
- Logistics values (simplified)
- Advanced features in PPT only (see below)

## How this differs from eNAM

- eNAM is a trading/marketplace platform.  
- **AgriSeva is a decision assistant** that explains *when and where* to sell, based on explainable signals.
- Focused on **farmer-friendly guidance**, not raw market data.

## Quick demo (3–4 minutes)

1. Start the backend:
   ```
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
2. Start the frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```
3. Open the dashboard at `http://localhost:5173`
4. Change the region and show:
   - Recommendation updates
   - Weather alert
   - NDVI health status
   - Market comparison + best net profit

Optional: set `OPENWEATHER_API_KEY` to use real forecast data.

## API endpoints

- `POST /prices/predict`  
  Returns recommendation + confidence + explanation + forecast series.
- `GET /weather/risk-alerts`  
  Returns rainfall/drought risk alerts.
- `GET /ndvi/health-status`  
  Returns NDVI value + health classification.
- `GET /market/compare`  
  Returns 2–3 nearby market prices with net profit.

## Architecture (MVP)

```
frontend (React + Chart.js)
    |
backend (FastAPI)
    |
ML (simple regression + seasonality)
    |
data (Agmarknet-style CSV + NDVI samples)
```

## PPT / Explain-only features (not coded)

- Buyer demand forecast
- Price manipulation / anomaly detection
- Crop insurance & credit integration
- Federated learning at scale
- Export market intelligence

## Data sources

- Historical prices: `data/prices_tomato.csv` (Agmarknet-style sample)
- NDVI: `data/ndvi_samples.json` (static)
- Market prices: `data/market_prices.json` (static)

## Notes

- This MVP is intentionally lightweight for demo and judging.
- Every feature supports **farmer decision-making** — not transactions.
