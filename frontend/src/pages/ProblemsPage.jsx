import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { PROBLEMS } from "../data/problems";
import { Code2Icon } from "lucide-react";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-zinc-600 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#1a1e1d] text-[#222b2a] dark:text-zinc-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#222b2a]/10 dark:border-white/10 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222b2a] dark:text-white tracking-tight">
              Practice Problems
            </h1>
            <p className="text-sm text-[#222b2a]/60 dark:text-zinc-400 mt-1 font-medium">
              Sharpen your problem-solving skills with focused coding challenges.
            </p>
          </div>

          {/* COMPACT STATS TEXT */}
          <div className="text-xs font-medium text-[#222b2a]/60 dark:text-zinc-400 flex items-center gap-2">
            <span><strong className="text-[#222b2a] dark:text-white font-semibold">{problems.length}</strong> Problems</span>
            <span>·</span>
            <span><strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{easyProblemsCount}</strong> Easy</span>
            <span>·</span>
            <span><strong className="text-amber-600 dark:text-amber-400 font-semibold">{mediumProblemsCount}</strong> Medium</span>
            <span>·</span>
            <span><strong className="text-rose-600 dark:text-rose-400 font-semibold">{hardProblemsCount}</strong> Hard</span>
          </div>
        </div>

        {/* PROBLEMS LIST - CLEAN REFINED ROWS */}
        <div className="divide-y divide-[#222b2a]/10 dark:divide-white/10">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="py-4 px-2 hover:bg-[#222b2a]/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Code2Icon className="w-4 h-4 text-[#83a971] shrink-0" />
                  <h2 className="text-base font-bold text-[#222b2a] dark:text-white group-hover:text-[#83a971] transition-colors truncate">
                    {problem.title}
                  </h2>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded border capitalize ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                  <span className="text-xs text-[#222b2a]/50 dark:text-zinc-500 font-medium">
                    · {problem.category}
                  </span>
                </div>
                
                <p className="text-xs text-[#222b2a]/70 dark:text-zinc-400 line-clamp-1 pl-6">
                  {problem.description.text}
                </p>
              </div>

              <div className="text-xs font-semibold text-[#83a971] shrink-0 self-end sm:self-center flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Solve</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProblemsPage;
