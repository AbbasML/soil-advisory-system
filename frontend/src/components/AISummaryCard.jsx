const AISummaryCard = ({ summary }) => {
  return (
    <div className="card">
      <h2>🤖 AI Soil Analysis</h2>

      <div
        style={{
          background: "#f0fdf4",
          borderLeft: "6px solid #16a34a",
          borderRadius: "12px",
          padding: "18px",
          marginTop: "12px",
          lineHeight: "1.8",
          color: "#1f2937",
          fontSize: "15px",
        }}
      >
        {summary || "No AI analysis available."}
      </div>

      <p
        style={{
          marginTop: "15px",
          fontSize: "13px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        Generated using Google Gemini AI and soil nutrient analysis.
      </p>
    </div>
  );
};

export default AISummaryCard;