import { useState, useEffect } from "react";
import { useLanguage } from "../i18n.jsx";
import client from "../api/client.js";

const DEFAULT_POOLS = [
  { id: "demo-1", route: "Nashik → Pune", seats: "2 tractors", date: "Tomorrow 6:00 AM" },
  { id: "demo-2", route: "Nagpur → Bhandara", seats: "1 truck", date: "Today 4:00 PM" },
  { id: "demo-3", route: "Indore → Ujjain", seats: "3 mini-trucks", date: "Friday 7:30 AM" },
];

export default function TransportPooling() {
  const { t } = useLanguage();
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [capacity, setCapacity] = useState("2 tractors");
  const [pools, setPools] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPools, setLoadingPools] = useState(true);

  const fetchPools = () => {
    setLoadingPools(true);
    const params = {};
    if (fromPlace.trim()) params.from_place = fromPlace.trim();
    if (toPlace.trim()) params.to_place = toPlace.trim();
    client
      .get("/transport/", { params })
      .then((res) => {
        setLoadingPools(false);
        if (res.data && Array.isArray(res.data.pools)) {
          setPools(
            res.data.pools.map((p) => ({
              id: p.id,
              route: p.route,
              seats: p.seats || p.capacity,
              date: p.date || p.date_time || "TBD",
            }))
          );
        }
      })
      .catch(() => {
        setLoadingPools(false);
        setPools(DEFAULT_POOLS);
      });
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const handleCreatePool = () => {
    if (!fromPlace.trim() || !toPlace.trim()) {
      setStatus("Please enter From and To.");
      return;
    }
    setLoading(true);
    setStatus("");
    client
      .post("/transport/", {
        from_place: fromPlace.trim(),
        to_place: toPlace.trim(),
        date_time: dateTime.trim() || "TBD",
        capacity: capacity.trim() || "2 tractors",
      })
      .then((res) => {
        setLoading(false);
        if (res.data && res.data.pool) {
          setStatus("Pooling request created.");
          setFromPlace("");
          setToPlace("");
          setDateTime("");
          fetchPools();
        } else {
          setStatus("Invalid response from server.");
        }
      })
      .catch((err) => {
        setLoading(false);
        setStatus(err.response?.data?.detail || "Could not create pool. Is the backend running?");
      });
  };

  const handleJoinPool = (poolId, route) => {
    setLoading(true);
    setStatus("");
    client
      .post("/transport/join", { pool_id: poolId })
      .then((res) => {
        setLoading(false);
        setStatus(`Joined pool: ${route}`);
      })
      .catch((err) => {
        setLoading(false);
        setStatus(err.response?.data?.detail || "Could not join pool.");
      });
  };

  const displayPools = pools.length ? pools : DEFAULT_POOLS;

  return (
    <div>
      <section className="hero">
        <h1>{t("transportPoolingTitle")}</h1>
        <p>{t("transportPoolingSubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("createPoolRequest")}</div>
        <div className="flex">
          <input
            className="input"
            placeholder="From (village/mandi)"
            value={fromPlace}
            onChange={(e) => setFromPlace(e.target.value)}
            disabled={loading}
          />
          <input
            className="input"
            placeholder="To (market)"
            value={toPlace}
            onChange={(e) => setToPlace(e.target.value)}
            disabled={loading}
          />
          <input
            className="input"
            placeholder="Date & time (e.g. Tomorrow 6 AM)"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            disabled={loading}
          />
          <select
            className="input"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            disabled={loading}
          >
            <option value="2 tractors">2 tractors</option>
            <option value="1 truck">1 truck</option>
            <option value="3 mini-trucks">3 mini-trucks</option>
          </select>
          <button
            className="btn"
            onClick={handleCreatePool}
            disabled={loading}
          >
            {loading ? "Creating..." : t("createPool")}
          </button>
        </div>
      </div>
      {status && (
        <div className="pill" style={{ marginTop: 12 }}>
          {status}
        </div>
      )}

      <div className="flex" style={{ marginTop: 16, gap: 8 }}>
        <button type="button" className="btn" onClick={fetchPools} disabled={loadingPools}>
          {loadingPools ? "Loading..." : "Refresh pools"}
        </button>
      </div>

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {displayPools.map((pool) => (
          <div className="card" key={pool.id || pool.route}>
            <h3>{pool.route}</h3>
            <div className="muted">{pool.seats}</div>
            <div className="pill" style={{ marginTop: 10 }}>
              {pool.date}
            </div>
            <button
              className="btn"
              style={{ marginTop: 12 }}
              onClick={() => handleJoinPool(pool.id, pool.route)}
              disabled={loading}
            >
              {t("joinPool")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
