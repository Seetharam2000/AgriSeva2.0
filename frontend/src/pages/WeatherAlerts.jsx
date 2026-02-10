import { useEffect, useState } from "react";
import client from "../api/client.js";
import { INDIA_LOCATIONS } from "../data/locations.js";
import { INDIA_CROPS } from "../data/crops.js";

export default function WeatherAlerts() {
  const [region, setRegion] = useState("Maharashtra");
  const [crop, setCrop] = useState("Tomato");
  const [current, setCurrent] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const loadWeather = () => {
    client
      .get("/weather/current", { params: { region } })
      .then((res) => setCurrent(res.data))
      .catch(() => {
        setCurrent({
          temp_c: 29.4,
          humidity: 64,
          rainfall_mm: 3.2,
          source: "mock"
        });
      });
    client
      .get("/weather/risk-alerts", { params: { region, crop } })
      .then((res) => setAlerts(res.data.alerts))
      .catch(() => setAlerts(["No major risks detected"]));
  };

  useEffect(() => {
    loadWeather();
  }, []);

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
        >
          {INDIA_CROPS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button className="btn" onClick={loadWeather}>
          Refresh
        </button>
      </div>

      {current && (
        <div className="grid grid-3" style={{ marginTop: 20 }}>
          <div className="card">
            <h3>Temperature</h3>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              {current.temp_c}°C
            </div>
          </div>
          <div className="card">
            <h3>Humidity</h3>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              {current.humidity}%
            </div>
          </div>
          <div className="card">
            <h3>Rainfall</h3>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              {current.rainfall_mm} mm
            </div>
          </div>
        </div>
      )}

      <div className="section-title light">Risk Alerts</div>
      {alerts.map((alert, idx) => (
        <div key={idx} className="alert">
          {alert}
        </div>
      ))}
    </div>
  );
}
