// src/lib/auditEngine.js
// Pure functions — no side effects, easy to test.
import { pricingData } from "./pricingData.js";

/**
 * Calculate the actual monthly cost for a single tool entry.
 * monthlySpend is what the user SAYS they pay — we validate it against catalog.
 */
export function calcToolCost(entry) {
  const { tool, plan, seats, monthlySpend } = entry;
  const toolData = pricingData[tool];
  if (!toolData) return { ...entry, catalogPrice: null, delta: null };

  const planInfo = toolData.plans.find(
    (p) => p.name.toLowerCase() === plan.toLowerCase()
  );
  const pricePerSeat = planInfo?.pricePerSeat ?? null;
  const catalogMonthly =
    pricePerSeat !== null ? pricePerSeat * seats : null;

  return {
    tool,
    displayName: toolData.displayName,
    plan,
    seats,
    monthlySpend,                        // what user reports paying
    catalogMonthly,                      // what catalog says it should be
    delta: catalogMonthly !== null       // over/under vs catalog
      ? monthlySpend - catalogMonthly
      : null,
  };
}

/**
 * Build the cheapest-equivalent config for a given use-case and team size.
 * Returns an alternative plan suggestion if savings exist.
 */
function findCheaperAlternative(tool, currentPlan, seats) {
  const toolData = pricingData[tool];
  if (!toolData) return null;

  const current = toolData.plans.find(
    (p) => p.name.toLowerCase() === currentPlan.toLowerCase()
  );
  if (!current || current.pricePerSeat === null) return null;

  const currentTotal = current.pricePerSeat * seats;

  // Find plans that are cheaper per total cost and not free (free = different tier)
  const cheaper = toolData.plans
    .filter(
      (p) =>
        p.pricePerSeat !== null &&
        p.pricePerSeat > 0 &&
        p.pricePerSeat < current.pricePerSeat &&
        p.name.toLowerCase() !== currentPlan.toLowerCase()
    )
    .sort((a, b) => b.pricePerSeat - a.pricePerSeat); // closest cheaper option first

  if (!cheaper.length) return null;

  const best = cheaper[0];
  const savings = (current.pricePerSeat - best.pricePerSeat) * seats;
  return {
    suggestedPlan: best.name,
    suggestedPricePerSeat: best.pricePerSeat,
    suggestedTotal: best.pricePerSeat * seats,
    monthlySavings: savings,
    annualSavings: savings * 12,
    description: best.description,
  };
}

/**
 * Check for annual billing savings (if tool offers a discount).
 */
function annualBillingHint(tool, plan, seats, monthlySpend) {
  const toolData = pricingData[tool];
  if (!toolData?.annualDiscount) return null;
  const saving = monthlySpend * toolData.annualDiscount;
  return {
    type: "annual_billing",
    message: `Switching to annual billing on ${toolData.displayName} saves ~${pct(toolData.annualDiscount)} (~$${Math.round(saving * 12)}/yr).`,
    annualSavings: Math.round(saving * 12),
  };
}

/**
 * Check for seat count efficiency (are they over-seated?).
 */
function seatEfficiencyHint(tool, plan, seats, teamSize) {
  if (!teamSize || seats <= teamSize) return null;
  const toolData = pricingData[tool];
  const planInfo = toolData?.plans.find(
    (p) => p.name.toLowerCase() === plan.toLowerCase()
  );
  if (!planInfo || planInfo.pricePerSeat === null) return null;
  const excessSeats = seats - teamSize;
  const waste = excessSeats * planInfo.pricePerSeat;
  return {
    type: "excess_seats",
    message: `You have ${excessSeats} unused ${toolData.displayName} seat(s) — removing them saves $${waste}/month.`,
    monthlySavings: waste,
    annualSavings: waste * 12,
  };
}

const pct = (n) => `${Math.round(n * 100)}%`;

/**
 * Main audit function.
 * @param {AuditInput} input
 * @returns {AuditResult}
 */
