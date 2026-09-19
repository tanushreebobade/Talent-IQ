import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import Footer from "../components/Footer";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#1a1e1d] text-[#222b2a] dark:text-zinc-100 flex flex-col font-sans transition-colors">
      <Navbar />

      {/* Main Content Layout (1100-1200px centered) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        <StatsCards
          activeSessionsCount={activeSessions.length}
          recentSessionsCount={recentSessions.length}
        />

        <ActiveSessions
          sessions={activeSessions}
          isLoading={loadingActiveSessions}
          isUserInSession={isUserInSession}
          onCreateSession={() => setShowCreateModal(true)}
        />

        <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
      </main>

      <Footer />

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </div>
  );
}

export default DashboardPage;
