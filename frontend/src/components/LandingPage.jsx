import "./LandingPage.css";

function LandingPage({ onStart }) {
  return (
    <div className="landing">
      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-icon">🌱</div>

          <h1 className="hero-title">
            AI Soil Health
            <br />
            & Crop Advisory System
          </h1>

          <p className="hero-subtitle">
            Empowering farmers with Machine Learning, Soil Intelligence,
            Crop Prediction, and AI-driven recommendations for smarter farming.
          </p>

          <button
            className="hero-btn"
            onClick={() => {
              onStart();
            }}
          >
            🚀 Start Soil Analysis
          </button>

          <div className="hero-badges">
            <span>🤖 Machine Learning</span>
            <span>📊 Soil Analytics</span>
            <span>🌾 Crop Prediction</span>
            <span>🌍 Multilingual</span>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2 className="features-title">
          Smart Farming Powered by AI
        </h2>

        <p className="features-subtitle">
          Everything needed to analyze soil health and maximize crop productivity.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>Crop Recommendation</h3>
            <p>
              Machine Learning predicts the most suitable crop for your soil.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Soil Health Analysis</h3>
            <p>
              Evaluate soil quality using NPK levels, pH, moisture and climate.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Advisory</h3>
            <p>
              Receive intelligent recommendations powered by AI.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>Fertilizer Guidance</h3>
            <p>
              Detect nutrient deficiencies and get fertilizer suggestions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Soil Improvement Plan</h3>
            <p>
              Improve long-term soil health with actionable recommendations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Multilingual Support</h3>
            <p>
              Accessible guidance for farmers in multiple languages.
            </p>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stat-card">
          <h2>⚡ AI Powered</h2>
          <p>Real-time soil insights and recommendations</p>
        </div>

        <div className="stat-card">
          <h2>🎯 ML Based</h2>
          <p>Crop prediction using trained machine learning models</p>
        </div>

        <div className="stat-card">
          <h2>🌱 Sustainable Farming</h2>
          <p>Promoting efficient resource utilization and soil health</p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;