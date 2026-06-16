import "./LandingPage.css";

function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <div className="hero">
        <div className="hero-content">
          <h1>🌱 AI Soil Health Analysis System</h1>

          <p>
            Analyze soil health, get crop recommendations,
            fertilizer suggestions and AI-powered farming guidance.
          </p>

          <button onClick={onStart}>
            Start Soil Analysis
          </button>
        </div>
      </div>

      <section className="features">
        <h2>Why Use Our System?</h2>

        <div className="feature-grid">
          <div className="card">
            🌾
            <h3>Crop Recommendation</h3>
            <p>Find the most suitable crop for your soil.</p>
          </div>

          <div className="card">
            📊
            <h3>Soil Analysis</h3>
            <p>Get instant soil health insights.</p>
          </div>

          <div className="card">
            🤖
            <h3>AI Assistant</h3>
            <p>Ask farming questions anytime.</p>
          </div>

          <div className="card">
            🌱
            <h3>Improvement Plan</h3>
            <p>Improve soil quality with smart suggestions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;