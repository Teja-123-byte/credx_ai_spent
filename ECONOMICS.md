# Economics

All inputs below are estimates. Where a number is uncertain, the assumption is stated explicitly. Approximate numbers > no numbers.

---

## Revenue Model Assumption

Credex monetises by converting the free audit tool into consulting engagements. The tool is top-of-funnel. Revenue has two components:

| Component | Price | Duration |
|---|---|---|
| Implementation consultation (one-time) | $1,500 | One-off |
| Ongoing monitoring retainer | $400/month | Avg. 5 months |
| **Blended LTV per client** | **$3,500** | |

*Rationale: seed-stage startups have real budget ($500–$5k/month in AI tools) but no internal procurement. A $1,500 one-time fee to save $800/month is a 2-month payback — an easy sell. Retainer churn is high at this stage; 5 months is conservative.*

---

## What Is a Converted Lead Worth?

**Lead** = a user who completed an audit AND submitted their email.

```
Lead → consultation booked:    25%
Consultation → paying client:  50%
Lead → paying client:          12.5%

Lead value = 12.5% × $3,500 LTV = $437.50
```

**High-savings lead** (identified ≥ $500/month in savings — the threshold in the codebase):

```
Higher intent → higher close rate:  30%
Lead → paying client:               30% × 50% = 15%

High-savings lead value = 15% × $3,500 = $525
```

---

## CAC by Channel

No paid budget. Founder time costed at **$50/hour** (opportunity cost proxy).

| Channel | Hours/month | Est. clients/month | Time-based CAC |
|---|---|---|---|
| Show HN post (one-time) | 4 hrs | 2 (burst) | **$100** |
| X reply hunting (10 replies/day) | 20 hrs | 1.5 | **$667** |
| Reddit posts (r/ExperiencedDevs, r/SaaS) | 6 hrs | 0.75 | **$400** |
| Discord drops (Cursor, AI Engineer) | 4 hrs | 0.5 | **$400** |
| YC cold email (20 targets/batch) | 4 hrs | 0.5 | **$400** |
| Viral audit links (zero incremental effort) | 0 hrs | 0.5 | **$0** |

**Blended CAC (months 1–3):** ~$420  
**Blended CAC (months 6+):** drops to ~$200 as referrals and shared audit links compound.

---

## Conversion Funnel to Profitability

```
Visitors              →  100%
Audit started         →   20%   (low friction; no signup)
Audit completed       →   15%   (multi-step form; some drop mid-way)
Email submitted       →   10%   (optional; not all users want follow-up)
Consultation booked   →   25%   (of email leads; triggered by high-savings flag)
Paying client         →   50%   (of consultations)

Visitor → paying client:  0.15 × 0.10 × 0.25 × 0.50 = 0.19%
Revenue per visitor:      0.0019 × $3,500 = $6.65
```

**Break-even visitors for $3,500 client:**
```
$3,500 / $6.65 ≈ 527 visitors to acquire one paying client
```

At $420 blended CAC and $3,500 LTV:
```
Gross margin per client:  $3,500 − $420 = $3,080  (88%)
Payback period:           < 1 month (cash upfront for consultation)
```

Infrastructure cost is near zero: Supabase free tier, Anthropic free credits, Resend free tier ≈ **$0/month** until meaningful scale.

---

## What Would Have to Be True for $1M ARR in 18 Months

**Target:** $1,000,000 ARR = $83,333 MRR

### Model A — Retainer-Heavy
```
ACV:          $4,800/year ($400/month × 12)
Clients needed for $1M ARR: 1,000,000 / 4,800 ≈ 209 active retainer clients

To reach 209 by month 18, assuming 5-month avg retention:
  → Need ~42 new clients/month by month 12
  → Avg across 18 months: ~25 new clients/month

At 12.5% lead → client conversion:
  → Need 200 leads/month = 2,000 audits/month = 13,333 visitors/month
```

**Verdict:** Possible, but requires the viral loop from shared audit links to work. Without it, 13k organic visitors/month is a content marketing problem arriving in month 18, not month 6.

### Model B — Higher ACV Per Client (requires a sales motion)
```
ACV:          $12,000/year ($1,000/month retainer or $8k one-time + $4k retainer)
Clients needed: 1,000,000 / 12,000 ≈ 84 active clients

New clients/month needed: ~5–6 by month 12
At 12.5% lead → client: 40–50 leads/month = 2,500–3,000 visitors/month
```

**Verdict:** $1M ARR in 18 months is realistic under Model B — if Credex can close at $12k ACV consistently, which requires a sales call, a champion inside the company, and proof of savings. The tool already generates the proof; the missing piece is a repeatable sales motion after the audit.

---

## What Must Be True Regardless of Model

| Assumption | Required value | Current state |
|---|---|---|
| Audit completion rate | ≥ 15% of visitors | Achievable; form is low-friction, no login |
| Email capture rate | ≥ 10% of completions | Achievable; optional email field exists post-value |
| Consultation close rate | ≥ 40% | Requires polished follow-up sequence; not yet built |
| Viral coefficient | ≥ 0.2 new audits per shared link | Shareable link is built; needs real sharing data |
| ACV | ≥ $5,000 | Requires a defined pricing page and sales playbook |
| Churn | ≤ 15%/month on retainer | Requires demonstrable ongoing value beyond one-time audit |

**Instrumentation is the most valuable thing to build in week 2.** Without tracking audit → email → consultation, the conversion numbers above are unverifiable guesses.

---

## Summary

| Metric | Value |
|---|---|
| Blended LTV | $3,500 |
| High-savings lead value | $525 |
| Standard lead value | $437 |
| Blended CAC (early) | ~$420 |
| CAC at scale | ~$200 |
| LTV:CAC ratio | ~8:1 early, ~17:1 at scale |
| Break-even visitors per client | ~527 |
| Visitors/month needed for $1M ARR | 3k–13k depending on ACV |
| Gross margin | ~88% |

