import { Link } from "react-router";
import {
  ArrowRightIcon,
  Code2Icon,
  UsersIcon,
  VideoIcon,
  CheckCircle2Icon,
  TerminalIcon,
  ZapIcon,
  ShieldCheckIcon
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import { TalentIQLogo } from "../components/TalentIQLogo";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#1a1e1d] text-[#222b2a] dark:text-zinc-100 flex flex-col font-sans transition-colors">
      {/* NAVBAR */}
      <nav className="border-b border-[#222b2a]/10 dark:border-white/10 bg-[#fcfcfc]/90 dark:bg-[#1a1e1d]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5">
            <TalentIQLogo className="w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-tight flex items-center">
                <span className="text-[#222b2a] dark:text-white">Talent</span>
                <span className="text-[#83a971] ml-0.5">IQ</span>
              </span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <SignInButton mode="modal">
            <button className="px-5 py-2.5 bg-[#83a971] hover:bg-[#729860] text-white font-semibold text-base rounded-md transition-colors flex items-center gap-2 shadow-sm">
              <span>Get Started</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-5xl sm:text-7xl font-extrabold text-[#222b2a] dark:text-white tracking-tight leading-[1.1]">
                Code together. <br />
                <span className="text-[#83a971]">Learn together.</span>
              </h1>

              <p className="text-xl text-[#222b2a]/70 dark:text-zinc-400 max-w-xl leading-relaxed">
                The streamlined platform for collaborative technical interviews and pair programming sessions. Connect with video, code simultaneously, and run solutions in real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <SignInButton mode="modal">
                  <button className="px-7 py-3.5 bg-[#83a971] hover:bg-[#729860] text-white font-semibold text-base rounded-md transition-colors flex items-center gap-2 shadow-sm">
                    <span>Start Coding Now</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </SignInButton>

                <SignInButton mode="modal">
                  <button className="px-7 py-3.5 bg-white dark:bg-white/5 border border-[#222b2a]/15 dark:border-white/15 hover:bg-[#222b2a]/5 dark:hover:bg-white/10 text-[#222b2a] dark:text-white font-semibold text-base rounded-md transition-colors flex items-center gap-2">
                    <TerminalIcon className="w-5 h-5 text-[#83a971]" />
                    <span>Explore Problems</span>
                  </button>
                </SignInButton>
              </div>

              {/* STATS STRIP */}
              <div className="pt-8 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="text-3xl font-bold text-[#222b2a] dark:text-white">10K+</div>
                  <div className="text-sm text-[#222b2a]/60 dark:text-zinc-400 font-medium">Coders</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#83a971]">50K+</div>
                  <div className="text-sm text-[#222b2a]/60 dark:text-zinc-400 font-medium">Sessions Hosted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#222b2a] dark:text-white">99.9%</div>
                  <div className="text-sm text-[#222b2a]/60 dark:text-zinc-400 font-medium">Uptime</div>
                </div>
              </div>
            </div>

            {/* RIGHT SHOWCASE: LIVE PAIR PROGRAMMING SESSION */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-[#222b2a]/15 dark:border-white/15 bg-[#1a1e1d] text-white shadow-2xl overflow-hidden flex flex-col">
                {/* Header Toolbar */}
                <div className="px-4 py-3 bg-[#141716] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-zinc-400">session #294 — Two Sum</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-mono text-[#83a971]">
                    <span className="w-2 h-2 rounded-full bg-[#83a971] animate-pulse"></span>
                    <span>2/2 Connected</span>
                  </div>
                </div>

                {/* Showcase Body: Split Video & Code */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#1a1e1d]">
                  {/* Left: Video Feeds Stack */}
                  <div className="sm:col-span-5 flex flex-col gap-2">
                    {/* Participant 1 */}
                    <div className="relative flex-1 min-h-[96px] rounded-lg bg-[#222b2a] border border-white/10 p-2.5 flex flex-col justify-between overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1e1d] via-transparent to-transparent opacity-60"></div>
                      <div className="flex justify-between items-center z-10">
                        <span className="text-xs font-semibold text-white px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs">
                          Host
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#83a971]"></span>
                      </div>
                      <div className="flex items-center gap-2 z-10">
                        <div className="w-6 h-6 rounded-full bg-[#83a971] text-white text-xs font-bold flex items-center justify-center">
                          TB
                        </div>
                        <span className="text-sm font-medium text-white truncate">Tanushree B.</span>
                      </div>
                    </div>

                    {/* Participant 2 */}
                    <div className="relative flex-1 min-h-[96px] rounded-lg bg-[#222b2a] border border-white/10 p-2.5 flex flex-col justify-between overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1e1d] via-transparent to-transparent opacity-60"></div>
                      <div className="flex justify-between items-center z-10">
                        <span className="text-xs font-semibold text-white px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs">
                          Candidate
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#83a971]"></span>
                      </div>
                      <div className="flex items-center gap-2 z-10">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                          AK
                        </div>
                        <span className="text-sm font-medium text-white truncate">Ananya K.</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Code Editor Mockup */}
                  <div className="sm:col-span-7 rounded-lg border border-white/10 bg-[#141716] p-3 font-mono text-xs leading-relaxed text-zinc-300 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="text-zinc-500 text-xs">// Synchronized Real-time Editor</div>
                      <div><span className="text-[#83a971]">function</span> <span className="text-amber-300">twoSum</span>(nums, target) &#123;</div>
                      <div className="pl-3"><span className="text-[#83a971]">const</span> map = <span className="text-[#83a971]">new</span> <span className="text-sky-300">Map</span>();</div>
                      <div className="pl-3"><span className="text-[#83a971]">for</span> (<span className="text-[#83a971]">let</span> i = 0; i &lt; nums.length; i++) &#123;</div>
                      <div className="pl-6"><span className="text-[#83a971]">const</span> diff = target - nums[i];</div>
                      <div className="pl-6 relative inline-block">
                        <span className="text-[#83a971]">if</span> (map.has(diff)) &#123;
                      </div>
                      <div className="pl-9 text-[#83a971]">return [map.get(diff), i];</div>
                      <div className="pl-6">&#125;</div>
                      <div className="pl-3">&#125;</div>
                      <div>&#125;</div>
                    </div>

                    {/* Output pill inside editor */}
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-sans">
                      <span className="text-emerald-400 font-medium">✓ 3/3 Tests Passed</span>
                    </div>
                  </div>
                </div>

                {/* Session Footer Control Bar */}
                <div className="px-4 py-2.5 bg-[#141716] border-t border-white/10 flex items-center justify-between text-sm text-zinc-400">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-white">
                      <VideoIcon className="w-4 h-4 text-[#83a971]" />
                      <span className="text-xs font-medium">Video Connected</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <Code2Icon className="w-4 h-4 text-[#83a971]" />
                      <span className="text-xs font-medium">Live Sync Active</span>
                    </div>
                  </div>

                  <span className="text-xs text-[#83a971] font-semibold">Talent IQ Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl font-bold text-[#222b2a] dark:text-white tracking-tight">
                Designed for Productive Collaboration
              </h2>
              <p className="text-base text-[#222b2a]/70 dark:text-zinc-400 mt-3 font-medium">
                All the essential tools built specifically for pair programming and technical interviews.
              </p>
            </div>

            {/* FEATURES GRID */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-lg border border-[#222b2a]/10 dark:border-white/10 bg-[#fcfcfc] dark:bg-[#1a1e1d] hover:border-[#83a971]/50 transition-colors">
                <div className="w-12 h-12 rounded-md bg-[#83a971]/15 text-[#83a971] flex items-center justify-center mb-4">
                  <VideoIcon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl text-[#222b2a] dark:text-white mb-2">
                  HD Video & Audio
                </h3>
                <p className="text-base text-[#222b2a]/70 dark:text-zinc-400 leading-relaxed">
                  Crystal clear face-to-face communication embedded right alongside your code workspace.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-lg border border-[#222b2a]/10 dark:border-white/10 bg-[#fcfcfc] dark:bg-[#1a1e1d] hover:border-[#83a971]/50 transition-colors">
                <div className="w-12 h-12 rounded-md bg-[#83a971]/15 text-[#83a971] flex items-center justify-center mb-4">
                  <Code2Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl text-[#222b2a] dark:text-white mb-2">
                  Synchronized Editor
                </h3>
                <p className="text-base text-[#222b2a]/70 dark:text-zinc-400 leading-relaxed">
                  Collaborative code editor supporting multiple languages with syntax highlighting and instant execution.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-lg border border-[#222b2a]/10 dark:border-white/10 bg-[#fcfcfc] dark:bg-[#1a1e1d] hover:border-[#83a971]/50 transition-colors">
                <div className="w-12 h-12 rounded-md bg-[#83a971]/15 text-[#83a971] flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl text-[#222b2a] dark:text-white mb-2">
                  Structured Problem Bank
                </h3>
                <p className="text-base text-[#222b2a]/70 dark:text-zinc-400 leading-relaxed">
                  Curated interview questions with example test cases, solution specs, and difficulty ratings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default HomePage;
