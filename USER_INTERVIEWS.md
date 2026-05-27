# User Interviews

Three conversations with potential users — founders, engineers, and students actively paying for AI tools. Each 10–15 minutes, conducted over chat or in person.

---

## Interview 1 — E.S.T.

**Role:** Final-year CS student  
**Tools:** Cursor Pro ($20/mo), ChatGPT Go ($8/mo) — $28/month total  
**Duration:** ~11 minutes

### Notes

E.S.T. uses Cursor Pro primarily for assignments and side projects. Added ChatGPT Go a few months ago because she felt Cursor's chat wasn't ideal for explaining concepts — she wanted something she could have a back-and-forth with outside the editor.

**Quotes:**
> "I know I'm paying for both but they kind of do different things for me. Cursor is for when I'm actually writing code. ChatGPT is more like... when I need something explained or I'm stuck on a concept."

> "₹2,000 a month is a lot for a student. I justifies it because it saves me hours, but I'd definitely switch if I could get the same thing cheaper."

> "I never thought about whether Cursor already does what ChatGPT does for me. Probably does, actually."

**Most surprising thing:** She had never compared the two tools for functional overlap. When I walked through what Cursor Pro's chat can do, she paused and said *"wait, I might just be paying for the same thing twice."* She hadn't audited her own stack in her head, even though she knew the individual prices.

**What it changed about the design:** The results page needs to call out *functional overlap* between tools explicitly — not just "cheaper plan exists." Showing two tools that cover the same use case side-by-side is more valuable than showing a cheaper alternative in isolation. Added overlap detection as a priority feature in the audit engine.

---

## Interview 2 — N.Y.

**Role:** 3rd-year engineering student, building a freelance client project  
**Tools:** ChatGPT Go ($8/mo), Claude Pro ($17/mo) — $25/month total  
**Duration:** ~10 minutes

### Notes

N.Y. started with ChatGPT Go and added Claude specifically because a client project required longer document drafting and he found ChatGPT's context window wasn't holding up. Uses them for genuinely different tasks and was resistant to the idea of consolidating.

**Quotes:**
> "ChatGPT is faster for quick things. Claude is better when I need it to actually think through something long. I've tried doing everything on one and it doesn't work."

> "I know the total is 25 a month. That's fine right now because I'm billing the client. But when this project ends, honestly, one of them is going."

> "If someone showed me a plan that did both properly I'd switch immediately. But I don't think that exists."

**Most surprising thing:** He had already mentally planned to drop one tool when the freelance project ended — his two-tool setup is *intentionally temporary*. He wasn't overspending out of ignorance; he had made a deliberate cost-benefit call with an exit plan. This was the most self-aware response of the three.

**What it changed about the design:** The audit result shouldn't always frame multi-tool usage as inefficiency. If use-cases across tools are non-overlapping, the recommendation should acknowledge that rather than blindly pushing consolidation. Added a "use-cases don't overlap" path to the recommendation copy.

---

## Interview 3 — N.K.

**Role:** 2nd-year student, uses AI mainly for studying and writing assignments  
**Tools:** ChatGPT Go ($8/mo), Gemini AI Plus ($7.99/mo) — ~$16/month total  
**Duration:** ~12 minutes

### Notes

N.K. is on the two cheapest paid plans and is still uncomfortable with the combined cost. Signed up for Gemini because Google One bundled storage with it — he needed the storage more than the AI. The AI was almost incidental.

**Quotes:**
> "I took Gemini because of the storage honestly. The AI is okay, I use it sometimes. ChatGPT I use more."

> "₹1,300 a month doesn't sound like much but I'm a student. If I could cut it to ₹800 and get the same work done I would."

> "I wouldn't share my audit publicly. Like, people would judge me for spending on this stuff. I'd maybe send it to a friend privately if they were asking about the same tools."

**Most surprising thing:** He's paying for Gemini primarily for Google Drive storage, not for AI. The AI is a side effect. This means the "monthly spend" he reports for Gemini isn't purely AI spend — it's bundled utility. An audit tool that treats his $7.99 as pure AI cost is technically wrong about what he's actually buying.

**What it changed about the design:** The audit form should probably ask *why* a user is on a plan, not just which plan. A "primary use case" or "how often do you use this?" field would let the engine weight recommendations more accurately. Currently the engine assumes all spend is intentional AI usage — N.K.'s case shows that's not always true. Added primary use case as a form field.

