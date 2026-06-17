const DeficiencyCard = ({ deficiencies = [] }) => {
  return (
    <div className="card">
      <h2>⚠️ Nutrient Deficiencies</h2>

      {deficiencies.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "10px",
            }}
          >
            ✅
          </div>

          <p
            style={{
              color: "#16a34a",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            No deficiencies detected
          </p>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Your soil nutrients are within the recommended range.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          {deficiencies.map((d, i) => (
            <div
              key={i}
              style={{
                background: "#fef2f2",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "10px",
                fontWeight: "600",
                borderLeft: "5px solid #ef4444",
              }}
            >
              ⚠️ {d}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeficiencyCard;