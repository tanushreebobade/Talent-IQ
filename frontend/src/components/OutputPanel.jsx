import { TerminalIcon } from "lucide-react";

function OutputPanel({ output }) {
  return (
    <div className="h-full bg-[#171a19] text-white flex flex-col font-mono text-xs border-t border-white/10">
      <div className="px-4 py-2 bg-[#141716] border-b border-white/10 flex items-center justify-between font-sans text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 font-semibold">
          <TerminalIcon className="w-3.5 h-3.5 text-[#83a971]" />
          <span>Execution Output</span>
        </div>
        {output && (
          <span className={output.success ? "text-[#83a971]" : "text-rose-400"}>
            {output.success ? "Status: 0 (Success)" : "Status: 1 (Error)"}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 leading-relaxed">
        {output === null ? (
          <p className="text-zinc-500 font-sans italic">
            Click "Run Code" to execute your solution...
          </p>
        ) : output.success ? (
          <pre className="text-emerald-400 whitespace-pre-wrap">{output.output}</pre>
        ) : (
          <div className="space-y-2">
            {output.output && (
              <pre className="text-zinc-300 whitespace-pre-wrap">{output.output}</pre>
            )}
            <pre className="text-rose-400 whitespace-pre-wrap">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
