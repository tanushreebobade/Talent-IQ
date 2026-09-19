import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { TalentIQLogo } from "./TalentIQLogo";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#fcfcfc]/95 dark:bg-[#1a1e1d]/95 backdrop-blur-sm border-b border-[#222b2a]/10 dark:border-white/10 sticky top-0 z-50 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <TalentIQLogo className="w-7 h-7" />
          <span className="font-bold text-xl tracking-tight flex items-center">
            <span className="text-[#222b2a] dark:text-white">Talent</span>
            <span className="text-[#83a971] ml-0.5">IQ</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to="/problems"
            className={`py-5 text-sm font-medium transition-colors flex items-center gap-2 relative ${
              isActive("/problems")
                ? "text-[#83a971] font-semibold"
                : "text-[#222b2a]/70 hover:text-[#222b2a] dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <BookOpenIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Problems</span>
            {isActive("/problems") && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#83a971]"></span>
            )}
          </Link>

          {/* DASHBOARD PAGE LINK */}
          <Link
            to="/dashboard"
            className={`py-5 text-sm font-medium transition-colors flex items-center gap-2 relative ${
              isActive("/dashboard")
                ? "text-[#83a971] font-semibold"
                : "text-[#222b2a]/70 hover:text-[#222b2a] dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <LayoutDashboardIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
            {isActive("/dashboard") && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#83a971]"></span>
            )}
          </Link>

          <div className="pl-2 border-l border-[#222b2a]/10 dark:border-white/10 flex items-center">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
