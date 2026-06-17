import "./LandingPage.css";

function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <div className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-icon">🌱</div>
          <h1 className="hero-title">
            AI Soil Health
            <br />
            Advisory System
          </h1>
          <p className="hero-subtitle">
            Analyze soil health, get crop recommendations, fertilizer
            suggestions and AI-powered farming guidance.
          </p>
          <button className="hero-btn" onClick={onStart}>
            Start Soil Analysis →
          </button>
          <div className="hero-badge">
            🏆 Team CodeHarvest · TechForGood 2026
          </div>
        </div>
      </div>

      <section className="features">
        <h2 className="features-title">Why Use Our System?</h2>
        <p className="features-subtitle">
          Everything a farmer needs to make smarter soil decisions
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>Crop Recommendation</h3>
            <p>Find the most suitable crop for your soil.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Soil Analysis</h3>
            <p>Get instant soil health insights.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Ask farming questions anytime.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Improvement Plan</h3>
            <p>Improve soil quality with smart suggestions.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <strong>KisanSaathi</strong> · Powered by Google Gemini AI · Team
        CodeHarvest · IEEE MIT-ADT University
      </footer>
    </div>
  );
}

export default LandingPage;
