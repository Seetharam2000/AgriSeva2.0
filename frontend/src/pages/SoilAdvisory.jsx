import { useState, useEffect } from "react";
import { useLanguage } from "../i18n.jsx";
import client from "../api/client.js";
import { INDIA_CROPS } from "../data/crops.js";
import { INDIA_LOCATIONS } from "../data/locations.js";

const SOIL_TYPES = ["Loamy", "Clay", "Sandy", "Red", "Black"];

const DEFAULT_RECOMMENDATIONS = [
  { label: "Soil Type", value: "Loamy" },
  { label: "Organic Matter", value: "Medium" },
  { label: "Suggested Fertilizer", value: "NPK 20-20-0 (45 kg/acre)" },
];

export default function SoilAdvisory() {
  const { t } = useLanguage();
  const [soilType, setSoilType] = useState("Loamy");
  const [crop, setCrop] = useState("Tomato");
  const [region, setRegion] = useState("Maharashtra");
  const [recommendations, setRecommendations] = useState(DEFAULT_RECOMMENDATIONS);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAdvisory = () => {
    setLoading(true);
    setStatus("");

    client
      .post("/soil/", { soil_type: soilType, crop, region })
      .then((res) => {
        setLoading(false);
        if (res.data && res.data.recommendations) {
          setRecommendations(res.data.recommendations);
          setStatus(`Advisory updated for ${soilType} soil and ${crop} in ${region}.`);
        } else {
          setStatus("Invalid response from server.");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Soil advisory error:", error);
        let errorMessage = "Unable to get soil advisory. Please try again.";
        if (error.response) {
          errorMessage = error.response.data?.detail || `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "Cannot connect to server. Please make sure the backend is running.";
        }
        setStatus(`Error: ${errorMessage}`);
        setRecommendations(DEFAULT_RECOMMENDATIONS);
      });
  };

  useEffect(() => {
    fetchAdvisory();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>{t("soilAdvisoryTitle")}</h1>
        <p>{t("soilAdvisorySubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("checkSoil")}</div>
        <div className="flex">
          <select
            className="input"
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            disabled={loading}
          >
            {SOIL_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
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
          <button
            className="btn"
            onClick={fetchAdvisory}
            disabled={loading}
          >
            {loading ? "Loading..." : t("getAdvisory")}
          </button>
        </div>
      </div>
      {status && (
        <div className="pill" style={{ marginTop: 12 }}>
          {status}
        </div>
      )}

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {recommendations.map((item) => (
          <div className="card" key={item.label}>
            <h3>{item.label}</h3>
            <div className="muted">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
