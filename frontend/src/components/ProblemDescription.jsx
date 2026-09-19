function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "hard":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#fcfcfc] dark:bg-[#1a1e1d] text-[#222b2a] dark:text-zinc-100 transition-colors">
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-[#222b2a]/10 dark:border-white/10 bg-white dark:bg-white/5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-[#222b2a] dark:text-white tracking-tight">
            {problem.title}
          </h1>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded border capitalize ${getDifficultyColor(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
        </div>
        <p className="text-xs text-[#222b2a]/60 dark:text-zinc-400 font-medium mb-4">
          {problem.category}
        </p>

        {/* Problem selector */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#222b2a]/60 dark:text-zinc-400 mb-1">
            Switch Problem
          </label>
          <select
            className="w-full px-3 py-1.5 rounded-md border border-[#222b2a]/15 dark:border-white/15 bg-[#fcfcfc] dark:bg-[#1a1e1d] text-xs font-medium focus:outline-none focus:border-[#83a971]"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id} className="dark:bg-[#1a1e1d]">
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="p-5 rounded-lg border border-[#222b2a]/10 dark:border-white/10 bg-white dark:bg-white/5">
          <h2 className="text-base font-bold text-[#222b2a] dark:text-white mb-3">
            Description
          </h2>

          <div className="space-y-3 text-sm text-[#222b2a]/80 dark:text-zinc-300 leading-relaxed">
            <p>{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx}>{note}</p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="p-5 rounded-lg border border-[#222b2a]/10 dark:border-white/10 bg-white dark:bg-white/5">
          <h2 className="text-base font-bold text-[#222b2a] dark:text-white mb-4">
            Examples
          </h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#83a971]/15 text-[#83a971]">
                    Example {idx + 1}
                  </span>
                </div>
                <div className="p-3.5 rounded-md border border-[#222b2a]/10 dark:border-white/10 bg-[#222b2a] text-white font-mono text-xs space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-[#83a971] font-semibold min-w-[60px]">Input:</span>
                    <span className="text-zinc-200">{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-amber-400 font-semibold min-w-[60px]">Output:</span>
                    <span className="text-zinc-200">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-white/10 mt-2 text-zinc-400 font-sans text-xs">
                      <span className="font-semibold text-zinc-300">Explanation:</span>{" "}
                      {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="p-5 rounded-lg border border-[#222b2a]/10 dark:border-white/10 bg-white dark:bg-white/5">
          <h2 className="text-base font-bold text-[#222b2a] dark:text-white mb-3">
            Constraints
          </h2>
          <ul className="space-y-2 text-xs text-[#222b2a]/80 dark:text-zinc-300 font-mono">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-[#83a971]">•</span>
                <code className="bg-[#222b2a]/5 dark:bg-white/10 px-1.5 py-0.5 rounded border border-[#222b2a]/10 dark:border-white/10">
                  {constraint}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
