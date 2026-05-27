import { Check, Zap } from "lucide-react";

const AnalyseOverlay = () => (
  <div className="animate-fade-in-overlay absolute inset-0 bg-black/55 flex items-center justify-center">
    <div className="animate-slide-up-overlay bg-[rgba(15,15,25,0.92)] border border-white/10 rounded-2xl p-6 w-80 max-w-[90%] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-400 flex items-center justify-center">
          <Zap size={16} color="white" />
        </div>
        <div>
          <div className="text-white font-semibold text-sm">Set Up Your AI Workspace</div>
          <div className="text-white/50 text-[11px]">Step 1 of 4</div>
        </div>
      </div>
      <div className="bg-white/8 rounded-md h-1.5 mb-4 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-purple-400 w-1/4 h-full" />
      </div>
      {["Connect data sources", "Configure AI models", "Set analysis parameters", "Run initial scan"].map((step, i) => (
        <div key={i} className={`flex items-center gap-2.5 py-2 ${i < 3 ? "border-b border-white/5" : ""}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? "bg-gradient-to-br from-violet-600 to-purple-400" : "bg-white/10"}`}>
            {i === 0 ? <Check size={11} color="white" /> : <span className="text-white/30 text-[10px]">{i + 1}</span>}
          </div>
          <span className={`text-[13px] ${i === 0 ? "text-white" : "text-white/40"}`}>{step}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AnalyseOverlay;