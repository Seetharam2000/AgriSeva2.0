import React from "react";

const statusColors = {
  "Sell Now": "good",
  Hold: "neutral",
  "High Risk": "danger",
  Low: "good",
  Moderate: "neutral",
  High: "danger"
};

export default function SummaryCard({ title, value, subtitle, status }) {
  const statusClass = statusColors[status] || "neutral";

  return (
    <div className={`card summary ${statusClass}`}>
      <h3>{title}</h3>
      <p className="summary-value">{value}</p>
      <p className="muted">{subtitle}</p>
    </div>
  );
}
