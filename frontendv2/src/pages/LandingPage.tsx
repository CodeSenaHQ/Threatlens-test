import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { StatsSection } from '../components/landing/StatsSection';
import { SyntraComparisonSection } from '../components/landing/SyntraComparisonSection';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { SyntraWorkflowTabs } from '../components/landing/SyntraWorkflowTabs';
import { SyntraThreeCards } from '../components/landing/SyntraThreeCards';
import { PipelineVisualizer } from '../components/landing/PipelineVisualizer';
import { SyntraBottomCta } from '../components/landing/SyntraBottomCta';
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
        <SyntraComparisonSection />
        <FeatureGrid onSelectModule={onSelectModule} />
        <SyntraWorkflowTabs />
        <SyntraThreeCards />
        <PipelineVisualizer />
        <SyntraBottomCta onLaunchConsole={onLaunchConsole} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
