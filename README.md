# Agriseva MVP — Farm-to-Market Intelligence Platform

Hackathon-grade MVP showcasing AI price forecasts, weather-aware decision support, NDVI crop health maps, and blockchain-backed data ownership.

## Tech Stack
- Frontend: React + Vite, Chart.js, Leaflet
- Backend: FastAPI
- AI/ML: Facebook Prophet (price forecasting with weather regressors)
- Blockchain: Solidity (demo-only contract)

## Project Structure
```
App/
  backend/
    app/
    data/
    ml/
  frontend/
  blockchain/
```

## Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

## Frontend Setup
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## AI Model (Prophet)
Train models (optional for demo):
```bash
cd backend
python ml/train_prophet.py
```
Prediction is integrated in `POST /prices/predict` using Prophet with rainfall + temperature regressors.

## API Endpoints
Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/aadhaar-login`

Farmer
- `POST /farmer/register`
- `POST /farmer/crop`
- `GET /farmer/dashboard`

Price Intelligence
- `GET /prices/history?crop=&region=`
- `POST /prices/predict`

Weather
- `GET /weather/current?region=`
- `GET /weather/risk-alerts?crop=&region=`

NDVI
- `GET /ndvi/health-status?farm_id=`
- `GET /ndvi/map?region=&crop=`

Auction
- `POST /auction/create`
- `POST /auction/bid`
- `GET /auction/live`

Blockchain (demo)
- `POST /blockchain/register-data`
- `GET /blockchain/access-log`

## Demo Notes
- Logistics flows are mocked.
- NDVI uses static sample data (`backend/data/ndvi_samples.json`).
- Weather uses OpenWeatherMap if `OPENWEATHER_API_KEY` is set; otherwise mock values are returned.
- Blockchain calls are simulated in the API; contract is provided in `blockchain/`.

## UX Highlights
- Colorful dashboard with quick stats
- Forecast charts + best selling window
- NDVI map markers with health labels
- Live auction listing + instant bid demo
