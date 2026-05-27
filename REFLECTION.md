# Reflection - Week 1

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug I hit this week was a silent logic error in the audit engine: annual billing recommendations were showing up in the recommendation list, but their savings were not actually contributing to the audit totals. What made it tricky was that nothing crashed. The UI still rendered, the recommendation card looked correct, and the report felt plausible, so this was the kind of bug that could easily ship and quietly reduce trust in the product.

My first hypothesis was that the problem lived in the sorting or rendering layer. I thought maybe `annual_billing` recommendations were being deprioritized or displayed without affecting totals because of a frontend formatting mistake. After that, I considered whether the annual discount values in `pricingData.js` were missing or inconsistent for some tools. The third hypothesis, which turned out to be right, was that the recommendation object shape itself was inconsistent across recommendation types.

What worked was writing a focused backend test around a simple case: a Cursor Teams plan where I expected both a downgrade recommendation and an annual-billing recommendation. Once I had that test, I inspected the reducer in `runAudit()` and compared it to the data coming back from `annualBillingHint()`. The reducer summed `recommendation.monthlySavings`, but `annualBillingHint()` only returned `annualSavings`. That meant the recommendation existed, but it contributed `0` to total monthly savings.

I briefly considered patching the reducer to derive monthly savings from `annualSavings / 12`, but that felt like hiding a contract problem instead of fixing it. The real fix was to make `annualBillingHint()` return both `monthlySavings` and `annualSavings`, then verify the totals through tests. Once that was in place, the test passed and the totals matched the recommendation list exactly.

## 2. A decision I reversed mid-week, and what made me reverse it

The biggest decision I reversed mid-week was how I thought about the system boundary. Earlier in the week, I was still reasoning about the app as if the frontend was the main product and the backend was mostly a helper layer. That assumption showed up in older docs and in how I mentally modeled the feature set: form in the browser, instant result, then maybe some optional backend persistence later. By the end of the week, I reversed that completely.

What changed my mind was reading the actual code with more discipline and following the real request flow instead of the intended one. `POST /audit` is not a cosmetic endpoint. It validates the request, runs the audit engine, calls Groq to generate the summary, persists the audit in Supabase, and returns the identifiers that power `/result` and `/audit/[shareId]`. The backend is not a nice-to-have; it is the system of record. I also noticed `backend/src/db/supabase.js` throws immediately if Supabase variables are missing, which removed any illusion that database persistence was still optional in the current implementation.

That reversal mattered because it changed both my engineering priorities and my documentation priorities. Instead of describing the product as a client-side calculator with some backend extras, I started treating it as a backend-owned audit workflow with a frontend presentation layer. That led directly to the architecture rewrite, the README rewrite, and the decision to test the backend audit engine first. In hindsight, this was less about “changing my mind” randomly and more about admitting that the codebase had already evolved past my original mental model, and my job was to align with reality rather than keep narrating the older story.

## 3. What I would build in week 2 if I had it

If I had a full week 2, I would focus less on adding surface-level features and more on turning the project from a convincing prototype into a reliable product. The first thing I would build is a single source of truth for pricing data. Right now the frontend form uses `frontend/src/lib/pricingData.ts`, while the backend audit engine and validation logic use `backend/src/lib/pricingData.js`. That duplication is a real product risk, because the UI can drift away from the rules that actually generate the audit. I would either move pricing into a shared package or make the frontend consume backend pricing directly.

The second thing I would build is resilience around external services. Right now audit creation depends on Groq succeeding during `POST /audit`, which means an upstream LLM issue can block the whole product. I would make LLM summaries best-effort: create and save the audit first, then attach a summary if the model call succeeds. I would take a similar approach with email delivery by making it asynchronous and more observable.

The third thing I would build is better public sharing. The backend already returns Open Graph preview data for shared audits, but the Next.js route still does not wire that into `generateMetadata()`. That means the shareable report is structurally there but not fully optimized for actual distribution. I would fix that, then add a small branded OG image so public links are genuinely attractive to share.

If I still had time after those reliability tasks, I would build a scenario planner: “What happens if I drop tool X, move tool Y to annual billing, and compare before vs after?” That would turn the app from an audit snapshot into a decision-making tool.

## 4. How I used AI tools

I used AI tools in three different ways this week: GitHub Copilot for in-editor speed, Claude for reasoning and structured debugging, and component structure when I wanted another way of framing a problem. Each tool was useful, but only in a narrow band where the cost of being slightly wrong was low and easy for me to verify.

Copilot was most useful for repetitive work: filling in route handlers, TypeScript interfaces, JSX scaffolding, and repetitive pricing object edits. Claude was more useful when I needed to reason about the system, especially around test coverage, CI setup, and making documentation match the real request flow. Claude was helpful when I wanted fast variations on copy or layout patterns, but I treated those outputs as drafts, not decisions.

What I did not trust AI with was pricing truth, production assumptions, and subtle business logic. I did not trust it to tell me whether the current architecture was still client-side or backend-driven; I checked the code. I did not trust it to get environment variable names right; I verified them against the actual files. I also did not trust it with audit math unless I had a test around the behavior.


## 5. Self-rating on a 1-10 scale

- **Discipline: 7/10.** I showed decent consistency by keeping the project moving across frontend, backend, tests, and docs, but I also had a few points where my mental model lagged behind the actual code and I should have validated reality sooner.

- **Code quality: 7/10.** The strongest part of the codebase is the now-tested audit engine and the clearer backend flow, but there are still rough edges like duplicated pricing catalogs and external-service coupling that keep it from feeling fully mature.

- **Design sense: 8/10.** The landing page and audit result experience have a clear visual personality instead of looking like generic boilerplate, and even though the form can still be cleaner, the product already feels like something real rather than a bare assignment.

- **Problem-solving: 8/10.** I think I did a good job this week of not just patching symptoms, especially when I traced the annual-billing bug back to a data-contract mismatch and when I corrected the architecture narrative after reading the real request flow.

- **Entrepreneurial thinking: 7/10.** The shareable report, post-value email capture, and public-audit flow are all product-minded decisions, but week 2 still needs better funnel thinking, metadata polish, and a stronger plan for how this turns interest into actual usage or revenue.
