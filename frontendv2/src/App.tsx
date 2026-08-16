import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SecurityProvider, useSecurity, SecurityModuleType } from './contexts/SecurityContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ModulesPage } from './pages/ModulesPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { AuthModal } from './components/auth/AuthModal';
import { AiCopilotModal } from './components/copilot/AiCopilotModal';
import { Toaster } from 'sonner';

function AppContent() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'modules' | 'telemetry'>('landing');
  const { setActiveModule, isSimulating } = useSecurity();

  // If simulation is launched from landing or studio, automatically route to telemetry view
  useEffect(() => {
    if (isSimulating) {
      setCurrentView('telemetry');
    }
  }, [isSimulating]);

  const handleLaunchConsole = () => {
    setCurrentView('dashboard');
  };

  const handleSelectModule = (moduleKey: SecurityModuleType) => {
    setActiveModule(moduleKey);
    setCurrentView('modules');
  };

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 font-sans selection:bg-blue-600/30">
      {/* Dynamic Viewport */}
      {currentView === 'landing' && (
        <LandingPage
          onLaunchConsole={handleLaunchConsole}
          onSelectModule={handleSelectModule}
          setCurrentView={setCurrentView}
        />
      )}

      {currentView === 'dashboard' && (
        <DashboardPage
          onOpenLanding={() => setCurrentView('landing')}
          setActiveSection={(sec) => {
            if (sec === 'overview') setCurrentView('dashboard');
            else if (sec === 'modules') setCurrentView('modules');
            else if (sec === 'telemetry') setCurrentView('telemetry');
          }}
        />
      )}

      {currentView === 'modules' && (
        <ModulesPage
          onOpenLanding={() => setCurrentView('landing')}
          setActiveSection={(sec) => {
            if (sec === 'overview') setCurrentView('dashboard');
            else if (sec === 'modules') setCurrentView('modules');
            else if (sec === 'telemetry') setCurrentView('telemetry');
          }}
        />
      )}

      {currentView === 'telemetry' && (
        <TelemetryPage
          onOpenLanding={() => setCurrentView('landing')}
          setActiveSection={(sec) => {
            if (sec === 'overview') setCurrentView('dashboard');
            else if (sec === 'modules') setCurrentView('modules');
            else if (sec === 'telemetry') setCurrentView('telemetry');
          }}
        />
      )}

      {/* Global AI Copilot Drawer */}
      <AiCopilotModal />

      {/* Global Authentication Modal */}
      <AuthModal />

      {/* Toast Notifications */}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#090d1c',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#f8fafc',
            borderRadius: '14px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SecurityProvider>
        <AppContent />
      </SecurityProvider>
    </AuthProvider>
  );
}
