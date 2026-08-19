import React from 'react';

// Case 1: Standard exported interface & type
export interface AuditReport {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

export type ScanStatus = 'idle' | 'scanning' | 'completed' | 'failed';

// Case 2: Exported Enum
export enum VulnerabilityCategory {
  SQLI = 'SQL_INJECTION',
  XSS = 'CROSS_SITE_SCRIPTING',
  RCE = 'REMOTE_CODE_EXECUTION',
}

// Case 3: Arrow function assigned to exported const
export const computeRiskScore = (findingsCount: number, maxSeverity: number): number => {
  return findingsCount * maxSeverity;
};

// Case 4: Async arrow function
export const dispatchAlertAsync = async (report: AuditReport, webhookUrl: string): Promise<boolean> => {
  console.log('Sending alert to', webhookUrl);
  return true;
};

// Case 5: React Functional Component (TSX)
export const VulnerabilityPill: React.FC<{ category: VulnerabilityCategory }> = ({ category }) => {
  return (
    <div className="pill">
      <span>{category}</span>
    </div>
  );
};

// Case 6: Standard class with constructor & methods
export class SecurityEngine {
  private status: ScanStatus = 'idle';

  constructor(private targetUrl: string) {}

  public getStatus(): ScanStatus {
    return this.status;
  }

  public async executeScan(category: VulnerabilityCategory): Promise<AuditReport> {
    this.status = 'scanning';
    return { id: 'scan_1', severity: 'critical', details: `Found ${category}` };
  }
}

// Case 7: Default exported function
export default function initializeEngine(config: Record<string, any>): SecurityEngine {
  return new SecurityEngine(config.targetUrl);
}

// Case 8: Plain exported constant (variable)
export const DEFAULT_PORT = 8080;
export const API_VERSION = 'v1.0.0';
