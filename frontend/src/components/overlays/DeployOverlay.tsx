import { Check, Rocket } from "lucide-react";

const DeployOverlay = () => (
  <div className="animate-fade-in-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div className="animate-slide-up-overlay overlay-card" style={{ background: "rgba(15, 15, 25, 0.92)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", width: "320px", maxWidth: "90%", backdropFilter: "blur(20px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0891b2,#67e8f9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Rocket size={16} color="white" />
        </div>
        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>Deploy to Production</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Ready to ship</div>
        </div>
      </div>
      {["Build passed ✓", "Tests passed ✓", "Security scan ✓", "Staging verified ✓"].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(52,211,153,0.2)", border: "1px solid #34d399", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Check size={10} color="#34d399" />
          </div>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{item}</span>
        </div>
      ))}
      <button style={{ marginTop: 16, width: "100%", padding: "10px", borderRadius: 8, background: "linear-gradient(135deg,#0891b2,#0e7490)", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
        Deploy Now →
      </button>
    </div>
  </div>
);

export default DeployOverlay;