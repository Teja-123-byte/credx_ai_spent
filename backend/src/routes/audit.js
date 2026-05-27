import { Router } from "express";

import { supabase } from "../db/supabase.js";
import { runAudit } from "../lib/auditEngine.js";
import {
  buildAuditSharePreview,
  buildAuditShareUrl,
  createAuditShareId,
} from "../lib/auditShare.js";
import { validateAuditInput } from "../middleware/validate.js";
import { queryGroq } from "../lib/groq.js";
import {sendAuditResultEmail} from "../lib/email.js";
import {rateLimiter} from "../middleware/rateLimiter.js";

const router = Router();
const auditLimiter = rateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 }); // 10 req / 10 min

const AUDITS_TABLE = "audits";
const AUDIT_COLUMNS = [
  "id",
  "share_id",
  "is_public",
  "company_name",
  "email",
  "team_size",
  "primary_use_case",
  "input",
  "result",
  "created_at",
  "updated_at",
].join(", ");

function normalizeAuditInput(body) {
  const companyName =
    typeof body.companyName === "string" ? body.companyName.trim() : null;

  return {
    ...body,
    companyName: companyName || null,
  };
}

function mapAuditRow(row) {
  return {
    id: row.id,
    shareId: row.share_id,
    shareUrl: buildAuditShareUrl(row.share_id),
    isPublic: Boolean(row.is_public),
    companyName: row.company_name,
    email: row.email ?? null,
    teamSize: row.team_size,
    primaryUseCase: row.primary_use_case,
    input: row.input,
    result: row.result,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
  };
}

function mapAuditListItem(row) {
  const audit = mapAuditRow(row);

  return {
    id: audit.id,
    shareId: audit.shareId,
    shareUrl: audit.shareUrl,
    isPublic: audit.isPublic,
    companyName: audit.companyName,
    teamSize: audit.teamSize,
    primaryUseCase: audit.primaryUseCase,
    totalMonthlySpend: audit.result?.totalMonthlySpend ?? null,
    totalPotentialMonthlySavings:
      audit.result?.totalPotentialMonthlySavings ?? null,
    totalPotentialAnnualSavings:
      audit.result?.totalPotentialAnnualSavings ?? null,
    savingsPercentage: audit.result?.savingsPercentage ?? null,
    createdAt: audit.createdAt,
  };
}

function mapPublicAuditRow(row) {
  const audit = mapAuditRow(row);

  return {
    shareId: audit.shareId,
    shareUrl: audit.shareUrl,
    companyName: audit.companyName,
    teamSize: audit.teamSize,
    primaryUseCase: audit.primaryUseCase,
    createdAt: audit.createdAt,
    result: audit.result,
    openGraph: buildAuditSharePreview({
      shareId: audit.shareId,
      companyName: audit.companyName,
      result: audit.result,
    }),
  };
}

function buildDatabaseError(error, fallbackMessage) {
  if (error?.code === "42P01") {
    return {
      status: 500,
      body: {
        error:
          'Database table "audits" does not exist. Apply the Supabase migration before retrying.',
        details: error.message,
      },
    };
  }

  if (error?.code === "42703") {
    return {
      status: 500,
      body: {
        error:
          'Database table "audits" is missing one or more required columns. Apply the latest Supabase migration before retrying.',
        details: error.message,
      },
    };
  }

  return {
    status: 500,
    body: {
      error: fallbackMessage,
      details: error?.message ?? "Unknown database error",
    },
  };
}

async function insertAuditRecord(input, result) {
  let lastError = null;

  
    const shareId = createAuditShareId();
    const { data, error } = await supabase
      .from(AUDITS_TABLE)
      .insert({
        share_id: shareId,
        is_public: true,
        company_name: input.companyName,
        team_size: input.teamSize,
        primary_use_case: input.primaryUseCase,
        input,
        result,
      })
      .select(AUDIT_COLUMNS)
      .single();

    return data;
}

router.post("/", auditLimiter, validateAuditInput, async (req, res) => {
  try {
    const input = normalizeAuditInput(req.body);
    const result = runAudit(input);
    result["llmSummary"] = await queryGroq(JSON.stringify(result));
    const savedAudit = await insertAuditRecord(input, result);
    const audit = mapAuditRow(savedAudit);

    return res.status(201).json({
      id: audit.id,
      shareId: audit.shareId,
      shareUrl: audit.shareUrl,
      createdAt: audit.createdAt,
      result: audit.result,
      llmSummary: audit.result?.llmSummary ?? null,
    });
  } catch (error) {
    console.error("Create audit error:", error);
    const response = buildDatabaseError(
      error,
      "Failed to create and store audit result."
    );
    return res.status(response.status).json(response.body);
  }
});

router.patch("/:id/email", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    const { data, error } = await supabase
      .from(AUDITS_TABLE)
      .update({ email: trimmedEmail })
      .eq("id", id)
      .select(AUDIT_COLUMNS)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Audit record not found." });
    }

    const audit = mapAuditRow(data);

    await sendAuditResultEmail(audit, trimmedEmail);

    return res.json({ id: audit.id, email: audit.email, shareUrl: audit.shareUrl });
  } catch (error) {
    console.error("Update audit email error:", error);
    const response = buildDatabaseError(error, "Failed to save email address.");
    return res.status(response.status).json(response.body);
  }
});

router.get("/share/:shareId",auditLimiter, async (req, res) => {
  try {
    const { shareId } = req.params;
    const { data, error } = await supabase
      .from(AUDITS_TABLE)
      .select(AUDIT_COLUMNS)
      .eq("share_id", shareId)
      .eq("is_public", true)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Shared audit not found" });
    }

    return res.json(mapPublicAuditRow(data));
  } catch (error) {
    console.error("Fetch shared audit error:", error);
    const response = buildDatabaseError(
      error,
      "Failed to load the shared audit result."
    );
    return res.status(response.status).json(response.body);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from(AUDITS_TABLE)
      .select(AUDIT_COLUMNS)
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Audit not found" });
    }

    return res.json(mapAuditRow(data));
  } catch (error) {
    console.error("Fetch audit error:", error);
    const response = buildDatabaseError(error, "Failed to load audit.");
    return res.status(response.status).json(response.body);
  }
});

router.get("/", async (req, res) => {
  try {
    const { company, limit = 10 } = req.query;
    const parsedLimit = Math.min(parseInt(limit, 10) || 10, 50);

    let query = supabase
      .from(AUDITS_TABLE)
      .select(AUDIT_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(parsedLimit);

    if (company) {
      query = query.ilike("company_name", `%${String(company).trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const audits = (data ?? []).map(mapAuditListItem);
    return res.json({ audits, count: audits.length });
  } catch (error) {
    console.error("List audits error:", error);
    const response = buildDatabaseError(error, "Failed to fetch audits.");
    return res.status(response.status).json(response.body);
  }
});

export default router;
