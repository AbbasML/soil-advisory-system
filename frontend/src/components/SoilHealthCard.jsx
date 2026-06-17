const SoilHealthCard = ({ score, status }) => {
  const getColor = () => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#eab308";
    return "#dc2626";
  };

  const getEmoji = () => {
    if (score >= 80) return "🌱";
    if (score >= 60) return "🌾";
    return "⚠️";
  };

  return (
    <div className="card">
      <h2>Soil Health Score</h2>

      <div
        style={{
          fontSize: "52px",
          fontWeight: "800",
          textAlign: "center",
          color: getColor(),
          margin: "15px 0",
        }}
      >
        {score}
      </div>

      <div
        style={{
          width: "100%",
          height: "12px",
          background: "#e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: getColor(),
            transition: "0.5s",
          }}
        />
      </div>

      <p
        style={{
          textAlign: "center",
          fontWeight: "700",
          color: getColor(),
          fontSize: "16px",
        }}
      >
        {getEmoji()} {status}
      </p>
    </div>
  );
};

export default SoilHealthCard;