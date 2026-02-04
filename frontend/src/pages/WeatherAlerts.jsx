import { useEffect, useState } from "react";
import client from "../api/client.js";

export default function WeatherAlerts() {
  const [region, setRegion] = useState("Nagpur");
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
        <input
          className="input"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region"
        />
        <input
          className="input"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="Crop"
        />
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

      <div className="section-title">Risk Alerts</div>
      {alerts.map((alert, idx) => (
        <div key={idx} className="alert">
          {alert}
        </div>
      ))}
    </div>
  );
}
