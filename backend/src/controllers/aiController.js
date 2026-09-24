import { generateSocraticHint, explainCodeError } from "../lib/ai.js";

export const getAiHint = async (req, res) => {
  try {
    const { problemTitle, problemDescription, code, language, hintLevel } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: "Code and language are required" });
    }

    const hint = await generateSocraticHint({
      problemTitle,
      problemDescription,
      code,
      language,
      hintLevel: hintLevel || 1,
    });

    return res.status(200).json({ success: true, hint });
  } catch (error) {
    console.error("AI Hint Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to generate AI hint" });
  }
};

export const getErrorExplanation = async (req, res) => {
  try {
    const { code, language, errorOutput, problemTitle } = req.body;

    if (!errorOutput) {
      return res.status(400).json({ success: false, message: "Error output is required" });
    }

    const explanation = await explainCodeError({
      code,
      language,
      errorOutput,
      problemTitle,
    });

    return res.status(200).json({ success: true, explanation });
  } catch (error) {
    console.error("AI Error Explanation Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to explain error" });
  }
};
