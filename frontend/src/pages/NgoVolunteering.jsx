import { useState } from "react";

export default function NgoVolunteering() {
  const [form, setForm] = useState({
    organization: "",
    contactPerson: "",
    email: "",
    phone: "",
    focusArea: "Farmer training",
    region: "India",
    message: ""
  });
  const [status, setStatus] = useState("");

  const submitInterest = (event) => {
    event.preventDefault();
    setStatus("Thank you! Your interest has been recorded.");
    setForm({
      organization: "",
      contactPerson: "",
      email: "",
      phone: "",
      focusArea: "Farmer training",
      region: "India",
      message: ""
    });
  };

  return (
    <div>
      <section className="hero">
        <h1>NGO Volunteering</h1>
        <p>
          Partner with Agriseva to deliver education, training, and outreach
          services for farmers and rural communities.
        </p>
      </section>

      <div className="card">
        <h3>Register Interest</h3>
        <form onSubmit={submitInterest} className="form-grid">
          <input
            className="input"
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            placeholder="Organization name"
            required
          />
          <input
            className="input"
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            placeholder="Contact person"
            required
          />
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            required
          />
          <input
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
            required
          />
          <select
            className="input"
            value={form.focusArea}
            onChange={(e) => setForm({ ...form, focusArea: e.target.value })}
          >
            <option>Farmer training</option>
            <option>Digital literacy</option>
            <option>Market education</option>
            <option>Climate resilience</option>
            <option>Women empowerment</option>
          </select>
          <input
            className="input"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            placeholder="Region / State"
            required
          />
          <textarea
            className="input"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="How would you like to support?"
            required
          />
          <button className="btn" type="submit">
            Submit Interest
          </button>
        </form>
        {status && <div className="pill" style={{ marginTop: 12 }}>{status}</div>}
      </div>
    </div>
  );
}
