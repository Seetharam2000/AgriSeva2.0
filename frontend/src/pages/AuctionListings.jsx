import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client.js";
import { INDIA_LOCATIONS } from "../data/locations.js";
import { INDIA_CROPS } from "../data/crops.js";

export default function AuctionListings() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [seeded, setSeeded] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    auction_id: "AUC-1001",
    crop: "Tomato",
    quantity_kg: 500,
    base_price: 1800,
    region: "Maharashtra"
  });

  const demoAuctions = [
    {
      auction_id: "AUC-1001",
      crop: "Tomato",
      quantity_kg: 500,
      base_price: 1800,
      region: "Maharashtra"
    },
    {
      auction_id: "AUC-1002",
      crop: "Tomato",
      quantity_kg: 500,
      base_price: 1800,
      region: "Tripura"
    }
  ];

  const loadAuctions = () => {
    client
      .get("/auction/live")
      .then((res) => {
        const data = res.data.auctions || [];
        setAuctions(data);
        if (data.length === 0 && !seeded) {
          seedAuctions();
        }
      })
      .catch(() => {
        setAuctions(demoAuctions);
        setSeeded(true);
        setStatus("Backend unavailable. Showing demo auctions.");
      });
  };

  const seedAuctions = async () => {
    if (seeded) {
      return;
    }
    setSeeded(true);
    await Promise.all(
      demoAuctions.map((item) =>
        client.post("/auction/create", item).catch(() => null)
      )
    );
    loadAuctions();
  };

  const createAuction = async () => {
    setStatus("");
    if (!form.auction_id || !form.crop || !form.region) {
      setStatus("Please fill Auction ID, Crop, and Region.");
      return;
    }
    try {
      await client.post("/auction/create", form);
      await loadAuctions();
      setStatus("Auction launched successfully.");
    } catch (error) {
      setAuctions((prev) => [...prev, { ...form, bids: [] }]);
      setStatus("Backend unavailable. Auction created in demo mode.");
    }
  };

  const placeBid = async (auction) => {
    setStatus("");
    const bidPrice = Math.round(auction.base_price * 1.08);
    try {
      await client.post("/auction/bid", {
        auction_id: auction.auction_id,
        bidder: "AgroMart Co.",
        price: bidPrice
      });
      setAuctions((prev) =>
        prev.map((item) =>
          item.auction_id === auction.auction_id
            ? {
                ...item,
                bids: [
                  ...(item.bids || []),
                  { bidder: "AgroMart Co.", price: bidPrice }
                ]
              }
            : item
        )
      );
    } catch (error) {
      setAuctions((prev) =>
        prev.map((item) =>
          item.auction_id === auction.auction_id
            ? {
                ...item,
                bids: [
                  ...(item.bids || []),
                  { bidder: "AgroMart Co.", price: bidPrice }
                ]
              }
            : item
        )
      );
      setStatus("Backend unavailable. Bid saved in demo mode.");
    }
  };

  const goToPayment = (auction) => {
    const params = new URLSearchParams({
      auctionId: auction.auction_id,
      crop: auction.crop,
      quantityKg: String(auction.quantity_kg),
      region: auction.region,
      basePrice: String(auction.base_price)
    });
    navigate(`/payments?${params.toString()}`);
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
        {status && <div className="pill" style={{ marginBottom: 12 }}>{status}</div>}
        <div className="flex">
          <input
            className="input"
            value={form.auction_id}
            onChange={(e) => setForm({ ...form, auction_id: e.target.value })}
            placeholder="Auction ID"
          />
          <select
            className="input"
            value={form.crop}
            onChange={(e) => setForm({ ...form, crop: e.target.value })}
          >
            {INDIA_CROPS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
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
          <select
            className="input"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          >
            {INDIA_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <button className="btn" type="button" onClick={createAuction}>
            Launch
          </button>
        </div>
      </div>

      <div className="section-title light">Live Listings</div>
      {status && <div className="pill" style={{ marginBottom: 12 }}>{status}</div>}
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
            <button className="btn" onClick={() => placeBid(auction)}>
              Place Bid
            </button>
            <button className="btn" onClick={() => goToPayment(auction)}>
              Buy Now
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
