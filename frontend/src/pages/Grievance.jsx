import { useState } from "react";
import { useLanguage } from "../i18n.jsx";

export default function Grievance() {
  const { t } = useLanguage();
  const [status, setStatus] = useState("");
  return (
    <div>
      <section className="hero">
        <h1>{t("grievanceTitle")}</h1>
        <p>{t("grievanceSubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("submitIssue")}</div>
        <div className="flex">
          <input className="input" placeholder="Name" />
          <input className="input" placeholder="Phone" />
          <input className="input" placeholder="Region" />
        </div>
        <textarea className="input" rows="4" placeholder="Describe your issue" />
        <button className="btn" onClick={() => setStatus("Grievance submitted. Our team will contact you.")}>
          {t("submitGrievance")}
        </button>
      </div>
      {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}
    </div>
  );
}
