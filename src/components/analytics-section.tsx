import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommit, GitPullRequest, CircleDot, Users } from "lucide-react";
import { AnalyticsData } from "../types/github";

export function AnalyticsSection({ data }: { data: AnalyticsData }) {
  const stats = [
    {
      title: "Total Commits",
      value: data.totalCommits.toLocaleString(),
      icon: GitCommit,
      className: "text-green-500",
    },
    {
      title: "Pull Requests",
      value: data.totalPRs.toLocaleString(),
      icon: GitPullRequest,
      className: "text-blue-500",
    },
    {
      title: "Issues",
      value: data.totalIssues.toLocaleString(),
      icon: CircleDot,
      className: "text-yellow-500",
    },
    {
      title: "Contributors",
      value: data.contributorsCount.toLocaleString(),
      icon: Users,
      className: "text-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.className}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
