import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomeScreen } from './screens/HomeScreen';
import { SessionScreen } from './screens/SessionScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { usePlayerStore } from './store/usePlayerStore';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isOnboarded = usePlayerStore((s) => s.isOnboarded);
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route
          element={
            <AuthGuard>
              <AppShell />
            </AuthGuard>
          }
        >
          <Route index element={<HomeScreen />} />
          <Route path="/progress" element={<ProgressScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Route>
        {/* Session is full-screen, outside AppShell */}
        <Route
          path="/session"
          element={
            <AuthGuard>
              <SessionScreen />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
