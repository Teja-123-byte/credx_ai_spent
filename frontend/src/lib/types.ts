export type ToolName = 
  | 'cursor' | 'copilot' | 'claude' | 'chatgpt' 
  | 'anthropic-api' | 'openai-api' | 'gemini' | 'windsurf'; // add v0 if you prefer

export type Plan = string; // e.g. "Pro", "Business"

export interface ToolEntry {
  tool: ToolName;
  plan: Plan;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  companyName?: string;
}

export interface AuditResult { /* tomorrow */ }