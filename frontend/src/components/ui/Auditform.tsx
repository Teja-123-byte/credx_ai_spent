'use client';

import { useState, useEffect } from 'react';
import { Plus, ArrowRight, Briefcase } from 'lucide-react';
import { ToolName, ToolEntry, AuditInput } from '../../lib/types';
import { pricingData } from '../../lib/pricingData';
import ToolInput from './ToolInput';

const USE_CASES: { value: AuditInput['primaryUseCase']; label: string; emoji: string }[] = [
  { value: 'coding',   label: 'Coding',   emoji: '💻' },
  { value: 'writing',  label: 'Writing',  emoji: '✍️' },
  { value: 'data',     label: 'Data',     emoji: '📊' },
  { value: 'research', label: 'Research', emoji: '🔬' },
  { value: 'mixed',    label: 'Mixed',    emoji: '⚡' },
];

const ALL_TOOLS = Object.keys(pricingData) as ToolName[];

function makeEntry(tool: ToolName): ToolEntry {
  const firstPlan = pricingData[tool].plans[0];
  return { tool, plan: firstPlan.name, monthlySpend: firstPlan.pricePerSeat ?? 0, seats: 1 };
}

interface Props {
  onSubmit: (input: AuditInput) => void;
}

export default function AuditForm({ onSubmit }: Props) {
  const [tools, setTools] = useState<ToolEntry[]>(() => {
    if (typeof window === 'undefined') return [makeEntry('cursor')];
    try {
      const saved = localStorage.getItem('spendlens_tools');
      return saved ? JSON.parse(saved) : [makeEntry('cursor')];
    } catch { return [makeEntry('cursor')]; }
  });
  const [useCase, setUseCase] = useState<AuditInput['primaryUseCase']>(() => {
    if (typeof window === 'undefined') return 'mixed';
    return (localStorage.getItem('spendlens_usecase') as AuditInput['primaryUseCase']) || 'mixed';
  });

  const DEFAULT_TEAM_SIZE = 5;

  useEffect(() => {
    localStorage.setItem('spendlens_tools', JSON.stringify(tools));
    localStorage.setItem('spendlens_usecase', useCase);
  }, [tools, useCase]);

  const addTool = () => {
    const used = new Set(tools.map(t => t.tool));
    const next = ALL_TOOLS.find(t => !used.has(t));
    if (next) setTools(prev => [...prev, makeEntry(next)]);
  };

  const updateTool = (i: number, update: Partial<ToolEntry>) => {
    setTools(prev => prev.map((t, idx) => idx === i ? { ...t, ...update } : t));
  };

  const removeTool = (i: number) => {
    setTools(prev => prev.filter((_, idx) => idx !== i));
  };

  const canSubmit = tools.length > 0 && tools.every(t => t.tool && t.plan);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ tools, teamSize: DEFAULT_TEAM_SIZE, primaryUseCase: useCase });
  };

  return (
    <div className="max-w-[900px] mx-auto px-[42px] pt-11 pb-13 text-slate-200 bg-[#0b1322] border border-slate-400/16 rounded-[32px]">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-sky-400/12 border border-sky-400/28 rounded-full px-4 py-2 text-xs font-bold text-blue-200 uppercase tracking-[1.2px] mb-4">
          Step 1 of 2
        </div>
        <h2 className="text-[clamp(34px,4vw,44px)] font-extrabold mb-3.5 leading-[1.05] text-slate-50">
          Add every AI tool your team pays for.
        </h2>
        <p className="text-[15px] text-slate-300 leading-[1.9] max-w-[660px]">
          We'll audit your AI stack and show you exactly where you can cut waste today.
        </p>
      </div>

      {/* Context Row */}
      <div className="grid grid-cols-1 gap-5 mb-8 bg-white/4 border border-slate-400/18 rounded-3xl p-[26px]">
        <div className="flex flex-col gap-3 w-full">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-[0.6px] mb-2">
            <Briefcase size={12} /> Primary Use Case
          </label>
          <div className="flex flex-wrap gap-2.5 w-full mt-0.5">
            {USE_CASES.map(u => (
              <button
                key={u.value}
                onClick={() => setUseCase(u.value)}
                className={`px-3.5 py-2.5 rounded-[14px] text-[13px] font-bold cursor-pointer transition-all duration-200 ${
                  useCase === u.value
                    ? "border border-sky-400/90 bg-slate-800 text-sky-400"
                    : "border border-slate-400/24 bg-white/4 text-slate-200"
                }`}
              >
                {u.emoji} {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[180px_1fr_130px_90px_40px] gap-3 px-[18px] mb-3">
        {['Tool', 'Plan', 'Monthly Spend', 'Seats', ''].map((h, i) => (
          <div key={i} className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.7px]">{h}</div>
        ))}
      </div>

      {/* Tool Rows */}
      <div className="flex flex-col gap-3.5 mb-5">
        {tools.map((t, i) => (
          <ToolInput
            key={i}
            index={i}
            value={t}
            usedTools={tools.map(t => t.tool)}
            onChange={upd => updateTool(i, upd)}
            onRemove={() => removeTool(i)}
          />
        ))}
      </div>

      {/* Add Tool */}
      {tools.length < ALL_TOOLS.length && (
        <button
          onClick={addTool}
          className="w-full px-[18px] py-3.5 border border-dashed border-slate-400/35 rounded-2xl bg-slate-900 text-slate-300 text-sm font-bold cursor-pointer mb-6 flex items-center justify-center gap-2.5 transition-all duration-200"
        >
          <Plus size={16} /> Add another tool
        </button>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-[17px] border-none rounded-[18px] text-base font-extrabold tracking-[-0.3px] flex items-center justify-center gap-2.5 shadow-none transition-all duration-200 ${
          canSubmit
            ? "bg-sky-400 text-slate-900 cursor-pointer"
            : "bg-slate-400/16 text-slate-400 cursor-not-allowed"
        }`}
      >
        Run My Audit <ArrowRight size={18} />
      </button>
      {!canSubmit && (
        <p className="text-center text-xs text-slate-400 mt-2.5">
          Add at least one tool with a plan selected
        </p>
      )}
    </div>
  );
}
