const SoilHealthCard = ({ score, status }) => {
  return (
    <div className="card">
      <h2>Soil Health Score</h2>

      <div className="score">
        {score}/100
      </div>

      <p>{status}</p>
    </div>
  );
};

export default SoilHealthCard;