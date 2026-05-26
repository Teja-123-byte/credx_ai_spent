 'use client';

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './ui';
import { TrendingUp, Users, ArrowRight } from 'lucide-react';

interface ToolResult {
  tool: string;
  plan: string;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

interface AuditResultsProps {
  results: ToolResult[];
  totalMonthlySavings: number;
  teamSize: number;
  primaryUseCase: string;
  onSaveReport: () => void;
  onShare: () => void;
}

export default function AuditResults({
  results,
  totalMonthlySavings,
  teamSize,
  primaryUseCase,
  onSaveReport,
  onShare,
}: AuditResultsProps) {
  const totalAnnualSavings = totalMonthlySavings * 12;
  const isHighSavings = totalMonthlySavings > 500;
  const isOptimal = totalMonthlySavings < 50;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            AUDIT COMPLETE
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-4">
            You can save{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ${totalMonthlySavings}
            </span>{' '}
            monthly
          </h1>

          <p className="text-2xl text-slate-600 mb-8">
            ${totalAnnualSavings.toLocaleString()} per year
          </p>

          {isHighSavings && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-3xl mb-10">
              <p className="text-2xl font-semibold mb-3">Major savings opportunity detected</p>
              <p className="mb-6">Credex can help you capture even more by buying AI credits at a discount.</p>
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-slate-100 text-lg px-8" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
                Book Credex Consultation →
              </Button>
            </div>
          )}

          {isOptimal && (
            <div className="bg-slate-100 border border-slate-200 p-6 rounded-2xl mb-8 text-slate-700">
              Great job! Your AI spend is already well optimized.
            </div>
          )}
        </div>

        {/* Tool Breakdowns */}
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Users className="w-6 h-6" />
          Tool-by-Tool Breakdown
        </h2>

        <div className="space-y-6 mb-12">
          {results.map((result, i) => (
            <Card key={i} className="border-l-4 border-l-emerald-600">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{result.tool}</CardTitle>
                    <p className="text-sm text-slate-500">
                      {result.plan} • ${result.currentSpend}/month
                    </p>
                  </div>
                  <Badge className="text-base px-4 py-1" variant="secondary">
                    Save ${result.savings}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="uppercase text-xs tracking-widest text-slate-500 mb-1">Recommended</p>
                  <p className="font-medium text-lg">{result.recommendedAction}</p>
                </div>
                <div>
                  <p className="uppercase text-xs tracking-widest text-slate-500 mb-1">Reason</p>
                  <p className="text-slate-600">{result.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button onClick={onSaveReport} size="lg" className="text-lg px-10 py-6">
            Save &amp; Email Full Report
          </Button>
          <Button onClick={onShare} variant="outline" size="lg" className="text-lg px-10 py-6">
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
}