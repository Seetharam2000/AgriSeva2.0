import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client.js";

export default function Login() {
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("aadhaar");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!/^\d{12}$/.test(aadhaar)) {
      setStatus("Enter a valid 12-digit Aadhaar number.");
      return;
    }
    setStatus("OTP sent to registered mobile (demo: any 6 digits).");
    setStep("otp");
  };

  const verifyOtp = () => {
    if (!/^\d{6}$/.test(otp)) {
      setStatus("Enter a valid 6-digit OTP.");
      return;
    }

    client
      .post("/auth/aadhaar-login", { aadhaar, otp, name })
      .then((res) => {
        localStorage.setItem("agriseva_token", res.data.access_token);
        localStorage.setItem("agriseva_user_name", name || "Farmer");
        setStatus("Aadhaar verified. Logged in successfully.");
        navigate("/dashboard");
      })
      .catch(() => setStatus("Unable to verify Aadhaar. Try again."));
  };

  return (
    <div>
      <section className="hero">
        <h1>Aadhaar Login</h1>
        <p>Secure identity check for trusted farmer onboarding.</p>
      </section>

      <div className="card" style={{ maxWidth: 520 }}>
        <h3>Verify Identity</h3>
        <div className="muted" style={{ marginBottom: 12 }}>
          Demo-only Aadhaar integration. No UIDAI data is accessed.
        </div>

        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Farmer name (optional)"
          style={{ width: "100%", marginBottom: 12 }}
        />

        <input
          className="input"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value)}
          placeholder="Aadhaar number"
          style={{ width: "100%", marginBottom: 12 }}
        />

        {step === "aadhaar" && (
          <button className="btn" onClick={sendOtp}>
            Send OTP
          </button>
        )}

        {step === "otp" && (
          <>
            <input
              className="input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              style={{ width: "100%", margin: "12px 0" }}
            />
            <button className="btn" onClick={verifyOtp}>
              Verify & Login
            </button>
          </>
        )}

        {status && <div className="pill" style={{ marginTop: 16 }}>{status}</div>}
      </div>
    </div>
  );
}
