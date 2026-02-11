import { useState } from "react";
import { useLanguage } from "../i18n.jsx";

export default function CropCalendar() {
  const { t } = useLanguage();
  const schedule = [
    { stage: "Sowing", date: "Mar 10 - Mar 25", note: "Moisture-friendly window" },
    { stage: "Irrigation", date: "Apr 05 - Apr 12", note: "Moderate irrigation" },
    { stage: "Pest Watch", date: "May 01 - May 15", note: "Leaf miner risk" },
    { stage: "Harvest", date: "Jun 15 - Jun 30", note: "Target premium mandi days" },
  ];
  const [status, setStatus] = useState("");

  return (
    <div>
      <section className="hero">
        <h1>{t("cropCalendarTitle")}</h1>
        <p>{t("cropCalendarSubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("planSeason")}</div>
        <div className="flex">
          <input className="input" placeholder="Crop" />
          <input className="input" placeholder="Region" />
          <button className="btn" onClick={() => setStatus("Calendar generated for your crop.")}>
            {t("generateCalendar")}
          </button>
        </div>
      </div>
      {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}

      <div className="grid" style={{ marginTop: 20 }}>
        {schedule.map((item) => (
          <div className="card" key={item.stage}>
            <h3>{item.stage}</h3>
            <div className="muted">{item.date}</div>
            <div className="pill" style={{ marginTop: 10 }}>
              {item.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
