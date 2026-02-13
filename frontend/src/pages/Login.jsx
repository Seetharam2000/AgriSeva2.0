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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!/^\d{12}$/.test(aadhaar)) {
      setStatus("Enter a valid 12-digit Aadhaar number.");
      return;
    }
    setStatus("OTP sent to registered mobile (demo: any 6 digits).");
    setStep("otp");
    setOtp(""); // Clear OTP field when moving to OTP step
  };

  const verifyOtp = () => {
    if (!/^\d{6}$/.test(otp)) {
      setStatus("Enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setStatus("Verifying...");
    
    client
      .post("/auth/aadhaar-login", { aadhaar, otp, name })
      .then((res) => {
        setLoading(false);
        if (res.data && res.data.access_token) {
          localStorage.setItem("agriseva_token", res.data.access_token);
          localStorage.setItem("agriseva_user_name", name || role);
          setStatus("Aadhaar verified. Logged in successfully.");
          setTimeout(() => navigate("/dashboard"), 500);
        } else {
          setStatus("Invalid response from server. Please try again.");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Login error:", error);
        let errorMessage = "Unable to verify Aadhaar. Please try again.";
        
        if (error.response) {
          // Server responded with error
          errorMessage = error.response.data?.detail || error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
          // Request made but no response
          errorMessage = "Cannot connect to server. Please make sure the backend is running on http://localhost:8000";
        } else {
          // Something else happened
          errorMessage = error.message || "An unexpected error occurred.";
        }
        
        setStatus(`Error: ${errorMessage}`);
      });
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
          <button className="btn" onClick={sendOtp} disabled={loading}>
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
              disabled={loading}
            />
            <button className="btn" onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button 
              className="btn" 
              onClick={() => {
                setStep("aadhaar");
                setOtp("");
                setStatus("");
              }}
              disabled={loading}
              style={{ marginTop: 8, background: "rgba(255, 255, 255, 0.6)", color: "#0b2e59" }}
            >
              Back
            </button>
          </>
        )}

        {status && <div className="pill" style={{ marginTop: 16 }}>{status}</div>}
      </div>
    </div>
  );
}
