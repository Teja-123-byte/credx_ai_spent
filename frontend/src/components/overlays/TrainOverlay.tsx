const TrainOverlay = () => (
  <div className="animate-fade-in-overlay absolute inset-0 bg-black/55 flex items-center justify-center">
    <div className="animate-slide-up-overlay bg-[rgba(15,15,25,0.92)] border border-white/10 rounded-2xl p-6 w-80 max-w-[90%] backdrop-blur-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-white font-semibold text-sm">AI Model Training</div>
          <div className="text-white/50 text-[11px] mt-0.5">Epoch 67 / 100</div>
        </div>
        <span className="bg-amber-500/20 text-amber-400 text-[11px] font-semibold px-2 py-[3px] rounded-full border border-amber-500/30">Training</span>
      </div>
      <div className="bg-white/8 rounded-md h-1.5 mb-4 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-400 w-[67%] h-full" />
      </div>
      {[["Accuracy", "94.2%", "text-amber-400"], ["Loss", "0.043", "text-emerald-400"], ["Val Accuracy", "91.8%", "text-blue-400"], ["ETA", "4m 32s", "text-white/50"]].map(([k, v, c], i) => (
        <div key={i} className={`flex justify-between py-[7px] ${i < 3 ? "border-b border-white/5" : ""}`}>
          <span className="text-white/50 text-xs">{k}</span>
          <span className={`${c} text-xs font-semibold`}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TrainOverlay;