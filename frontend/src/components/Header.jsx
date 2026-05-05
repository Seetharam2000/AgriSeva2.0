import React from "react";

export default function Header({ farmer }) {
  return (
    <header className="header">
      <div>
        <p className="eyebrow">AgriSeva Farmer Dashboard</p>
        <h1>
          Welcome, {farmer.name}
          <span className="muted"> · Decision assistant for {farmer.crop}</span>
        </h1>
      </div>
      <div className="header-badge">
        <span>Not a trading platform</span>
        <span className="muted">Decision support only</span>
      </div>
    </header>
  );
}
