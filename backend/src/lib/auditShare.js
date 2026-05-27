import crypto from "node:crypto";

const SHARE_ID_BYTES = 9;

function formatUsd(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(Number(amount || 0));
}

function getPublicAppBaseUrl() {
  return (
    process.env.PUBLIC_URL
  )
    .trim()
    .replace(/\/+$/, "");
}

export function createAuditShareId() {
  return crypto.randomBytes(SHARE_ID_BYTES).toString("base64url");
}

export function buildAuditShareUrl(shareId) {
  const publicBaseUrl = getPublicAppBaseUrl();
  const path = `/audit/${shareId}`;
  return publicBaseUrl ? `${publicBaseUrl}${path}` : path;
}

export function buildAuditSharePreview({ shareId, companyName, result }) {
  const shareUrl = buildAuditShareUrl(shareId);
  const toolCount = Array.isArray(result?.breakdown) ? result.breakdown.length : 0;
  const currentMonthlySpend = Number(result?.totalMonthlySpend ?? 0);
  const monthlySavings = Number(result?.totalPotentialMonthlySavings ?? 0);
  const annualSavings = Number(result?.totalPotentialAnnualSavings ?? 0);
  const companyLabel = companyName?.trim() || "AI spend audit";

  if (monthlySavings > 0) {
    return {
      title: `${companyLabel} can save ${formatUsd(monthlySavings)}/month on AI tools`,
      description: `${toolCount} tool${toolCount === 1 ? "" : "s"} audited. Current AI spend is ${formatUsd(currentMonthlySpend)}/month with ${formatUsd(annualSavings)}/year in potential savings.`,
      url: shareUrl,
      type: "website",
      siteName: "CredX AI Spend Audit",
    };
  }

  return {
    title: `${companyLabel} AI spend audit`,
    description: `${toolCount} tool${toolCount === 1 ? "" : "s"} reviewed. Current AI spend is ${formatUsd(currentMonthlySpend)}/month and the stack appears close to optimized.`,
    url: shareUrl,
    type: "website",
    siteName: "CredX AI Spend Audit",
  };
}
