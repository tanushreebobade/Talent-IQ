import { useUser } from "@clerk/clerk-react";
import { PlusIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222b2a] dark:text-white tracking-tight">
            Welcome back, {user?.firstName || "Developer"}
          </h1>
        </div>

        <button
          onClick={onCreateSession}
          className="w-full sm:w-auto px-4 py-2 bg-[#83a971] hover:bg-[#729860] active:translate-y-[1px] text-white font-medium text-sm rounded transition-all flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Session</span>
        </button>
      </div>
    </div>
  );
}

export default WelcomeSection;
