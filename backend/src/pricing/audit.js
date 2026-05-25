// src/routes/audit.js
import { Router } from "express";
import { runAudit } from "../lib/auditEngine.js";
import { validateAuditInput } from "../middleware/validate.js";
import { supabase } from "../lib/supabase.js";

const router = Router();

/**
 * POST /audit
 * Run an audit and save the result to Supabase.
 *
 * Body: AuditInput { tools, teamSize, primaryUseCase, companyName? }
 * Returns: AuditResult + saved record id
 */
router.post("/", validateAuditInput, async (req, res) => {
  try {
    const input = req.body;
    const result = runAudit(input);

    // Save to Supabase
    const { data, error } = await supabase
      .from("audits")
      .insert({
        company_name: input.companyName ?? null,
        team_size: input.teamSize,
        primary_use_case: input.primaryUseCase,
        input: input,          // full input JSON
        result: result,        // full result JSON
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      // Still return the audit result even if save fails
      return res.status(207).json({
        warning: "Audit completed but could not be saved to database.",
        supabaseError: error.message,
        result,
      });
    }

    return res.status(201).json({
      id: data.id,
      createdAt: data.created_at,
      result,
    });
  } catch (err) {
    console.error("Audit error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

/**
 * GET /audit/:id
 * Load a saved audit by ID.
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("audits")
      .select("id, company_name, team_size, primary_use_case, input, result, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Audit not found" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Fetch audit error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /audit?company=<name>&limit=10
 * List recent audits, optionally filtered by company name.
 */
router.get("/", async (req, res) => {
  try {
    const { company, limit = 10 } = req.query;
    const parsedLimit = Math.min(parseInt(limit, 10) || 10, 50);

    let query = supabase
      .from("audits")
      .select("id, company_name, team_size, primary_use_case, created_at, result->totalMonthlySpend, result->totalPotentialAnnualSavings")
      .order("created_at", { ascending: false })
      .limit(parsedLimit);

    if (company) {
      query = query.ilike("company_name", `%${company}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("List audits error:", error);
      return res.status(500).json({ error: "Failed to fetch audits" });
    }

    return res.json({ audits: data, count: data.length });
  } catch (err) {
    console.error("List error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;