import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, SendIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  isSubmitting,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onSubmitCode,
}) {
  return (
    <div className="h-full bg-[#1a1e1d] flex flex-col overflow-hidden min-w-0">
      {/* Panel Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#171a19] border-b border-white/10 shrink-0 gap-2">
        <div className="flex items-center gap-2.5">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage]?.icon || "/javascript.png"}
            alt={LANGUAGE_CONFIG[selectedLanguage]?.name || selectedLanguage}
            className="w-4 h-4"
          />
          <select
            className="px-2.5 py-1 rounded bg-[#222b2a] text-white border border-white/15 text-xs font-medium focus:outline-none focus:border-[#83a971]"
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key} className="bg-[#1a1e1d]">
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* RUN CODE BUTTON */}
          <button
            className="px-3.5 py-1.5 bg-[#222b2a] hover:bg-[#2c3735] text-zinc-200 border border-white/15 disabled:opacity-50 font-medium text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm"
            disabled={isRunning || isSubmitting}
            onClick={onRunCode}
          >
            {isRunning ? (
              <>
                <Loader2Icon className="w-3.5 h-3.5 animate-spin text-[#83a971]" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-3.5 h-3.5 fill-current text-[#83a971]" />
                <span>Run</span>
              </>
            )}
          </button>

          {/* SUBMIT BUTTON */}
          {onSubmitCode && (
            <button
              className="px-4 py-1.5 bg-[#83a971] hover:bg-[#729860] disabled:bg-zinc-600 text-white font-medium text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm"
              disabled={isRunning || isSubmitting}
              onClick={onSubmitCode}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <SendIcon className="w-3.5 h-3.5" />
                  <span>Submit</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditorPanel;
