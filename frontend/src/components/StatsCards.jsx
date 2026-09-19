function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="py-4 my-2 border-y border-[#222b2a]/10 dark:border-white/10 flex items-center gap-8">
      {/* Active Count */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#222b2a] dark:text-white">
          {activeSessionsCount}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#222b2a]/50 dark:text-zinc-400">
          Active Sessions
        </span>
      </div>

      <div className="h-6 w-[1px] bg-[#222b2a]/15 dark:bg-white/15"></div>

      {/* Total Count */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#83a971]">
          {recentSessionsCount}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#222b2a]/50 dark:text-zinc-400">
          Total Sessions
        </span>
      </div>
    </div>
  );
}

export default StatsCards;