export function runAudit(input) {
  const { tools, teamSize, primaryUseCase, companyName } = input;

  // --- Per-tool cost breakdown ---
  const breakdown = tools.map(calcToolCost);

  const totalMonthlySpend = tools.reduce((s, t) => s + t.monthlySpend, 0);
  const totalCatalogMonthly = breakdown.reduce(
    (s, b) => s + (b.catalogMonthly ?? b.monthlySpend),
    0
  );

  // --- Recommendations ---
  const recommendations = [];

  for (const entry of tools) {
    const { tool, plan, seats, monthlySpend } = entry;

    // 1. Cheaper plan alternative
    const alt = findCheaperAlternative(tool, plan, seats);
    if (alt && alt.monthlySavings > 0) {
      recommendations.push({
        type: "downgrade_plan",
        tool,
        displayName: pricingData[tool]?.displayName ?? tool,
        currentPlan: plan,
        ...alt,
        message: `Downgrade ${pricingData[tool]?.displayName} from "${plan}" → "${alt.suggestedPlan}" to save $${alt.monthlySavings}/month ($${alt.annualSavings}/yr).`,
      });
    }

    // 2. Annual billing hint
    const annual = annualBillingHint(tool, plan, seats, monthlySpend);
    if (annual) recommendations.push({ tool, displayName: pricingData[tool]?.displayName ?? tool, ...annual });

    // 3. Seat efficiency
    const seatHint = seatEfficiencyHint(tool, plan, seats, teamSize);
    if (seatHint) recommendations.push({ tool, displayName: pricingData[tool]?.displayName ?? tool, ...seatHint });
  }

  // 4. Overlap detection — flag duplicate-purpose tools
  const codingTools = tools.filter(
    (t) => pricingData[t.tool]?.category === "coding"
  );
  if (codingTools.length > 1) {
    const names = codingTools.map((t) => pricingData[t.tool]?.displayName ?? t.tool).join(", ");
    const waste = codingTools.slice(1).reduce((s, t) => s + t.monthlySpend, 0);
    recommendations.push({
      type: "tool_overlap",
      tool: null,
      message: `You're paying for ${codingTools.length} coding AI tools (${names}). Consider consolidating — you could save ~$${waste}/month.`,
      monthlySavings: waste,
      annualSavings: waste * 12,
    });
  }

  const generalTools = tools.filter(
    (t) => pricingData[t.tool]?.category === "general"
  );
  if (generalTools.length > 1) {
    const names = generalTools.map((t) => pricingData[t.tool]?.displayName ?? t.tool).join(", ");
    const waste = generalTools.slice(1).reduce((s, t) => s + t.monthlySpend, 0);
    recommendations.push({
      type: "tool_overlap",
      tool: null,
      message: `You have ${generalTools.length} general AI assistants (${names}). Consolidating could save ~$${waste}/month.`,
      monthlySavings: waste,
      annualSavings: waste * 12,
    });
  }

  // Sort by highest savings first
  recommendations.sort(
    (a, b) => (b.annualSavings ?? 0) - (a.annualSavings ?? 0)
  );

  const totalPotentialMonthlySavings = recommendations.reduce(
    (s, r) => s + (r.monthlySavings ?? 0),
    0
  );

  return {
    companyName: companyName ?? null,
    teamSize,
    primaryUseCase,
    totalMonthlySpend,
    totalCatalogMonthly: Math.round(totalCatalogMonthly * 100) / 100,
    totalPotentialMonthlySavings: Math.round(totalPotentialMonthlySavings * 100) / 100,
    totalPotentialAnnualSavings: Math.round(totalPotentialMonthlySavings * 12 * 100) / 100,
    savingsPercentage:
      totalMonthlySpend > 0
        ? Math.round((totalPotentialMonthlySavings / totalMonthlySpend) * 100)
        : 0,
    breakdown,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}