import React, { useState } from "react";
import { SparklesIcon, LightbulbIcon, BugIcon, Loader2Icon, BotIcon } from "lucide-react";
import { getAiHint, explainAiError } from "../api/ai";

export default function AICopilotPanel({ problem, code, selectedLanguage, output }) {
  const [hintLevel, setHintLevel] = useState(1);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("hint"); // 'hint' or 'error'

  const handleFetchHint = async (level) => {
    setIsLoading(true);
    setAiResponse("");
    setHintLevel(level);
    try {
      const data = await getAiHint({
        problemTitle: problem?.title,
        problemDescription: problem?.description,
        code,
        language: selectedLanguage,
        hintLevel: level,
      });
      if (data.success) {
        setAiResponse(data.hint);
      }
    } catch (err) {
      console.error("AI Hint Error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to generate AI hint.";
      setAiResponse(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainError = async () => {
    if (!output || (!output.error && !output.stderr && !output.output)) {
      setAiResponse("Please run your code first to generate output or error traces.");
      return;
    }

    setIsLoading(true);
    setAiResponse("");
    try {
      const errorTrace = output.error || output.stderr || output.output;
      const data = await explainAiError({
        code,
        language: selectedLanguage,
        errorOutput: errorTrace,
        problemTitle: problem?.title,
      });
      if (data.success) {
        setAiResponse(data.explanation);
      }
    } catch (err) {
      console.error("AI Error Analysis Error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to generate error analysis.";
      setAiResponse(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1a1e1d] text-[#222b2a] dark:text-zinc-100 border border-[#222b2a]/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm transition-colors">
      {/* Panel Header */}
      <div className="px-4 py-3 bg-zinc-50 dark:bg-white/5 border-b border-[#222b2a]/10 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BotIcon className="w-4 h-4 text-[#83a971]" />
          <div>
            <h3 className="text-sm font-bold text-[#222b2a] dark:text-white">
              AI Mentor & Hints
            </h3>
            <p className="text-[11px] text-[#222b2a]/60 dark:text-zinc-400">AI guidance powered by Gemini</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-200/60 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-300/50 dark:border-zinc-700/60">
          <button
            onClick={() => setActiveTab("hint")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              activeTab === "hint"
                ? "bg-[#83a971] text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <LightbulbIcon className="w-3.5 h-3.5" />
            Hints
          </button>
          <button
            onClick={() => setActiveTab("error")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              activeTab === "error"
                ? "bg-[#83a971] text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <BugIcon className="w-3.5 h-3.5" />
            Explain Error
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {activeTab === "hint" ? (
          <div className="space-y-3">
            <p className="text-xs text-[#222b2a]/70 dark:text-zinc-300 font-medium">
              Select a hint level tailored to your current code:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleFetchHint(1)}
                disabled={isLoading}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  hintLevel === 1
                    ? "bg-[#83a971]/15 border-[#83a971]/50 text-[#83a971] dark:text-emerald-400 shadow-xs"
                    : "bg-zinc-50 dark:bg-white/5 border-[#222b2a]/10 dark:border-white/10 text-[#222b2a]/80 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10"
                }`}
              >
                Level 1
                <span className="block text-[10px] text-[#222b2a]/60 dark:text-zinc-400 font-normal">Concept Push</span>
              </button>
              <button
                onClick={() => handleFetchHint(2)}
                disabled={isLoading}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  hintLevel === 2
                    ? "bg-[#83a971]/15 border-[#83a971]/50 text-[#83a971] dark:text-emerald-400 shadow-xs"
                    : "bg-zinc-50 dark:bg-white/5 border-[#222b2a]/10 dark:border-white/10 text-[#222b2a]/80 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10"
                }`}
              >
                Level 2
                <span className="block text-[10px] text-[#222b2a]/60 dark:text-zinc-400 font-normal">Edge Cases</span>
              </button>
              <button
                onClick={() => handleFetchHint(3)}
                disabled={isLoading}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  hintLevel === 3
                    ? "bg-[#83a971]/15 border-[#83a971]/50 text-[#83a971] dark:text-emerald-400 shadow-xs"
                    : "bg-zinc-50 dark:bg-white/5 border-[#222b2a]/10 dark:border-white/10 text-[#222b2a]/80 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10"
                }`}
              >
                Level 3
                <span className="block text-[10px] text-[#222b2a]/60 dark:text-zinc-400 font-normal">Pseudocode</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#222b2a]/70 dark:text-zinc-300 font-medium">
              Encountering runtime or compilation errors? Let AI analyze what went wrong and how to fix it:
            </p>
            <button
              onClick={handleExplainError}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#83a971] hover:bg-[#729660] text-white rounded-lg text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BugIcon className="w-4 h-4" />
              Analyze Latest Output Error
            </button>
          </div>
        )}

        {/* AI Output Result Box */}
        <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-[#171a19] border border-[#222b2a]/10 dark:border-white/10 min-h-[160px] relative transition-colors">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-100/90 dark:bg-[#171a19]/90 rounded-xl backdrop-blur-xs z-10">
              <Loader2Icon className="w-6 h-6 animate-spin text-[#83a971]" />
              <span className="text-xs font-medium text-[#222b2a]/70 dark:text-zinc-400">Consulting Gemini AI...</span>
            </div>
          ) : aiResponse ? (
            <div className="prose dark:prose-invert prose-xs max-w-none text-[#222b2a] dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
              <div className="flex items-center gap-2 text-[#83a971] font-bold mb-2 text-xs border-b border-[#222b2a]/10 dark:border-white/10 pb-2">
                <BotIcon className="w-4 h-4 text-[#83a971]" />
                AI Mentor Response:
              </div>
              {aiResponse}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
              <BotIcon className="w-8 h-8 mb-2 stroke-[1.5] text-[#83a971]/60" />
              <p className="text-xs font-medium text-[#222b2a]/60 dark:text-zinc-400">
                Click a hint level or analyze output error to get real-time assistance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

