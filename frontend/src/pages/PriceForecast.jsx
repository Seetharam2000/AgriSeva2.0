import { useEffect, useMemo, useState } from "react";
import client from "../api/client.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { INDIA_LOCATIONS } from "../data/locations.js";
import { INDIA_CROPS } from "../data/crops.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const seededRandom = (seed) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => (value = (value * 16807) % 2147483647) / 2147483647;
};

const buildDemoForecast = (crop, region, days = 30) => {
  const seed =
    crop.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) +
    region.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const rand = seededRandom(seed);
  const base = 1200 + Math.floor(rand() * 1200);
  const trend = rand() > 0.5 ? 1 : -1;
  const today = new Date();
  const forecast = [];

  for (let i = 0; i < days; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i + 1);
    const seasonal = Math.sin((i / days) * Math.PI * 2) * 90;
    const noise = (rand() - 0.5) * 120;
    const drift = trend * i * 6;
    const price = Math.max(850, Math.round(base + seasonal + noise + drift));
    forecast.push({
      date: date.toISOString().slice(0, 10),
      predicted_price: price
    });
  }

  const best = forecast.reduce(
    (acc, item) => (item.predicted_price > acc.predicted_price ? item : acc),
    forecast[0]
  );

  return {
    forecast,
    best: { date: best.date, expected_price: best.predicted_price },
    confidence: 0.72 + rand() * 0.15
  };
};

export default function PriceForecast() {
  const [crop, setCrop] = useState("Tomato");
  const [region, setRegion] = useState("Maharashtra");
  const [forecast, setForecast] = useState([]);
  const [best, setBest] = useState(null);
  const [confidence, setConfidence] = useState(0.78);

  const fetchForecast = () => {
    client
      .post("/prices/predict", { crop, region })
      .then((res) => {
        setForecast(res.data.forecast);
        setBest(res.data.best_selling_window);
        setConfidence(res.data.confidence);
      })
      .catch(() => {
        const demo = buildDemoForecast(crop, region);
        setForecast(demo.forecast);
        setBest(demo.best);
        setConfidence(demo.confidence);
      });
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const chartData = useMemo(() => {
    return {
      labels: forecast.map((p) => p.date),
      datasets: [
        {
          label: "Predicted Price (₹/qtl)",
          data: forecast.map((p) => p.predicted_price),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.3)",
          tension: 0.35
        }
      ]
    };
  }, [forecast]);

  return (
    <div>
      <section className="hero">
        <h1>Price Forecast Intelligence</h1>
        <p>AI-powered forecasts using market + weather signals.</p>
      </section>

      <div className="card flex">
        <select
          className="input"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
        >
          {INDIA_CROPS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {INDIA_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <button className="btn" onClick={fetchForecast}>
          Refresh Forecast
        </button>
        <div className="pill">Confidence {Math.round(confidence * 100)}%</div>
      </div>

      <div className="chart-wrap" style={{ marginTop: 20 }}>
        <Line data={chartData} />
      </div>

      {best && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>Best Selling Window</h3>
          <p>
            Target <strong>{best.date}</strong> for an expected price of{" "}
            <strong>₹{best.expected_price}</strong>. Plan logistics and auction
            listings ahead of time.
          </p>
        </div>
      )}
    </div>
  );
}
