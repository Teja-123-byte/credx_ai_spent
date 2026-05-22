// src/lib/pricingData.ts
export type ToolName = 
  | 'cursor' 
  | 'copilot' 
  | 'claude' 
  | 'chatgpt' 
  | 'gemini' 
  | 'windsurf'
  | 'anthropic-api'
  | 'openai-api';

export interface PlanInfo {
  name: string;
  pricePerSeat: number;        // Monthly
  description?: string;
  notes?: string;
}

export interface ToolPricing {
  plans: PlanInfo[];
  sourceUrl: string;
  verifiedDate: string;
  notes?: string;
  apiPricing?: { model: string; input: number; output: number }[]; // per MTok
}

export const pricingData: Record<ToolName, ToolPricing> = {
  cursor: {
    plans: [
      { name: "Hobby", pricePerSeat: 0, description: "Limited requests" },
      { name: "Pro", pricePerSeat: 20, description: "$20 usage credits" },
      { name: "Pro+", pricePerSeat: 60, description: "3x credits" },
      { name: "Ultra", pricePerSeat: 200, description: "20x credits" },
      { name: "Teams", pricePerSeat: 40, description: "Admin + shared rules" },
      { name: "Enterprise", pricePerSeat: 0, description: "Custom pricing" },
    ],
    sourceUrl: "https://cursor.com/pricing",
    verifiedDate: "2026-05-21"
  },

  copilot: {
    plans: [
      { name: "Individual", pricePerSeat: 10 },
      { name: "Business", pricePerSeat: 19 },
      { name: "Enterprise", pricePerSeat: 39 },
    ],
    sourceUrl: "https://github.com/features/copilot",
    verifiedDate: "2026-05-21",
    notes: "Moving to usage-based billing from June 2026"
  },

  claude: {
    plans: [
      { name: "Free", pricePerSeat: 0 },
      { name: "Pro", pricePerSeat: 20 },
      { name: "Max 5x", pricePerSeat: 100 },
      { name: "Max 20x", pricePerSeat: 200 },
      { name: "Team Standard", pricePerSeat: 25 },
      { name: "Team Premium", pricePerSeat: 100 },
    ],
    sourceUrl: "https://anthropic.com/pricing",
    verifiedDate: "2026-05-21"
  },

  chatgpt: {
    plans: [
      { name: "Plus", pricePerSeat: 20 },
      { name: "Pro", pricePerSeat: 200 },
      { name: "Business", pricePerSeat: 25 },
      { name: "Enterprise", pricePerSeat: 0, description: "Custom" },
    ],
    sourceUrl: "https://openai.com/business/chatgpt-pricing",
    verifiedDate: "2026-05-21"
  },

  gemini: {
    plans: [
      { name: "AI Plus", pricePerSeat: 7.99 },
      { name: "AI Pro", pricePerSeat: 19.99 },
      { name: "AI Ultra", pricePerSeat: 249.99 },
      { name: "Business", pricePerSeat: 14 },
    ],
    sourceUrl: "https://one.google.com/about/plans",
    verifiedDate: "2026-05-21"
  },

  windsurf: {
    plans: [
      { name: "Pro", pricePerSeat: 20 },
      { name: "Max", pricePerSeat: 200 },
      { name: "Teams", pricePerSeat: 40 },
      { name: "Enterprise", pricePerSeat: 60 },
    ],
    sourceUrl: "https://windsurf.com/pricing",
    verifiedDate: "2026-05-21"
  },

  'anthropic-api': {
    plans: [{ name: "Pay-per-token", pricePerSeat: 0 }],
    sourceUrl: "https://anthropic.com/pricing",
    verifiedDate: "2026-05-21",
    apiPricing: [
      { model: "Sonnet 4.6", input: 3.00, output: 15.00 },
      // add more as needed
    ]
  },

  'openai-api': {
    plans: [{ name: "Pay-per-token", pricePerSeat: 0 }],
    sourceUrl: "https://openai.com/api/pricing",
    verifiedDate: "2026-05-21"
  },
} as const;