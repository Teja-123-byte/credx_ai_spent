import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function queryGroq(AUDIT_JSON) {
  const prompt = `You are an AI software spend optimization assistant.

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
{${AUDIT_JSON}}`;
  const response = await client.responses.create({
    model: "openai/gpt-oss-20b",
    input: prompt,
  });

  return response.output_text;
}

