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
      {/* Top Overview Chart Row (2:1 Grid matching Cortex Labs) */}
      <div className="cortex-grid-2-1">
        <OverviewMetrics />
        <AiKeyInsights />
      </div>

      {/* Middle Row: Usage by Type (1 col) + Token Consumption Equalizer (2 cols) */}
      <div className="cortex-grid-1-2">
        <ModuleUsageBars />
        <EqualizerTrafficChart />
      </div>

      {/* Global Attack Vector Map */}
      <LiveAttackMap />

      {/* Active Targets & Repositories Table */}
      <ActiveTargetsTable />
    </DashboardLayout>
  );
};
