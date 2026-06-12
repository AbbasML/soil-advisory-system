function SoilManagementCard({ plan }) {
  return (
    <div className="card">
      <h3>Soil Management Plan</h3>

      <ul>
        {plan?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default SoilManagementCard;