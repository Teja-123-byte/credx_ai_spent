import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuditResultEmail(audit, email) {
    try {
          if (audit.shareUrl) {
            await resend.emails.send({
              from: "SpendLens <onboarding@resend.dev>",
              to: email,
              subject: "Your SpendLens audit is ready",
              html: `
              <div style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a;">
                <h1 style="font-size: 24px; margin-bottom: 12px;">Your SpendLens Audit is Ready</h1>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Hi there,</p>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Your audit is complete and ready to view. Click the button below to open your report.</p>
                <a href="${audit.shareUrl}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#38bdf8;color:#0f172a;font-weight:700;text-decoration:none;">View your audit</a>
                <p style="font-size: 14px; line-height: 1.6; margin-top: 24px; color: #475569;">If that button does not work, copy and paste this URL into your browser:</p>
                <p style="font-size: 14px; line-height: 1.6; word-break: break-all;">${audit.shareUrl}</p>
                <p style="font-size: 14px; line-height: 1.6; margin-top: 24px; color: #475569;">Thanks for using SpendLens.</p>
              </div>
              `,
            });
          }
        } catch (sendError) {
          console.error("Resend email failed:", sendError);
        }
}