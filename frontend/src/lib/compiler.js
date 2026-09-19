import axiosInstance from "./axios";

const JUDGE0_API = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

const JUDGE0_LANG_MAP = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

/**
 * Executes code via backend compiler service /api/code/run.
 * Falls back to direct client-side call to Judge0 CE if backend is unreachable.
 *
 * @param {string} language - programming language (javascript, python, java, cpp)
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  const sanitizedCode = typeof code === "string" ? code.trim() : "";
  if (!sanitizedCode) {
    return {
      success: false,
      error: "Source code cannot be empty.",
    };
  }

  const normalizedLang = (language || "").toLowerCase().trim();

  // 1. Primary: Call backend compiler route /api/code/run
  try {
    const { data } = await axiosInstance.post("/code/run", {
      language: normalizedLang,
      code: sanitizedCode,
    });
    if (data && typeof data.success === "boolean") {
      return data;
    }
  } catch (backendError) {
    console.warn("Backend compiler route unreachable, trying direct Judge0 call:", backendError?.message);
  }

  // 2. Fallback: Direct client call to Judge0 CE API (supports browser CORS)
  const languageId = JUDGE0_LANG_MAP[normalizedLang];
  if (!languageId) {
    return {
      success: false,
      error: `Unsupported language: ${language}`,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(JUDGE0_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: sanitizedCode,
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
        return { success: false, output: "", error: stderr.trim() };
      }

      return {
        success: true,
        output: stdout ? stdout.trim() : "No output",
        error: stderr ? stderr.trim() : undefined,
      };
    }
  } catch (clientError) {
    console.error("Direct Judge0 client execution failed:", clientError);
  }

  return {
    success: false,
    error: "Failed to execute code. Please check your connection and try again.",
  };
}
