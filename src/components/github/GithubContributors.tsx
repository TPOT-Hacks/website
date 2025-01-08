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

interface ContributorsPageProps {
  orgName: string;
  githubToken: string;
}

export default function GithubContributors({
  orgName,
  githubToken,
}: ContributorsPageProps) {
  const [contributors, setContributors] = useState<ContributorData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    totalReviews: 0,
    contributorsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `
          query($orgName: String!) {
            organization(login: $orgName) {
              repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
                nodes {
                  name
                  defaultBranchRef {
                    target {
                      ... on Commit {
                        history {
                          nodes {
                            author {
                              user {
                                login
                                name
                                avatarUrl
                                contributionsCollection {
                                  totalCommitContributions
                                  totalIssueContributions
                                  totalPullRequestContributions
                                  totalPullRequestReviewContributions
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, variables: { orgName } }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data from GitHub API");
        }

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }
        const processedData = processContributorData(data);
        setContributors(processedData.contributors);
        setAnalytics(processedData.analytics);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [orgName, githubToken]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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

function processContributorData(data: any) {
  const contributorsMap = new Map<string, ContributorData>();
  let totalCommits = 0;
  let totalPRs = 0;
  let totalIssues = 0;
  let totalReviews = 0;

  data.data.organization.repositories.nodes.forEach((repo: any) => {
    const commits = repo.defaultBranchRef?.target?.history?.nodes || [];
    commits.forEach((commit: any) => {
      const user = commit.author?.user;
      if (user) {
        if (!contributorsMap.has(user.login)) {
          const contributions = user.contributionsCollection;
          totalCommits += contributions.totalCommitContributions;
          totalPRs += contributions.totalPullRequestContributions;
          totalIssues += contributions.totalIssueContributions;
          totalReviews += contributions.totalPullRequestReviewContributions;

          contributorsMap.set(user.login, {
            login: user.login,
            name: user.name,
            avatarUrl: user.avatarUrl,
            ...contributions,
            repositories: [repo.name],
            repositoryCount: 1,
            totalContributions:
              contributions.totalCommitContributions +
              contributions.totalPullRequestContributions +
              contributions.totalIssueContributions +
              contributions.totalPullRequestReviewContributions,
          });
        } else {
          const contributor = contributorsMap.get(user.login)!;
          if (!contributor.repositories.includes(repo.name)) {
            contributor.repositories.push(repo.name);
            contributor.repositoryCount = contributor.repositories.length;
          }
        }
      }
    });
  });

  return {
    contributors: Array.from(contributorsMap.values()).sort(
      (a, b) => b.totalContributions - a.totalContributions,
    ),
    analytics: {
      totalCommits,
      totalPRs,
      totalIssues,
      totalReviews,
      contributorsCount: contributorsMap.size,
    },
  };
}
