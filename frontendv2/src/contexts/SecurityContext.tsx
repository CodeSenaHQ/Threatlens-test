import React, { createContext, useContext, useState } from 'react';
import { MOCK_TARGETS, TargetEndpoint } from '../lib/mockData';
import { toast } from 'sonner';

export type SecurityModuleType =
  | 'sqli'
  | 'xss'
  | 'ddos'
  | 'git-audit'
  | 'exfil'
  | 'ratelimit'
  | 'proxy';

export interface SimulationParams {
  module: SecurityModuleType;
  moduleName: string;
  target: string;
  options: Record<string, any>;
}

export interface SecurityContextType {
  targets: TargetEndpoint[];
  activeTarget: TargetEndpoint;
  setActiveTarget: (target: TargetEndpoint) => void;
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  activeModule: SecurityModuleType;
  setActiveModule: (module: SecurityModuleType) => void;
  
  // Live Simulation Runner State
  isSimulating: boolean;
  simulationParams: SimulationParams | null;
  startSimulation: (params: SimulationParams) => void;
  stopSimulation: () => void;
  
  // AI Copilot state
  isCopilotOpen: boolean;
  openCopilot: (initialPrompt?: string) => void;
  closeCopilot: () => void;
  copilotInitialPrompt: string;

  // Global search modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [targets, setTargets] = useState<TargetEndpoint[]>(MOCK_TARGETS);
  const [activeTarget, setActiveTarget] = useState<TargetEndpoint>(MOCK_TARGETS[0]);
  const [targetUrl, setTargetUrl] = useState<string>(MOCK_TARGETS[0].url);
  const [activeModule, setActiveModule] = useState<SecurityModuleType>('sqli');
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationParams, setSimulationParams] = useState<SimulationParams | null>(null);

  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const startSimulation = (params: SimulationParams) => {
    setSimulationParams(params);
    setIsSimulating(true);
    toast.success(`Dispatched ${params.moduleName} attack simulation on ${params.target}`);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    toast.info('Security assessment run concluded.');
  };

  const openCopilot = (initialPrompt = '') => {
    setCopilotInitialPrompt(initialPrompt);
    setIsCopilotOpen(true);
  };

  const closeCopilot = () => {
    setIsCopilotOpen(false);
    setCopilotInitialPrompt('');
  };

  return (
    <SecurityContext.Provider
      value={{
        targets,
        activeTarget,
        setActiveTarget: (target) => {
          setActiveTarget(target);
          setTargetUrl(target.url);
        },
        targetUrl,
        setTargetUrl,
        activeModule,
        setActiveModule,
        isSimulating,
        simulationParams,
        startSimulation,
        stopSimulation,
        isCopilotOpen,
        openCopilot,
        closeCopilot,
        copilotInitialPrompt,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within SecurityProvider');
  return context;
};
