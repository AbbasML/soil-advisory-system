import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const NutrientChart = ({ N, P, K, ph }) => {

  const data = [
    { name: "N", value: N },
    { name: "P", value: P },
    { name: "K", value: K },
    { name: "pH", value: ph }
  ];

  return (
    <div className="card">
      <h2>Nutrient Analysis</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutrientChart;