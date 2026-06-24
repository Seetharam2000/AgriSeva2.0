import { useMemo, useState } from "react";

const BANKS = [
  { name: "State Bank of India", url: "https://sbi.co.in/" },
  { name: "Punjab National Bank", url: "https://www.pnbindia.in/" },
  { name: "Bank of Baroda", url: "https://www.bankofbaroda.in/" },
  { name: "Canara Bank", url: "https://canarabank.com/" },
  { name: "Union Bank of India", url: "https://www.unionbankofindia.co.in/" },
  { name: "Bank of India", url: "https://bankofindia.co.in/" },
  { name: "Central Bank of India", url: "https://www.centralbankofindia.co.in/" },
  { name: "Indian Bank", url: "https://www.indianbank.in/" },
  { name: "Indian Overseas Bank", url: "https://www.iob.in/" },
  { name: "UCO Bank", url: "https://www.ucobank.com/" },
  { name: "Bank of Maharashtra", url: "https://bankofmaharashtra.in/" },
  { name: "Punjab & Sind Bank", url: "https://punjabandsindbank.co.in/" },
  { name: "Axis Bank", url: "https://www.axisbank.com/" },
  { name: "HDFC Bank", url: "https://www.hdfcbank.com/" },
  { name: "ICICI Bank", url: "https://www.icicibank.com/" },
  { name: "Kotak Mahindra Bank", url: "https://www.kotak.com/" },
  { name: "IndusInd Bank", url: "https://www.indusind.com/" },
  { name: "Yes Bank", url: "https://www.yesbank.in/" },
  { name: "IDFC FIRST Bank", url: "https://www.idfcfirstbank.com/" },
  { name: "Federal Bank", url: "https://www.federalbank.co.in/" },
  { name: "RBL Bank", url: "https://www.rblbank.com/" },
  { name: "Bandhan Bank", url: "https://www.bandhanbank.com/" },
  { name: "South Indian Bank", url: "https://www.southindianbank.com/" },
  { name: "Karur Vysya Bank", url: "https://www.kvb.co.in/" },
  { name: "City Union Bank", url: "https://www.cityunionbank.com/" },
  { name: "DCB Bank", url: "https://www.dcbbank.com/" },
  { name: "Karnataka Bank", url: "https://karnatakabank.com/" },
  { name: "Jammu & Kashmir Bank", url: "https://www.jkbank.com/" },
  { name: "IDBI Bank", url: "https://www.idbibank.in/" },
  { name: "Standard Chartered Bank", url: "https://www.sc.com/in/" },
  { name: "HSBC India", url: "https://www.hsbc.co.in/" },
  { name: "Citibank India", url: "https://www.online.citibank.co.in/" },
  { name: "Deutsche Bank India", url: "https://www.deutschebank.co.in/" },
  { name: "Bank of Bahrain & Kuwait", url: "https://www.bbkonline.com/" },
  { name: "Bank of Ceylon", url: "https://www.boc.lk/" },
  { name: "Bank of Thailand", url: "https://www.bot.or.th/" },
  { name: "Nepal SBI Bank", url: "https://www.nepalsbi.com.np/" }
];

export default function Payments() {
  const [query, setQuery] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("Agriseva payment");
  const [upiStatus, setUpiStatus] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return BANKS;
    return BANKS.filter((bank) => bank.name.toLowerCase().includes(value));
  }, [query]);

  return (
    <div>
      <section className="hero">
        <h1>Payments</h1>
        <p>
          Select your bank to continue to official payment portals for secure
          settlement.
        </p>
      </section>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>UPI Payment</h3>
        <div className="muted" style={{ marginBottom: 12 }}>
          Pay instantly using UPI apps like GPay, PhonePe, or Paytm.
        </div>
        <div className="form-grid">
          <input
            className="input"
            value={upiId}
            onChange={(event) => setUpiId(event.target.value)}
            placeholder="UPI ID (e.g., name@bank)"
          />
          <input
            className="input"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Amount (INR)"
          />
          <input
            className="input"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Payment note"
          />
          <button
            className="btn"
            onClick={() => {
              if (!upiId) {
                setUpiStatus("Enter a valid UPI ID.");
                return;
              }
              const params = new URLSearchParams({
                pa: upiId,
                pn: "Agriseva",
                am: amount || "0",
                tn: note || "Agriseva payment",
                cu: "INR",
              });
              const url = `upi://pay?${params.toString()}`;
              window.location.href = url;
              setUpiStatus("Opening UPI app...");
            }}
          >
            Pay via UPI
          </button>
        </div>
        {upiStatus && <div className="pill" style={{ marginTop: 12 }}>{upiStatus}</div>}
      </div>

      <div className="card">
        <h3>Choose Bank</h3>
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search bank"
          style={{ width: "100%", marginBottom: 12 }}
        />
        <div className="bank-grid">
          {filtered.map((bank) => (
            <div className="bank-item" key={bank.name}>
              <div>
                <strong>{bank.name}</strong>
                <div className="muted">Official portal</div>
              </div>
              <a
                className="btn-link"
                href={bank.url}
                target="_blank"
                rel="noreferrer"
              >
                Pay via Bank
              </a>
            </div>
          ))}
        </div>
        <div className="muted" style={{ marginTop: 12 }}>
          Note: Payments are completed on the bank’s official website.
        </div>
      </div>
    </div>
  );
}
