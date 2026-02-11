import { useState } from "react";
import { useLanguage } from "../i18n.jsx";

export default function MandiCompare() {
  const { t } = useLanguage();
  const [markets, setMarkets] = useState([
    { name: "Nagpur Mandi", price: "₹1820/qtl", distance: "18 km", logistics: "₹90" },
    { name: "Wardha Mandi", price: "₹1760/qtl", distance: "42 km", logistics: "₹160" },
    { name: "Bhandara Mandi", price: "₹1885/qtl", distance: "58 km", logistics: "₹210" },
  ]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    distance: "",
    logistics: "",
  });
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState("");

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const addMarket = () => {
    if (!form.name || !form.price || !form.distance || !form.logistics) {
      setStatus("Please fill all mandi details to add.");
      return;
    }
    setMarkets((prev) => [
      ...prev,
      {
        name: form.name,
        price: form.price,
        distance: form.distance,
        logistics: form.logistics,
      },
    ]);
    setForm({ name: "", price: "", distance: "", logistics: "" });
    setStatus("Mandi price added.");
  };

  const compareMarkets = () => {
    setStatus("Comparison ready. Select a mandi to proceed.");
  };

  return (
    <div>
      <section className="hero">
        <h1>{t("mandiCompareTitle")}</h1>
        <p>{t("mandiCompareSubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("quickCompare")}</div>
        <div className="flex">
          <input className="input" placeholder="Crop (e.g., Tomato)" />
          <input className="input" placeholder="Quantity (kg)" />
          <input className="input" placeholder="Your village / PIN" />
          <button className="btn" onClick={compareMarkets}>
            {t("compareMarkets")}
          </button>
        </div>
      </div>

      <div className="card form-grid" style={{ marginTop: 16 }}>
        <div className="section-title">{t("addMandiPrice")}</div>
        <div className="flex">
          <input
            className="input"
            placeholder="Mandi name"
            value={form.name}
            onChange={handleChange("name")}
          />
          <input
            className="input"
            placeholder="Price (e.g., ₹1800/qtl)"
            value={form.price}
            onChange={handleChange("price")}
          />
          <input
            className="input"
            placeholder="Distance (e.g., 24 km)"
            value={form.distance}
            onChange={handleChange("distance")}
          />
          <input
            className="input"
            placeholder="Logistics cost (e.g., ₹120)"
            value={form.logistics}
            onChange={handleChange("logistics")}
          />
          <button className="btn" onClick={addMarket}>
            {t("addMandi")}
          </button>
        </div>
        {status && <div className="pill">{status}</div>}
      </div>

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {markets.map((market) => (
          <div className="card" key={market.name}>
            <h3>{market.name}</h3>
            <div className="muted">Price: {market.price}</div>
            <div className="muted">Distance: {market.distance}</div>
            <div className="muted">Logistics cost: {market.logistics}</div>
            <button
              className="btn"
              style={{ marginTop: 12 }}
              onClick={() => {
                setSelected(market.name);
                setStatus(`Selected ${market.name}. Proceed to sell or auction.`);
              }}
            >
              {t("selectMarket")}
            </button>
          </div>
        ))}
      </div>
      {selected && (
        <div className="pill" style={{ marginTop: 12 }}>
          {t("selectedMandi")}: {selected}
        </div>
      )}
    </div>
  );
}
