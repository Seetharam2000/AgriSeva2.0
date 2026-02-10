import { useState } from "react";

const MARKET_LAT = 19.0760;
const MARKET_LON = 72.8777;

const toRad = (value) => (value * Math.PI) / 180;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function GpsLocator() {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [status, setStatus] = useState("");

  const fetchPlaceName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      if (!response.ok) {
        return "";
      }
      const data = await response.json();
      return data.display_name || "";
    } catch {
      return "";
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported in this browser.");
      return;
    }
    setStatus("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });
        setDistance(calculateDistance(lat, lon, MARKET_LAT, MARKET_LON));
        setPlaceName("");
        const name = await fetchPlaceName(lat, lon);
        setPlaceName(name);
        setStatus("");
      },
      () => {
        setStatus("Unable to fetch location. Please allow GPS permissions.");
      }
    );
  };

  return (
    <div>
      <section className="hero">
        <h1>Find Nearby Markets</h1>
        <p>Use GPS to locate the nearest mandi and plan faster logistics.</p>
      </section>

      <div className="card gps-card">
        <h3>AgriSeva GPS Locator</h3>
        <button className="btn" onClick={getLocation}>
          Get My Location
        </button>

        {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}

        {location && (
          <div className="muted" style={{ marginTop: 12 }}>
            Latitude: {location.lat.toFixed(6)} · Longitude:{" "}
            {location.lon.toFixed(6)}
          </div>
        )}

        {placeName && (
          <div className="pill" style={{ marginTop: 12 }}>
            Location: {placeName}
          </div>
        )}

        {distance !== null && (
          <div className="pill" style={{ marginTop: 12 }}>
            Distance to nearest market: {distance.toFixed(2)} km
          </div>
        )}
      </div>
    </div>
  );
}
