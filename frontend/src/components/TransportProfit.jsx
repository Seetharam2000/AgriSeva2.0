import React from "react";

export default function TransportProfit({ data }) {
  const markets = data?.markets || [];
  const bestNet = markets.reduce(
    (best, current) => (current.net_profit > best.net_profit ? current : best),
    markets[0] || {}
  );

  return (
    <div className="card">
      <h3>Transport Cost vs Net Profit</h3>
      {markets.length === 0 ? (
        <p className="muted">Calculating transport impact...</p>
      ) : (
        <>
          <div className="table">
            {markets.map((market) => (
              <div className="table-row" key={market.name}>
                <span>{market.name}</span>
                <span>Transport ₹{market.transport_cost}</span>
                <span>Net ₹{market.net_profit}</span>
              </div>
            ))}
          </div>
          <div className="highlight">
            Best net outcome: {bestNet.name} (₹{bestNet.net_profit})
          </div>
        </>
      )}
    </div>
  );
}
