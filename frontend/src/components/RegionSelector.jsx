import React from "react";

const regions = ["Madurai", "Coimbatore", "Salem", "Thanjavur"];

export default function RegionSelector({ value, onChange }) {
  return (
    <div className="card compact">
      <label className="label">Select Region</label>
      <select
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <p className="helper-text">Local market insights for your region.</p>
    </div>
  );
}
