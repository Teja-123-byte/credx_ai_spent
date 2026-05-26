"use client";

import AuditResults from '../../components/AuditResults';

export default function AuditResultsPage() {
  // This will come from your audit engine
  const sampleResults = [
    {
      tool: "Cursor",
      plan: "Business",
      currentSpend: 1200,
      recommendedAction: "Downgrade to Pro for most users",
      savings: 600,
      reason: "Team plan is overkill for your current usage patterns."
    }
    // ... more
  ];

  return (
    <AuditResults
      results={sampleResults}
      totalMonthlySavings={850}
      teamSize={12}
      primaryUseCase="coding"
      onSaveReport={() => alert('Email capture modal coming soon')}
      onShare={() => alert('Shareable link coming soon')}
    />
  );
}