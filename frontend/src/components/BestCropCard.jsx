const BestCropCard = ({ crop, score }) => {
  return (
    <div className="card">
      <h2>Best Crop</h2>

      <h1>{crop}</h1>

      <p>Suitability: {score}%</p>
    </div>
  );
};

export default BestCropCard;