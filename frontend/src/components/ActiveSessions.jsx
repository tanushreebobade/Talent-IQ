import { Link } from "react-router";

function ActiveSessions({ sessions, isLoading, isUserInSession, onCreateSession }) {
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
    <div className="py-6">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#222b2a]/10 dark:border-white/10 mb-2">
        <h2 className="text-lg font-bold text-[#222b2a] dark:text-white tracking-tight">
          Live Sessions
        </h2>
        <span className="text-xs font-medium text-[#222b2a]/60 dark:text-zinc-400">
          {sessions.length} active
        </span>
      </div>

      {/* SESSIONS LIST */}
      <div>
        {isLoading ? (
          /* Subtle Skeleton Rows */
          <div className="space-y-3 py-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="py-3 px-1 animate-pulse flex items-center justify-between border-b border-[#222b2a]/5 dark:border-white/5"
              >
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-[#222b2a]/10 dark:bg-white/10 rounded"></div>
                  <div className="h-3 w-32 bg-[#222b2a]/5 dark:bg-white/5 rounded"></div>
                </div>
                <div className="h-4 w-16 bg-[#222b2a]/10 dark:bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="divide-y divide-[#222b2a]/10 dark:divide-white/10">
            {sessions.map((session) => {
              const isFull = session.participant && !isUserInSession(session);
              const userInThis = isUserInSession(session);

              return (
                <div
                  key={session._id}
                  className="py-3.5 px-2 hover:bg-[#222b2a]/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-semibold text-sm text-[#222b2a] dark:text-white truncate">
                        {session.problem}
                      </h3>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded border capitalize ${getDifficultyColor(
                          session.difficulty
                        )}`}
                      >
                        {session.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#222b2a]/60 dark:text-zinc-400">
                      <span>Host: {session.host?.name || "Anonymous"}</span>
                      <span>·</span>
                      <span>{session.participant ? "2 participants" : "1 participant"}</span>
                      <span>·</span>
                      <span className={isFull ? "text-rose-500 font-medium" : "text-[#83a971] font-medium"}>
                        {isFull ? "Full" : "Open"}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {isFull ? (
                      <span className="text-xs font-medium text-zinc-400">Full</span>
                    ) : (
                      <Link
                        to={`/session/${session._id}`}
                        className="text-xs font-semibold text-[#83a971] hover:text-[#729860] transition-colors inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>{userInThis ? "Rejoin" : "Join"}</span>
                        <span>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Compact Empty State */
          <div className="py-4 text-left flex items-center justify-between">
            <p className="text-sm font-medium text-[#222b2a]/60 dark:text-zinc-400">
              No active sessions right now.
            </p>
            {onCreateSession && (
              <button
                onClick={onCreateSession}
                className="text-xs font-semibold text-[#83a971] hover:underline inline-flex items-center gap-1"
              >
                <span>+ Create Session</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveSessions;
