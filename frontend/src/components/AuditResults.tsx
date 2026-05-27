'use client';

import { useState, useEffect } from 'react';
import { TrendingDown, Download, Share2, Mail, ExternalLink, CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react';
import { AuditResult } from '../lib/types';

interface Props {
  result: AuditResult;
  onReset: () => void;
}

function SeverityBadge({ type }: { type: string }) {
  const map: Record<string, { bg: string; color: string; label: string; icon: JSX.Element }> = {
    downgrade_plan: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'Downgrade', icon: <TrendingDown size={11} /> },
    excess_seats:   { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', label: 'Excess Seats', icon: <AlertTriangle size={11} /> },
    tool_overlap:   { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', label: 'Overlap', icon: <AlertTriangle size={11} /> },
    annual_billing: { bg: 'rgba(56,189,248,0.15)', color: '#38bdf8', label: 'Tip', icon: <Info size={11} /> },
    optimal:        { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', label: 'Optimized', icon: <CheckCircle size={11} /> },
  };
  const s = map[type] || map.optimal;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    }}>
      {s.icon} {s.label}
    </span>
  );
}

export default function AuditResults({ result, onReset }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(true);

  const {
    totalMonthlySpend,
    totalPotentialMonthlySavings,
    totalPotentialAnnualSavings,
    savingsPercentage,
    breakdown,
    recommendations,
    teamSize,
    primaryUseCase,
  } = result;

  const highSavings = totalPotentialMonthlySavings > 500;
  const alreadyOptimal = totalPotentialMonthlySavings < 50;

  useEffect(() => {
    generateSummary();
  }, []);

  async function generateSummary() {
    setLoadingSummary(true);
    const toolList = breakdown.map(b => `${b.displayName ?? b.tool} (${b.plan}, ${b.seats} seat${b.seats !== 1 ? 's' : ''}, $${b.monthlySpend}/mo)`).join(', ');
    const prompt = `You are a financial advisor specializing in AI tool spend optimization. A startup team of ${teamSize} uses AI primarily for ${primaryUseCase}. Their tools: ${toolList}. Total spend: $${totalMonthlySpend}/mo. Potential monthly savings identified: $${totalPotentialMonthlySavings}. Write a crisp 80–100 word personalized summary of their AI spend situation, key risks, and top recommendation. Be direct and specific. Plain paragraph only, no bullets or headers.`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text;
      setAiSummary(text || fallback());
    } catch {
      setAiSummary(fallback());
    } finally {
      setLoadingSummary(false);
    }
  }

  function fallback() {
    const top = [...breakdown].sort((a, b) => b.monthlySpend - a.monthlySpend)[0];
    return totalPotentialMonthlySavings > 0
      ? `Your team of ${teamSize} is spending $${totalMonthlySpend}/mo across ${breakdown.length} AI tools for ${primaryUseCase} work. We identified $${totalPotentialMonthlySavings}/mo ($${totalPotentialAnnualSavings}/yr) in potential savings — primarily through plan right-sizing and seat optimization. Your highest spend is on ${top?.displayName ?? top?.tool}, which represents the largest opportunity for immediate action.`
      : `Your team of ${teamSize} appears well-optimized across ${breakdown.length} AI tools, spending $${totalMonthlySpend}/mo on ${primaryUseCase} work. No significant inefficiencies were detected. Continue monitoring as vendor pricing evolves — we'll alert you when new optimization opportunities arise for your stack.`;
  }

  function exportReport() {
    const rows = breakdown.map(b => {
      const rec = recommendations.find(r => r.tool === b.tool);
      return `<tr style="border-bottom:1px solid #1e2a3a">
        <td style="padding:12px 16px;color:#f1f5f9;font-weight:600">${b.displayName ?? b.tool}</td>
        <td style="padding:12px 16px;color:#94a3b8">${b.plan} × ${b.seats}</td>
        <td style="padding:12px 16px;color:#f1f5f9;font-weight:700">$${b.monthlySpend}/mo</td>
        <td style="padding:12px 16px;color:${rec && rec.monthlySavings > 0 ? '#4ade80' : '#94a3b8'};font-weight:${rec && rec.monthlySavings > 0 ? '700' : '400'}">
          ${rec && rec.monthlySavings > 0 ? `Save $${rec.monthlySavings}/mo` : '✓ Optimized'}
        </td>
        <td style="padding:12px 16px;color:#64748b;font-size:13px">${rec ? rec.message : 'Spending looks appropriate.'}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SpendLens AI Audit Report</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#0a0f1e;color:#f1f5f9}</style>
    </head><body>
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:48px;border-bottom:1px solid #1e2a3a">
      <div style="font-size:26px;font-weight:900;letter-spacing:-1px;margin-bottom:6px">Spend<span style="color:#38bdf8">Lens</span></div>
      <div style="color:#64748b;font-size:14px">AI Spend Audit Report · ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <div style="display:flex;gap:0;border-bottom:1px solid #1e2a3a">
      ${[
        ['Current Monthly', `$${totalMonthlySpend}`,'#f1f5f9'],
        ['Monthly Savings', `$${totalPotentialMonthlySavings}`,'#4ade80'],
        ['Annual Savings', `$${totalPotentialAnnualSavings}`,'#4ade80'],
        ['Tools Audited', String(breakdown.length),'#38bdf8'],
      ].map(([l,v,c]) => `<div style="flex:1;padding:28px 32px;border-right:1px solid #1e2a3a">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#475569;margin-bottom:6px">${l}</div>
        <div style="font-size:32px;font-weight:900;color:${c}">${v}</div>
      </div>`).join('')}
    </div>
    <div style="padding:32px 48px">
      <div style="font-size:18px;font-weight:700;margin-bottom:16px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-size:12px">Per-Tool Breakdown</div>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:#0f172a">
          <th style="padding:10px 16px;text-align:left;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:.5px">Tool</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:.5px">Plan</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:.5px">Cost</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:.5px">Opportunity</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:.5px">Detail</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${highSavings ? `<div style="margin:0 48px 32px;background:linear-gradient(135deg,#0f172a,#1e3a5f);border:1px solid #1e3a5f;border-radius:16px;padding:32px">
      <div style="font-size:20px;font-weight:800;margin-bottom:8px">💡 Unlock more with Credex</div>
      <p style="color:#64748b;font-size:14px;line-height:1.7">Your audit shows $${totalPotentialMonthlySavings}/mo in savings. Credex provides discounted AI infrastructure credits — same tools, 15–30% less. Book a free consultation at <strong style="color:#38bdf8">credex.rocks</strong></p>
    </div>` : ''}
    <div style="padding:24px 48px;border-top:1px solid #1e2a3a;font-size:12px;color:#334155">
      Generated by SpendLens · Powered by Credex · credex.rocks
    </div></body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `SpendLens-Audit-${Date.now()}.html`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,58,95,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20,
        padding: '40px 44px', marginBottom: 24
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>
          Audit Complete
        </div>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 24 }}>
          {[
            { label: 'Current Monthly', value: `$${totalMonthlySpend}`, color: '#f1f5f9' },
            { label: 'Monthly Savings Found', value: `$${totalPotentialMonthlySavings}`, color: totalPotentialMonthlySavings > 0 ? '#4ade80' : '#94a3b8' },
            { label: 'Annual Potential', value: `$${totalPotentialAnnualSavings}`, color: totalPotentialMonthlySavings > 0 ? '#4ade80' : '#94a3b8' },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: i > 0 ? 40 : 0 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: -2, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        {alreadyOptimal && (
          <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, padding: '12px 16px', color: '#4ade80', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} /> Your stack looks well-optimized. Great work.
          </div>
        )}
      </div>

      {/* AI Summary */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ background: 'linear-gradient(135deg,#38bdf8,#818cf8)', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
            AI SUMMARY
          </div>
          <Zap size={14} style={{ color: '#818cf8' }} />
        </div>
        {loadingSummary ? (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontStyle: 'italic' }}>
            Generating personalized analysis...
          </div>
        ) : (
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.7)' }}>{aiSummary}</p>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: -0.5, marginBottom: 14 }}>
            Recommendations ({recommendations.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recommendations.map((r, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${r.type === 'tool_overlap' || r.type === 'excess_seats' ? 'rgba(239,68,68,0.2)' : r.type === 'downgrade_plan' ? 'rgba(251,191,36,0.2)' : 'rgba(56,189,248,0.15)'}`,
                borderLeft: `3px solid ${r.type === 'tool_overlap' || r.type === 'excess_seats' ? '#f87171' : r.type === 'downgrade_plan' ? '#fbbf24' : '#38bdf8'}`,
                borderRadius: 12, padding: '18px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <SeverityBadge type={r.type} />
                    {r.displayName && <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{r.displayName}</span>}
                  </div>
                  {r.monthlySavings > 0 && (
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', whiteSpace: 'nowrap' }}>
                      Save ${r.monthlySavings}/mo
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{r.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-tool breakdown */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: -0.5, marginBottom: 14 }}>
          Tool Breakdown
        </h2>
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, overflow: 'hidden'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Tool', 'Plan / Seats', 'Monthly', 'Catalog'].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{h}</div>
            ))}
          </div>
          {breakdown.map((b, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px',
              padding: '14px 20px',
              borderBottom: i < breakdown.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
            }}>
              <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{b.displayName ?? b.tool}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{b.plan} × {b.seats}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>${b.monthlySpend}/mo</div>
              <div style={{ fontSize: 13, color: b.delta != null && b.delta > 5 ? '#fbbf24' : 'rgba(255,255,255,0.35)' }}>
                {b.catalogMonthly != null ? `$${b.catalogMonthly}/mo` : 'Usage-based'}
                {b.delta != null && b.delta > 5 && <span style={{ fontSize: 11, marginLeft: 4, color: '#fbbf24' }}>↑${b.delta} over</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credex CTA */}
      {highSavings && (
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          border: '1px solid rgba(56,189,248,0.2)', borderRadius: 20,
          padding: '36px 40px', marginBottom: 24
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#38bdf8', marginBottom: 16 }}>
            HIGH SAVINGS DETECTED
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5, marginBottom: 10 }}>
            You're leaving ${totalPotentialMonthlySavings}/mo on the table
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
            Credex sources discounted AI credits from companies that overforecast their usage — same Cursor, Claude, and ChatGPT tools, 15–30% less. Book a free 20-minute consultation.
          </p>
          <a
            href="https://credex.rocks" target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#38bdf8', color: '#0f172a', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}
          >
            Book Free Credex Consultation <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Email capture */}
      {!submitted ? (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 32px', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            <Mail size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
            {alreadyOptimal ? 'Get notified when new savings apply to your stack' : 'Get this report in your inbox'}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 18 }}>
            {alreadyOptimal ? 'AI pricing changes frequently. We\'ll alert you when a better option appears.' : 'Full PDF breakdown, plus a personal note for high-savings cases.'}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="email" placeholder="you@company.com" value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, padding: '11px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none' }}
            />
            <button
              onClick={() => email && setSubmitted(true)}
              style={{ background: '#fff', color: '#0f172a', border: 'none', borderRadius: 10, padding: '11px 22px', fontWeight: 800, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Send →
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 16, padding: '20px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#4ade80', fontWeight: 600 }}>
          <CheckCircle size={18} /> Report sent to {email}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={exportReport}
          style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Download size={16} /> Export Report
        </button>
        <button
          onClick={onReset}
          style={{ flex: 1, padding: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          ← New Audit
        </button>
      </div>
    </div>
  );
}
