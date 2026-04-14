import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';
import { ProgressStepper } from '../components/session/ProgressStepper';
import { SessionRouter } from '../components/session/SessionRouter';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { X } from 'lucide-react';

export function SessionScreen() {
  const navigate = useNavigate();
  const { activeSession, dailyContent, isLoadingContent, startSession } = useSessionStore();

  useEffect(() => {
    if (!activeSession) {
      startSession();
    }
  }, []);

  if (isLoadingContent) {
    return <LoadingSpinner fullScreen />;
  }

  if (!dailyContent) {
    return (
      <div className="app-container flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-slate-400">Content not loaded yet.</p>
          <button
            onClick={() => navigate('/')}
            className="text-amber-400 underline underline-offset-2 text-sm"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!activeSession) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="app-container flex flex-col min-h-screen">
      {/* Session header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <ProgressStepper
          modules={activeSession.modules}
          currentIndex={activeSession.currentModuleIndex}
        />
      </div>

      {/* Module content */}
      <div className="flex-1 overflow-y-auto py-2">
        <SessionRouter />
      </div>
    </div>
  );
}
