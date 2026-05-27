'use client';

import { useState, useEffect, useRef } from "react";
import { Star, ChevronDown, BarChart3, BookOpen, Users, Rocket, Check, Zap } from "lucide-react";
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

export default function SpendLensPage() {
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
      <div className="hero-bg min-h-screen text-white relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0">
          <StarParticles />
        </div>

        <div className="max-w-[1280px] mx-auto relative z-[1]">
          {/* NAVIGATION */}
          <nav className="animate-fade-in-up [animation-delay:0.1s] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={18} fill="white" color="white" />
              <span className="text-[17px] font-bold tracking-tight">SpendLens</span>
            </div>

            <div className="flex items-center gap-8">
              {[["Solutions", true], ["For Teams", true], ["About Us", false], ["Learn Hub", false]].map(([label, hasArrow]) => (
                <button key={label as string} className="text-sm text-white/70 bg-transparent border-none">
                  {label}
                  {hasArrow && <ChevronDown size={14} />}
                </button>
              ))}
            </div>

            <div className="flex items-center">
              <Link href="/audit" className="bg-white text-black px-5 py-2.5 rounded-full text-[13px] font-semibold border-none cursor-pointer">
                Start audit
              </Link>
            </div>
          </nav>

          {/* HERO SECTION */}
          <section className="px-6 pt-10 pb-[60px] flex flex-col items-center text-center">
            <div className="animate-fade-in-up [animation-delay:0.2s] inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
              <div className="w-6 h-6 border border-white/30 rounded-md flex items-center justify-center">
                <Star size={12} fill="white" color="white" />
              </div>
            </div>

            <div className="relative w-full max-w-[900px] mb-7">
              <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 flex flex-col gap-6 items-center pointer-events-none">
                <div className="float-2 -translate-x-2.5">
                  <div className="w-[70px] h-[18px] rounded-[50%] shadow-[0_4px_12px_rgba(197,151,58,0.5)]" style={{ background: "linear-gradient(180deg, #f5d77a 0%, #c9973a 40%, #f5d77a 60%, #a07020 100%)" }} />
                </div>
                <div className="float-3">
                  <div className="w-[52px] h-[52px] bg-gradient-to-br from-cyan-300 to-cyan-600" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                </div>
              </div>

              <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 flex flex-col gap-7 items-center pointer-events-none">
                <div className="float-1">
                  <div className="w-[90px] h-5 rounded-[50%]" style={{ background: "linear-gradient(180deg, #6ee7b7 0%, #059669 40%, #6ee7b7 60%, #047857 100%)" }} />
                </div>
                <div className="orb-pulse">
                  <div className="w-[220px] h-[220px] rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #c084fc, #7c3aed 40%, #4c1d95 80%, #1e0a4a)" }} />
                </div>
                <div className="float-2">
                  <div className="w-[58px] h-12 bg-gradient-to-br from-pink-300 to-pink-600 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]" />
                </div>
              </div>

              <div className="animate-fade-in-up [animation-delay:0.3s]">
                <h1 className="text-[clamp(48px,7vw,80px)] font-normal leading-[1.08] tracking-[-0.03em] mb-0">
                  <span className="text-white">SpendLens</span>
                </h1>
              </div>
            </div>

            <p className="animate-fade-in-up [animation-delay:0.4s] text-lg text-white/55 max-w-[540px] leading-relaxed mb-8">
              Audit your AI tool spend, compare plan costs, and identify overlap in minutes.
            </p>

            <Link href="/audit" className="animate-fade-in-up [animation-delay:0.5s] bg-green-500 text-white px-9 py-3.5 rounded-full text-[15px] font-semibold border-none cursor-pointer mb-10 shadow-[0_4px_24px_rgba(34,197,94,0.4)] no-underline inline-block">
              Start audit
            </Link>

            {/* Tab Bar */}
            <div className="animate-fade-in-up [animation-delay:0.6s] mb-8 bg-white/7 rounded-[10px] p-1 border border-white/8 inline-flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-medium border-none cursor-pointer transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-white text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                        : "bg-transparent text-gray-500 hover:text-black"
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Video Container */}
            <div className="animate-fade-in-up [animation-delay:0.7s] w-full max-w-[900px] relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] bg-[#111]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
              />
              {renderOverlay()}
            </div>

            {/* Metrics */}
            <div className="animate-fade-in-up [animation-delay:0.75s] flex gap-12 mt-9 justify-center flex-wrap">
              {[["$847/mo", "Avg savings found"], ["8+", "Tools covered"], ["60s", "Time to audit"]].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-[28px] font-bold text-white">{val}</div>
                  <div className="text-xs text-white/50">{label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
