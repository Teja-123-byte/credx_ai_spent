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
  annualSavings?: number;
  message: string;
  /** downgrade_plan fields */
  currentPlan?: string;
  suggestedPlan?: string;
  suggestedPricePerSeat?: number;
  suggestedTotal?: number;
  description?: string;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  companyName?: string;
}

export interface AuditResult {
  companyName?: string | null;
  totalMonthlySpend: number;
  totalCatalogMonthly?: number;
  totalPotentialMonthlySavings: number;
  totalPotentialAnnualSavings: number;
  savingsPercentage: number;
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed' | string;
  breakdown: ToolEntry[];
  recommendations: Recommendation[];
  generatedAt?: string;
}

export interface AuditReport extends AuditResult {
  id?: string;
  shareId?: string;
  shareUrl?: string;
  companyName?: string | null;
  email?: string | null;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  llmSummary?: string | null;
}

export interface AuditCreateResponse {
  id: string;
  shareId: string;
  shareUrl: string;
  createdAt: string;
  result: AuditResult;
  llmSummary: string;
}

export interface SharedAuditOpenGraph {
  title: string;
  description: string;
  url: string;
  type: string;
  siteName: string;
}

export interface SharedAuditResponse {
  shareId: string;
  shareUrl: string;
  companyName: string | null;
  teamSize: number;
  primaryUseCase: AuditInput["primaryUseCase"] | string;
  createdAt: string;
  result: AuditResult;
  openGraph: SharedAuditOpenGraph;
}
