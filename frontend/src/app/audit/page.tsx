"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuditForm from '../../components/ui/Auditform';
import AuditResults from '../../components/AuditResults';
import { axiosInstance } from '../../lib/axios';
import type { AuditCreateResponse, AuditInput, AuditReport } from '../../lib/types';

export default function AuditPage() {
  const [result, setResult] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(input: AuditInput) {
    setError(null);
    setLoading(true);
    try {
      const resp = await axiosInstance.post<AuditCreateResponse>('/audit', input);
      const payload = resp.data;
      const nextResult: AuditReport = {
        ...payload.result,
        id: payload.id,
        shareId: payload.shareId,
        shareUrl: payload.shareUrl,
        createdAt: payload.createdAt,
        companyName: payload.result?.companyName ?? input?.companyName ?? null,
        llmSummary: payload?.llmSummary ?? null,
      };
      window.localStorage.setItem('spendlens_audit_result', JSON.stringify(nextResult));
      router.push('/result');
    } catch (err) {
      console.error('Audit submit failed', err);
      setError('We could not save this audit right now. Please verify the backend deployment, Supabase migration, and API URL, then try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 px-6 pt-12 pb-20">
      <div className="max-w-[1040px] mx-auto">
        <div className="flex flex-col gap-3 mb-7">
          <div className="inline-flex items-center gap-2.5 bg-white/8 rounded-full px-4 py-2 text-slate-300 text-xs font-bold uppercase tracking-[1px]">
            <span>SpendLens</span>
            <span className="w-1 h-1 rounded-full bg-sky-400" />
          </div>
          <div className="text-slate-50">
            <h1 className="text-[clamp(36px,4vw,52px)] font-extrabold m-0 tracking-[-0.04em]">
              Tell us about your AI stack
            </h1>
            <p className="text-base text-slate-200/[0.98] max-w-[720px] leading-[1.75] mt-4">
              Add every AI tool your team pays for. We'll show you where you can save.
            </p>
            <div className="mt-[18px] px-5 py-3.5 bg-sky-400/12 border border-sky-400/22 rounded-[22px] inline-flex items-center gap-2.5 text-sky-100">
              <span className="text-[13px] font-bold uppercase tracking-[0.9px]">We will audit your stack</span>
              <span className="flex-1 h-px bg-white/22" />
            </div>
          </div>
        </div>

        {result ? (
          <AuditResults result={result} onReset={() => setResult(null)} />
        ) : (
          <>
            <AuditForm onSubmit={handleSubmit} />
            {loading && <div className="text-center text-slate-400 mt-3">Submitting audit…</div>}
            {error && (
              <div className="mt-3.5 rounded-2xl border border-red-400/35 bg-red-900/35 px-[18px] py-3.5 text-red-200 text-sm leading-relaxed">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
