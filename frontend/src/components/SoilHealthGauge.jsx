import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function SoilHealthGauge({ score, status }) {
  return (
    <div className="card">
      <h2>🌱 Soil Health Score</h2>

      <div
        style={{
          width: 220,
          height: 220,
          margin: "20px auto",
        }}
      >
        <CircularProgressbar
          value={score}
          text={`${score}`}
          styles={buildStyles({
            textSize: "18px",
            pathColor:
              score >= 80
                ? "#22c55e"
                : score >= 60
                ? "#f59e0b"
                : "#ef4444",
            textColor: "#14532d",
            trailColor: "#e5e7eb",
          })}
        />
      </div>

      <p
        style={{
          textAlign: "center",
          fontWeight: "700",
          color: "#166534",
          fontSize: "16px",
        }}
      >
        {status}
      </p>
    </div>
  );
}

export default SoilHealthGauge;