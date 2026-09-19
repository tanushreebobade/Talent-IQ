import { Link } from "react-router";
import { TalentIQLogo } from "./TalentIQLogo";

export function Footer() {
  return (
    <footer className="border-t border-[#222b2a]/10 dark:border-white/10 bg-[#fcfcfc] dark:bg-[#1a1e1d] text-[#222b2a] dark:text-zinc-300 py-10 px-4 transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link to="/" className="flex items-center gap-2">
            <TalentIQLogo className="w-6 h-6" />
            <span className="font-bold text-base tracking-tight">
              <span className="text-[#222b2a] dark:text-white">Talent</span>
              <span className="text-[#83a971] ml-0.5">IQ</span>
            </span>
          </Link>
          <p className="text-xs text-[#222b2a]/60 dark:text-zinc-400 font-medium">
            Code together. Learn together.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center items-center gap-5 text-xs font-medium text-[#222b2a]/70 dark:text-zinc-300">
          <Link to="/problems" className="hover:text-[#83a971] transition-colors">
            Problems
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <Link to="/dashboard" className="hover:text-[#83a971] transition-colors">
            Dashboard
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <a
            href="https://github.com/tanushreebobade/Talent-IQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#83a971] transition-colors"
          >
            GitHub
          </a>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <a
            href="https://www.linkedin.com/in/tanushree-bobade-b699102b3"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#83a971] transition-colors"
          >
            LinkedIn
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#222b2a]/50 dark:text-zinc-500 text-center md:text-right">
          <p>© 2026 Talent IQ</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
