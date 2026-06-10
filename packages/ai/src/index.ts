import OpenAI from "openai";
import { z } from "zod";

export const AiTriageSchema = z.object({
  category: z.string(),
  priority: z.string(),
  labels: z.array(z.string()),
  rationale: z.string()
});

export type AiTriage = z.infer<typeof AiTriageSchema>;

export async function aiTriageIssue(input: {
  title: string;
  body: string;
  apiKey?: string;
}): Promise<AiTriage | null> {
  const apiKey = input.apiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are an OSS maintainer assistant. Return compact JSON with category, priority, labels, and rationale."
      },
      {
        role: "user",
        content: `Title: ${input.title}\n\nBody:\n${input.body}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) return null;

  try {
    return AiTriageSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}
