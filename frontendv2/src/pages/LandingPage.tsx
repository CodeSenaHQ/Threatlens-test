import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { StatsSection } from '../components/landing/StatsSection';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { PipelineVisualizer } from '../components/landing/PipelineVisualizer';
import { Footer } from '../components/layout/Footer';
import { CyberGrid } from '../components/react-bits/CyberGrid';
import { SecurityModuleType } from '../contexts/SecurityContext';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onSelectModule: (module: SecurityModuleType) => void;
  setCurrentView: (view: 'landing' | 'dashboard' | 'modules' | 'telemetry') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchConsole,
  onSelectModule,
  setCurrentView,
}) => {
  return (
    <div className="relative min-h-screen bg-[#05070e] text-slate-100 selection:bg-blue-600/30 overflow-x-hidden">
      {/* Cyber Grid Background */}
      <CyberGrid />

      {/* Top Navbar */}
      <Navbar currentView="landing" setCurrentView={setCurrentView} />

      {/* Main Landing Flow */}
      <main className="relative z-10">
        <HeroSection
          onLaunchConsole={onLaunchConsole}
          onExploreModules={() => setCurrentView('modules')}
        />
        <StatsSection />
        <FeatureGrid onSelectModule={onSelectModule} />
        <PipelineVisualizer />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
