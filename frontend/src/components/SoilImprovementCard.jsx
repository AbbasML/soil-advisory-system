const RecommendationCard = ({ recommendations }) => {
  return (
    <div className="card">
      <h2>Recommendations</h2>

      <ul>
        {recommendations.map((r, i) => (
          <li key={i}>✓ {r}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationCard;