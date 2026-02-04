import { useEffect, useState } from "react";
import client from "../api/client.js";

export default function AuctionListings() {
  const [auctions, setAuctions] = useState([]);
  const [form, setForm] = useState({
    auction_id: "AUC-1001",
    crop: "Tomato",
    quantity_kg: 500,
    base_price: 1800,
    region: "Nagpur"
  });

  const loadAuctions = () => {
    client
      .get("/auction/live")
      .then((res) => setAuctions(res.data.auctions))
      .catch(() => setAuctions([]));
  };

  const createAuction = () => {
    client
      .post("/auction/create", form)
      .then(() => loadAuctions())
      .catch(() => loadAuctions());
  };

  const placeBid = (auctionId) => {
    client
      .post("/auction/bid", {
        auction_id: auctionId,
        bidder: "AgroMart Co.",
        price: Math.round(form.base_price * 1.08)
      })
      .then(() => loadAuctions())
      .catch(() => loadAuctions());
  };

  useEffect(() => {
    loadAuctions();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Live Auctions</h1>
        <p>Transparent bidding with blockchain auditability.</p>
      </section>

      <div className="card">
        <h3>Create Auction</h3>
        <div className="flex">
          <input
            className="input"
            value={form.auction_id}
            onChange={(e) => setForm({ ...form, auction_id: e.target.value })}
            placeholder="Auction ID"
          />
          <input
            className="input"
            value={form.crop}
            onChange={(e) => setForm({ ...form, crop: e.target.value })}
            placeholder="Crop"
          />
          <input
            className="input"
            type="number"
            value={form.quantity_kg}
            onChange={(e) => setForm({ ...form, quantity_kg: Number(e.target.value) })}
            placeholder="Quantity (kg)"
          />
          <input
            className="input"
            type="number"
            value={form.base_price}
            onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })}
            placeholder="Base Price"
          />
          <input
            className="input"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            placeholder="Region"
          />
          <button className="btn" onClick={createAuction}>
            Launch
          </button>
        </div>
      </div>

      <div className="section-title">Live Listings</div>
      {auctions.length === 0 && (
        <div className="card">No auctions yet. Create one to demo.</div>
      )}
      {auctions.map((auction) => (
        <div className="auction-item" key={auction.auction_id}>
          <div className="flex">
            <div>
              <strong>{auction.crop}</strong> · {auction.quantity_kg} kg ·{" "}
              {auction.region}
              <div className="muted">Base price ₹{auction.base_price}</div>
            </div>
            <button className="btn" onClick={() => placeBid(auction.auction_id)}>
              Place Bid
            </button>
          </div>
          <div className="muted" style={{ marginTop: 8 }}>
            Bids: {auction.bids?.length || 0}
          </div>
        </div>
      ))}
    </div>
  );
}
