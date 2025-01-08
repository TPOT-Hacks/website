"use client";

import { useEffect, useState } from "react";
import { AnalyticsSection } from "@/components/analytics-section";
import { ActivityChart } from "@/components/activity-chart";
import { ContributorCard } from "@/components/contributor-card";
import { ContributorData, AnalyticsData } from "@/types/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchGithubData } from "./githubData";

interface GithubContributorsProps {
  orgName: string;
  githubToken: string;
}

export default function GithubContributors({
  orgName,
  githubToken,
}: GithubContributorsProps) {
  const [contributors, setContributors] = useState<ContributorData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    totalReviews: 0,
    contributorsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGithubData(orgName, githubToken);
        setContributors(data.contributors);
        setAnalytics(data.analytics);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orgName, githubToken]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          GitHub Contributors
        </h1>
        <p className="text-gray-400">
          An overview of contributor activity in the {orgName} organization
        </p>
      </div>

      <AnalyticsSection data={analytics} />
      <ActivityChart contributors={contributors} />

      <Card className="bg-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Top Contributors</CardTitle>
          <CardDescription className="text-blue-600">
            Most active contributors in the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contributors.map((contributor) => (
              <ContributorCard key={contributor.login} {...contributor} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
