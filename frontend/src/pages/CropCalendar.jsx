import { useState, useEffect } from "react";
import { useLanguage } from "../i18n.jsx";
import client from "../api/client.js";
import { INDIA_CROPS } from "../data/crops.js";
import { INDIA_LOCATIONS } from "../data/locations.js";

export default function CropCalendar() {
  const { t } = useLanguage();
  const [crop, setCrop] = useState("Tomato");
  const [region, setRegion] = useState("Maharashtra");
  const [schedule, setSchedule] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCalendar = () => {
    if (!crop || !region) {
      setStatus("Please select both crop and region.");
      return;
    }

    setLoading(true);
    setStatus("");

    client
      .post("/calendar/", { crop, region })
      .catch(() => {
        // Try GET endpoint as fallback
        return client.get("/calendar/", { params: { crop, region } });
      })
      // Single .then handler - no duplicate
      .then((res) => {
        setLoading(false);
        if (res.data && res.data.schedule) {
          setSchedule(res.data.schedule);
          setStatus(`Calendar generated for ${crop} in ${region}.`);
        } else {
          setStatus("Invalid response from server.");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Calendar error:", error);
        let errorMessage = "Unable to generate calendar. Please try again.";
        
        if (error.response) {
          errorMessage = error.response.data?.detail || `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "Cannot connect to server. Please make sure the backend is running.";
        }
        
        setStatus(`Error: ${errorMessage}`);
        // Fallback to demo data
        setSchedule([
          { stage: "Sowing", date: "Mar 10 - Mar 25", note: "Moisture-friendly window" },
          { stage: "Irrigation", date: "Apr 05 - Apr 12", note: "Moderate irrigation" },
          { stage: "Fertilization", date: "Apr 20 - Apr 30", note: "Apply balanced NPK fertilizer" },
          { stage: "Pest Watch", date: "May 01 - May 15", note: "Monitor for common pests" },
          { stage: "Harvest", date: "Jun 15 - Jun 30", note: "Target premium mandi days" },
        ]);
      });
  };

  useEffect(() => {
    // Auto-load calendar on mount
    fetchCalendar();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>{t("cropCalendarTitle")}</h1>
        <p>{t("cropCalendarSubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("planSeason")}</div>
        <div className="flex">
          <select
            className="input"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            disabled={loading}
          >
            {INDIA_CROPS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            disabled={loading}
          >
            {INDIA_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <button 
            className="btn" 
            onClick={fetchCalendar}
            disabled={loading}
          >
            {loading ? "Generating..." : t("generateCalendar")}
          </button>
        </div>
      </div>
      {status && (
        <div className={`pill ${status.startsWith("Error") ? "" : ""}`} style={{ marginTop: 12 }}>
          {status}
        </div>
      )}

      {schedule.length > 0 && (
        <div className="grid" style={{ marginTop: 20 }}>
          {schedule.map((item) => (
            <div className="card" key={item.stage}>
              <h3>{item.stage}</h3>
              <div className="muted">{item.date}</div>
              <div className="pill" style={{ marginTop: 10 }}>
                {item.note}
              </div>
            </div>
          ))}
        </div>
      )}

      {schedule.length === 0 && !loading && (
        <div className="card" style={{ marginTop: 20, textAlign: "center" }}>
          <p className="muted">Select a crop and region to generate the calendar.</p>
        </div>
      )}
    </div>
  );
}
