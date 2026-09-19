import { Code2Icon, LoaderIcon, PlusIcon, XIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222b2a]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-[#fcfcfc] dark:bg-[#1a1e1d] rounded-lg border border-[#222b2a]/15 dark:border-white/15 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#222b2a]/10 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-lg text-[#222b2a] dark:text-white">
            Create Coding Session
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#222b2a]/50 dark:text-zinc-400 hover:text-[#222b2a] dark:hover:text-white hover:bg-[#222b2a]/5 dark:hover:bg-white/5 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#222b2a]/70 dark:text-zinc-300">
              Select Coding Problem <span className="text-rose-500">*</span>
            </label>

            <select
              className="w-full px-3 py-2 rounded-md border border-[#222b2a]/15 dark:border-white/15 bg-white dark:bg-white/5 text-[#222b2a] dark:text-white text-sm focus:outline-none focus:border-[#83a971] transition-colors"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title} className="dark:bg-[#1a1e1d]">
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="p-4 rounded-md border border-[#83a971]/30 bg-[#83a971]/10 text-xs text-[#222b2a] dark:text-zinc-200 flex items-start gap-3">
              <Code2Icon className="w-5 h-5 text-[#83a971] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-sm text-[#222b2a] dark:text-white">
                  Session Details:
                </p>
                <p>
                  Problem: <span className="font-semibold">{roomConfig.problem}</span>
                </p>
                <p>
                  Capacity: <span className="font-semibold">2 Participants (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#222b2a]/10 dark:border-white/10 bg-[#222b2a]/5 dark:bg-white/5 flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium text-[#222b2a]/70 dark:text-zinc-300 hover:text-[#222b2a] dark:hover:text-white transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 bg-[#83a971] hover:bg-[#729860] disabled:bg-zinc-400 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2 shadow-sm"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="w-4 h-4 animate-spin" />
            ) : (
              <PlusIcon className="w-4 h-4" />
            )}
            <span>{isCreating ? "Creating..." : "Create Session"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSessionModal;
