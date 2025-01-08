import { ContributorData, AnalyticsData } from "@/types/github";

export async function fetchGithubData(
  orgName: string,
  githubToken: string,
): Promise<{
  contributors: ContributorData[];
  analytics: AnalyticsData;
}> {
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

    const data: any = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return processContributorData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
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
