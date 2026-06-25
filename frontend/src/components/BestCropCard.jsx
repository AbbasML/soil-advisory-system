import "./Dashboard.css";

const cropImageMap = {
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  rice: "https://images.unsplash.com/photo-1536657235019-0306385cfd4f?auto=format&fit=crop&w=600&q=80",
  maize: "https://images.unsplash.com/photo-1551754655-cd27e38d20f6?auto=format&fit=crop&w=600&q=80",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d20f6?auto=format&fit=crop&w=600&q=80",
  soybean: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80",
  cotton: "https://images.unsplash.com/photo-1594751498131-8c0d9c4aa058?auto=format&fit=crop&w=600&q=80",
  groundnut: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80",
  peanut: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80",
  sugarcane: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=600&q=80",
  tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  onion: "https://images.unsplash.com/photo-1618519764620-7403abdbfee9?auto=format&fit=crop&w=600&q=80",
  default: "https://images.unsplash.com/photo-1464226184884-fa280b87c3a9?auto=format&fit=crop&w=600&q=80"
};

function BestCropCard({
  crop,
  score,
  rawCropName,
  title = "🥇 Recommended Crop (ML)",
  icon = "🌾",
  subtitle = "Highest suitability score based on soil nutrients, pH, rainfall, temperature and humidity."
}) {
  const imageUrl = cropImageMap[rawCropName?.toLowerCase()] || cropImageMap.default;

  return (
    <div className="best-crop-card-main">
      <div className="crop-image-wrapper">
        <img src={imageUrl} alt={crop} className="crop-card-image" />
        <div className="crop-image-overlay"></div>
        <span className="crop-card-badge">{title}</span>
      </div>

      <div className="crop-card-info">
        <div className="crop-card-header-row">
          <h2 className="best-crop-name">
            <span className="crop-card-icon">{icon}</span> {crop}
          </h2>
          <div className="best-crop-score">
            {Number(score || 0).toFixed(1)}% Suitable
          </div>
        </div>

        <p className="best-crop-text">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default BestCropCard;