
export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  AUDITOR = 'AUDITOR',
  LIVE_SCOUT = 'LIVE_SCOUT',
  VIBE_SIM = 'VIBE_SIM',
  LOGS = 'LOGS'
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  trustIndex: number;
  location: { lat: number; lng: number };
  recentReviewSummary: string;
  visualAuditGrade: 'A' | 'B' | 'C' | 'D';
}

export interface ScoutThought {
  id: string;
  timestamp: Date;
  step: string;
  details: string;
  status: 'pending' | 'completed' | 'analyzing';
}

export interface AuditResult {
  providerName: string;
  assessment: string;
  confidenceScore: number;
  detectedIssues: string[];
  recommendation: string;
}
