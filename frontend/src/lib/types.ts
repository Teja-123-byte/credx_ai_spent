export type ToolName = 
  | 'cursor' | 'copilot' | 'claude' | 'chatgpt' 
  | 'anthropic-api' | 'openai-api' | 'gemini' | 'windsurf';

export type Plan = string; // e.g. "Pro", "Business"

export interface ToolEntry {
  tool: ToolName;
  plan: Plan;
  monthlySpend: number;
  seats: number;
  displayName?: string;
  catalogMonthly?: number | null;
  delta?: number | null;
}

export interface Recommendation {
  tool: ToolName | string;
  type: 'downgrade_plan' | 'excess_seats' | 'tool_overlap' | 'annual_billing' | 'optimal' | string;
  displayName?: string;
  monthlySavings: number;
  message: string;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  companyName?: string;
}

export interface AuditResult {
  totalMonthlySpend: number;
  totalPotentialMonthlySavings: number;
  totalPotentialAnnualSavings: number;
  savingsPercentage: number;
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed' | string;
  breakdown: ToolEntry[];
  recommendations: Recommendation[];
}
