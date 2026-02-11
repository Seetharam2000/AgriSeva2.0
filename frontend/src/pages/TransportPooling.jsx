import { useState } from "react";
import { useLanguage } from "../i18n.jsx";

export default function TransportPooling() {
  const { t } = useLanguage();
  const pools = [
    { route: "Nashik → Pune", seats: "2 tractors", date: "Tomorrow 6:00 AM" },
    { route: "Nagpur → Bhandara", seats: "1 truck", date: "Today 4:00 PM" },
    { route: "Indore → Ujjain", seats: "3 mini-trucks", date: "Friday 7:30 AM" },
  ];
  const [status, setStatus] = useState("");

  return (
    <div>
      <section className="hero">
        <h1>{t("transportPoolingTitle")}</h1>
        <p>{t("transportPoolingSubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("createPoolRequest")}</div>
        <div className="flex">
          <input className="input" placeholder="From (village/mandi)" />
          <input className="input" placeholder="To (market)" />
          <input className="input" placeholder="Date & time" />
          <button className="btn" onClick={() => setStatus("Pooling request created.")}>
            {t("createPool")}
          </button>
        </div>
      </div>
      {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {pools.map((pool) => (
          <div className="card" key={pool.route}>
            <h3>{pool.route}</h3>
            <div className="muted">{pool.seats}</div>
            <div className="pill" style={{ marginTop: 10 }}>
              {pool.date}
            </div>
            <button
              className="btn"
              style={{ marginTop: 12 }}
              onClick={() => setStatus(`Joined pool: ${pool.route}`)}
            >
              {t("joinPool")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
