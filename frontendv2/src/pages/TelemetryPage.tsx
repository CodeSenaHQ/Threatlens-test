import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LiveTerminalRunner } from '../components/telemetry/LiveTerminalRunner';
import { Terminal, Shield, Activity, RefreshCw } from 'lucide-react';
import { useSecurity } from '../contexts/SecurityContext';

interface TelemetryPageProps {
  onOpenLanding: () => void;
  setActiveSection: (section: string) => void;
}

export const TelemetryPage: React.FC<TelemetryPageProps> = ({
  onOpenLanding,
  setActiveSection,
}) => {
  const { startSimulation } = useSecurity();

  const handleRerun = () => {
    startSimulation({
      module: 'sqli',
      moduleName: 'Continuous Offensive Security Audit',
      target: 'https://staging.threatlens.io',
      options: { categories: ['Error-based', 'Blind'] },
    });
  };

  return (
    <DashboardLayout
      activeSection="telemetry"
      setActiveSection={setActiveSection}
      onOpenLanding={onOpenLanding}
    >
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
        <LiveTerminalRunner />
      </div>
    </DashboardLayout>
  );
};
