'use client';

import { useMemo, useState } from 'react';
import { TrendingDown, Download, Share2, Mail, ExternalLink, CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import type { AuditReport, Recommendation, ToolEntry } from '../lib/types';

interface Props {
  result: AuditReport;
  onReset?: () => void;
  mode?: 'private' | 'public';
}

const SEVERITY_MAP: Record<string, { bgClass: string; textClass: string; label: string; icon: JSX.Element }> = {
  downgrade_plan: { bgClass: 'bg-amber-400/15', textClass: 'text-amber-400', label: 'Downgrade', icon: <TrendingDown size={11} /> },
  excess_seats: { bgClass: 'bg-red-400/15', textClass: 'text-red-400', label: 'Excess Seats', icon: <AlertTriangle size={11} /> },
  tool_overlap: { bgClass: 'bg-red-400/15', textClass: 'text-red-400', label: 'Overlap', icon: <AlertTriangle size={11} /> },
  annual_billing: { bgClass: 'bg-sky-400/15', textClass: 'text-sky-400', label: 'Tip', icon: <Info size={11} /> },
  optimal: { bgClass: 'bg-green-400/15', textClass: 'text-green-400', label: 'Optimized', icon: <CheckCircle size={11} /> },
};

function SeverityBadge({ type }: { type: string }) {
  const severity = SEVERITY_MAP[type] ?? SEVERITY_MAP.optimal;

  return (
    <span className={`inline-flex items-center gap-1 ${severity.bgClass} ${severity.textClass} px-2.5 py-[3px] rounded-full text-[11px] font-bold`}>
      {severity.icon} {severity.label}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatCreatedAt(createdAt?: string) {
  if (!createdAt) {
    return null;
  }

  try {
    return new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return null;
  }
}

function SummaryStat({ label, value, color, hasDivider }: { label: string; value: string; color: string; hasDivider?: boolean }) {
  return (
    <div className={hasDivider ? "border-l border-white/8 pl-10" : ""}>
      <div className="text-[11px] text-white/30 uppercase tracking-[1px] mb-1">{label}</div>
      <div className="text-[38px] font-black tracking-[-2px]" style={{ color }}>{value}</div>
    </div>
  );
}

function SharePanel({ shareUrl, copied, onCopy }: { shareUrl: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="bg-sky-400/8 border border-sky-400/18 rounded-[18px] p-[22px] mb-6">
      <div className="flex justify-between gap-4 items-start flex-wrap">
        <div>
          <div className="text-xs font-bold tracking-[1.2px] uppercase text-sky-300 mb-2.5">
            Shareable Report URL
          </div>
          <a href={shareUrl} target="_blank" rel="noreferrer" className="text-slate-50 text-[15px] font-semibold break-all no-underline">
            {shareUrl}
          </a>
          <p className="mt-2.5 text-[13px] leading-[1.7] text-slate-300/72">
            This public page is safe to share and is the same URL used for Open Graph previews on Slack, LinkedIn, and other social apps.
          </p>
        </div>
        <button onClick={onCopy} className="bg-sky-400 text-sky-950 border-none rounded-xl px-[18px] py-[11px] text-[13px] font-extrabold cursor-pointer whitespace-nowrap">
          {copied ? 'Copied' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const isWarning = recommendation.type === 'tool_overlap' || recommendation.type === 'excess_seats';
  const isDowngrade = recommendation.type === 'downgrade_plan';
  const isAnnual = recommendation.type === 'annual_billing';

  const borderClass = isWarning
    ? 'border-red-500/20 border-l-red-400'
    : isDowngrade
      ? 'border-amber-400/20 border-l-amber-400'
      : isAnnual
        ? 'border-sky-400/15 border-l-sky-400'
        : 'border-green-400/15 border-l-green-400';

  const actionBgClass = isWarning
    ? 'bg-red-500/10'
    : isDowngrade
      ? 'bg-amber-500/10'
      : isAnnual
        ? 'bg-sky-500/10'
        : 'bg-green-500/10';

  const actionTextClass = isWarning
    ? 'text-red-300'
    : isDowngrade
      ? 'text-amber-300'
      : isAnnual
        ? 'text-sky-300'
        : 'text-green-300';

  let actionLabel = '';
  let actionDetail: React.ReactNode = null;

  if (isDowngrade && recommendation.currentPlan && recommendation.suggestedPlan) {
    actionLabel = 'Change your plan';
    actionDetail = (
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 bg-white/8 rounded-lg px-3 py-1.5 text-[13px] font-bold text-white/80">
          {recommendation.displayName} <span className="text-white/40 font-normal">{recommendation.currentPlan}</span>
        </span>
        <span className="text-xl text-white/30">→</span>
        <span className="inline-flex items-center gap-1.5 bg-green-400/12 border border-green-400/20 rounded-lg px-3 py-1.5 text-[13px] font-bold text-green-400">
          {recommendation.suggestedPlan}
          {recommendation.suggestedPricePerSeat != null && (
            <span className="text-green-400/60 font-normal">${recommendation.suggestedPricePerSeat}/seat/mo</span>
          )}
        </span>
      </div>
    );
  } else if (recommendation.type === 'excess_seats') {
    actionLabel = 'Remove unused seats';
    
    const seatMatch = recommendation.message.match(/(\d+)\s+unused/i);
    const excessCount = seatMatch ? seatMatch[1] : '?';
    actionDetail = (
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 bg-white/8 rounded-lg px-3 py-1.5 text-[13px] font-bold text-white/80">
          {recommendation.displayName ?? recommendation.tool}
        </span>
        <span className="text-xl text-white/30">→</span>
        <span className="inline-flex items-center gap-1.5 bg-red-400/12 border border-red-400/20 rounded-lg px-3 py-1.5 text-[13px] font-bold text-red-300">
          Remove {excessCount} extra seat{excessCount !== '1' ? 's' : ''}
        </span>
      </div>
    );
  } else if (recommendation.type === 'tool_overlap') {
    actionLabel = 'Consolidate overlapping tools';
    actionDetail = (
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 bg-red-400/12 border border-red-400/20 rounded-lg px-3 py-1.5 text-[13px] font-bold text-red-300">
          Pick one &amp; cancel the rest
        </span>
      </div>
    );
  } else if (isAnnual) {
    actionLabel = 'Switch to annual billing';
    actionDetail = (
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 bg-white/8 rounded-lg px-3 py-1.5 text-[13px] font-bold text-white/80">
          Monthly billing
        </span>
        <span className="text-xl text-white/30">→</span>
        <span className="inline-flex items-center gap-1.5 bg-sky-400/12 border border-sky-400/20 rounded-lg px-3 py-1.5 text-[13px] font-bold text-sky-300">
          Annual billing
          {recommendation.annualSavings != null && (
            <span className="text-sky-300/60 font-normal">(save {formatCurrency(recommendation.annualSavings)}/yr)</span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-white/3 border border-l-[3px] ${borderClass} rounded-xl px-5 py-[18px]`}>
      {/* Header row */}
      <div className="flex justify-between items-start mb-1.5">
        <div className="flex items-center gap-2.5">
          <SeverityBadge type={recommendation.type} />
          {recommendation.displayName && <span className="text-sm font-bold text-slate-100">{recommendation.displayName}</span>}
        </div>
        {recommendation.monthlySavings > 0 && (
          <span className="text-[15px] font-extrabold text-green-400 whitespace-nowrap">
            Save {formatCurrency(recommendation.monthlySavings)}/mo
          </span>
        )}
      </div>

      {/* Precise action box */}
      {actionLabel && (
        <div className={`${actionBgClass} rounded-lg px-4 py-3 mt-2.5 mb-2`}>
          <div className={`text-[11px] font-bold uppercase tracking-[1px] ${actionTextClass} mb-0.5`}>
            ✦ What to do
          </div>
          <div className="text-[14px] font-semibold text-white/90">{actionLabel}</div>
          {actionDetail}
        </div>
      )}

      {/* Original message as supporting context */}
      <p className="text-sm text-white/45 leading-relaxed mt-1.5">{recommendation.message}</p>
    </div>
  );
}


function ToolRow({ entry, isLast, recommendation }: { entry: ToolEntry; isLast: boolean; recommendation?: Recommendation }) {
  let statusBadge: React.ReactNode;

  if (!recommendation || recommendation.type === 'optimal') {
    statusBadge = <span className="text-[12px] text-green-400/70 font-semibold">✓ Optimal</span>;
  } else if (recommendation.type === 'downgrade_plan' && recommendation.suggestedPlan) {
    statusBadge = (
      <span className="inline-flex items-center gap-1 bg-amber-400/12 text-amber-300 rounded-md px-2 py-0.5 text-[11px] font-bold">
        Switch → {recommendation.suggestedPlan}
      </span>
    );
  } else if (recommendation.type === 'excess_seats') {
    const seatMatch = recommendation.message.match(/(\d+)\s+unused/i);
    statusBadge = (
      <span className="inline-flex items-center gap-1 bg-red-400/12 text-red-300 rounded-md px-2 py-0.5 text-[11px] font-bold">
        -{seatMatch?.[1] ?? '?'} seats
      </span>
    );
  } else if (recommendation.type === 'annual_billing') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 bg-sky-400/12 text-sky-300 rounded-md px-2 py-0.5 text-[11px] font-bold">
        Go annual
      </span>
    );
  } else {
    statusBadge = (
      <span className="inline-flex items-center gap-1 bg-white/8 text-white/50 rounded-md px-2 py-0.5 text-[11px] font-bold">
        Review
      </span>
    );
  }

  return (
    <div className={`grid grid-cols-[1fr_1fr_120px_120px_100px] px-5 py-3.5 ${isLast ? "" : "border-b border-white/4"}`}>
      <div className="font-bold text-slate-100 text-sm">{entry.displayName ?? entry.tool}</div>
      <div className="text-[13px] text-white/45">{entry.plan} × {entry.seats}</div>
      <div className="text-sm font-bold text-slate-100">{formatCurrency(entry.monthlySpend)}/mo</div>
      <div className={`text-[13px] ${entry.delta != null && entry.delta > 5 ? 'text-amber-400' : 'text-white/35'}`}>
        {entry.catalogMonthly != null ? `${formatCurrency(entry.catalogMonthly)}/mo` : 'Usage-based'}
        {entry.delta != null && entry.delta > 5 && <span className="text-[11px] ml-1 text-amber-400">↑{formatCurrency(entry.delta)} over</span>}
      </div>
      <div className="flex items-center">{statusBadge}</div>
    </div>
  );
}


export default function AuditResults({ result, onReset, mode = 'private' }: Props) {
  const [email, setEmail] = useState(result.email ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    companyName,
    shareUrl,
    totalMonthlySpend,
    totalPotentialMonthlySavings,
    totalPotentialAnnualSavings,
    breakdown,
    recommendations,
    teamSize,
    primaryUseCase,
    createdAt,
    llmSummary,
  } = result;
  const createdLabel = useMemo(() => formatCreatedAt(createdAt), [createdAt]);
  const highSavings = totalPotentialMonthlySavings > 500;
  const alreadyOptimal = totalPotentialMonthlySavings < 50;
  const canShare = Boolean(shareUrl);

  const summaryStats = useMemo(() => [
    { label: 'Current Monthly', value: formatCurrency(totalMonthlySpend), color: '#f1f5f9' },
    { label: 'Monthly Savings Found', value: formatCurrency(totalPotentialMonthlySavings), color: totalPotentialMonthlySavings > 0 ? '#4ade80' : '#94a3b8' },
    { label: 'Annual Potential', value: formatCurrency(totalPotentialAnnualSavings), color: totalPotentialMonthlySavings > 0 ? '#4ade80' : '#94a3b8' },
  ], [totalMonthlySpend, totalPotentialMonthlySavings, totalPotentialAnnualSavings]);

  const recommendationByTool = useMemo(
    () => new Map(recommendations.map((item) => [item.tool, item])),
    [recommendations],
  );

  async function handleCopyShareLink() {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Could not copy share URL', error);
    }
  }

  async function handleEmailSubmit() {
    if (!email.trim() || !result.id) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError(null);
    setEmailSubmitting(true);

    try {
      await axiosInstance.patch(`/audit/${result.id}/email`, { email: email.trim() });
      setSubmitted(true);
    } catch (error) {
      console.error('Email submit failed', error);
      setEmailError('Unable to save your email. Please try again later.');
    } finally {
      setEmailSubmitting(false);
    }
  }

  function exportReport() {
    const rows = breakdown.map((entry) => {
      const recommendation = recommendationByTool.get(entry.tool);
      const hasSavings = recommendation?.monthlySavings && recommendation.monthlySavings > 0;

      let actionText = '✓ Optimized';
      if (recommendation?.type === 'downgrade_plan' && recommendation.suggestedPlan) {
        actionText = `Switch: ${recommendation.currentPlan ?? entry.plan} → ${recommendation.suggestedPlan}`;
      } else if (recommendation?.type === 'excess_seats') {
        const seatMatch = recommendation.message.match(/(\d+)\s+unused/i);
        actionText = `Remove ${seatMatch?.[1] ?? '?'} extra seat(s)`;
      } else if (recommendation?.type === 'annual_billing') {
        actionText = 'Switch to annual billing';
      } else if (recommendation?.type === 'tool_overlap') {
        actionText = 'Consolidate — pick one tool';
      }

      return `<tr style="border-bottom:1px solid #1e2a3a">
        <td style="padding:12px 16px;color:#f1f5f9;font-weight:600">${entry.displayName ?? entry.tool}</td>
        <td style="padding:12px 16px;color:#94a3b8">${entry.plan} × ${entry.seats}</td>
        <td style="padding:12px 16px;color:#f1f5f9;font-weight:700">${formatCurrency(entry.monthlySpend)}/mo</td>
        <td style="padding:12px 16px;color:${hasSavings ? '#4ade80' : '#94a3b8'};font-weight:${hasSavings ? '700' : '400'}">
          ${hasSavings ? `Save ${formatCurrency(recommendation!.monthlySavings)}/mo` : '—'}
        </td>
        <td style="padding:12px 16px;color:${hasSavings ? '#fbbf24' : '#4ade80'};font-weight:600;font-size:13px">${actionText}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SpendLens AI Audit Report</title>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#0a0f1e;color:#f1f5f9}</style>
      </head><body>
      <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:48px;border-bottom:1px solid #1e2a3a">
        <div style="font-size:26px;font-weight:900;letter-spacing:-1px;margin-bottom:6px">Spend<span style="color:#38bdf8">Lens</span></div>
        <div style="color:#64748b;font-size:14px">AI Spend Audit Report · ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <div style="display:flex;gap:0;border-bottom:1px solid #1e2a3a">
        ${[
        ['Current Monthly', formatCurrency(totalMonthlySpend), '#f1f5f9'],
        ['Monthly Savings', formatCurrency(totalPotentialMonthlySavings), '#4ade80'],
        ['Annual Savings', formatCurrency(totalPotentialAnnualSavings), '#4ade80'],
        ['Tools Audited', String(breakdown.length), '#38bdf8'],
      ].map(([label, value, color]) => `<div style="flex:1;padding:28px 32px;border-right:1px solid #1e2a3a">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#475569;margin-bottom:6px">${label}</div>
            <div style="font-size:32px;font-weight:900;color:${color}">${value}</div>
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
            <th style="padding:10px 16px;text-align:left;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:.5px">Action</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="padding:24px 48px;border-top:1px solid #1e2a3a;font-size:12px;color:#334155">
        Generated by SpendLens · Powered by Credex · ${shareUrl ?? 'credex.rocks'}
      </div>
    </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `SpendLens-Audit-${Date.now()}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-[840px] mx-auto px-6 pt-12 pb-20">
      <section className="bg-gradient-to-br from-slate-900/90 to-[rgba(30,58,95,0.95)] border border-white/8 rounded-[20px] px-11 py-10 mb-6">
        <div className="flex justify-between gap-4 flex-wrap mb-5">
          <div>
            <div className="text-xs font-bold text-white/30 uppercase tracking-[1.5px] mb-2.5">
              {mode === 'public' ? 'Shared Audit Report' : 'Audit Complete'}
            </div>
            <h1 className="m-0 text-[clamp(28px,4vw,40px)] text-white tracking-[-1.2px]">
              {companyName?.trim() ? `${companyName} AI Spend Audit` : 'AI Spend Audit Result'}
            </h1>
          </div>
          <div className="self-start rounded-full border border-white/10 bg-white/5 px-3.5 py-2.5 text-slate-300 text-xs leading-relaxed">
            <div>{teamSize} team member{teamSize === 1 ? '' : 's'}</div>
            <div className="capitalize">{primaryUseCase} workflow</div>
            {createdLabel && <div>{createdLabel}</div>}
          </div>
        </div>

        <div className="flex gap-10 flex-wrap mb-6">
          {summaryStats.map((stat, index) => (
            <SummaryStat key={stat.label} label={stat.label} value={stat.value} color={stat.color} hasDivider={index > 0} />
          ))}
        </div>

        {alreadyOptimal && (
          <div className="bg-green-400/10 border border-green-400/20 rounded-[10px] px-4 py-3 text-green-400 text-sm font-semibold flex items-center gap-2">
            <CheckCircle size={16} /> Your stack looks well-optimized. Great work.
          </div>
        )}
      </section>

      {canShare && <SharePanel shareUrl={shareUrl!} copied={copied} onCopy={handleCopyShareLink} />}

      <div className="bg-white/3 border border-white/7 rounded-2xl p-7 mb-6">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="bg-gradient-to-br from-sky-400 to-indigo-400 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-900">
            EXECUTIVE SUMMARY
          </div>
          <Zap size={14} className="text-indigo-400" />
        </div>
        <p className="text-[15px] leading-[1.75] text-white/70">{llmSummary}</p>
      </div>

      {recommendations.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-extrabold text-white tracking-[-0.5px] mb-3.5">
            Recommendations ({recommendations.length})
          </h2>
          <div className="flex flex-col gap-2.5">
            {recommendations.map((recommendation) => (
              <RecommendationCard key={`${recommendation.tool}-${recommendation.type}`} recommendation={recommendation} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-lg font-extrabold text-white tracking-[-0.5px] mb-3.5">
          Tool Breakdown
        </h2>
        <div className="bg-white/2 border border-white/7 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_120px_120px_100px] px-5 py-2.5 border-b border-white/6">
            {['Tool', 'Plan / Seats', 'Monthly', 'Catalog', 'Status'].map((header) => (
              <div key={header} className="text-[11px] font-bold text-white/25 uppercase tracking-[0.6px]">{header}</div>
            ))}
          </div>
          {breakdown.map((entry, index) => (
            <ToolRow
              key={`${entry.tool}-${entry.plan}-${entry.seats}`}
              entry={entry}
              isLast={index === breakdown.length - 1}
              recommendation={recommendationByTool.get(entry.tool)}
            />
          ))}
        </div>
      </section>

      {highSavings && (
        <section className="bg-gradient-to-br from-slate-900 to-[#1e3a5f] border border-sky-400/20 rounded-[20px] px-10 py-9 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-sky-400/10 border border-sky-400/25 rounded-full px-3 py-1 text-[11px] font-bold text-sky-400 mb-4">
            HIGH SAVINGS DETECTED
          </div>
          <h3 className="text-[22px] font-black text-white tracking-[-0.5px] mb-2.5">
            You're leaving {formatCurrency(totalPotentialMonthlySavings)}/mo on the table
          </h3>
          <p className="text-white/45 text-[15px] leading-[1.65] mb-5">
            Credex sources discounted AI credits from companies that overforecast their usage — same Cursor, Claude, and ChatGPT tools, 15–30% less. Book a free 20-minute consultation.
          </p>
          <a href="#" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-sky-400 text-slate-900 rounded-[10px] px-6 py-3 text-sm font-extrabold no-underline">
            Book Free Credex Consultation <ExternalLink size={14} />
          </a>
        </section>
      )}

      {mode === 'private' && (
        !submitted ? (
          <section className="bg-white/3 border border-white/7 rounded-2xl px-8 py-7 mb-5">
            <h3 className="text-[17px] font-extrabold text-white mb-1.5">
              <Mail size={16} className="inline mr-2 align-middle" />
              {alreadyOptimal ? 'Get notified when new savings apply to your stack' : 'Get this report in your inbox'}
            </h3>
            <p className="text-[13px] text-white/35 mb-[18px]">
              {alreadyOptimal ? 'AI pricing changes frequently. We\'ll alert you when a better option appears.' : 'Full PDF breakdown, plus a personal note for high-savings cases.'}
            </p>
            <div className="flex flex-col gap-2.5">
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="flex-1 px-4 py-[11px] bg-white/6 border border-white/10 rounded-[10px] text-sm text-white outline-none"
              />
              {emailError && (
                <div className="text-red-200 text-[13px] mt-0.5">{emailError}</div>
              )}
              <button
                onClick={handleEmailSubmit}
                disabled={emailSubmitting}
                className={`bg-white text-slate-900 border-none rounded-[10px] px-[22px] py-[11px] font-extrabold text-sm whitespace-nowrap ${emailSubmitting ? "cursor-not-allowed opacity-70" : "cursor-pointer opacity-100"
                  }`}
              >
                {emailSubmitting ? 'Saving...' : 'Send →'}
              </button>
            </div>
          </section>
        ) : (
          <div className="bg-green-400/8 border border-green-400/20 rounded-2xl px-7 py-5 mb-5 flex items-center gap-2.5 text-green-400 font-semibold">
            <CheckCircle size={18} /> Report sent to {email}
          </div>
        )
      )}

      <div className="flex gap-3 flex-wrap">
        <button onClick={exportReport} className="flex-1 min-w-[180px] py-[13px] rounded-xl text-sm font-bold cursor-pointer flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-100">
          <Download size={16} /> Export Report
        </button>
        {canShare && (
          <button onClick={handleCopyShareLink} className="flex-1 min-w-[180px] py-[13px] rounded-xl text-sm font-bold cursor-pointer flex items-center justify-center gap-2 bg-sky-400 border border-sky-400/20 text-sky-950">
            <Share2 size={16} /> {copied ? 'Copied Link' : 'Copy Share Link'}
          </button>
        )}
        {onReset && (
          <button onClick={onReset} className="flex-1 min-w-[180px] py-[13px] rounded-xl text-sm font-bold cursor-pointer flex items-center justify-center gap-2 bg-transparent border border-white/8 text-white/40">
            ← New Audit
          </button>
        )}
      </div>
    </div>
  );
}
