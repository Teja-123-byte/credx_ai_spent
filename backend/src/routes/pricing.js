// src/routes/pricing.js
import { Router } from "express";
import { pricingData, TOOL_NAMES } from "../lib/pricingData.js";

const router = Router();

/**
 * GET /pricing/tools
 * Returns a summary list of all supported tools (name + plans + category).
 */
router.get("/tools", (req, res) => {
  const tools = TOOL_NAMES.map((key) => {
    const t = pricingData[key];
    return {
      key,
      displayName: t.displayName,
      category: t.category,
      plans: t.plans.map((p) => p.name),
      verifiedDate: t.verifiedDate,
      sourceUrl: t.sourceUrl,
    };
  });
  return res.json({ tools });
});

/**
 * GET /pricing/:tool
 * Returns full pricing detail for a single tool.
 */
router.get("/:tool", (req, res) => {
  const { tool } = req.params;
  const data = pricingData[tool];

  if (!data) {
    return res.status(404).json({
      error: `Tool "${tool}" not found. Available tools: ${TOOL_NAMES.join(", ")}`,
    });
  }

  return res.json({ tool, ...data });
});

export default router;