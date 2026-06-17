function SoilManagementCard({ recommendations = [] }) {
  return (
    <div className="card">
      <h2>🌱 Soil Management Plan</h2>

      {recommendations.length === 0 ? (
        <p>No recommendations available.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "15px",
          }}
        >
          {recommendations.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#f0fdf4",
                borderLeft: "5px solid #16a34a",
                padding: "12px",
                borderRadius: "10px",
                fontWeight: "500",
                color: "#14532d",
              }}
            >
              ✅ {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SoilManagementCard;