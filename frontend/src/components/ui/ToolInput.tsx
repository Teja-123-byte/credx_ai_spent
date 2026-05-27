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
    <div style={{
      display: 'grid', gridTemplateColumns: '180px 1fr 130px 90px 40px',
      gap: 12, alignItems: 'center',
      background: '#ffffff', border: '1px solid #e2e8f0',
      borderRadius: 18, padding: '16px 20px',
      transition: 'border-color 0.15s'
    }}>
      {/* Tool */}
      <select value={value.tool} onChange={handleToolChange} style={selectStyle}>
        {ALL_TOOLS.map(t => (
          <option key={t} value={t} disabled={usedTools.includes(t) && t !== value.tool}>
            {TOOL_DISPLAY[t]}
          </option>
        ))}
      </select>

      {/* Plan */}
      <select value={value.plan} onChange={handlePlanChange} style={selectStyle}>
        {plans.map(p => (
          <option key={p.name} value={p.name}>
            {p.name}{p.pricePerSeat != null && p.pricePerSeat > 0 ? ` — $${p.pricePerSeat}/seat` : p.pricePerSeat === 0 ? ' — Free' : ' — Usage-based'}
          </option>
        ))}
      </select>

      {/* Monthly Spend */}
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>$</span>
        <input
          type="number" min={0}
          value={value.monthlySpend}
          onChange={e => onChange({ monthlySpend: Number(e.target.value) })}
          style={{ ...inputStyle, paddingLeft: 24 }}
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
        style={inputStyle}
      />

      {/* Remove */}
      <button
        onClick={onRemove}
        style={{
          width: 36, height: 36, borderRadius: 8, border: 'none',
          background: 'rgba(239,68,68,0.1)', color: '#f87171',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s'
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: '#f8fafc', border: '1px solid #d1d5db',
  borderRadius: 12, fontSize: 13, color: '#0f172a', outline: 'none', cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: '#f8fafc', border: '1px solid #d1d5db',
  borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none',
};
