export default function Founders() {
  const founders = [
    "Vaani Sharma",
    "Seetharam H",
    "Garvita Varshney",
    "Tanmay Deshmukh",
    "Snehapriya Roy",
    "Aanya Pant"
  ];

  return (
    <div>
      <section className="hero">
        <h1>Meet the Founders</h1>
        <p>
          The team behind Agriseva working to empower farmers and strengthen
          market transparency across India.
        </p>
      </section>

      <div className="grid grid-3">
        {founders.map((name) => (
          <div className="card" key={name}>
            <h3>{name}</h3>
            <p className="muted">Co‑founder, Agriseva</p>
          </div>
        ))}
      </div>
    </div>
  );
}
