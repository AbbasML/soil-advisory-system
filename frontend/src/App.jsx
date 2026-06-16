import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────
const C = {
  greenDark: "#14532D",
  greenMain: "#166534",
  greenMid: "#15803D",
  greenLight: "#22C55E",
  greenPale: "#DCFCE7",
  greenFaint: "#F0FDF4",
  golden: "#CA8A04",
  goldenPale: "#FEF9C3",
  brown: "#92400E",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  gray800: "#1F2937",
  red50: "#FEF2F2",
  red500: "#EF4444",
  red800: "#991B1B",
  amber50: "#FFFBEB",
  amber500: "#F59E0B",
  amber800: "#92400E",
};

// ─── Shared style helpers ─────────────────────────────────────────
const card = {
  background: C.white,
  borderRadius: 16,
  padding: "24px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
  border: `1px solid ${C.gray200}`,
};

const sectionTitle = {
  fontSize: 16,
  fontWeight: 700,
  color: C.greenDark,
  marginBottom: 14,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

// ─── Spinner ──────────────────────────────────────────────────────
function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 18,
        height: 18,
        border: "2.5px solid rgba(255,255,255,0.35)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "ks-spin 0.7s linear infinite",
      }}
    />
  );
}

// ─── SOIL FORM ────────────────────────────────────────────────────
const CROPS = [
  { v: "wheat", l: "🌾 Wheat (Gehun)" },
  { v: "rice", l: "🌾 Rice (Chawal)" },
  { v: "cotton", l: "🏗️ Cotton (Kapas)" },
  { v: "sugarcane", l: "🎋 Sugarcane (Ganna)" },
  { v: "soybean", l: "🫘 Soybean (Soya)" },
  { v: "maize", l: "🌽 Maize (Makka)" },
  { v: "tomato", l: "🍅 Tomato (Tamatar)" },
  { v: "potato", l: "🥔 Potato (Aloo)" },
  { v: "onion", l: "🧅 Onion (Pyaaz)" },
  { v: "groundnut", l: "🥜 Groundnut (Moongfali)" },
];

const LANGS = [
  { v: "English", l: "🇬🇧 English" },
  { v: "Hindi", l: "🇮🇳 Hindi (हिंदी)" },
  { v: "Marathi", l: "🟠 Marathi (मराठी)" },
  { v: "Gujarati", l: "🟡 Gujarati (ગુજરાતી)" },
];

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: `1.5px solid ${C.gray200}`,
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "inherit",
  color: C.gray800,
  background: C.gray50,
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: C.gray600,
  marginBottom: 5,
  display: "block",
};

const hintStyle = {
  fontSize: 11,
  color: C.gray400,
  marginTop: 3,
};

function Field({ label, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && <span style={hintStyle}>{hint}</span>}
    </div>
  );
}

const API = import.meta?.env?.VITE_API_URL || "http://localhost:8000";

