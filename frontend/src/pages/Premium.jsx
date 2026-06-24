import { useNavigate } from "react-router-dom";

export default function Premium() {
  const navigate = useNavigate();

  const goToPayment = () => {
    const params = new URLSearchParams({
      plan: "Premium",
      price: "50",
      cycle: "monthly"
    });
    navigate(`/payments?${params.toString()}`);
  };

  return (
    <div>
      <section className="hero">
        <h1>Premium</h1>
        <p>
          Upgrade for more listings access and priority trading benefits.
        </p>
      </section>

      <div className="grid grid-3">
        <div className="card">
          <h3>Premium Account</h3>
          <p className="muted">₹50 per month</p>
          <ul className="muted" style={{ paddingLeft: 18 }}>
            <li>Access to unlimited listings</li>
            <li>15 purchase transactions per week</li>
            <li>Free listing</li>
          </ul>
        </div>

        <div className="card">
          <h3>Free Account</h3>
          <p className="muted">Ads supported</p>
          <ul className="muted" style={{ paddingLeft: 18 }}>
            <li>7 listings per week</li>
            <li>7 purchase transactions per week</li>
          </ul>
          <p className="muted">
            Commission: <strong>2%</strong> of listing profit
          </p>
          <p className="muted">Per purchase fee: <strong>₹5</strong></p>
        </div>

        <div className="card">
          <h3>Commissions</h3>
          <p className="muted">
            Each listing profit amount: <strong>1%</strong> commission to the
            site.
          </p>
          <p className="muted">
            Per purchase: <strong>₹2</strong> service fee to the site.
          </p>
        </div>

        <div className="card">
          <h3>Get Started</h3>
          <p className="muted">
            Activate premium to unlock higher trading limits and quicker
            settlements.
          </p>
          <button className="btn" onClick={goToPayment}>
            Activate Premium
          </button>
        </div>
      </div>
    </div>
  );
}
