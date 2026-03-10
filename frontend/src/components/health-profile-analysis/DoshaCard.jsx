export default function DoshaCard({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        width: 140,
        textAlign: "center"
      }}
    >
      <h4>{title}</h4>
      <p>{(value * 100).toFixed(1)}%</p>
    </div>
  );
}
