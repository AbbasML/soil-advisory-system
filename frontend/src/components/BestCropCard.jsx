const BestCropCard = ({ crop, score }) => {
  const getBadgeColor = () => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#eab308";
    return "#dc2626";
  };

  return (
    <div className="card">
      <h2>🏆 Best Crop Recommendation</h2>

      <div
        style={{
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        <div
          style={{
            fontSize: "52px",
            marginBottom: "10px",
          }}
        >
          🌾
        </div>

        <h1
          style={{
            color: "#14532d",
            margin: "0",
            fontSize: "32px",
          }}
        >
          {crop}
        </h1>

        <div
          style={{
            display: "inline-block",
            marginTop: "15px",
            padding: "8px 16px",
            borderRadius: "20px",
            background: getBadgeColor(),
            color: "white",
            fontWeight: "700",
          }}
        >
          Suitability: {Number(score || 0).toFixed(1)}%
        </div>
      </div>

      <p
        style={{
          textAlign: "center",
          color: "#4b5563",
        }}
      >
        This crop is currently the most suitable for your soil conditions.
      </p>
    </div>
  );
};

export default BestCropCard;