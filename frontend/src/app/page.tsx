'use client';

import "./globals.css";
import { useState, useEffect, useRef } from "react";
import { Star, ChevronDown, BarChart3, BookOpen, Users, Rocket, Check, Zap } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import Link from "next/link"

import AnalyseOverlay from "../components/overlays/AnalyseOverlay";
import DeployOverlay from "../components/overlays/DeployOverlay";
import StarParticles from "../components/overlays/StarParticles";
import TestingOverlay from "../components/overlays/TestingOverlay";
import TrainOverlay from "../components/overlays/TrainOverlay";


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
    ;(async ()=> {
      const result = await axiosInstance.get('/test');
      console.log(result.data)
    })();


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

            <div style={{ display: "flex", alignItems: "center"}}>
              <Link href="/audit" style={{ background: "white", color: "black", padding: "9px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Start Free Audit
              </Link>
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