export default function Header() {
  const storedLanguage = localStorage.getItem("agriseva_lang") || "English";

  const setLanguage = (event) => {
    localStorage.setItem("agriseva_lang", event.target.value);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <div className="topbar-title">Agriseva Platform</div>
          <div className="topbar-caption">
            Empowering transparent, data-driven agricultural markets
          </div>
          <div className="topbar-subtitle">
            Ministry of Agriculture & Farmers Welfare · Government of India
          </div>
          <div className="topbar-subtitle">
            कृषि एवं किसान कल्याण मंत्रालय · भारत सरकार
          </div>
          <div className="topbar-motto">सत्यमेव जयते · Satyameva Jayate</div>
        </div>
      </div>
      <div className="topbar-actions">
        <div className="flag-badge" aria-label="Indian flag">
          <span className="flag-saffron" />
          <span className="flag-white" />
          <span className="flag-green" />
        </div>
        <label className="lang-label">
          Language
          <select
            className="lang-select"
            defaultValue={storedLanguage}
            onChange={setLanguage}
          >
            <option>English</option>
            <option>हिंदी</option>
            <option>বাংলা</option>
            <option>ગુજરાતી</option>
            <option>मराठी</option>
            <option>తెలుగు</option>
            <option>தமிழ்</option>
            <option>ಕನ್ನಡ</option>
            <option>മലയാളം</option>
            <option>ଓଡ଼ିଆ</option>
            <option>ਪੰਜਾਬੀ</option>
            <option>অসমীয়া</option>
          </select>
        </label>
        <span className="pill">Official Demo</span>
      </div>
    </header>
  );
}
