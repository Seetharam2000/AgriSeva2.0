import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";

export default function CreditInsurance() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const programs = [
    { name: "PM-KISAN", detail: "Income support for eligible farmers." },
    { name: "PMFBY", detail: "Crop insurance against natural calamities." },
    { name: "KCC", detail: "Kisan Credit Card for affordable credit." },
  ];
  const [status, setStatus] = useState("");

  return (
    <div>
      <section className="hero">
        <h1>{t("creditInsuranceTitle")}</h1>
        <p>{t("creditInsuranceSubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("eligibilityChecklist")}</div>
        <div className="flex">
          <input className="input" placeholder="Aadhaar / Farmer ID" />
          <input className="input" placeholder="State" />
          <button className="btn" onClick={() => setStatus("Eligibility check initiated.")}>
            {t("checkEligibility")}
          </button>
        </div>
      </div>
      {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {programs.map((program) => (
          <div className="card" key={program.name}>
            <h3>{program.name}</h3>
            <p className="muted">{program.detail}</p>
            <button
              className="btn"
              onClick={() => {
                setStatus(`${program.name} selected. Redirecting to payment.`);
                navigate("/payments");
              }}
            >
              {t("openOfficialPortal")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
