import { useState } from "react";
import { useLanguage } from "../i18n.jsx";

export default function SoilAdvisory() {
  const { t } = useLanguage();
  const recommendations = [
    { label: "Soil Type", value: "Loamy" },
    { label: "Organic Matter", value: "Medium" },
    { label: "Suggested Fertilizer", value: "NPK 20-20-0 (45 kg/acre)" },
  ];
  const [status, setStatus] = useState("");

  return (
    <div>
      <section className="hero">
        <h1>{t("soilAdvisoryTitle")}</h1>
        <p>{t("soilAdvisorySubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("checkSoil")}</div>
        <div className="flex">
          <select className="input">
            <option>Loamy</option>
            <option>Clay</option>
            <option>Sandy</option>
            <option>Red</option>
            <option>Black</option>
          </select>
          <input className="input" placeholder="Crop" />
          <button className="btn" onClick={() => setStatus("Advisory updated for selected soil type.")}>
            {t("getAdvisory")}
          </button>
        </div>
      </div>
      {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}

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
