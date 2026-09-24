import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/compiler";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Loader2Icon, LogOutIcon, PhoneOffIcon, Code2Icon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import AICopilotPanel from "../components/AICopilotPanel";
import { BotIcon, BookOpenIcon } from "lucide-react";
import VideoCallUI from "../components/VideoCallUI";
import { useWindowSize } from "../hooks/useWindowSize";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");
  const [leftTab, setLeftTab] = useState("problem"); // "problem" | "ai"

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // redirect the participant when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

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
    <div className="min-h-screen md:h-screen bg-[#fcfcfc] dark:bg-[#1a1e1d] text-[#222b2a] dark:text-zinc-100 flex flex-col font-sans transition-colors overflow-x-hidden md:overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-x-hidden md:overflow-hidden">
        <PanelGroup key={isMobile ? "mobile" : "desktop"} direction={isMobile ? "vertical" : "horizontal"}>
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={55} minSize={35}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DESC / AI PANEL */}
              <Panel defaultSize={45} minSize={20}>
                <div className="h-full overflow-y-auto bg-[#fcfcfc] dark:bg-[#1a1e1d] text-[#222b2a] dark:text-zinc-100 transition-colors flex flex-col">
                  {/* HEADER SECTION */}
                  <div className="p-4 bg-white dark:bg-white/5 border-b border-[#222b2a]/10 dark:border-white/10 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-xl font-bold text-[#222b2a] dark:text-white tracking-tight">
                          {session?.problem || "Loading..."}
                        </h1>
                        <p className="text-xs text-[#222b2a]/60 dark:text-zinc-400 mt-0.5 font-medium">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? "2/2 Participants" : "1/2 Participant"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {session?.difficulty && (
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded border capitalize ${getDifficultyColor(
                              session.difficulty
                            )}`}
                          >
                            {session.difficulty}
                          </span>
                        )}
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-3.5 h-3.5" />
                            )}
                            End Session
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Tab Selection Bar */}
                    <div className="flex items-center gap-2 border-t border-[#222b2a]/10 dark:border-white/10 pt-2">
                      <button
                        onClick={() => setLeftTab("problem")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          leftTab === "problem"
                            ? "bg-[#83a971] text-white shadow-xs"
                            : "bg-zinc-100 dark:bg-white/5 text-[#222b2a]/70 dark:text-zinc-400 hover:text-[#222b2a] dark:hover:text-white border border-[#222b2a]/5 dark:border-white/5"
                        }`}
                      >
                        <BookOpenIcon className="w-3.5 h-3.5" />
                        Problem Details
                      </button>

                      <button
                        onClick={() => setLeftTab("ai")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          leftTab === "ai"
                            ? "bg-[#83a971] text-white shadow-xs"
                            : "bg-zinc-100 dark:bg-white/5 text-[#222b2a]/70 dark:text-zinc-400 hover:text-[#222b2a] dark:hover:text-white border border-[#222b2a]/5 dark:border-white/5"
                        }`}
                      >
                        <BotIcon className="w-3.5 h-3.5 text-[#83a971] dark:text-emerald-300" />
                        AI Mentor & Hints
                      </button>
                    </div>
                  </div>

                  {/* Panel Content Body */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {leftTab === "ai" ? (
                      <AICopilotPanel
                        problem={problemData || { title: session?.problem, description: "" }}
                        code={code}
                        selectedLanguage={selectedLanguage}
                        output={output}
                      />
                    ) : (
                      <div className="space-y-5">
                        {/* problem desc */}
                        {problemData?.description && (
                          <div className="p-4 rounded-lg border border-[#222b2a]/10 dark:border-white/10 bg-white dark:bg-white/5">
                            <h2 className="text-sm font-bold text-[#222b2a] dark:text-white mb-2">
                              Description
                            </h2>
                            <div className="space-y-2 text-xs text-[#222b2a]/80 dark:text-zinc-300 leading-relaxed">
                              <p>{problemData.description.text}</p>
                              {problemData.description.notes?.map((note, idx) => (
                                <p key={idx}>{note}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* examples section */}
                        {problemData?.examples && problemData.examples.length > 0 && (
                          <div className="p-4 rounded-lg border border-[#222b2a]/10 dark:border-white/10 bg-white dark:bg-white/5">
                            <h2 className="text-sm font-bold text-[#222b2a] dark:text-white mb-3">
                              Examples
                            </h2>

                            <div className="space-y-3">
                              {problemData.examples.map((example, idx) => (
                                <div key={idx} className="space-y-1.5">
                                  <span className="text-[11px] font-semibold text-[#83a971]">
                                    Example {idx + 1}
                                  </span>
                                  <div className="p-3 rounded bg-[#222b2a] text-white font-mono text-xs space-y-1">
                                    <div className="flex gap-2">
                                      <span className="text-[#83a971] font-semibold min-w-[50px]">
                                        Input:
                                      </span>
                                      <span className="text-zinc-200">{example.input}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <span className="text-amber-400 font-semibold min-w-[50px]">
                                        Output:
                                      </span>
                                      <span className="text-zinc-200">{example.output}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-[#222b2a]/10 dark:bg-white/10 hover:bg-[#83a971] transition-colors cursor-row-resize" />

              <Panel defaultSize={55} minSize={25}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-1.5 bg-[#222b2a]/10 dark:bg-white/10 hover:bg-[#83a971] transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-[#222b2a]/10 dark:bg-white/10 hover:bg-[#83a971] transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={45} minSize={30}>
            <div className="h-full bg-[#1a1e1d] p-3 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2Icon className="w-8 h-8 mx-auto animate-spin text-[#83a971] mb-3" />
                    <p className="text-sm font-medium">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="p-6 rounded-lg border border-white/10 bg-[#222b2a] max-w-sm text-center">
                    <div className="w-12 h-12 mx-auto bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-3">
                      <PhoneOffIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-1">Connection Failed</h2>
                    <p className="text-xs text-zinc-400">
                      Unable to connect to the video service. Please refresh or try again.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;
