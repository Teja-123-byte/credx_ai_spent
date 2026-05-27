# Prompts

Every LLM prompt used inside the product, why each constraint was written the way it was, and what earlier versions looked like that didn't work.

---

## 1. Audit Summary Prompt

**Triggered by:** Results page render — fires once after the audit engine returns  
**Model:** `openai/gpt-oss-20b` via GROQ

### The Prompt

```
You are an AI software spend optimization assistant.

Using the provided JSON audit report, write a single personalized summary paragraph of approximately 100 words.

Guidelines:
- Maintain a professional yet natural tone.
- Start with the most impactful cost-saving insight.
- Include both monthly and yearly spending totals.
- Mention how many tools were reviewed.
- Indicate whether the current stack is cost-efficient or showing signs of overspending.
- Clearly state the estimated savings opportunity.
- Refer to the user’s primary use cases when appropriate.
- Avoid bullet points, titles, marketing language, or robotic repetition of JSON values.
- Keep the response within 80–120 words.
- Finish with one clear, practical recommendation sentence.

Audit Report JSON:
{${AUDIT_JSON}}
```

---

### Why It Was Written This Way

**`You are an AI SaaS cost optimization assistant.`**  
Without a role assignment, the model responds as a generic assistant and hedges everything ("it depends on your needs…"). The role anchors the register and keeps the output opinionated.

**`generate ONE concise personalized summary paragraph`**  
The word "ONE" is doing real work. Early versions without it produced multiple paragraphs — an intro, a body, a closing sentence — which looked verbose next to the structured breakdown the page already shows. "Personalized" is there to stop the model from writing something that could have been generated without reading the data.

**`Focus on the biggest savings opportunity first.`**  
Without this, the model would summarize tools in the order they appeared in the input, which is arbitrary. Users scan the first sentence. If the biggest win is buried at the end, the summary fails as a hook.

**`Avoid bullet points, headings, hype, or generic advice.`**  
The results page already has a structured breakdown. A bulleted LLM summary on top of that is redundant and visually noisy. "Hype" and "generic advice" are explicit because models default to things like "optimizing your AI spend is critical in today's competitive landscape" if you don't rule it out.

**`Do not repeat raw field names from the JSON.`**  
Early versions would output field names verbatim: "totalPotentialMonthlySavings: 340." This constraint forces the model to paraphrase — "you could save $340/month" instead of citing internal field names at the user.

**`Keep the output between 80–120 words.`**  
A hard word range is more reliable than "concise." The results page has a fixed card for the summary. Below 80 words it looks empty; above 120 it overflows. The range forces enough specificity without padding.

**`End with one actionable recommendation sentence.`**  
The last sentence is the one users remember. Without this constraint, the model often ends with a hedge or a restatement. Forcing an action sentence means the summary closes with something the user can actually do.

---

### What Didn't Work

**Version 1 — No constraints, just the role and the data**

Output was unpredictable in length (40–500 words) and structure. Unusable for a UI slot with fixed dimensions.

**Version 2 — Word limit only**

Length became consistent but content didn't. The model would spend the entire 100 words describing the input data structure rather than giving a useful takeaway.

**Version 3 — Added tone and structure constraints, no "one paragraph" instruction**

The model started producing two paragraphs: a financial summary and a recommendation section. This duplicated the structured breakdown already on the page and confused users about which source to trust.

**Version 4 — Added "ONE paragraph" and "avoid bullet points"**

This is essentially what landed. The remaining issue was the model occasionally opening with "Based on the data provided..." — acknowledging the prompt format rather than speaking directly to the user. Adding "Do not repeat raw field names" suppressed this pattern.

---

