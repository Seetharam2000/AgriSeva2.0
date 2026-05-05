import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Header from "./components/Header.jsx";
import RegionSelector from "./components/RegionSelector.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import RecommendationCard from "./components/RecommendationCard.jsx";
import AlertSection from "./components/AlertSection.jsx";
import PriceChart from "./components/PriceChart.jsx";
import MarketComparison from "./components/MarketComparison.jsx";
import TransportProfit from "./components/TransportProfit.jsx";

const API_BASE = "http://localhost:8000";

const defaultFarmer = {
  name: "Lakshmi Devi",
  crop: "Tomato"
};

export default function App() {
  const [region, setRegion] = useState("Madurai");
  const [prediction, setPrediction] = useState(null);
  const [weatherAlert, setWeatherAlert] = useState(null);
  const [ndvi, setNdvi] = useState(null);
  const [marketComparison, setMarketComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const cropLabel = useMemo(
    () => `${defaultFarmer.crop} · ${region}`,
    [region]
  );

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      try {
        const [predictRes, weatherRes, ndviRes, marketRes] =
          await Promise.all([
            axios.post(`${API_BASE}/prices/predict`, {
              crop: defaultFarmer.crop,
              region,
              horizon_days: 14
            }),
            axios.get(`${API_BASE}/weather/risk-alerts`, {
              params: { region }
            }),
            axios.get(`${API_BASE}/ndvi/health-status`, {
              params: { crop: defaultFarmer.crop, region }
            }),
            axios.get(`${API_BASE}/market/compare`, {
              params: { crop: defaultFarmer.crop, region }
            })
          ]);

        if (!active) return;
        setPrediction(predictRes.data);
        setWeatherAlert(weatherRes.data);
        setNdvi(ndviRes.data);
        setMarketComparison(marketRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [region]);

  return (
    <div className="app">
      <Header farmer={defaultFarmer} />
      <main className="dashboard">
        <section className="top-row">
          <RegionSelector value={region} onChange={setRegion} />
          <SummaryCard
            title="Crop & Region"
            value={cropLabel}
            subtitle="Decision support focused view"
          />
          <SummaryCard
            title="When-to-Sell"
            value={prediction?.recommendation || "Loading..."}
            subtitle={prediction?.explanation || "Fetching recommendation"}
            status={prediction?.recommendation}
          />
          <SummaryCard
            title="Weather Risk"
            value={weatherAlert?.risk_level || "Checking..."}
            subtitle={weatherAlert?.message || "Fetching alert"}
            status={weatherAlert?.risk_level}
          />
        </section>

        <section className="main-grid">
          <div className="card wide">
            <h3>Price Forecast (Next 7–30 Days)</h3>
            <PriceChart history={prediction?.history} forecast={prediction?.forecast} />
          </div>
          <RecommendationCard prediction={prediction} loading={loading} />
          <AlertSection weatherAlert={weatherAlert} ndvi={ndvi} />
        </section>

        <section className="lower-grid">
          <MarketComparison data={marketComparison} />
          <TransportProfit data={marketComparison} />
        </section>
      </main>
    </div>
  );
}
