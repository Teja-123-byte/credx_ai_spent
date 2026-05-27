# Metrics

---

## North Star: Qualified Leads per Week

**Definition:** A user who (a) completed an audit, (b) submitted their email, and (c) was flagged by the system as identifying ≥ $500/month in potential savings (`AUDIT_HIGH_SAVINGS_MONTHLY_THRESHOLD`).

**Why this and not something else:**

Credex is a B2B lead-generation tool, not a consumer app. "Users" and "audits" are vanity unless they produce a pipeline. A completed audit with no email is a free product delivery with zero business value. An email with no savings flag is a tire-kicker. Only the intersection of *completion + contact + high intent signal* predicts revenue.

DAU is explicitly not the North Star. Startups legitimately run one audit per quarter when they're reviewing budgets. A founder who ran the tool in January and saved $600/month is a success story — not a churn event because they didn't come back in February. Forcing a retention lens onto a tool with a natural quarterly cadence drives you toward artificial engagement features that don't close deals.

At the current stage — pre-revenue, pre-instrumentation — this metric is the only one that tells you whether the funnel is working end-to-end.

---

## Three Input Metrics

### 1. Audit Completion Rate
**Definition:** (Audits completed) ÷ (Audits started)  
**Target:** ≥ 15%  
**Why it matters:** The gap between "started" and "completed" is pure UX friction. A low rate means the form is too long, the tool catalogue is confusing, or the pricing inputs feel risky. This is fixable without changing the business model. Track by step to find exactly where users abandon.

### 2. Email Capture Rate on High-Savings Audits
**Definition:** (Emails submitted) ÷ (Audits completed where savings ≥ $500/month)  
**Target:** ≥ 35%  
**Why it matters:** When the tool surfaces real money — $600, $800, $1,200/month — users who *still* don't leave an email are saying something. Either they don't trust Credex with their contact, or the CTA at the end of the report isn't compelling. This rate is a direct proxy for trust and copy quality at the moment of maximum intent.

### 3. Audit-to-Consultation Booked Rate
**Definition:** (Consultations booked via follow-up) ÷ (Qualified leads in the same cohort, lagged 7 days)  
**Target:** ≥ 25%  
**Why it matters:** This is where lead value converts to revenue. A drop here signals a problem in the outbound sequence — wrong timing, wrong tone, or the lead went cold. It's the handoff between the product and the sales motion.

---

## What to Instrument First

The funnel has four steps. Instrument in this order:

1. **Audit started** — log an event with a session ID the moment the user begins the form. This is the denominator for everything else.
2. **Audit completed + savings amount** — log the total savings figure. This unlocks Completion Rate and the high-savings flag.
3. **Email submitted** — log the savings tier (standard / high-savings). This is the North Star numerator.
4. **Shareable link created** — log when a PDF is exported or a share link is generated. This tracks the viral loop; every share is a potential zero-CAC acquisition event.

Do not instrument page views or return visits yet. They are noise at this stage.

---

## Pivot Trigger

**If, after 200 completed audits, qualified leads per week is < 2.**

Two per week across 200 completions is a 5% email capture rate on high-savings users — far below the 35% target. At that rate, the funnel produces roughly one client every three months. That is not a business.

At that point, the question is where it's breaking:

- If completion rate is < 10%: the product has a UX problem. Fix the form before changing anything else.
- If completion rate is fine but email capture is < 15%: the trust or copy problem is downstream of the audit. Test a stronger end-of-report CTA or a value-first offer ("We'll do a 15-min Loom walkthrough of your results").
- If both are fine but consultations don't book: the sales motion is broken, not the product. The pivot is operational, not strategic.

200 audits is achievable in 2–3 weeks from a single Show HN post. That is the earliest point at which a data-driven pivot decision is possible.

