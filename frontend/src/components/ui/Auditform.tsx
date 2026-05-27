'use client';

import { useState, useEffect } from 'react';
import { Plus, ArrowRight, Users, Briefcase } from 'lucide-react';
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
  const [teamSize, setTeamSize] = useState<number>(() => {
    if (typeof window === 'undefined') return 5;
    return Number(localStorage.getItem('spendlens_teamsize') || '5');
  });
  const [useCase, setUseCase] = useState<AuditInput['primaryUseCase']>(() => {
    if (typeof window === 'undefined') return 'mixed';
    return (localStorage.getItem('spendlens_usecase') as AuditInput['primaryUseCase']) || 'mixed';
  });

  useEffect(() => {
    localStorage.setItem('spendlens_tools', JSON.stringify(tools));
    localStorage.setItem('spendlens_teamsize', String(teamSize));
    localStorage.setItem('spendlens_usecase', useCase);
  }, [tools, teamSize, useCase]);

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
    onSubmit({ tools, teamSize, primaryUseCase: useCase });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '44px 42px 52px', color: '#0f172a' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 700,
          color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16
        }}>
          Step 1 of 2
        </div>
        <h2 style={{ fontSize: 'clamp(34px, 4vw, 44px)', fontWeight: 800, margin: '0 0 14px', lineHeight: 1.05, color: '#0f172a' }}>
          Add every AI tool your team pays for.
        </h2>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, maxWidth: 660 }}>
          We’ll audit your AI stack and show you exactly where you can cut waste today.
        </p>
      </div>

      {/* Context Row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32,
        background: '#ffffff', border: '1px solid #e2e8f0',
        borderRadius: 24, padding: 26
      }}>
        <div>
          <label style={labelStyle}><Users size={12} /> Team Size</label>
          <input
            type="number" min={1} value={teamSize}
            onChange={e => setTeamSize(Number(e.target.value))}
            style={{ ...inputStyle, background: '#f8fafc', color: '#0f172a', border: '1px solid #d1d5db' }}
            placeholder="e.g. 8"
          />
        </div>
        <div>
          <label style={labelStyle}><Briefcase size={12} /> Primary Use Case</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 2 }}>
            {USE_CASES.map(u => (
              <button
                key={u.value}
                onClick={() => setUseCase(u.value)}
                style={{
                  padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                  border: useCase === u.value ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  background: useCase === u.value ? '#0f172a' : '#ffffff',
                  color: useCase === u.value ? '#ffffff' : '#0f172a',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                {u.emoji} {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '180px 1fr 130px 90px 40px',
        gap: 12, padding: '0 18px', marginBottom: 8
      }}>
        {['Tool', 'Plan', 'Monthly Spend', 'Seats', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.6 }}>{h}</div>
        ))}
      </div>

      {/* Tool Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
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
          style={{
            width: '100%', padding: '14px 18px', border: '1px dashed #cbd5e1',
            borderRadius: 16, background: '#ffffff', color: '#0f172a',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s'
          }}
        >
          <Plus size={16} /> Add another tool
        </button>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          width: '100%', padding: '17px',
          background: canSubmit
            ? '#0f172a'
            : '#e2e8f0',
          color: canSubmit ? '#ffffff' : '#94a3b8',
          border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800,
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          letterSpacing: -0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: canSubmit ? '0 24px 68px rgba(15,23,42,0.16)' : 'none',
          transition: 'all 0.2s'
        }}
      >
        Run My Audit <ArrowRight size={18} />
      </button>
      {!canSubmit && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 10 }}>
          Add at least one tool with a plan selected
        </p>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  fontSize: 11, fontWeight: 700, color: '#475569',
  textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: '#ffffff', border: '1px solid #d1d5db',
  borderRadius: 12, fontSize: 15, color: '#0f172a', outline: 'none'
};
