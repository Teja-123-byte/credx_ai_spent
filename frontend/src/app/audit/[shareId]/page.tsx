import AuditResults from "../../../components/AuditResults";
import type { AuditReport, SharedAuditResponse } from "../../../lib/types";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}
async function fetchSharedAudit(shareId: string): Promise<AuditReport> {
  const baseUrl = API_BASE.replace(/\/+$/, "");
  const url = `${baseUrl}/audit/share/${encodeURIComponent(shareId)}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    notFound();
  }

  const data = (await response.json()) as SharedAuditResponse;

  if (!data || !data.result) {
    notFound();
  }

  return {
    ...data.result,
    shareId: data.shareId,
    shareUrl: data.shareUrl,
    createdAt: data.createdAt,
    companyName: data.companyName ?? null,
  };
}

export default async function Page({
  params,
}: {
  params: { shareId: string };
}) {
  const result = await fetchSharedAudit(params.shareId);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <AuditResults result={result} mode="public" />
    </div>
  );
}
