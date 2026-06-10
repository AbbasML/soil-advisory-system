import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard({ analysis, rankings, setView }) {
  const chartData = [
    {
      name: "Deficiencies",
      value: analysis.deficiencies.length,
    },
    {
      name: "Fertilizers",
      value: analysis.fertilizer_recommendations.length,
    },
    {
      name: "Improvements",
      value: analysis.improvement_plan.length,
    },
  ];

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <h1>🌱 Soil Health Dashboard</h1>

      <h2>
        Status:
        <span
          style={{
            marginLeft: "10px",
            color:
              analysis.overall_status === "Good"
                ? "green"
                : "red",
          }}
        >
          {analysis.overall_status}
        </span>
      </h2>

      <hr />

      <h2>Detected Deficiencies</h2>

      {analysis.deficiencies.length === 0 ? (
        <p>No deficiencies found.</p>
      ) : (
        <ul>
          {analysis.deficiencies.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Recommended Fertilizers</h2>

      <ul>
        {analysis.fertilizer_recommendations.map(
          (fertilizer, index) => (
            <li key={index}>{fertilizer}</li>
          )
        )}
      </ul>

      <hr />

      <h2>Improvement Plan</h2>

      <ul>
        {analysis.improvement_plan.map((step, index) => (
          <li key={index}>✓ {step}</li>
        ))}
      </ul>

      <hr />

      <h2>AI Advisory</h2>

      <div
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        {analysis.ai_summary}
      </div>

      <hr />

      <h2>Soil Analysis Overview</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>

      <hr />

      <h2>Crop Suitability Rankings</h2>

      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={rankings}
          layout="vertical"
        >
          <XAxis type="number" />
          <YAxis
            dataKey="crop"
            type="category"
          />
          <Tooltip />
          <Bar dataKey="score" />
        </BarChart>
      </ResponsiveContainer>

      <br />

      <button
        onClick={() => setView("chat")}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Ask KisanBot
      </button>
    </div>
  );
}

export default Dashboard;