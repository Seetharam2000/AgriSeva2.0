import { useState } from "react";
import { useLanguage } from "../i18n.jsx";

export default function TraceabilityQR() {
  const { t } = useLanguage();
  const [status, setStatus] = useState("");
  return (
    <div>
      <section className="hero">
        <h1>{t("traceabilityTitle")}</h1>
        <p>{t("traceabilitySubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("createLotQr")}</div>
        <div className="flex">
          <input className="input" placeholder="Lot ID" />
          <input className="input" placeholder="Crop" />
          <input className="input" placeholder="Harvest date" />
          <button className="btn" onClick={() => setStatus("QR generated for this lot.")}>
            {t("generateQr")}
          </button>
        </div>
        <div className="pill" style={{ marginTop: 12 }}>
          Demo: QR generation can link to Agriseva provenance page.
        </div>
        {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}
      </div>
    </div>
  );
}
