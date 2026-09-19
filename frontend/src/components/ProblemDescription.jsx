import { useState } from "react";
import {
  FileTextIcon,
  HistoryIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  Code2Icon,
  Loader2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { format } from "date-fns";

function ProblemDescription({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
  submissions = [],
  isLoadingSubmissions = false,
  activeTab = "description",
  setActiveTab = () => {},
}) {
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
            <CheckCircle2Icon className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case "Wrong Answer":
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded border bg-rose-500/10 text-rose-500 border-rose-500/30">
            <XCircleIcon className="w-3.5 h-3.5" />
            Wrong Answer
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded border bg-amber-500/10 text-amber-500 border-amber-500/30">
            <AlertTriangleIcon className="w-3.5 h-3.5" />
            {status || "Compile Error"}
          </span>
        );
    }
  };

  const toggleExpand = (id) => {
    setExpandedSubmissionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] dark:bg-[#1a1e1d] text-[#222b2a] dark:text-zinc-100 transition-colors overflow-hidden">
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-[#222b2a]/10 dark:border-white/10 bg-white dark:bg-white/5 shrink-0">
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
        <div className="mb-4">
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

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-[#222b2a]/10 dark:border-white/10 pt-2">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 -mb-px ${
              activeTab === "description"
                ? "border-[#83a971] text-[#83a971]"
                : "border-transparent text-[#222b2a]/60 dark:text-zinc-400 hover:text-[#222b2a] dark:hover:text-white"
            }`}
          >
            <FileTextIcon className="w-3.5 h-3.5" />
            Description
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 -mb-px ${
              activeTab === "submissions"
                ? "border-[#83a971] text-[#83a971]"
                : "border-transparent text-[#222b2a]/60 dark:text-zinc-400 hover:text-[#222b2a] dark:hover:text-white"
            }`}
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            Submissions
            {submissions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#83a971]/20 text-[#83a971]">
                {submissions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "description" ? (
          <div className="space-y-6">
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
        ) : (
          /* SUBMISSIONS HISTORY TAB */
          <div className="space-y-4">
            {isLoadingSubmissions ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                <Loader2Icon className="w-6 h-6 animate-spin text-[#83a971] mb-2" />
                <span className="text-xs font-medium">Loading submission history...</span>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center rounded-lg border border-dashed border-[#222b2a]/15 dark:border-white/15 bg-white dark:bg-white/5">
                <HistoryIcon className="w-8 h-8 text-zinc-400 mx-auto mb-2 opacity-50" />
                <h3 className="text-sm font-bold text-[#222b2a] dark:text-white mb-1">
                  No Submissions Yet
                </h3>
                <p className="text-xs text-zinc-400">
                  Write your solution in the editor and click <strong>Submit</strong> to record your submission!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => {
                  const isExpanded = expandedSubmissionId === sub._id;
                  return (
                    <div
                      key={sub._id}
                      className="rounded-lg border border-[#222b2a]/10 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden transition-all"
                    >
                      <div
                        onClick={() => toggleExpand(sub._id)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusBadge(sub.status)}
                          <span className="text-xs font-mono font-medium uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            {sub.language}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          {sub.runtime > 0 && (
                            <span className="flex items-center gap-1 font-mono">
                              <ClockIcon className="w-3 h-3 text-[#83a971]" />
                              {sub.runtime} ms
                            </span>
                          )}
                          <span className="text-[11px]">
                            {sub.createdAt ? format(new Date(sub.createdAt), "MMM d, yyyy · HH:mm") : "Just now"}
                          </span>
                          {isExpanded ? (
                            <ChevronUpIcon className="w-4 h-4 text-zinc-400" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-zinc-400" />
                          )}
                        </div>
                      </div>

                      {/* EXPANDED CODE VIEW */}
                      {isExpanded && (
                        <div className="p-4 border-t border-[#222b2a]/10 dark:border-white/10 bg-[#171a19]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                              <Code2Icon className="w-3.5 h-3.5 text-[#83a971]" />
                              Submitted Solution
                            </span>
                          </div>
                          <pre className="p-3.5 rounded bg-[#1a1e1d] text-zinc-200 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed">
                            <code>{sub.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemDescription;
