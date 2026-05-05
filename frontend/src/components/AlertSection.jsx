import React from "react";

function ndviStatusClass(status) {
  if (status === "Healthy") return "good";
  if (status === "Moderate Stress") return "neutral";
  return "danger";
}

export default function AlertSection({ weatherAlert, ndvi }) {
  return (
    <div className="card alerts">
      <h3>Risk Alerts & Crop Health</h3>
      <div className="alert-item">
        <p className="label">Weather Alert</p>
        <p className="value">{weatherAlert?.message || "Loading..."}</p>
        <span className={`chip ${weatherAlert?.risk_level || "neutral"}`}>
          {weatherAlert?.risk_level || "Checking"}
        </span>
      </div>
      <div className="alert-item">
        <p className="label">NDVI Crop Health</p>
        <p className="value">{ndvi?.status || "Loading..."}</p>
        <span className={`chip ${ndviStatusClass(ndvi?.status)}`}>
          NDVI {ndvi?.ndvi_value?.toFixed(2) ?? "--"}
        </span>
      </div>
    </div>
  );
}
