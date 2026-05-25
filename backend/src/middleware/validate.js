// src/middleware/validate.js
import { TOOL_NAMES } from "../lib/pricingData.js";

const USE_CASES = ["coding", "writing", "data", "research", "mixed"];

export function validateAuditInput(req, res, next) {
  const { tools, teamSize, primaryUseCase } = req.body;

  const errors = [];

  // tools
  if (!Array.isArray(tools) || tools.length === 0) {
    errors.push("tools must be a non-empty array");
  } else {
    tools.forEach((entry, i) => {
      if (!entry.tool || !TOOL_NAMES.includes(entry.tool)) {
        errors.push(
          `tools[${i}].tool must be one of: ${TOOL_NAMES.join(", ")}`
        );
      }
      if (!entry.plan || typeof entry.plan !== "string") {
        errors.push(`tools[${i}].plan is required`);
      }
      if (typeof entry.seats !== "number" || entry.seats < 1) {
        errors.push(`tools[${i}].seats must be a positive number`);
      }
      if (typeof entry.monthlySpend !== "number" || entry.monthlySpend < 0) {
        errors.push(`tools[${i}].monthlySpend must be a non-negative number`);
      }
    });
  }

  // teamSize
  if (typeof teamSize !== "number" || teamSize < 1) {
    errors.push("teamSize must be a positive number");
  }

  // primaryUseCase
  if (!USE_CASES.includes(primaryUseCase)) {
    errors.push(`primaryUseCase must be one of: ${USE_CASES.join(", ")}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  next();
}
