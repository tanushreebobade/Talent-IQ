import express from "express";

const router = express.Router();

const JUDGE0_API = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

const JUDGE0_LANG_MAP = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

router.post("/run", async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ success: false, error: "Language and code are required." });
  }

  const normalizedLang = (language || "").toLowerCase().trim();
  const languageId = JUDGE0_LANG_MAP[normalizedLang];

  if (!languageId) {
    return res.status(400).json({ success: false, error: `Unsupported language: ${language}` });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(JUDGE0_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const stdout = data.stdout || "";
      const stderr = data.stderr || data.compile_output || "";

      if (stderr && !stdout) {
        return res.json({
          success: false,
          output: "",
          error: stderr.trim(),
        });
      }

      return res.json({
        success: true,
        output: stdout ? stdout.trim() : "No output",
        error: stderr ? stderr.trim() : undefined,
      });
    }
  } catch (err) {
    console.error("Backend Judge0 execution error:", err.message);
  }

  // Fallback for JavaScript if external compiler is unreachable
  if (normalizedLang === "javascript") {
    try {
      const vm = await import("node:vm");
      let logs = [];
      const context = {
        console: {
          log: (...args) => logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
          error: (...args) => logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
        },
      };
      vm.createContext(context);
      vm.runInContext(code, context, { timeout: 4000 });
      return res.json({
        success: true,
        output: logs.length > 0 ? logs.join("\n") : "No output",
      });
    } catch (vmErr) {
      return res.json({
        success: false,
        output: "",
        error: vmErr.message,
      });
    }
  }

  return res.status(500).json({
    success: false,
    error: "Code execution service unavailable. Please try again.",
  });
});

export default router;
