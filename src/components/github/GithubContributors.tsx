"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';
import Link from 'next/link';

interface ContributorData {
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

interface GithubContributorsProps {
  orgName: string;
  githubToken: string;
}

export default function GithubContributors({ orgName, githubToken }: GithubContributorsProps) {
  const [contributors, setContributors] = useState<ContributorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, variables: { orgName } }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data from GitHub API');
        }

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        // Process and aggregate contributor data
        const contributorsMap = new Map<string, ContributorData>();

        data.data.organization.repositories.nodes.forEach((repo: any) => {
          const commits = repo.defaultBranchRef?.target?.history?.nodes || [];
          commits.forEach((commit: any) => {
            const user = commit.author?.user;
            if (user) {
              if (!contributorsMap.has(user.login)) {
                contributorsMap.set(user.login, {
                  login: user.login,
                  name: user.name,
                  avatarUrl: user.avatarUrl,
                  ...user.contributionsCollection,
                  repositories: [],
                  repositoryCount: 0,
                  totalContributions: 0,
                });
              }
              const contributor = contributorsMap.get(user.login)!;
              if (!contributor.repositories.includes(repo.name)) {
                contributor.repositories.push(repo.name);
                contributor.repositoryCount = contributor.repositories.length;
              }
            }
          });
        });

        // Convert to array and calculate additional metrics
        const processedContributors = Array.from(contributorsMap.values()).map(contributor => ({
          ...contributor,
          totalContributions: 
            contributor.totalCommitContributions + 
            contributor.totalIssueContributions + 
            contributor.totalPullRequestContributions +
            contributor.totalPullRequestReviewContributions
        }));

        setContributors(_.orderBy(processedContributors, ['totalContributions'], ['desc']));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [orgName, githubToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="font-mono">Loading contributor data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-900/20 text-red-400 p-4 rounded-lg font-mono">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <nav className="mb-16 pt-8">
          <ul className="flex space-x-6 text-sm">
            <li>
              <Link href="/" className="hover:text-gray-400">Home</Link>
            </li>
            <li>
              <Link href="/hacks" className="hover:text-gray-400">Hacks</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gray-400">Blog</Link>
            </li>
            <li>
              <Link href="/contributors" className="hover:text-gray-400">Contributors</Link>
            </li>
          </ul>
        </nav>

        <main className="space-y-8">
          <h1 className="text-2xl font-bold">GitHub Contributors</h1>
          
          {/* Overview Chart */}
          <Card className="bg-[#0d1117] border border-gray-800">
            <CardHeader>
              <h2 className="text-xl font-mono">Contribution Overview</h2>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contributors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="login" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0d1117', 
                        border: '1px solid #374151',
                        borderRadius: '0.375rem',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="totalCommitContributions" fill="#059669" name="Commits" />
                    <Bar dataKey="totalPullRequestContributions" fill="#3B82F6" name="PRs" />
                    <Bar dataKey="totalIssueContributions" fill="#D97706" name="Issues" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Contributors List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributors.map((contributor) => (
              <Card key={contributor.login} className="bg-[#0d1117] border border-gray-800">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img
                      src={contributor.avatarUrl}
                      alt={contributor.login}
                      className="w-12 h-12 rounded-full ring-1 ring-gray-800"
                    />
                    <div>
                      <h3 className="text-lg font-mono text-white">{contributor.name || contributor.login}</h3>
                      <p className="text-sm text-[#58a6ff]">@{contributor.login}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-[#58a6ff]">Total Contributions:</span>{' '}
                      <span className="text-white">{contributor.totalContributions}</span>
                    </p>
                    <p>
                      <span className="text-[#58a6ff]">Commits:</span>{' '}
                      <span className="text-white">{contributor.totalCommitContributions}</span>
                    </p>
                    <p>
                      <span className="text-[#58a6ff]">Pull Requests:</span>{' '}
                      <span className="text-white">{contributor.totalPullRequestContributions}</span>
                    </p>
                    <p>
                      <span className="text-[#58a6ff]">Issues:</span>{' '}
                      <span className="text-white">{contributor.totalIssueContributions}</span>
                    </p>
                    <p>
                      <span className="text-[#58a6ff]">Reviews:</span>{' '}
                      <span className="text-white">{contributor.totalPullRequestReviewContributions}</span>
                    </p>
                    <p>
                      <span className="text-[#58a6ff]">Active Repositories:</span>{' '}
                      <span className="text-white">{contributor.repositoryCount}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-800 text-gray-400 text-sm">
            <p>Built with Next.js. Join our discord to make this site better!</p>
          </footer>
        </main>
      </div>
    </div>
  );
} 