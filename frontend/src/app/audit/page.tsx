"use client";

import { useState } from 'react';
import AuditForm from '../../components/ui/Auditform';
import AuditResults from '../../components/AuditResults';
import { pricingData } from '../../lib/pricingData';
import { axiosInstance } from '../../lib/axios';
import type { AuditInput, AuditResult, ToolEntry, Recommendation, ToolName } from '../../lib/types';

const TOOL_LABELS: Record<ToolName, string> = {
  cursor: 'Cursor',
  copilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
  'anthropic-api': 'Anthropic API',
  'openai-api': 'OpenAI API',
};

function createAuditResult(input: AuditInput): AuditResult {
  const breakdown = input.tools.map((tool): ToolEntry => {
    const pricing = pricingData[tool.tool];
    const planInfo = pricing?.plans.find(p => p.name === tool.plan);
    const catalogMonthly = planInfo ? planInfo.pricePerSeat * tool.seats : null;
    const delta = catalogMonthly != null ? Math.max(0, tool.monthlySpend - catalogMonthly) : null;

    return {
      ...tool,
      displayName: TOOL_LABELS[tool.tool] ?? tool.tool,
      catalogMonthly,
      delta,
    };
  });

  const totalMonthlySpend = breakdown.reduce((sum, tool) => sum + tool.monthlySpend, 0);
  const totalPotentialMonthlySavings = breakdown.reduce((sum, tool) => {
    if (!tool.delta || tool.delta <= 0) return sum;
    return sum + Math.round(Math.min(tool.delta, tool.delta * 0.6));
  }, 0);

  const recommendations: Recommendation[] = breakdown.map(tool => {
    const hasSavings = tool.delta != null && tool.delta > 0;
    const monthlySavings = hasSavings ? Math.round(Math.min(tool.delta!, tool.delta! * 0.6)) : 0;

    return {
      tool: tool.tool,
      type: hasSavings ? 'downgrade_plan' : 'optimal',
      displayName: tool.displayName,
      monthlySavings,
      message: hasSavings
        ? `Right-size ${tool.displayName} to ${tool.plan} for ${tool.seats} seat${tool.seats !== 1 ? 's' : ''}, and capture about $${monthlySavings}/mo in savings.`
        : `Your ${tool.displayName} spend is aligned with its current plan and team size. Great job.`,
    };
  });

  return {
    totalMonthlySpend,
    totalPotentialMonthlySavings,
    totalPotentialAnnualSavings: totalPotentialMonthlySavings * 12,
    savingsPercentage: totalMonthlySpend > 0 ? Math.round((totalPotentialMonthlySavings / totalMonthlySpend) * 100) : 0,
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
    breakdown,
    recommendations,
  };
}

export default function AuditPage() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(input: AuditInput) {
    setLoading(true);
    try {
      const preview = createAuditResult(input);
      // persist to backend
      const resp = await axiosInstance.post('/audit', input);
      const id = resp?.data?.id;
      setResult({ ...(preview as AuditResult), id } as AuditResult & { id?: string });
    } catch (err) {
      console.error('Audit submit failed', err);
      setResult(createAuditResult(input));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '36px 24px 72px' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 999, padding: '8px 16px', color: '#cbd5e1', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            <span>SpendLens</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#38bdf8' }} />
            <span>AI Spend Audit · Step 1 of 2</span>
          </div>
          <div style={{ color: '#fff' }}>
            <h1 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 800, margin: 0, letterSpacing: '-0.04em', textShadow: '0 0 24px rgba(56,189,248,0.35), 0 0 48px rgba(255,255,255,0.15)' }}>
              Tell us about your AI stack
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(226,232,240,0.95)', maxWidth: 720, lineHeight: 1.7, marginTop: 16, textShadow: '0 0 12px rgba(0,0,0,0.12)' }}>
              Add every AI tool your team pays for. We'll show you where you can save.
            </p>
            <div style={{ marginTop: 18, padding: '12px 18px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.28)', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 10, color: '#e0f2fe', boxShadow: '0 0 40px rgba(56,189,248,0.18)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9 }}>We will audit your stack</span>
              <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.25)' }} />
            </div>
          </div>
        </div>

        {result ? (
          <AuditResults result={result} onReset={() => setResult(null)} />
        ) : (
          <>
            <AuditForm onSubmit={handleSubmit} />
            {loading && <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 12 }}>Submitting audit…</div>}
          </>
        )}
      </div>
    </div>
  );
}
