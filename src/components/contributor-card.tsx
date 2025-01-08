import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GitCommit, GitPullRequest, CircleDot, GitFork } from "lucide-react";
import { ContributorData } from "../types/github";
import Image from "next/image";

export function ContributorCard(contributor: ContributorData) {
  const stats = [
    {
      label: "Commits",
      value: contributor.totalCommitContributions,
      icon: GitCommit,
      className: "text-green-500",
    },
    {
      label: "PRs",
      value: contributor.totalPullRequestContributions,
      icon: GitPullRequest,
      className: "text-blue-500",
    },
    {
      label: "Issues",
      value: contributor.totalIssueContributions,
      icon: CircleDot,
      className: "text-yellow-500",
    },
    {
      label: "Reviews",
      value: contributor.totalPullRequestReviewContributions,
      icon: GitFork,
      className: "text-purple-500",
    },
  ];

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur text-black">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12">
            <Image
              src={contributor.avatarUrl}
              alt={contributor.login}
              className="rounded-full object-cover"
              fill
              sizes="48px"
            />
          </div>
          <div>
            <h3 className="font-semibold">
              {contributor.name || contributor.login}
            </h3>
            <p className="text-sm text-gray-700">@{contributor.login}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center space-x-2">
              <stat.icon className={`h-4 w-4 ${stat.className}`} />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{stat.value}</p>
                <p className="text-xs ">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm">
          Active in {contributor.repositoryCount} repositories
        </div>
      </CardContent>
    </Card>
  );
}
