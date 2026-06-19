import "./Dashboard.css";
function BestCropCard({ crop, score }) {
  return (
    <div className="best-crop-card-main">
      <div className="best-crop-header">
        🥇 Best Crop Recommendation
      </div>

      <div className="best-crop-icon">
        🌾
      </div>

      <h1 className="best-crop-name">
        {crop}
      </h1>

      <div className="best-crop-score">
        {Number(score || 0).toFixed(1)}% Suitable
      </div>

      <p className="best-crop-text">
        Highest suitability score based on soil nutrients,
        pH, rainfall, temperature and humidity.
      </p>
    </div>
  );
}

export default BestCropCard;