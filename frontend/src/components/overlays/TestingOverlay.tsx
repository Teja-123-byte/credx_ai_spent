import { Check } from "lucide-react";

const TestingOverlay = () => (
  <div className="animate-fade-in-overlay absolute inset-0 bg-black/55 flex items-center justify-center">
    <div className="animate-slide-up-overlay bg-[rgba(15,15,25,0.92)] border border-white/10 rounded-2xl p-6 w-80 max-w-[90%] backdrop-blur-xl">
      <div className="text-center mb-4">
        <div className="w-[52px] h-[52px] rounded-full bg-emerald-400/15 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3">
          <Check size={24} color="#34d399" />
        </div>
        <div className="text-white font-bold text-[22px]">127 / 127</div>
        <div className="text-emerald-400 text-xs font-semibold">All tests passed</div>
      </div>
      {[["Unit Tests", "84", "84"], ["Integration", "31", "31"], ["E2E", "12", "12"]].map(([label, passed, total], i) => (
        <div key={i} className={`flex justify-between items-center py-2 ${i < 2 ? "border-b border-white/5" : ""}`}>
          <span className="text-white/60 text-xs">{label}</span>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-400/15 rounded h-1 w-20 overflow-hidden">
              <div className="bg-emerald-400 h-full w-full rounded" />
            </div>
            <span className="text-emerald-400 text-[11px] font-semibold">{passed}/{total}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TestingOverlay;