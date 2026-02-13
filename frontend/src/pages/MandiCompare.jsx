import { useState } from "react";
import { useLanguage } from "../i18n.jsx";
import client from "../api/client.js";
import { INDIA_CROPS } from "../data/crops.js";
import { INDIA_LOCATIONS } from "../data/locations.js";

const DEFAULT_MARKETS = [
  { id: "1", name: "Nagpur Mandi", price: "₹1820/qtl", distance: "18 km", logistics: "₹90", price_per_qtl: 1820, logistics_rs: 90 },
  { id: "2", name: "Wardha Mandi", price: "₹1760/qtl", distance: "42 km", logistics: "₹160", price_per_qtl: 1760, logistics_rs: 160 },
  { id: "3", name: "Bhandara Mandi", price: "₹1885/qtl", distance: "58 km", logistics: "₹210", price_per_qtl: 1885, logistics_rs: 210 },
];

export default function MandiCompare() {
  const { t } = useLanguage();
  const [crop, setCrop] = useState("Tomato");
  const [region, setRegion] = useState("Maharashtra");
  const [quantityKg, setQuantityKg] = useState("");
  const [markets, setMarkets] = useState(DEFAULT_MARKETS);
  const [form, setForm] = useState({ name: "", price: "", distance: "", logistics: "" });
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const compareMarkets = () => {
    setLoading(true);
    setStatus("");
    client
      .get("/mandi/compare", { params: { crop, region } })
      .then((res) => {
        setLoading(false);
        const list = res.data?.mandis;
        if (Array.isArray(list) && list.length > 0) {
          setMarkets(
            list.map((m, i) => ({
              id: `api-${i}-${m.name}`,
              name: m.name,
              price: m.price || `₹${m.price_per_qtl}/qtl`,
              distance: m.distance || `${m.distance_km} km`,
              logistics: m.logistics || `₹${m.logistics_rs}`,
              price_per_qtl: m.price_per_qtl,
              logistics_rs: m.logistics_rs ?? 0,
            }))
          );
          setStatus(`Comparing ${crop} prices across mandis in ${region}.`);
        } else {
          setStatus("No mandi data for this crop/region. Showing defaults.");
        }
      })
      .catch((err) => {
        setLoading(false);
        setStatus(err.response?.data?.detail || "Could not fetch mandi prices. Showing default list.");
        setMarkets(DEFAULT_MARKETS);
      });
  };

  const addMarket = () => {
    if (!form.name?.trim() || !form.price?.trim() || !form.distance?.trim() || !form.logistics?.trim()) {
      setStatus("Please fill all mandi details to add.");
      return;
    }
    const priceStr = form.price.trim();
    const logisticsStr = form.logistics.replace(/[^\d]/g, "") || "0";
    const priceNum = parseInt(form.price.replace(/[^\d]/g, ""), 10) || 0;
    setMarkets((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: form.name.trim(),
        price: priceStr,
        distance: form.distance.trim(),
        logistics: form.logistics.trim(),
        price_per_qtl: priceNum,
        logistics_rs: parseInt(logisticsStr, 10) || 0,
      },
    ]);
    setForm({ name: "", price: "", distance: "", logistics: "" });
    setStatus("Mandi price added.");
  };

  const quantity = parseFloat(quantityKg) || 0;
  const qtl = quantity / 100;
  const marketsWithNet = markets.map((m) => ({
    ...m,
    net_per_qtl: (m.price_per_qtl || 0) - (m.logistics_rs || 0),
    totalValue: qtl > 0 ? (m.price_per_qtl || 0) * qtl : null,
    totalLogistics: m.logistics_rs || 0,
  }));
  const best = marketsWithNet.length
    ? marketsWithNet.reduce((a, b) => (a.net_per_qtl > b.net_per_qtl ? a : b))
    : null;

  return (
    <div>
      <section className="hero">
        <h1>{t("mandiCompareTitle")}</h1>
        <p>{t("mandiCompareSubtitle")}</p>
      </section>

      <div className="card form-grid">
        <div className="section-title">{t("quickCompare")}</div>
        <div className="flex">
          <select
            className="input"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            disabled={loading}
          >
            {INDIA_CROPS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Quantity (kg)"
            value={quantityKg}
            onChange={(e) => setQuantityKg(e.target.value)}
            disabled={loading}
            type="number"
            min="1"
          />
          <select
            className="input"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            disabled={loading}
          >
            {INDIA_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <button className="btn" onClick={compareMarkets} disabled={loading}>
            {loading ? "Loading..." : t("compareMarkets")}
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

      {best && (
        <div className="pill" style={{ marginTop: 12 }}>
          Best net (price − logistics): <strong>{best.name}</strong> — ₹{best.net_per_qtl}/qtl net
        </div>
      )}

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {marketsWithNet.map((market) => (
          <div className="card" key={market.id}>
            <h3>{market.name}</h3>
            <div className="muted">Price: {market.price}</div>
            <div className="muted">Distance: {market.distance}</div>
            <div className="muted">Logistics: {market.logistics}</div>
            {market.net_per_qtl != null && (
              <div className="muted">Net/qtl: ₹{market.net_per_qtl}</div>
            )}
            {quantity > 0 && market.totalValue != null && (
              <div className="muted">Est. value ({quantity} kg): ₹{Math.round(market.totalValue)}</div>
            )}
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
