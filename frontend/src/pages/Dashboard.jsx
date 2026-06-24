import { useEffect, useState } from "react";
import client from "../api/client.js";
import StatCard from "../components/StatCard.jsx";
import { useLanguage } from "../i18n.jsx";
import introVideo from "../assets/agriseva-intro.mp4";

export default function Dashboard() {
  const { t } = useLanguage();
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
        <h1>{t("welcomeBack", { name: userName })} 👋</h1>
        <p>{t("heroSubtitle")}</p>
        <div className="pill">{t("connected")}</div>
      </section>

      <div className="card video-card">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={introVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

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

      <div className="section-title light">{t("latestActivity")}</div>
      <div className="card">
        <div className="flex">
          <div>
            <strong>{t("tomatoSpike")}</strong>
            <div className="muted">{t("bestWindow")}</div>
          </div>
          <div className="pill">₹2,180 / qtl</div>
        </div>
        <div className="flex" style={{ marginTop: 12 }}>
          <div>
            <strong>{t("ndviAlert")}</strong>
            <div className="muted">{t("ndviDetail")}</div>
          </div>
          <div className="pill">{t("actionNeeded")}</div>
        </div>
      </div>

    </div>
  );
}
