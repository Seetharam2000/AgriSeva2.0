import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client.js";
import loginBg from "../assets/login-bg.jpeg";
import loginCardBg from "../assets/login-card-bg.jpg";
import logoImage from "../assets/agriseva-logo.jpeg";

export default function Login() {
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Farmer");
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
        localStorage.setItem("agriseva_user_name", name || role);
        setStatus("Aadhaar verified. Logged in successfully.");
        navigate("/dashboard");
      })
      .catch(() => setStatus("Unable to verify Aadhaar. Try again."));
  };

  return (
    <div
      className="login-bg"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div
        className="login-card"
        style={{ backgroundImage: `url(${loginCardBg})` }}
      >
        <div className="login-logo">
          <img src={logoImage} alt="Agriseva logo" />
        </div>
        <h2>Aadhaar Login</h2>
        <p className="muted">
          Farmers, traders, and companies can securely access their profiles.
        </p>

        <select
          className="input"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        >
          <option>Farmer</option>
          <option>Trader</option>
          <option>Company</option>
        </select>

        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name (optional)"
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
