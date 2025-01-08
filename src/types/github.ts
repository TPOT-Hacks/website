export interface ContributorData {
  login: string;
  name: string | null;
  avatarUrl: string;
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  repositories: string[];
  repositoryCount: number;
  totalContributions: number;
}

export interface AnalyticsData {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
  contributorsCount: number;
}
