import React from 'react';

export interface SecurityReportProps {
  score: number;
  criticalIssues: string[];
}

export const SecurityReportCard: React.FC<SecurityReportProps> = ({ score, criticalIssues }) => {
  return (
    <div className="report-card">
      <h2>Security Score: {score}</h2>
      <ul>
        {criticalIssues.map((issue, idx) => (
          <li key={idx}>{issue}</li>
        ))}
      </ul>
    </div>
  );
};
