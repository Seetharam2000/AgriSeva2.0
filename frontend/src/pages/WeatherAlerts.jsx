import { useEffect, useState, useCallback } from "react";
import client from "../api/client.js";
import { INDIA_LOCATIONS } from "../data/locations.js";
import { INDIA_CROPS } from "../data/crops.js";

const MOCK_CURRENT = {
  temp_c: 29.4,
  humidity: 64,
  rainfall_mm: 3.2,
  source: "mock",
};

const MOCK_ALERTS = ["No major risks detected"];

export default function WeatherAlerts() {
  const [region, setRegion] = useState("Maharashtra");
  const [crop, setCrop] = useState("Tomato");
  const [current, setCurrent] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = useCallback(() => {
    setLoading(true);
    setError("");

    const currentReq = client
      .get("/weather/current", { params: { region } })
      .then((res) => {
        const data = res.data || {};
        setCurrent({
          region: data.region || region,
          temp_c: data.temp_c ?? MOCK_CURRENT.temp_c,
          humidity: data.humidity ?? MOCK_CURRENT.humidity,
          rainfall_mm: data.rainfall_mm ?? MOCK_CURRENT.rainfall_mm,
          source: data.source || "mock",
        });
      })
      .catch(() => {
        setCurrent({
          region,
          ...MOCK_CURRENT,
        });
      });

    const alertsReq = client
      .get("/weather/risk-alerts", { params: { region, crop } })
      .then((res) => {
        const list = res.data?.alerts;
        setAlerts(Array.isArray(list) ? list : MOCK_ALERTS);
      })
      .catch(() => {
        setAlerts(MOCK_ALERTS);
      });

    Promise.all([currentReq, alertsReq])
      .then(() => setError(""))
      .catch(() => setError("Could not load weather. Showing demo data."))
      .finally(() => setLoading(false));
  }, [region, crop]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return (
    <div>
      <section className="hero">
        <h1>Weather Alerts & Risk Signals</h1>
        <p>Plan harvesting and logistics with hyperlocal insights.</p>
      </section>

      <div className="card flex">
        <select
          className="input"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          disabled={loading}
        >
          {INDIA_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          disabled={loading}
        >
          {INDIA_CROPS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button className="btn" onClick={loadWeather} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="pill" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}

      {current && (
        <div className="grid grid-3" style={{ marginTop: 20 }}>
          <div className="card">
            <h3>Temperature</h3>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              {Number(current.temp_c).toFixed(1)}°C
            </div>
            {current.source === "mock" && (
              <div className="muted" style={{ fontSize: "0.85rem", marginTop: 4 }}>
                Demo data
              </div>
            )}
          </div>
          <div className="card">
            <h3>Humidity</h3>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              {Number(current.humidity)}%
            </div>
          </div>
          <div className="card">
            <h3>Rainfall</h3>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              {Number(current.rainfall_mm).toFixed(1)} mm
            </div>
          </div>
        </div>
      )}

      <div className="section-title light" style={{ marginTop: 24 }}>
        Risk Alerts
      </div>
      {alerts.length > 0 ? (
        alerts.map((alert, idx) => (
          <div key={idx} className="alert">
            {alert}
          </div>
        ))
      ) : (
        <div className="alert">No risk alerts for this crop and region.</div>
      )}
    </div>
  );
}
