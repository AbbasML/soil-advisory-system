import { translations } from "../services/translations";
import "./LandingPage.css";

function LandingPage({ onStart, language }) {
  const t = translations[language] || translations["English"];

  return (
    <div className="landing">
      {/* HERO SECTION */}
      <div className="hero-split">
        <div className="hero-left">
          <div className="hero-badge-tag">🌱 AI-Powered Smart Agriculture</div>
          <h1 className="hero-title" style={{ whiteSpace: "pre-line" }}>
            {t.heroTitle}
          </h1>

          <p className="hero-subtitle">
            {t.heroSubtitle}
          </p>

          <button
            className="hero-btn"
            onClick={onStart}
          >
            {t.startAnalysis}
          </button>

          <div className="hero-badges">
            <span>{t.mlBadge}</span>
            <span>{t.analyticsBadge}</span>
            <span>{t.cropBadge}</span>
            <span>{t.multilingualBadge}</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-graphic-card">
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80" 
              alt="Smart Agriculture" 
              className="hero-graphic-img" 
            />
            <div className="hero-card-glass">
              <h3>🌾 Soil Intelligence</h3>
              <p>Predict optimal crop conditions and detect nutrient deficits using deep diagnostic insights.</p>
              <div className="glass-stats">
                <div>
                  <strong>98.4%</strong>
                  <span>Accuracy</span>
                </div>
                <div>
                  <strong>Real-Time</strong>
                  <span>Diagnostics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2 className="features-title">
          {t.featuresTitle}
        </h2>

        <p className="features-subtitle">
          {t.featuresSubtitle}
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">🌾</div>
            <h3>{t.cropRecTitle}</h3>
            <p>
              {t.cropRecDesc}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">📊</div>
            <h3>{t.soilHealthTitle}</h3>
            <p>
              {t.soilHealthDesc}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🤖</div>
            <h3>{t.aiAdvisoryTitle}</h3>
            <p>
              {t.aiAdvisoryDesc}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🧪</div>
            <h3>{t.fertGuidanceTitle}</h3>
            <p>
              {t.fertGuidanceDesc}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">📈</div>
            <h3>{t.soilImproveTitle}</h3>
            <p>
              {t.soilImproveDesc}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🌍</div>
            <h3>{t.multiSupportTitle}</h3>
            <p>
              {t.multiSupportDesc}
            </p>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <h2>{t.statAi}</h2>
          <p>{t.statAiDesc}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <h2>{t.statMl}</h2>
          <p>{t.statMlDesc}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <h2>{t.statSust}</h2>
          <p>{t.statSustDesc}</p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;