export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{value}</div>
      <div className="muted">{subtitle}</div>
    </div>
  );
}
