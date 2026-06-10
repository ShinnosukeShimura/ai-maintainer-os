import { Octokit } from "@octokit/rest";

export function createGitHubClient(token = process.env.GITHUB_TOKEN) {
  if (!token) {
    throw new Error("GITHUB_TOKEN is required");
  }
  return new Octokit({ auth: token });
}

export function parseRepository(repo = process.env.GITHUB_REPOSITORY) {
  if (!repo || !repo.includes("/")) {
    throw new Error("GITHUB_REPOSITORY must be in owner/repo format");
  }
  const [owner, name] = repo.split("/");
  return { owner, repo: name };
}

export async function addLabelsToIssue(params: {
  token?: string;
  repository?: string;
  issueNumber: number;
  labels: string[];
}) {
  const octokit = createGitHubClient(params.token);
  const { owner, repo } = parseRepository(params.repository);
  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number: params.issueNumber,
    labels: params.labels
  });
}

export async function commentOnIssue(params: {
  token?: string;
  repository?: string;
  issueNumber: number;
  body: string;
}) {
  const octokit = createGitHubClient(params.token);
  const { owner, repo } = parseRepository(params.repository);
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: params.issueNumber,
    body: params.body
  });
}

export async function getRepositoryStats(params: {
  token?: string;
  repository?: string;
}) {
  const octokit = createGitHubClient(params.token);
  const { owner, repo } = parseRepository(params.repository);

  const [issues, pulls] = await Promise.all([
    octokit.issues.listForRepo({ owner, repo, state: "open", per_page: 100 }),
    octokit.pulls.list({ owner, repo, state: "open", per_page: 100 })
  ]);

  const issueOnly = issues.data.filter((issue) => !issue.pull_request);

  return {
    openIssues: issueOnly.length,
    openPullRequests: pulls.data.length
  };
}
