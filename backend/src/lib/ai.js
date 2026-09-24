import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in backend environment variables.");
  }
  return new GoogleGenAI({ apiKey });
}

async function generateWithFallback(ai, options) {
  const models = [
    "gemini-3.6-flash",
    "gemini-3-flash-preview",
    "gemini-2.5-pro",
    "gemini-3.5-flash",
    "gemini-flash-latest",
  ];
  let lastError = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        ...options,
        model,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn(`Model ${model} unavailable (${err.message}). Trying fallback...`);
      lastError = err;
    }
  }
  throw lastError || new Error("Failed to generate content from AI models.");
}

export async function generateSocraticHint({ problemTitle, problemDescription, code, language, hintLevel = 1 }) {
  const ai = getAiClient();

  const systemInstruction = `You are an elite AI Coding Mentor in a live technical interview application called Talent-IQ.
Your goal is to guide candidates without giving away full solutions unless requested.

Hint Level Guidelines:
- Level 1: Gentle conceptual push or pointing out a logic misunderstanding.
- Level 2: Specific guidance on data structures, algorithms, edge cases, or runtime complexity.
- Level 3: Concrete structural suggestion or pseudocode breakdown.

Keep responses concise, formatted cleanly with Markdown, encouraging, and focused on helping the candidate figure it out themselves.`;

  const prompt = `Problem Title: ${problemTitle || "Coding Problem"}
Problem Description: ${problemDescription || "No description provided"}
Programming Language: ${language}

Current Candidate Code:
\`\`\`${language}
${code}
\`\`\`

Target Hint Level: ${hintLevel} (1 = Concept, 2 = Edge cases/Approach, 3 = Pseudocode/Detailed)

Provide a helpful, encouraging hint for this candidate.`;

  return await generateWithFallback(ai, {
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
}

export async function explainCodeError({ code, language, errorOutput, problemTitle }) {
  const ai = getAiClient();

  const prompt = `The candidate executed code for problem "${problemTitle}" in ${language} and encountered an error/output issue.

Code:
\`\`\`${language}
${code}
\`\`\`

Execution Output / Error Trace:
${errorOutput}

Explain in simple, clear terms why this error happened and give a hint on how to fix it.`;

  return await generateWithFallback(ai, {
    contents: prompt,
  });
}
