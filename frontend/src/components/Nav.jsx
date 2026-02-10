import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";

export default function Nav() {
  const { t } = useLanguage();
  const enamOptions = [
    { label: "Commodity", href: "https://enam.gov.in/web/commodity" },
    { label: "State Unified License", href: "https://enam.gov.in/web/state-unified-license" },
    { label: "Mobile App", href: "https://enam.gov.in/web/mobile-app" },
    { label: "Price Details", href: "https://enam.gov.in/web/dashboard/trade-data" },
    { label: "Incentives", href: "https://enam.gov.in/web/incentives" },
    { label: "Success Stories", href: "https://enam.gov.in/web/success-stories" }
  ];

  const enamWhatsNew = [
    {
      label: "Revised e-NAM Operational Guidelines (2025)",
      href: "https://enam.gov.in/web/assest/download/eNAM-revised-guidelines-01-01-2025.pdf"
    },
    {
      label: "Operational Guideline (Revised)",
      href: "https://enam.gov.in/web/assest/download/Revised-Operational-Guidelines-of-e-NAM.pdf"
    },
    {
      label: "Stakeholder Training Schedule",
      href:
        "https://enam.gov.in/web/assest/download/sul/Stakeholder%20Training%20schedule%20link_30%20Sep%2025.pdf"
    },
    {
      label: "QC Labs Guidelines at Mandis",
      href:
        "https://enam.gov.in/web/assest/download/sul/Guidelines_for_QC_labs_at_mandis_under_e-NAM.pdf"
    },
    { label: "News Archive", href: "https://enam.gov.in/web/all_news_desc" }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">Agriseva · अग्रीसेवा</div>
      <nav>
        <NavLink className="nav-link" to="/login">
          {t("aadhaarLogin")}
        </NavLink>
        <NavLink className="nav-link" to="/dashboard">
          {t("dashboard")}
        </NavLink>
        <NavLink className="nav-link" to="/prices">
          {t("priceForecast")}
        </NavLink>
        <NavLink className="nav-link" to="/weather">
          {t("weatherAlerts")}
        </NavLink>
        <NavLink className="nav-link" to="/ndvi">
          {t("cropHealth")}
        </NavLink>
        <NavLink className="nav-link" to="/auction">
          {t("auctions")}
        </NavLink>
        <NavLink className="nav-link" to="/gps">
          GPS Locator
        </NavLink>
        <NavLink className="nav-link" to="/feedback">
          {t("feedback")}
        </NavLink>
        <NavLink className="nav-link" to="/about">
          About
        </NavLink>
        <NavLink className="nav-link" to="/payments">
          Payments
        </NavLink>
        <NavLink className="nav-link" to="/ngo-volunteering">
          NGO-Volunteering
        </NavLink>
        <NavLink className="nav-link" to="/ads">
          Ads & Workshops
        </NavLink>
        <NavLink className="nav-link" to="/premium">
          Premium
        </NavLink>
        <NavLink className="nav-link" to="/founders">
          Meet the Founders
        </NavLink>
      </nav>

      <details className="nav-dropdown">
        <summary>e-NAM Portal</summary>
        <div className="sidebar-links">
          {enamOptions.map((option) => (
            <a
              key={option.label}
              className="btn-link sidebar-link"
              href={option.href}
              target="_blank"
              rel="noreferrer"
            >
              {option.label}
            </a>
          ))}
        </div>
      </details>

      <details className="nav-dropdown">
        <summary>What’s New</summary>
        <div className="sidebar-links">
          {enamWhatsNew.map((item) => (
            <a
              key={item.label}
              className="btn-link sidebar-link"
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          ))}
        </div>
      </details>

      <details className="nav-dropdown">
        <summary>Agriseva Extras</summary>
        <div className="sidebar-links">
          <NavLink className="btn-link sidebar-link" to="/prices">
            AI Price Forecast
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/weather">
            Weather Risk Alerts
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/ndvi">
            NDVI Crop Health Map
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/auction">
            Blockchain-Ready Auctions
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/gps">
            GPS Market Locator
          </NavLink>
        </div>
      </details>
    </aside>
  );
}
