import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import client from "../api/client.js";
import { INDIA_LOCATIONS } from "../data/locations.js";
import { INDIA_CROPS } from "../data/crops.js";

const healthColor = (health) => {
  if (health === "Healthy") return "#22c55e";
  if (health === "Moderate stress") return "#f59e0b";
  return "#ef4444";
};

export default function CropHealthMap() {
  const [region, setRegion] = useState("Maharashtra");
  const [crop, setCrop] = useState("Tomato");
  const [points, setPoints] = useState([]);

  const loadMap = () => {
    client
      .get("/ndvi/map", { params: { region, crop } })
      .then((res) => setPoints(res.data.points))
      .catch(() => {
        setPoints([
          { farm_id: "FARM-001", lat: 21.1458, lon: 79.0882, ndvi: 0.64, health: "Healthy" },
          { farm_id: "FARM-002", lat: 21.1521, lon: 79.1024, ndvi: 0.42, health: "Moderate stress" },
          { farm_id: "FARM-003", lat: 21.1322, lon: 79.0729, ndvi: 0.29, health: "High stress" }
        ]);
      });
  };

  useEffect(() => {
    loadMap();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>NDVI Crop Health Map</h1>
        <p>Satellite-derived vegetation health for targeted intervention.</p>
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
        <button className="btn" onClick={loadMap}>
          Refresh Map
        </button>
      </div>

      <div className="map-container" style={{ marginTop: 20 }}>
        <MapContainer center={[21.1458, 79.0882]} zoom={12} style={{ height: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point) => (
            <CircleMarker
              key={point.farm_id}
              center={[point.lat, point.lon]}
              radius={10}
              pathOptions={{ color: healthColor(point.health), fillOpacity: 0.8 }}
            >
              <Popup>
                <strong>{point.farm_id}</strong>
                <div>NDVI: {point.ndvi}</div>
                <div>Status: {point.health}</div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
