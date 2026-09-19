// OneCompiler API is a service for code execution

const ONECOMPILER_API = "https://api.onecompiler.com/v1/run";
const API_KEY = import.meta.env.VITE_ONLINE_COMPILER_API_KEY;

const LANGUAGE_MAP = {
  javascript: { language: "nodejs", extension: "js" },
  python: { language: "python", extension: "py" },
  java: { language: "java", extension: "java" },
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_MAP[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await fetch(ONECOMPILER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        language: languageConfig.language,
        files: [
          {
            name: `main.${languageConfig.extension}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();

    if (data.status !== "success") {
       return {
        success: false,
        output: data.stdout || "",
        error: data.exception || data.stderr || "Execution failed",
      };
    }

    const stderr = data.stderr || "";
    if (stderr) {
      return {
        success: false,
        output: data.stdout || "",
        error: stderr,
      };
    }

    return {
      success: true,
      output: data.stdout || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}
