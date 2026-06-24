export default function About() {
  return (
    <div>
      <section className="hero">
        <h1>About Agriseva</h1>
        <p>
          Agriseva connects farmers, traders, and institutions with intelligent
          market insights, transparent auctions, and real-time crop intelligence.
        </p>
      </section>

      <div className="grid grid-3">
        <div className="card">
          <h3>Company</h3>
          <p className="muted">
            Agriseva is a mission-driven agri-tech initiative focused on
            empowering farmers and strengthening market transparency across
            India.
          </p>
        </div>
        <div className="card">
          <h3>Platform</h3>
          <p className="muted">
            AI price forecasts, NDVI crop health, weather alerts, and auction
            intelligence—built to complement e-NAM.
          </p>
        </div>
        <div className="card">
          <h3>Resources</h3>
          <p className="muted">
            Access training, guidelines, and best practices from our e-NAM
            resource hub and partner networks.
          </p>
        </div>
      </div>

      <div className="section-title light">Contact</div>
      <div className="card">
        <p className="muted">
          Email: support@agriseva.in · Phone: +91 1800-270-0224
        </p>
        <p className="muted">
          Address: Agriseva Innovation Lab, New Delhi, India
        </p>
      </div>
    </div>
  );
}
