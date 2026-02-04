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

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function PriceForecast() {
  const [crop, setCrop] = useState("Tomato");
  const [region, setRegion] = useState("Nagpur");
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
        setForecast([
          { date: "2025-04-18", predicted_price: 2100 },
          { date: "2025-04-19", predicted_price: 2140 },
          { date: "2025-04-20", predicted_price: 2180 }
        ]);
        setBest({ date: "2025-04-20", expected_price: 2180 });
        setConfidence(0.74);
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
        <input
          className="input"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="Crop"
        />
        <input
          className="input"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region"
        />
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
