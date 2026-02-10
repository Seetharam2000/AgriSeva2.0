import { useState } from "react";
import client from "../api/client.js";

export default function Feedback() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Farmer");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const submitFeedback = (event) => {
    event.preventDefault();
    setStatus("Submitting...");
    client
      .post("/feedback", { name, role, message })
      .then(() => {
        setStatus("Feedback submitted successfully.");
        setName("");
        setMessage("");
      })
      .catch(() => setStatus("Error submitting feedback."));
  };

  return (
    <div>
      <section className="hero">
        <h1>AgriSeva Feedback</h1>
        <p>Help us improve services for farmers and market stakeholders.</p>
      </section>

      <div className="card" style={{ maxWidth: 520 }}>
        <h3>Share your feedback</h3>
        <form onSubmit={submitFeedback}>
          <input
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your Name"
            required
            style={{ width: "100%", marginBottom: 12 }}
          />

          <select
            className="input"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
          >
            <option>Farmer</option>
            <option>Retailer</option>
            <option>Union</option>
          </select>

          <textarea
            className="input"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your feedback..."
            required
            rows={4}
            style={{ width: "100%", marginBottom: 12 }}
          />

          <button className="btn" type="submit">
            Submit Feedback
          </button>
        </form>

        {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}
      </div>
    </div>
  );
}
