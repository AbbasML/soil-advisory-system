const CropRankingTable = ({ crops = [] }) => {
  return (
    <div className="card">
      <h2>🏆 Crop Suitability Ranking</h2>

      {crops.length === 0 ? (
        <p>No crop rankings available.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#166534",
                  color: "white",
                }}
              >
                <th style={{ padding: "12px" }}>Rank</th>
                <th style={{ padding: "12px" }}>Crop</th>
                <th style={{ padding: "12px" }}>Suitability</th>
              </tr>
            </thead>

            <tbody>
              {crops.map((crop, index) => (
                <tr
                  key={index}
                  style={{
                    background:
                      index % 2 === 0 ? "#f9fafb" : "#ffffff",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontWeight: "700",
                    }}
                  >
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {crop.crop}
                  </td>

                  <td style={{ padding: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "10px",
                          background: "#e5e7eb",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${crop.score}%`,
                            height: "100%",
                            background: "#16a34a",
                          }}
                        />
                      </div>

                      <strong>
                        {Number(crop.score).toFixed(1)}%
                      </strong>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CropRankingTable;