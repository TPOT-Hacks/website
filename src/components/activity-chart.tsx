"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContributorData } from "../types/github";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function ActivityChart({
  contributors,
}: {
  contributors: ContributorData[];
}) {
  return (
    <Card className="col-span-full bg-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Contribution Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contributors}>
              <XAxis
                dataKey="login"
                stroke="white" // Set X axis labels to gray-400
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="white"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm font-medium">Commits</span>
                          </div>
                          <span className="text-sm">
                            {payload[0].payload.totalCommitContributions}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium">PRs</span>
                          </div>
                          <span className="text-sm">
                            {payload[0].payload.totalPullRequestContributions}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="totalCommitContributions"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
