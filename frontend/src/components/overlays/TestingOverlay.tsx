import { Check } from "lucide-react";

const TestingOverlay = () => (
  <div className="animate-fade-in-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div className="animate-slide-up-overlay overlay-card" style={{ background: "rgba(15, 15, 25, 0.92)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", width: "320px", maxWidth: "90%", backdropFilter: "blur(20px)" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "2px solid #34d399", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <Check size={24} color="#34d399" />
        </div>
        <div style={{ color: "white", fontWeight: 700, fontSize: 22 }}>127 / 127</div>
        <div style={{ color: "#34d399", fontSize: 12, fontWeight: 600 }}>All tests passed</div>
      </div>
      {[["Unit Tests", "84", "84"], ["Integration", "31", "31"], ["E2E", "12", "12"]].map(([label, passed, total], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{label}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "rgba(52,211,153,0.15)", borderRadius: 4, height: 4, width: 80, overflow: "hidden" }}>
              <div style={{ background: "#34d399", height: "100%", width: "100%", borderRadius: 4 }} />
            </div>
            <span style={{ color: "#34d399", fontSize: 11, fontWeight: 600 }}>{passed}/{total}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TestingOverlay;