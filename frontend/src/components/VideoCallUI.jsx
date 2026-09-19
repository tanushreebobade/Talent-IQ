import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2Icon className="w-8 h-8 mx-auto animate-spin text-[#83a971] mb-3" />
          <p className="text-sm font-medium">Joining video room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 relative str-video">
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Header toolbar */}
        <div className="flex items-center justify-between gap-2 bg-[#222b2a] px-4 py-2.5 rounded-lg border border-white/10 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <UsersIcon className="w-4 h-4 text-[#83a971]" />
            <span>
              {participantCount} {participantCount === 1 ? "Participant" : "Participants"}
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isChatOpen
                  ? "bg-[#83a971] text-white"
                  : "bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              <MessageSquareIcon className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          )}
        </div>

        {/* Video feed container */}
        <div className="flex-1 bg-[#141716] rounded-lg overflow-hidden relative border border-white/10">
          <SpeakerLayout />
        </div>

        {/* Controls toolbar */}
        <div className="bg-[#222b2a] p-2.5 rounded-lg border border-white/10 flex justify-center">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-lg border border-white/10 overflow-hidden bg-[#222b2a] transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-[#1a1e1d] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                  Session Chat
                </h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;
