import { useState } from "react";
import { useLanguage } from "../i18n.jsx";

export default function SmartAlerts() {
  const { t } = useLanguage();
  const alerts = [
    { title: "Price Spike", detail: "Onion prices up 6% in Pune mandis." },
    { title: "Rain Risk", detail: "Heavy rainfall expected in Kerala in 48 hours." },
    { title: "Best Sell Window", detail: "Soybean likely peaks this weekend in Indore." },
  ];
  const [status, setStatus] = useState("");

  return (
    <div>
      <section className="hero">
        <h1>{t("smartAlertsTitle")}</h1>
        <p>{t("smartAlertsSubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("alertPreferences")}</div>
        <div className="flex">
          <input className="input" placeholder="Crop" />
          <input className="input" placeholder="Region" />
          <select className="input">
            <option>SMS</option>
            <option>WhatsApp</option>
            <option>App Notification</option>
          </select>
          <button className="btn" onClick={() => setStatus("Alert preferences saved.")}>
            {t("savePreferences")}
          </button>
        </div>
      </div>
      {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {alerts.map((alert) => (
          <div className="card" key={alert.title}>
            <h3>{alert.title}</h3>
            <p className="muted">{alert.detail}</p>
            <button className="btn" onClick={() => setStatus(`Acknowledged: ${alert.title}`)}>
              {t("acknowledge")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
