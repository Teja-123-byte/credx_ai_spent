'use client';

import { ChangeEvent } from 'react';
import { ToolEntry, ToolName } from '../../lib/types';
import { pricingData } from '../../lib/pricingData';
import { X } from 'lucide-react';

const ALL_TOOLS = Object.keys(pricingData) as ToolName[];

const TOOL_DISPLAY: Record<ToolName, string> = {
  cursor: 'Cursor',
  copilot: 'GitHub Copilot',
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT (OpenAI)',
  'anthropic-api': 'Anthropic API',
  'openai-api': 'OpenAI API',
  gemini: 'Google Gemini',
  windsurf: 'Windsurf',
};

interface Props {
  index: number;
  value: ToolEntry;
  usedTools: ToolName[];
  onChange: (update: Partial<ToolEntry>) => void;
  onRemove: () => void;
}

export default function ToolInput({ index, value, usedTools, onChange, onRemove }: Props) {
  const toolData = pricingData[value.tool];
  const plans = toolData?.plans ?? [];

  const handleToolChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const tool = e.target.value as ToolName;
    const firstPlan = pricingData[tool]?.plans[0];
    onChange({ tool, plan: firstPlan?.name ?? '', monthlySpend: firstPlan?.pricePerSeat ?? 0 });
  };

  const handlePlanChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const plan = e.target.value;
    const planInfo = toolData?.plans.find(p => p.name === plan);
    onChange({ plan, monthlySpend: (planInfo?.pricePerSeat ?? 0) * value.seats });
  };

  return (
    <div className="grid grid-cols-[180px_1fr_130px_90px_40px] gap-3 items-center bg-white/4 border border-slate-400/16 rounded-[20px] px-[22px] py-[18px] transition-[border-color,transform] duration-150">
      {/* Tool */}
      <select value={value.tool} onChange={handleToolChange} className="w-full px-3.5 py-3 bg-[#07111f] border border-slate-400/22 rounded-[14px] text-[13px] text-slate-200 outline-none cursor-pointer">
        {ALL_TOOLS.map(t => (
          <option key={t} value={t} disabled={usedTools.includes(t) && t !== value.tool}>
            {TOOL_DISPLAY[t]}
          </option>
        ))}
      </select>

      {/* Plan */}
      <select value={value.plan} onChange={handlePlanChange} className="w-full px-3.5 py-3 bg-[#07111f] border border-slate-400/22 rounded-[14px] text-[13px] text-slate-200 outline-none cursor-pointer">
        {plans.map(p => (
          <option key={p.name} value={p.name}>
            {p.name}{p.pricePerSeat != null && p.pricePerSeat > 0 ? ` — $${p.pricePerSeat}/seat` : p.pricePerSeat === 0 ? ' — Free' : ' — Usage-based'}
          </option>
        ))}
      </select>

      {/* Monthly Spend */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
        <input
          type="number" min={0}
          value={value.monthlySpend}
          onChange={e => onChange({ monthlySpend: Number(e.target.value) })}
          className="w-full pl-6 pr-3.5 py-3 bg-[#07111f] border border-slate-400/22 rounded-[14px] text-sm text-slate-200 outline-none"
        />
      </div>

      {/* Seats */}
      <input
        type="number" min={1}
        value={value.seats}
        onChange={e => {
          const seats = Number(e.target.value);
          const planInfo = toolData?.plans.find(p => p.name === value.plan);
          const spend = planInfo?.pricePerSeat ? planInfo.pricePerSeat * seats : value.monthlySpend;
          onChange({ seats, monthlySpend: spend });
        }}
        className="w-full px-3.5 py-3 bg-[#07111f] border border-slate-400/22 rounded-[14px] text-sm text-slate-200 outline-none"
      />

      {/* Remove */}
      <button
        onClick={onRemove}
        className="w-9 h-9 rounded-lg border-none bg-red-500/10 text-red-400 cursor-pointer flex items-center justify-center transition-colors duration-150"
      >
        <X size={15} />
      </button>
    </div>
  );
}
