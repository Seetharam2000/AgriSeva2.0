export default function Ads() {
  const workshops = [
    {
      title: "Climate‑Smart Farming Workshop",
      host: "Krishi Mitra Foundation",
      region: "Pune, Maharashtra",
      date: "Feb 28, 2026",
      link: "https://enam.gov.in/web/"
    },
    {
      title: "Post‑Harvest Management Training",
      host: "Green Harvest NGO",
      region: "Coimbatore, Tamil Nadu",
      date: "Mar 10, 2026",
      link: "https://enam.gov.in/web/"
    },
    {
      title: "Digital Market Access Bootcamp",
      host: "AgriTech Volunteers",
      region: "Lucknow, Uttar Pradesh",
      date: "Mar 15, 2026",
      link: "https://enam.gov.in/web/"
    }
  ];

  const ngos = [
    "Pragati Rural Trust",
    "Seva Kisan Collective",
    "Women in Agri Network",
    "Soil & Seed Initiative",
    "Rural Skills Mission"
  ];

  return (
    <div>
      <section className="hero">
        <h1>Ads & Workshops</h1>
        <p>
          Discover upcoming workshops and NGO partnerships that strengthen
          agricultural livelihoods and national development goals.
        </p>
      </section>

      <div className="grid grid-3">
        {workshops.map((item) => (
          <div className="card" key={item.title}>
            <h3>{item.title}</h3>
            <div className="muted">{item.host}</div>
            <div className="muted">{item.region}</div>
            <div className="pill" style={{ marginTop: 8 }}>{item.date}</div>
            <a
              className="btn-link"
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: 12 }}
            >
              View Details
            </a>
          </div>
        ))}
      </div>

      <div className="section-title light">NGOs Willing to Collaborate</div>
      <div className="card">
        <div className="section-grid">
          {ngos.map((name) => (
            <div key={name} className="pill">
              {name}
            </div>
          ))}
        </div>
      </div>

      <div className="section-title light">Government Development Focus</div>
      <div className="card">
        <p className="muted">
          This platform supports national priorities such as farmer income
          enhancement, transparent market access, and climate resilience. It
          aligns with initiatives under the Ministry of Agriculture & Farmers
          Welfare and the e‑NAM program.
        </p>
        <p className="muted">
          For official resources and updates, refer to the Government of India
          and e‑NAM portals.
        </p>
      </div>
    </div>
  );
}
