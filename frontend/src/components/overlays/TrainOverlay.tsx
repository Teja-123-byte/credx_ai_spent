const TrainOverlay = () => (
  <div className="animate-fade-in-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div className="animate-slide-up-overlay overlay-card" style={{ background: "rgba(15, 15, 25, 0.92)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", width: "320px", maxWidth: "90%", backdropFilter: "blur(20px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>AI Model Training</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>Epoch 67 / 100</div>
        </div>
        <span style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, border: "1px solid rgba(245,158,11,0.3)" }}>Training</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, height: 6, marginBottom: 16, overflow: "hidden" }}>
        <div className="progress-bar" style={{ background: "linear-gradient(90deg,#d97706,#fbbf24)", width: "67%" }} />
      </div>
      {[["Accuracy", "94.2%", "#fbbf24"], ["Loss", "0.043", "#34d399"], ["Val Accuracy", "91.8%", "#60a5fa"], ["ETA", "4m 32s", "rgba(255,255,255,0.5)"]].map(([k, v, c], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{k}</span>
          <span style={{ color: c, fontSize: 12, fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TrainOverlay;