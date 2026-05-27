'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuditResults from '../../components/AuditResults';
import type { AuditReport } from '../../lib/types';

export default function EndpointPage() {
  const [result, setResult] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('spendlens_audit_result');
      if (!saved) {
        setError('No audit result found. Please run an audit first.');
        return;
      }

      const parsed = JSON.parse(saved) as AuditReport;
      setResult(parsed);
    } catch (cause) {
      console.error('Failed to load audit result', cause);
      setError('Unable to load the audit result. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  function handleReset() {
    window.localStorage.removeItem('spendlens_audit_result');
    router.push('/audit');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center shadow-2xl shadow-slate-950/40">
          Loading audit result…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center shadow-2xl shadow-slate-950/40">
          <p className="mb-6 text-lg font-semibold">{error}</p>
          <button
            onClick={() => router.push('/audit')}
            className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Go start audit
          </button>
        </div>
      </div>
    );
  }

  return result &&(
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <AuditResults result={result} onReset={handleReset} />
    </div>
  );
}
