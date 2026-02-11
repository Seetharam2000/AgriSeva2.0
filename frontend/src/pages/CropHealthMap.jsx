import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import client from "../api/client.js";
import { INDIA_LOCATIONS } from "../data/locations.js";
import { INDIA_CROPS } from "../data/crops.js";

const healthColor = (health) => {
  if (health === "Healthy") return "#22c55e";
  if (health === "Moderate stress") return "#f59e0b";
  return "#ef4444";
};

const REGION_CENTER = {
  "Andhra Pradesh": [15.9129, 79.74],
  "Arunachal Pradesh": [28.218, 94.7278],
  Assam: [26.2006, 92.9376],
  Bihar: [25.0961, 85.3131],
  Chhattisgarh: [21.2787, 81.8661],
  Goa: [15.2993, 74.124],
  Gujarat: [22.2587, 71.1924],
  Haryana: [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1734],
  Jharkhand: [23.6102, 85.2799],
  Karnataka: [15.3173, 75.7139],
  Kerala: [10.8505, 76.2711],
  "Madhya Pradesh": [22.9734, 78.6569],
  Maharashtra: [19.7515, 75.7139],
  Manipur: [24.6637, 93.9063],
  Meghalaya: [25.467, 91.3662],
  Mizoram: [23.1645, 92.9376],
  Nagaland: [26.1584, 94.5624],
  Odisha: [20.9517, 85.0985],
  Punjab: [31.1471, 75.3412],
  Rajasthan: [27.0238, 74.2179],
  Sikkim: [27.533, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  Telangana: [18.1124, 79.0193],
  Tripura: [23.9408, 91.9882],
  "Uttar Pradesh": [26.8467, 80.9462],
  Uttarakhand: [30.0668, 79.0193],
  "West Bengal": [22.9868, 87.855],
  "Andaman and Nicobar Islands": [11.7401, 92.6586],
  Chandigarh: [30.7333, 76.7794],
  "Dadra and Nagar Haveli and Daman and Diu": [20.3974, 72.8328],
  Delhi: [28.7041, 77.1025],
  "Jammu and Kashmir": [33.7782, 76.5762],
  Ladakh: [34.1526, 77.5771],
  Lakshadweep: [10.5667, 72.6417],
  Puducherry: [11.9416, 79.8083],
};

const getDemoPoints = (center) => {
  const [lat, lon] = center;
  return [
    { farm_id: "FARM-001", lat: lat + 0.06, lon: lon + 0.05, ndvi: 0.64, health: "Healthy" },
    { farm_id: "FARM-002", lat: lat - 0.04, lon: lon + 0.02, ndvi: 0.42, health: "Moderate stress" },
    { farm_id: "FARM-003", lat: lat + 0.02, lon: lon - 0.06, ndvi: 0.29, health: "High stress" }
  ];
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function CropHealthMap() {
  const [region, setRegion] = useState("Maharashtra");
  const [crop, setCrop] = useState("Tomato");
  const [points, setPoints] = useState([]);
  const center = REGION_CENTER[region] || [21.1458, 79.0882];

  const loadMap = () => {
    client
      .get("/ndvi/map", { params: { region, crop } })
      .then((res) => setPoints(res.data.points))
      .catch(() => {
        setPoints(getDemoPoints(center));
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
        <MapContainer center={center} zoom={7} style={{ height: "100%" }}>
          <MapUpdater center={center} />
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