function SoilForm({ onResult }) {
  const [form, setForm] = useState({
    crop: "wheat",
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    farm_acres: "1",
    language: "English",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError("");
  };
  const inp = (k) => ({
    ...inputStyle,
    borderColor: focused === k ? C.greenMid : C.gray200,
    boxShadow: focused === k ? `0 0 0 3px ${C.greenPale}` : "none",
  });

  const submit = async () => {
    if (!form.ph || !form.nitrogen || !form.phosphorus || !form.potassium) {
      setError("Please fill in pH, N, P, and K values before analyzing.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        crop: form.crop,
        ph: parseFloat(form.ph),
        nitrogen: parseFloat(form.nitrogen),
        phosphorus: parseFloat(form.phosphorus),
        potassium: parseFloat(form.potassium),
        farm_acres: parseFloat(form.farm_acres) || 1,
        language: form.language,
      };
      const res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      onResult(data);
    } catch (err) {
      setError(
        "Could not connect to server. Make sure the backend is running on port 8000.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...card, maxWidth: 640, margin: "0 auto" }}>
      <h2 style={sectionTitle}>🧪 Enter Your Soil Test Values</h2>

      {/* Crop + Language */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Field label="🌱 Crop">
          <select
            value={form.crop}
            onChange={set("crop")}
            style={{ ...inp("crop"), cursor: "pointer" }}
            onFocus={() => setFocused("crop")}
            onBlur={() => setFocused("")}
          >
            {CROPS.map((c) => (
              <option key={c.v} value={c.v}>
                {c.l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="🌐 Language / भाषा">
          <select
            value={form.language}
            onChange={set("language")}
            style={{ ...inp("lang"), cursor: "pointer" }}
            onFocus={() => setFocused("lang")}
            onBlur={() => setFocused("")}
          >
            {LANGS.map((l) => (
              <option key={l.v} value={l.v}>
                {l.l}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* pH + Farm size */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Field label="⚗️ pH Value" hint="Range 0–14, ideal 6.0–7.5">
          <input
            type="number"
            placeholder="e.g. 6.5"
            min="0"
            max="14"
            step="0.1"
            value={form.ph}
            onChange={set("ph")}
            style={inp("ph")}
            onFocus={() => setFocused("ph")}
            onBlur={() => setFocused("")}
          />
        </Field>
        <Field label="🏡 Farm Size (acres)">
          <input
            type="number"
            placeholder="e.g. 2"
            min="0.1"
            step="0.5"
            value={form.farm_acres}
            onChange={set("farm_acres")}
            style={inp("farm")}
            onFocus={() => setFocused("farm")}
            onBlur={() => setFocused("")}
          />
        </Field>
      </div>

      {/* NPK row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <Field label="🌿 Nitrogen (N)" hint="kg/ha">
          <input
            type="number"
            placeholder="e.g. 80"
            min="0"
            value={form.nitrogen}
            onChange={set("nitrogen")}
            style={inp("n")}
            onFocus={() => setFocused("n")}
            onBlur={() => setFocused("")}
          />
        </Field>
        <Field label="🔵 Phosphorus (P)" hint="kg/ha">
          <input
            type="number"
            placeholder="e.g. 50"
            min="0"
            value={form.phosphorus}
            onChange={set("phosphorus")}
            style={inp("p")}
            onFocus={() => setFocused("p")}
            onBlur={() => setFocused("")}
          />
        </Field>
        <Field label="🟡 Potassium (K)" hint="kg/ha">
          <input
            type="number"
            placeholder="e.g. 50"
            min="0"
            value={form.potassium}
            onChange={set("potassium")}
            style={inp("k")}
            onFocus={() => setFocused("k")}
            onBlur={() => setFocused("")}
          />
        </Field>
      </div>

      {error && (
        <div
          style={{
            background: C.red50,
            border: `1px solid #FECACA`,
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: C.red800,
            marginBottom: 16,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={submit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          background: loading
            ? C.gray400
            : `linear-gradient(135deg, ${C.greenMain}, ${C.greenMid})`,
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxShadow: loading ? "none" : "0 4px 14px rgba(22,101,52,0.35)",
          transition: "all 0.2s",
        }}
      >
        {loading ? (
          <>
            <Spinner /> Analyzing your soil...
          </>
        ) : (
          <>🔍 Analyze Soil</>
        )}
      </button>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────
function ScoreCircle({ score }) {
  const color =
    score >= 80
      ? C.greenLight
      : score >= 60
        ? "#84CC16"
        : score >= 40
          ? C.amber500
          : C.red500;
  const label =
    score >= 80
      ? "Excellent"
      : score >= 60
        ? "Good"
        : score >= 40
          ? "Fair"
          : "Poor";
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: `6px solid ${color}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 10px",
          background: `${color}18`,
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 10, color: C.gray400, fontWeight: 500 }}>
          /100
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color }}>{label}</div>
      <div style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>
        Soil Health Score
      </div>
    </div>
  );
}

function CropBar({ crop, score, rank }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderBottom: `1px solid ${C.gray100}`,
      }}
    >
      <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>
        {rank < 3 ? medals[rank] : `${rank + 1}`}
      </span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: C.gray800,
            textTransform: "capitalize",
            marginBottom: 4,
          }}
        >
          {crop}
        </div>
        <div style={{ height: 6, background: C.gray100, borderRadius: 3 }}>
          <div
            style={{
              height: "100%",
              width: `${Math.min(score, 100)}%`,
              background: `linear-gradient(90deg, ${C.greenMid}, ${C.greenLight})`,
              borderRadius: 3,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: C.greenMain,
          minWidth: 38,
          textAlign: "right",
        }}
      >
        {score}%
      </span>
    </div>
  );
}

function DefTag({ d }) {
  const cfg =
    d.severity === "High"
      ? { bg: C.red50, txt: C.red800, dot: C.red500 }
      : d.severity === "Medium"
        ? { bg: C.amber50, txt: C.amber800, dot: C.amber500 }
        : { bg: C.greenFaint, txt: C.greenDark, dot: C.greenLight };
  return (
    <div
      style={{
        background: cfg.bg,
        borderRadius: 10,
        padding: "10px 14px",
        marginBottom: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <span style={{ fontWeight: 600, color: cfg.txt, fontSize: 13 }}>
          {d.parameter}
        </span>
        <span style={{ fontSize: 12, color: cfg.txt, marginLeft: 6 }}>
          {d.status} · Value: {d.value} · Ideal: {d.ideal_range || d.ideal}
        </span>
      </div>
      <span
        style={{
          background: cfg.dot,
          color: "#fff",
          fontSize: 10,
          padding: "2px 8px",
          borderRadius: 20,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {d.severity}
      </span>
    </div>
  );
}

function Dashboard({ data, onChat }) {
  if (!data) return null;
  const score = data.soil_health_score ?? data.health_score ?? 0;
  const defs = data.deficiencies || [];
  const ranks = (data.crop_rankings || data.rankings || []).slice(0, 5);
  const ferts = data.fertilizer_recommendations || [];
  const plan = data.improvement_plan || {};
  const ai = data.ai_summary || data.gemini_advice || "";
  const best = ranks[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top strip */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.greenDark}, ${C.greenMid})`,
          borderRadius: 16,
          padding: "20px 24px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            🌿 Soil Health Dashboard
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>
            Crop:{" "}
            <strong style={{ textTransform: "capitalize" }}>{data.crop}</strong>
          </div>
        </div>
        <button
          onClick={onChat}
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 10,
            padding: "9px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          💬 Ask KisanBot
        </button>
      </div>

      {/* Score + Best crop */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...card, textAlign: "center", padding: "24px 16px" }}>
          <ScoreCircle score={score} />
        </div>
        <div style={{ ...card, textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 12, color: C.gray400, fontWeight: 500 }}>
            Best Match
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: C.greenMain,
              textTransform: "capitalize",
              marginTop: 4,
            }}
          >
            {best ? best.crop || best.name : "—"}
          </div>
          {best && (
            <div style={{ fontSize: 12, color: C.gray400, marginTop: 4 }}>
              Suitability: {best.score ?? best.suitability_score ?? 0}%
            </div>
          )}
        </div>
      </div>

      {/* AI Advisory */}
      {ai && (
        <div style={card}>
          <div style={sectionTitle}>🤖 AI Advisory (KisanBot Says)</div>
          <div
            style={{
              background: C.greenFaint,
              border: `1px solid ${C.greenPale}`,
              borderRadius: 12,
              padding: "16px",
              fontSize: 14,
              lineHeight: 1.8,
              color: C.gray600,
            }}
          >
            {ai}
          </div>
        </div>
      )}

      {/* Deficiencies */}
      <div style={card}>
        <div style={sectionTitle}>⚠️ Nutrient Deficiencies</div>
        {defs.length === 0 ? (
          <div
            style={{
              background: C.greenFaint,
              borderRadius: 10,
              padding: "14px",
              fontSize: 14,
              color: C.greenDark,
              fontWeight: 500,
            }}
          >
            ✅ No deficiencies detected — soil is healthy!
          </div>
        ) : (
          defs.map((d, i) => <DefTag key={i} d={d} />)
        )}
      </div>

      {/* Fertilizer */}
      {ferts.length > 0 && (
        <div style={card}>
          <div style={sectionTitle}>💊 Fertilizer Recommendations</div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: C.greenPale }}>
                  {[
                    "Fertilizer",
                    "Per Acre",
                    "Total (Farm)",
                    "When to Apply",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        color: C.greenDark,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ferts.map((f, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `1px solid ${C.gray100}` }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                      {f.fertilizer || f.name}
                    </td>
                    <td style={{ padding: "10px 12px", color: C.gray600 }}>
                      {f.dose_per_acre || f.dose}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontWeight: 700,
                        color: C.greenMain,
                      }}
                    >
                      {f.total_quantity_kg || f.total}
                    </td>
                    <td style={{ padding: "10px 12px", color: C.gray600 }}>
                      {f.timing}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Crop Ranking */}
      {ranks.length > 0 && (
        <div style={card}>
          <div style={sectionTitle}>🌾 Crop Suitability Ranking</div>
          {ranks.map((r, i) => (
            <CropBar
              key={i}
              rank={i}
              crop={r.crop || r.name}
              score={r.score ?? r.suitability_score ?? 0}
            />
          ))}
        </div>
      )}

      {/* Improvement Plan */}
      {Object.keys(plan).length > 0 && (
        <div style={card}>
          <div style={sectionTitle}>📅 4-Week Soil Improvement Plan</div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {Object.entries(plan).map(([wk, task]) => (
              <div
                key={wk}
                style={{
                  background: C.greenFaint,
                  border: `1px solid ${C.greenPale}`,
                  borderRadius: 10,
                  padding: "14px",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.greenMain,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  📌 {wk.replace(/_/g, " ")}
                </div>
                <div
                  style={{ fontSize: 13, color: C.gray600, lineHeight: 1.6 }}
                >
                  {task}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHATBOT ──────────────────────────────────────────────────────
const QUICK = [
  "When should I sow?",
  "Best crop for my soil?",
  "How to improve nitrogen?",
  "Recommended fertilizer?",
];

function Chatbot({ soilData, onBack }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "🙏 Namaste! I'm KisanBot. Ask me anything about your soil and crops!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = { current: null };

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const context = soilData
        ? `Soil data: crop=${soilData.crop}, health_score=${soilData.soil_health_score ?? soilData.health_score}, deficiencies=${JSON.stringify(soilData.deficiencies?.map((d) => d.parameter))}`
        : "";
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          soil_context: context,
          history: [],
          language: soilData?.language || "English",
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "bot", text: data.reply || data.response },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Sorry, I couldn't connect right now. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...card, padding: 0, overflow: "hidden" }}>
      {/* Chat header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.greenDark}, ${C.greenMid})`,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          🌾
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>
            KisanBot
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            AI Agricultural Assistant · Always here to help
          </div>
        </div>
        <button
          onClick={onBack}
          style={{
            marginLeft: "auto",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 8,
            padding: "7px 14px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Dashboard
        </button>
      </div>

      {/* Quick questions */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          padding: "12px 16px",
          borderBottom: `1px solid ${C.gray100}`,
        }}
      >
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            style={{
              padding: "6px 14px",
              background: C.greenPale,
              color: C.greenDark,
              border: `1px solid ${C.greenLight}30`,
              borderRadius: 20,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 500,
              transition: "all 0.15s",
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        style={{
          height: 340,
          overflowY: "auto",
          padding: "16px",
          background: C.gray50,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "78%",
                padding: "11px 16px",
                borderRadius:
                  m.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                background:
                  m.role === "user"
                    ? `linear-gradient(135deg, ${C.greenMain}, ${C.greenMid})`
                    : C.white,
                color: m.role === "user" ? "#fff" : C.gray800,
                fontSize: 13.5,
                lineHeight: 1.6,
                boxShadow:
                  m.role === "user" ? "none" : "0 1px 6px rgba(0,0,0,0.08)",
                border: m.role === "user" ? "none" : `1px solid ${C.gray100}`,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div
            style={{
              display: "flex",
              gap: 5,
              padding: "12px 16px",
              background: C.white,
              borderRadius: "18px 18px 18px 4px",
              width: "fit-content",
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
              border: `1px solid ${C.gray100}`,
            }}
          >
            {[0, 0.2, 0.4].map((d, i) => (
              <span
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.greenLight,
                  animation: `ks-bounce 1.2s ${d}s infinite`,
                  display: "block",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "14px 16px",
          borderTop: `1px solid ${C.gray100}`,
          background: C.white,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask KisanBot anything about your soil..."
          style={{
            flex: 1,
            padding: "11px 16px",
            border: `1.5px solid ${C.gray200}`,
            borderRadius: 24,
            fontSize: 14,
            fontFamily: "inherit",
            outline: "none",
            color: C.gray800,
          }}
        />
        <button
          onClick={() => send()}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.greenMain}, ${C.greenMid})`,
            color: "#fff",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(22,101,52,0.3)",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("form");
  const [result, setResult] = useState(null);

  const onResult = (data) => {
    setResult(data);
    setView("dashboard");
  };
  const reset = () => {
    setResult(null);
    setView("form");
  };

  return (
    <>
      {/* Global keyframe animations injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
          background: linear-gradient(160deg, #F0FDF4 0%, #ECFDF5 50%, #F7FEE7 100%);
          min-height: 100vh;
        }
        @keyframes ks-spin { to { transform: rotate(360deg); } }
        @keyframes ks-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-7px); }
        }
        input:focus, select:focus {
          border-color: #15803D !important;
          box-shadow: 0 0 0 3px #DCFCE7 !important;
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #BBF7D0; border-radius: 3px; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .ks-grid-2 { grid-template-columns: 1fr !important; }
          .ks-grid-3 { grid-template-columns: 1fr 1fr !important; }
          .ks-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .ks-hide-mobile { display: none !important; }
        }
      `}</style>

      <div
        style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 60px" }}
      >
        {/* ── Header ── */}
        <header
          style={{
            background: `linear-gradient(135deg, ${C.greenDark} 0%, ${C.greenMain} 55%, ${C.greenMid} 100%)`,
            borderRadius: 20,
            padding: "32px 24px 28px",
            textAlign: "center",
            marginBottom: 24,
            boxShadow: "0 8px 32px rgba(20,83,45,0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -50,
              left: -30,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }}
          />

          <div style={{ fontSize: 52, marginBottom: 8, position: "relative" }}>
            🌾
          </div>
          <h1
            style={{
              fontSize: "clamp(20px, 5vw, 28px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.3,
              marginBottom: 8,
              position: "relative",
            }}
          >
            AI Soil Health Advisory System
          </h1>
          <p style={{ fontSize: 14, color: "#BBF7D0", position: "relative" }}>
            Smart recommendations for better farming · KisanSaathi
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: 12,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(202,138,4,0.4)",
              color: "#FDE047",
              fontSize: 12,
              fontWeight: 500,
              padding: "5px 16px",
              borderRadius: 20,
              position: "relative",
            }}
          >
            🏆 Team CodeHarvest · TechForGood 2026 · IEEE MIT-ADT
          </div>
        </header>

        {/* ── Back button (when not on form) ── */}
        {view !== "form" && (
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              marginBottom: 16,
              background: C.white,
              border: `1.5px solid ${C.greenMid}`,
              borderRadius: 10,
              color: C.greenMain,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Analyze New Soil
          </button>
        )}

        {/* ── Views ── */}
        {view === "form" && <SoilForm onResult={onResult} />}
        {view === "dashboard" && result && (
          <Dashboard data={result} onChat={() => setView("chat")} />
        )}
        {view === "chat" && (
          <Chatbot soilData={result} onBack={() => setView("dashboard")} />
        )}

        {/* ── Footer ── */}
        <footer
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: 12,
            color: C.gray400,
            lineHeight: 1.8,
          }}
        >
          <strong style={{ color: C.greenMain }}>KisanSaathi</strong> · Powered
          by Google Gemini AI
          <br />
          Team CodeHarvest · TechForGood 2026 · IEEE Student Branch · MIT-ADT
          University
        </footer>
      </div>
    </>
  );
}
