import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";

export default function Nav({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const linkProps = { onClick: onClose };

  const handleLogout = () => {
    localStorage.removeItem("agriseva_token");
    localStorage.removeItem("agriseva_user_name");
    onClose();
    navigate("/login");
  };
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
    <aside className={`sidebar ${isOpen ? "sidebar-mobile-open" : ""}`}>
      <div className="brand">Agriseva · अग्रीसेवा</div>
      <nav>
        <NavLink className="nav-link" to="/login" {...linkProps}>
          {t("aadhaarLogin")}
        </NavLink>
        <button type="button" className="nav-link nav-link-button" onClick={handleLogout}>
          {t("logout")}
        </button>
        <NavLink className="nav-link" to="/dashboard" {...linkProps}>
          {t("dashboard")}
        </NavLink>
        <NavLink className="nav-link" to="/prices" {...linkProps}>
          {t("priceForecast")}
        </NavLink>
        <NavLink className="nav-link" to="/weather" {...linkProps}>
          {t("weatherAlerts")}
        </NavLink>
        <NavLink className="nav-link" to="/ndvi" {...linkProps}>
          {t("cropHealth")}
        </NavLink>
        <NavLink className="nav-link" to="/auction" {...linkProps}>
          {t("auctions")}
        </NavLink>
        <NavLink className="nav-link" to="/gps" {...linkProps}>
          {t("navGps")}
        </NavLink>
        <NavLink className="nav-link" to="/mandi-compare" {...linkProps}>
          {t("navMandiCompare")}
        </NavLink>
        <NavLink className="nav-link" to="/smart-alerts" {...linkProps}>
          {t("navSmartAlerts")}
        </NavLink>
        <NavLink className="nav-link" to="/crop-calendar" {...linkProps}>
          {t("navCropCalendar")}
        </NavLink>
        <NavLink className="nav-link" to="/soil-advisory" {...linkProps}>
          {t("navSoilAdvisory")}
        </NavLink>
        <NavLink className="nav-link" to="/transport-pooling" {...linkProps}>
          {t("navTransportPooling")}
        </NavLink>
        <NavLink className="nav-link" to="/credit-insurance" {...linkProps}>
          {t("navCreditInsurance")}
        </NavLink>
        <NavLink className="nav-link" to="/traceability" {...linkProps}>
          {t("navTraceability")}
        </NavLink>
        <NavLink className="nav-link" to="/grievance" {...linkProps}>
          {t("navGrievance")}
        </NavLink>
        <NavLink className="nav-link" to="/feedback" {...linkProps}>
          {t("feedback")}
        </NavLink>
        <NavLink className="nav-link" to="/about" {...linkProps}>
          {t("navAbout")}
        </NavLink>
        <NavLink className="nav-link" to="/payments" {...linkProps}>
          {t("navPayments")}
        </NavLink>
        <NavLink className="nav-link" to="/ngo-volunteering" {...linkProps}>
          {t("navNgoVolunteering")}
        </NavLink>
        <NavLink className="nav-link" to="/ads" {...linkProps}>
          {t("navAds")}
        </NavLink>
        <NavLink className="nav-link" to="/premium" {...linkProps}>
          {t("navPremium")}
        </NavLink>
        <NavLink className="nav-link" to="/founders" {...linkProps}>
          {t("navFounders")}
        </NavLink>
      </nav>

      <details className="nav-dropdown">
        <summary>{t("enamPortal")}</summary>
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
        <summary>{t("whatsNew")}</summary>
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
        <summary>{t("agrisevaExtras")}</summary>
        <div className="sidebar-links">
          <NavLink className="btn-link sidebar-link" to="/prices">
            {t("aiPriceForecast")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/weather">
            {t("weatherRiskAlerts")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/ndvi">
            {t("ndviCropHealth")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/auction">
            {t("blockchainAuctions")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/gps">
            {t("gpsMarketLocator")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/mandi-compare">
            {t("navMandiCompare")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/smart-alerts">
            {t("navSmartAlerts")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/crop-calendar">
            {t("navCropCalendar")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/soil-advisory">
            {t("navSoilAdvisory")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/transport-pooling">
            {t("navTransportPooling")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/credit-insurance">
            {t("navCreditInsurance")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/traceability">
            {t("navTraceability")}
          </NavLink>
          <NavLink className="btn-link sidebar-link" to="/grievance">
            {t("grievanceTitle")}
          </NavLink>
        </div>
      </details>
    </aside>
  );
}
