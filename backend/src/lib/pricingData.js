// src/lib/pricingData.js
// Single source of truth for all AI tool pricing.
// Mirrors frontend/src/lib/pricingData.ts — keep both in sync.

export const pricingData = {
  cursor: {
    displayName: "Cursor",
    category: "coding",
    plans: [
      { name: "Hobby",      pricePerSeat: 0,   description: "Limited agent requests & tab completions" },
      { name: "Pro",        pricePerSeat: 20,  description: "$20/month usage credits, unlimited Tab" },
      { name: "Pro+",       pricePerSeat: 60,  description: "3x usage credits ($60/month)" },
      { name: "Ultra",      pricePerSeat: 200, description: "20x usage credits, priority access" },
      { name: "Teams",      pricePerSeat: 40,  description: "Pro AI + admin controls, centralized billing" },
      { name: "Enterprise", pricePerSeat: null, description: "Custom — SSO, SCIM, audit logs, pooled credits" },
    ],
    annualDiscount: 0.20,
    sourceUrl: "https://cursor.com/pricing",
    verifiedDate: "2026-05-21",
  },

  copilot: {
    displayName: "GitHub Copilot",
    category: "coding",
    plans: [
      { name: "Free",       pricePerSeat: 0,  description: "Limited completions for students & OSS" },
      { name: "Individual", pricePerSeat: 10, description: "Unlimited completions, all major IDEs" },
      { name: "Business",   pricePerSeat: 19, description: "Org management, SAML SSO, audit logs" },
      { name: "Enterprise", pricePerSeat: 39, description: "Fine-tuning, custom knowledge bases" },
    ],
    notes: "Moving to usage-based billing June 2026",
    sourceUrl: "https://github.com/features/copilot",
    verifiedDate: "2026-05-21",
  },

  claude: {
    displayName: "Claude (Anthropic)",
    category: "general",
    plans: [
      { name: "Free",          pricePerSeat: 0,   description: "Sonnet 4.6, rolling limits" },
      { name: "Pro",           pricePerSeat: 20,  description: "5x usage vs Free, all models" },
      { name: "Max 5x",        pricePerSeat: 100, description: "5x more than Pro, priority routing" },
      { name: "Max 20x",       pricePerSeat: 200, description: "20x more than Pro, priority routing" },
      { name: "Team Standard", pricePerSeat: 25,  description: "Min 5 seats, admin controls ($20/seat annual)" },
      { name: "Team Premium",  pricePerSeat: 100, description: "Includes Claude Code, engineering teams" },
      { name: "Enterprise",    pricePerSeat: null, description: "Custom — ~$60/seat min 70 seats, HIPAA, SSO" },
    ],
    sourceUrl: "https://anthropic.com/pricing",
    verifiedDate: "2026-05-21",
  },

  chatgpt: {
    displayName: "ChatGPT (OpenAI)",
    category: "general",
    plans: [
      { name: "Free",       pricePerSeat: 0,   description: "GPT-4o mini, limited messages" },
      { name: "Go",         pricePerSeat: 8,   description: "More usage than Free (Jan 2026)" },
      { name: "Plus",       pricePerSeat: 20,  description: "GPT-4o, GPT-5.5, image generation" },
      { name: "Pro",        pricePerSeat: 200, description: "Unlimited GPT-4o, o1 Pro mode" },
      { name: "Business",   pricePerSeat: 25,  description: "Shared workspace, admin controls (min 2 users)" },
      { name: "Enterprise", pricePerSeat: null, description: "Custom — min 150 users, data residency" },
    ],
    sourceUrl: "https://openai.com/business/chatgpt-pricing",
    verifiedDate: "2026-05-21",
  },

  gemini: {
    displayName: "Gemini (Google)",
    category: "general",
    plans: [
      { name: "Free",       pricePerSeat: 0,      description: "Gemini 3.1 Flash, limited prompts" },
      { name: "AI Plus",    pricePerSeat: 7.99,   description: "Enhanced Pro access, 200 GB storage" },
      { name: "AI Pro",     pricePerSeat: 19.99,  description: "1M context, full Deep Research, 5 TB storage" },
      { name: "AI Ultra",   pricePerSeat: 249.99, description: "Deep Think, Veo 3.1 video, 30 TB storage" },
      { name: "Business",   pricePerSeat: 14,     description: "Workspace add-on" },
      { name: "Enterprise", pricePerSeat: 30,     description: "Workspace add-on, enterprise controls" },
    ],
    sourceUrl: "https://one.google.com/about/plans",
    verifiedDate: "2026-05-21",
  },

  windsurf: {
    displayName: "Windsurf (Codeium)",
    category: "coding",
    plans: [
      { name: "Free",       pricePerSeat: 0,   description: "25 credits/month, limited Cascade" },
      { name: "Pro",        pricePerSeat: 20,  description: "500 credits/month, all premium models" },
      { name: "Max",        pricePerSeat: 200, description: "Max AI capacity for power users" },
      { name: "Teams",      pricePerSeat: 40,  description: "500 credits/user + admin controls" },
      { name: "Enterprise", pricePerSeat: 60,  description: "SSO, RBAC, compliance docs" },
    ],
    notes: "Pro increased from $15→$20 in March 2026; existing subscribers grandfathered",
    sourceUrl: "https://windsurf.com/pricing",
    verifiedDate: "2026-05-21",
  },

  "anthropic-api": {
    displayName: "Anthropic API",
    category: "api",
    plans: [
      { name: "Pay-per-token", pricePerSeat: 0, description: "No subscription; billed per token" },
    ],
    apiPricing: [
      { model: "Claude Sonnet 4.6", inputPerMTok: 3.00,  outputPerMTok: 15.00 },
      { model: "Claude Opus 4.6",   inputPerMTok: 5.00,  outputPerMTok: 25.00 },
      { model: "Claude Haiku 4.5",  inputPerMTok: 0.80,  outputPerMTok: 4.00  },
    ],
    batchDiscount: 0.50,
    cacheReadDiscount: 0.90,
    sourceUrl: "https://anthropic.com/pricing",
    verifiedDate: "2026-05-21",
  },

  "openai-api": {
    displayName: "OpenAI API",
    category: "api",
    plans: [
      { name: "Pay-per-token", pricePerSeat: 0, description: "No subscription; billed per token" },
    ],
    apiPricing: [
      { model: "GPT-4.1",    inputPerMTok: 2.00,  outputPerMTok: 8.00  },
      { model: "GPT-4o",     inputPerMTok: 2.50,  outputPerMTok: 10.00 },
      { model: "GPT-4o mini",inputPerMTok: 0.15,  outputPerMTok: 0.60  },
      { model: "o3",         inputPerMTok: 10.00, outputPerMTok: 40.00 },
    ],
    sourceUrl: "https://openai.com/api/pricing",
    verifiedDate: "2026-05-21",
  },
};

export const TOOL_NAMES = Object.keys(pricingData);