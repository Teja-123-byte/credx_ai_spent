import { Check, Zap } from "lucide-react";

const AnalyseOverlay = () => (
  <div className="animate-fade-in-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div className="animate-slide-up-overlay overlay-card" style={{ background: "rgba(15, 15, 25, 0.92)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", width: "320px", maxWidth: "90%", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#c084fc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={16} color="white" />
        </div>
        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>Set Up Your AI Workspace</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Step 1 of 4</div>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, height: 6, marginBottom: 16, overflow: "hidden" }}>
        <div className="progress-bar" style={{ background: "linear-gradient(90deg,#7c3aed,#c084fc)", width: "25%" }} />
      </div>
      {["Connect data sources", "Configure AI models", "Set analysis parameters", "Run initial scan"].map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg,#7c3aed,#c084fc)" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {i === 0 ? <Check size={11} color="white" /> : <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>{i + 1}</span>}
          </div>
          <span style={{ color: i === 0 ? "white" : "rgba(255,255,255,0.4)", fontSize: 13 }}>{step}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AnalyseOverlay;