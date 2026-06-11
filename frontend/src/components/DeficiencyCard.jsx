const DeficiencyCard = ({ deficiencies }) => {
  return (
    <div className="card">
      <h2>Deficiencies</h2>

      {deficiencies.length === 0 ? (
        <p>No deficiencies detected</p>
      ) : (
        <ul>
          {deficiencies.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeficiencyCard;
