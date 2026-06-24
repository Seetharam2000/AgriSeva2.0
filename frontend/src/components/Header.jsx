import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import logoImage from "../assets/agriseva-logo.jpeg";
import flagImage from "../assets/india-flag.png";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
  { value: "bn", label: "বাংলা" },
  { value: "gu", label: "ગુજરાતી" },
  { value: "mr", label: "मराठी" },
  { value: "te", label: "తెలుగు" },
  { value: "ta", label: "தமிழ்" },
  { value: "kn", label: "ಕನ್ನಡ" },
  { value: "ml", label: "മലയാളം" },
  { value: "or", label: "ଓଡ଼ିଆ" },
  { value: "pa", label: "ਪੰਜਾਬੀ" },
  { value: "as", label: "অসমীয়া" }
];

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("agriseva_token");
    localStorage.removeItem("agriseva_user_name");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="nav-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ☰
        </button>
        <div className="topbar-brand">
          <img
            src={logoImage}
            alt="Agriseva logo"
            className="brand-logo"
          />
          <div>
            <div className="topbar-title">{t("appTitle")}</div>
            <div className="topbar-caption">{t("appCaption")}</div>
            <div className="topbar-subtitle">{t("ministryEn")}</div>
            <div className="topbar-subtitle">{t("ministryHi")}</div>
            <div className="topbar-motto">{t("motto")}</div>
          </div>
        </div>
      </div>
      <div className="topbar-actions">
        <button type="button" className="logout-btn" onClick={handleLogout}>
          {t("logout") || "Log out"}
        </button>
        <img
          src={flagImage}
          alt="Indian flag"
          className="flag-image"
        />
        <label className="lang-label">
          {t("language")}
          <select
            className="lang-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <span className="pill">{t("officialDemo")}</span>
      </div>
    </header>
  );
}
