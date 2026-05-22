'use client';

import { useState, useEffect, useRef } from "react";
import { Star, ChevronDown, BarChart3, BookOpen, Users, Rocket, Check, Zap } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #ffffff; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInDialog {
    from { opacity: 0; transform: translate(-50%, -45%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }
  @keyframes float1 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-18px) rotate(5deg); }
    66% { transform: translateY(-8px) rotate(-3deg); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-22px) rotate(-8deg); }
  }
  @keyframes float3 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    40% { transform: translateY(-14px) rotate(12deg); }
    80% { transform: translateY(-6px) rotate(-5deg); }
  }
  @keyframes orbPulse {
    0%, 100% { filter: brightness(1) saturate(1.2); transform: scale(1); }
    50% { filter: brightness(1.15) saturate(1.5); transform: scale(1.03); }
  }
  @keyframes starTwinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }

  .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-fade-in-overlay { animation: fadeInOverlay 0.4s ease-out forwards; }
  .animate-slide-up-overlay { animation: fadeInDialog 0.5s ease-out forwards; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
  .float-1 { animation: float1 6s ease-in-out infinite; }
  .float-2 { animation: float2 8s ease-in-out infinite 1s; }
  .float-3 { animation: float3 7s ease-in-out infinite 2s; }
  .orb-pulse { animation: orbPulse 4s ease-in-out infinite; }
  .gradient-heading {
    background: linear-gradient(135deg, #000 0%, #555 50%, #888 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .star-particle {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: white;
    animation: starTwinkle var(--dur, 3s) ease-in-out infinite var(--delay, 0s);
  }
  .tab-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .tab-btn.active {
    background: white;
    color: black;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  }
  .tab-btn.inactive {
    background: transparent;
    color: #6b7280;
  }
  .tab-btn.inactive:hover { color: black; }

  .hero-bg {
    background: radial-gradient(ellipse 80% 60% at 70% 40%, rgba(124,58,237,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 30% 80%, rgba(5,150,105,0.05) 0%, transparent 50%),
                #0a0a0f;
  }
  .video-container {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    height: 400px;
    background: #111;
  }
  @media (min-width: 768px) {
    .video-container { height: 500px; }
  }
`;

const StarParticles = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    dur: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() > 0.7 ? 4 : 2,
  }));
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="star-particle"
          style={{
            top: p.top,
            left: p.left,
            "--dur": p.dur,
            "--delay": p.delay,
            width: p.size,
            height: p.size,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
};

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

const tabs = [
  { id: "analyse", label: "Analyse", icon: BarChart3 },
  { id: "train", label: "Train", icon: BookOpen },
  { id: "testing", label: "Testing", icon: Users },
  { id: "deploy", label: "Deploy", icon: Rocket },
];

export default function AISpendAudit() {
  const [activeTab, setActiveTab] = useState("analyse");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCycle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveTab(prev => {
        const idx = tabs.findIndex(t => t.id === prev);
        return tabs[(idx + 1) % tabs.length].id;
      });
    }, 4000);
  };

  useEffect(() => {
    startCycle();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    startCycle();
  };

  const renderOverlay = () => {
    switch (activeTab) {
      case "analyse": return <AnalyseOverlay key="analyse" />;
      case "train": return <TrainOverlay key="train" />;
      case "testing": return <TestingOverlay key="testing" />;
      case "deploy": return <DeployOverlay key="deploy" />;
      default: return null;
    }
  };

  return (
    <>
      <style jsx global>{styles}</style>
      <div className="hero-bg" style={{ minHeight: "100vh", color: "white", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <StarParticles />
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* NAVIGATION */}
          <nav className="animate-fade-in-up" style={{ animationDelay: "0.1s", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Star size={18} fill="white" color="white" />
              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>AISpendAudit</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {[["Solutions", true], ["For Teams", true], ["About Us", false], ["Learn Hub", false]].map(([label, hasArrow]) => (
                <button key={label as string} className="nav-link" style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", background: "none", border: "none" }}>
                  {label}
                  {hasArrow && <ChevronDown size={14} />}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button className="nav-link">Login</button>
              <button style={{ background: "white", color: "black", padding: "9px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Start Free Audit
              </button>
            </div>
          </nav>

          {/* HERO SECTION */}
          <section style={{ padding: "40px 24px 60px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32, padding: "6px 14px", borderRadius: 50, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}>
              <div style={{ width: 24, height: 24, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Star size={12} fill="white" color="white" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>4.9 rating from 18.3K+ users</span>
            </div>

            <div style={{ position: "relative", width: "100%", maxWidth: 900, marginBottom: 28 }}>
              <div style={{ position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 24, alignItems: "center", pointerEvents: "none" }}>
                <div className="float-2" style={{ transform: "translateX(-10px)" }}><div className="coin-gold" style={{ width: "70px", height: "18px", background: "linear-gradient(180deg, #f5d77a 0%, #c9973a 40%, #f5d77a 60%, #a07020 100%)", borderRadius: "50%", boxShadow: "0 4px 12px rgba(197,151,58,0.5)" }} /></div>
                <div className="float-3"><div className="shape-cyan" style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #67e8f9, #0891b2)", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} /></div>
              </div>

              <div style={{ position: "absolute", right: -30, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 28, alignItems: "center", pointerEvents: "none" }}>
                <div className="float-1"><div className="coin-green" style={{ width: "90px", height: "20px", background: "linear-gradient(180deg, #6ee7b7 0%, #059669 40%, #6ee7b7 60%, #047857 100%)", borderRadius: "50%" }} /></div>
                <div className="orb-pulse"><div className="orb-main" style={{ width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #c084fc, #7c3aed 40%, #4c1d95 80%, #1e0a4a)" }} /></div>
                <div className="float-2"><div className="shape-pink" style={{ width: "58px", height: "48px", background: "linear-gradient(135deg, #f9a8d4, #db2777)", borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }} /></div>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <h1 style={{ fontSize: "clamp(48px,7vw,80px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 0 }}>
                  <span style={{ color: "white" }}>Work Smarter. Move Faster.</span>
                  <br />
                  <span className="gradient-heading">AI Powers You Up.</span>
                </h1>
              </div>
            </div>

            <p className="animate-fade-in-up" style={{ animationDelay: "0.4s", fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 540, lineHeight: 1.6, marginBottom: 32 }}>
              Intelligent automation syncs with the tools you love to streamline tasks, boost output, and save time.
            </p>

            <button className="animate-fade-in-up" style={{ animationDelay: "0.5s", background: "#22c55e", color: "white", padding: "14px 36px", borderRadius: 50, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 40, boxShadow: "0 4px 24px rgba(34,197,94,0.4)" }}>
              Begin Free Trial
            </button>

            {/* Tab Bar */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.6s", marginBottom: 32, background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: 4, border: "1px solid rgba(255,255,255,0.08)", display: "inline-flex" }}>
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`tab-btn ${isActive ? "active" : "inactive"}`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Video Container */}
            <div className="animate-fade-in-up video-container" style={{ animationDelay: "0.7s", width: "100%", maxWidth: 900 }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
              />
              {renderOverlay()}
            </div>

            {/* Metrics */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.75s", display: "flex", gap: 48, marginTop: 36, justifyContent: "center", flexWrap: "wrap" }}>
              {[["$847/mo", "Avg savings found"], ["8+", "Tools covered"], ["60s", "Time to audit"]].map(([val, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: "white" }}>{val}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}