import { Check, Rocket } from "lucide-react";

const DeployOverlay = () => (
  <div className="animate-fade-in-overlay absolute inset-0 bg-black/55 flex items-center justify-center">
    <div className="animate-slide-up-overlay bg-[rgba(15,15,25,0.92)] border border-white/10 rounded-2xl p-6 w-80 max-w-[90%] backdrop-blur-xl">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-300 flex items-center justify-center">
          <Rocket size={16} color="white" />
        </div>
        <div>
          <div className="text-white font-semibold text-sm">Deploy to Production</div>
          <div className="text-white/50 text-[11px]">Ready to ship</div>
        </div>
      </div>
      {["Build passed ✓", "Tests passed ✓", "Security scan ✓", "Staging verified ✓"].map((item, i) => (
        <div key={i} className={`flex items-center gap-2.5 py-2 ${i < 3 ? "border-b border-white/5" : ""}`}>
          <div className="w-[18px] h-[18px] rounded-full bg-emerald-400/20 border border-emerald-400 flex items-center justify-center shrink-0">
            <Check size={10} color="#34d399" />
          </div>
          <span className="text-white/70 text-[13px]">{item}</span>
        </div>
      ))}
      <button className="mt-4 w-full py-2.5 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-700 text-white text-[13px] font-semibold border-none cursor-pointer">
        Deploy Now →
      </button>
    </div>
  </div>
);

export default DeployOverlay;