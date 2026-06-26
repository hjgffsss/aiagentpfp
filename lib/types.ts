export type EligibilityRole = "GTD" | "WL" | "NOT_ELIGIBLE";

export interface EligibilityResult {
  walletAddress: string;
  xUsername: string;
  role: EligibilityRole;
}

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Application {
  id: string;
  walletAddress: string;
  xUsername: string;
  repostUrl: string;
  notes?: string;
  status: ApplicationStatus;
  role: EligibilityRole | null;
  createdAt: string;
  points?: number;
}

export interface ChatStepData {
  walletAddress?: string;
  walletVerified?: boolean;
  followConfirmed?: boolean;
  xUsername?: string;
  repostUrl?: string;
  notes?: string;
}

export interface LeaderboardEntry {
  rank: number;
  xUsername: string;
  walletAddress: string;
  points: number;
}
