const CropRankingTable = ({ crops }) => {
  return (
    <div className="card">
      <h2>Crop Suitability Ranking</h2>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Crop</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {crops?.map((crop, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{crop.crop}</td>
              <td>{crop.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CropRankingTable;