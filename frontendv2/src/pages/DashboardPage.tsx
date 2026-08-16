import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { OverviewMetrics } from '../components/dashboard/OverviewMetrics';
import { AiKeyInsights } from '../components/dashboard/AiKeyInsights';
import { EqualizerTrafficChart } from '../components/dashboard/EqualizerTrafficChart';
import { ModuleUsageBars } from '../components/dashboard/ModuleUsageBars';
import { LiveAttackMap } from '../components/dashboard/LiveAttackMap';
import { ActiveTargetsTable } from '../components/dashboard/ActiveTargetsTable';

interface DashboardPageProps {
  onOpenLanding: () => void;
  setActiveSection: (section: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenLanding,
  setActiveSection,
}) => {
  return (
    <DashboardLayout
      activeSection="overview"
      setActiveSection={setActiveSection}
      onOpenLanding={onOpenLanding}
    >
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Top Overview Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OverviewMetrics />
          </div>
          <div className="lg:col-span-1">
            <AiKeyInsights />
          </div>
        </div>

        {/* Middle Traffic Equalizer & Multi-Scanner Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EqualizerTrafficChart />
          <ModuleUsageBars />
        </div>

        {/* Global Attack Vector Map */}
        <LiveAttackMap />

        {/* Active Targets & Repositories Table */}
        <ActiveTargetsTable />
      </div>
    </DashboardLayout>
  );
};
