import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function queryGroq(AUDIT_JSON) {
  const prompt = `You are an AI SaaS cost optimization assistant.

Given a JSON audit report, generate ONE concise personalized summary paragraph (~100 words).

Requirements:
- Write in a professional but conversational tone.
- Focus on the biggest savings opportunity first.
- Mention total monthly and annual spend.
- Mention the number of tools analyzed.
- Highlight whether the user is overspending or already optimized.
- Quantify potential savings clearly.
- Reference the user’s actual use cases when relevant.
- Avoid bullet points, headings, hype, or generic advice.
- Do not repeat raw JSON fields mechanically.
- Keep the output between 80–120 words.
- End with one actionable recommendation sentence.

Input JSON:
{${AUDIT_JSON}}
    `;
  const response = await client.responses.create({
    model: "openai/gpt-oss-20b",
    input: prompt,
  });

  return response.output_text;
}

