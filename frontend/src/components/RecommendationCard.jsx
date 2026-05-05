import React from "react";

export default function RecommendationCard({ prediction, loading }) {
  return (
    <div className="card recommendation">
      <h3>AI When-to-Sell Advisor</h3>
      <p className="summary-value">
        {loading ? "Calculating..." : prediction?.recommendation}
      </p>
      <div className="meta-row">
        <div>
          <p className="label">Confidence</p>
          <p className="value">
            {prediction ? `${prediction.confidence}%` : "--"}
          </p>
        </div>
        <div>
          <p className="label">Trend</p>
          <p className="value">{prediction?.trend || "--"}</p>
        </div>
      </div>
      <p className="explain">
        {prediction?.explanation ||
          "Using market prices, seasonality, and rainfall signals."}
      </p>
    </div>
  );
}
