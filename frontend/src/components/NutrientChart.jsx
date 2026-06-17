import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const NutrientChart = ({ N = 0, P = 0, K = 0, ph = 0 }) => {
  const data = [
    { name: "Nitrogen", value: N },
    { name: "Phosphorus", value: P },
    { name: "Potassium", value: K },
    { name: "pH", value: ph },
  ];

  const colors = [
    "#16a34a",
    "#22c55e",
    "#84cc16",
    "#eab308",
  ];

  return (
    <div className="card">
      <h2>📊 Nutrient Analysis</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div
        style={{
          marginTop: "15px",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}
      >
        <div
          style={{
            background: "#f0fdf4",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          🌿 Nitrogen: <strong>{N}</strong>
        </div>

        <div
          style={{
            background: "#f0fdf4",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          🌱 Phosphorus: <strong>{P}</strong>
        </div>

        <div
          style={{
            background: "#f0fdf4",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          🌾 Potassium: <strong>{K}</strong>
        </div>

        <div
          style={{
            background: "#fef9c3",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          ⚗️ pH: <strong>{ph}</strong>
<br />
<small>
  {ph < 6.5
    ? "Acidic"
    : ph > 7.5
    ? "Alkaline"
    : "Optimal"}
</small>
        </div>
      </div>
    </div>
  );
};

export default NutrientChart;