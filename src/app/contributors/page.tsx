import GithubContributors from '@/components/github/GithubContributors';

export default function ContributorsPage() {
  const githubToken = process.env.GITHUB_TOKEN || '';
  const orgName = process.env.GITHUB_ORG || '';

  return <GithubContributors orgName={orgName} githubToken={githubToken} />;
}
