import type { IssueTriageResult } from "@ai-maintainer-os/core";

export function renderIssueTriageComment(result: IssueTriageResult) {
  return [
    "## AI Maintainer OS triage",
    "",
    `- Category: **${result.category}**`,
    `- Priority: **${result.priority}**`,
    `- Confidence: **${Math.round(result.confidence * 100)}%**`,
    `- Labels: ${result.labels.map((label) => `\`${label}\``).join(", ")}`,
    "",
    `Rationale: ${result.rationale}`,
    "",
    "_This is an AI-assisted recommendation. Maintainers remain the final decision makers._"
  ].join("\n");
}

export function renderWeeklyReport(input: {
  repository: string;
  openIssues: number;
  openPullRequests: number;
  burnoutLevel: string;
  burnoutScore: number;
  recommendation: string;
}) {
  return [
    `# Weekly maintainer report: ${input.repository}`,
    "",
    "## Repository health",
    "",
    `- Open issues: ${input.openIssues}`,
    `- Open pull requests: ${input.openPullRequests}`,
    `- Maintainer burnout risk: **${input.burnoutLevel}** (${input.burnoutScore}/100)`,
    "",
    "## Recommendation",
    "",
    input.recommendation
  ].join("\n");
}
