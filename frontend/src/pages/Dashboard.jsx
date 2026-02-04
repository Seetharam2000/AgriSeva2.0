import { useEffect, useState } from "react";
import client from "../api/client.js";
import StatCard from "../components/StatCard.jsx";

export default function Dashboard() {
  const [data, setData] = useState({
    total_farmers: 0,
    total_crops: 0,
    farmers: [],
    crops: []
  });
  const [userName, setUserName] = useState("Farmer");

  useEffect(() => {
    const storedName = localStorage.getItem("agriseva_user_name");
    if (storedName) {
      setUserName(storedName);
    }
    client
      .get("/farmer/dashboard")
      .then((res) => setData(res.data))
      .catch(() => {
        setData({
          total_farmers: 12,
          total_crops: 18,
          farmers: [],
          crops: []
        });
      });
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Welcome back, {userName} 👋</h1>
        <p>
          Your farm intelligence hub for smarter pricing, climate resilience,
          and fair auctions.
        </p>
        <div className="pill">Connected to eNAM-ready data feeds</div>
      </section>

      <div className="grid grid-3">
        <StatCard
          title="Active Farmers"
          value={data.total_farmers}
          subtitle="Registered in your cluster"
        />
        <StatCard
          title="Tracked Crops"
          value={data.total_crops}
          subtitle="With live price intelligence"
        />
        <StatCard
          title="Alerts"
          value="3"
          subtitle="Weather + market opportunities"
        />
      </div>

      <div className="section-title">Latest Activity</div>
      <div className="card">
        <div className="flex">
          <div>
            <strong>Tomato price spike</strong>
            <div className="muted">Nagpur · Best selling window in 5 days</div>
          </div>
          <div className="pill">₹2,180 / qtl</div>
        </div>
        <div className="flex" style={{ marginTop: 12 }}>
          <div>
            <strong>NDVI alert</strong>
            <div className="muted">Farm-003 shows high stress</div>
          </div>
          <div className="pill">Action needed</div>
        </div>
      </div>

    </div>
  );
}
