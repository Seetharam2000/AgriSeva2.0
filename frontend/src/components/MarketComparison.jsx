import React from "react";

export default function MarketComparison({ data }) {
  const markets = data?.markets || [];

  return (
    <div className="card">
      <h3>Micro-Region Market Comparison</h3>
      {markets.length === 0 ? (
        <p className="muted">Loading nearby market prices...</p>
      ) : (
        <div className="table">
          {markets.map((market) => (
            <div className="table-row" key={market.name}>
              <span>{market.name}</span>
              <span>₹{market.price}/quintal</span>
              <span className={market.is_best ? "tag good" : "tag"}>
                {market.is_best ? "Best price" : "Compare"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
