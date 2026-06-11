import SoilHealthCard from "./SoilHealthCard";
import BestCropCard from "./BestCropCard";
import DeficiencyCard from "./DeficiencyCard";
import SoilManagementCard from "./SoilManagementCard";
import AISummaryCard from "./AISummaryCard";
import NutrientChart from "./NutrientChart";
import CropRankingTable from "./CropRankingTable";

function Dashboard({ analysis, rankings, setView }) {
  if (!analysis) {
    return <h2>No analysis data available.</h2>;
  }

  return (
    <div className="dashboard-container">
      <h1>🌱 Soil Health Dashboard</h1>

      <div className="dashboard-grid">
        <SoilHealthCard
          score={analysis.soil_health_score}
          status={analysis.soil_health_status}
        />

        <BestCropCard
          crop={analysis.crop}
          score={rankings?.[0]?.score || 0}
        />

        <DeficiencyCard
          deficiencies={analysis.deficiencies || []}
        />

        <SoilManagementCard
          recommendations={analysis.improvement_plan || []}
        />
      </div>

      <AISummaryCard
        summary={analysis.ai_summary}
      />

      <div style={{ marginTop: "20px" }}>
        <NutrientChart
          N={analysis.N || 0}
          P={analysis.P || 0}
          K={analysis.K || 0}
          ph={analysis.ph || 0}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <CropRankingTable
          crops={rankings || []}
        />
      </div>

      <button
        onClick={() => setView("chat")}
        className="chat-btn"
      >
        🤖 Ask KisanBot
      </button>
    </div>
  );
}

export default Dashboard;