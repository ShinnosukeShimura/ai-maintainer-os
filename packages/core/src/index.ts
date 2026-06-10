export type IssueCategory =
  | "bug"
  | "feature"
  | "documentation"
  | "support"
  | "security"
  | "question"
  | "maintenance";

export type IssueTriageResult = {
  category: IssueCategory;
  priority: "low" | "medium" | "high" | "critical";
  labels: string[];
  confidence: number;
  rationale: string;
};

const keywordMap: Record<IssueCategory, string[]> = {
  bug: ["bug", "crash", "error", "fails", "failure", "broken", "regression"],
  feature: ["feature", "request", "enhancement", "add support", "proposal"],
  documentation: ["docs", "documentation", "readme", "typo", "example"],
  support: ["help", "how do i", "cannot install", "setup", "configuration"],
  security: ["security", "vulnerability", "xss", "csrf", "rce", "leak", "secret"],
  question: ["question", "why", "what is", "is it possible"],
  maintenance: ["refactor", "chore", "dependency", "ci", "workflow"]
};

export function classifyIssue(title: string, body = ""): IssueTriageResult {
  const text = `${title}\n${body}`.toLowerCase();
  const scores = Object.entries(keywordMap).map(([category, keywords]) => ({
    category: category as IssueCategory,
    score: keywords.filter((keyword) => text.includes(keyword)).length
  }));

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];
  const category = best.score > 0 ? best.category : "question";

  const critical = category === "security" || /data loss|rce|credential|secret/.test(text);
  const high = critical || /crash|regression|production|blocking/.test(text);
  const priority = critical ? "critical" : high ? "high" : best.score >= 2 ? "medium" : "low";

  const labels = Array.from(new Set([
    `type:${category}`,
    `priority:${priority}`,
    best.score === 0 ? "needs:maintainer-review" : "ai:triaged"
  ]));

  return {
    category,
    priority,
    labels,
    confidence: Math.min(0.95, 0.45 + best.score * 0.2),
    rationale: best.score > 0
      ? `Matched ${best.score} keyword signal(s) for ${category}.`
      : "No strong keyword signal found; defaulted to question and requested maintainer review."
  };
}

export type PullRequestReview = {
  summary: string;
  risk: "low" | "medium" | "high";
  labels: string[];
  needsHumanReview: boolean;
};

export function analyzePullRequest(title: string, body = "", filesChanged = 0): PullRequestReview {
  const text = `${title}\n${body}`.toLowerCase();
  const breaking = /breaking|migration|remove|deprecated|major/.test(text);
  const security = /security|auth|token|secret|permission/.test(text);
  const risk = breaking || security || filesChanged > 20 ? "high" : filesChanged > 8 ? "medium" : "low";

  return {
    summary: `PR appears to be ${risk}-risk based on text signals and ${filesChanged} changed file(s).`,
    risk,
    labels: [
      `risk:${risk}`,
      breaking ? "change:breaking" : "change:standard",
      security ? "area:security" : "ai:reviewed"
    ],
    needsHumanReview: risk !== "low"
  };
}

export type BurnoutInput = {
  openIssues: number;
  openPullRequests: number;
  weeklyIssueCount: number;
  weeklyReviewCount: number;
  maintainerCount: number;
};

export function calculateBurnoutRisk(input: BurnoutInput) {
  const maintainers = Math.max(1, input.maintainerCount);
  const issueLoad = input.openIssues / maintainers;
  const prLoad = input.openPullRequests / maintainers;
  const weeklyLoad = (input.weeklyIssueCount + input.weeklyReviewCount) / maintainers;
  const score = Math.min(100, Math.round(issueLoad * 0.4 + prLoad * 2 + weeklyLoad * 3));
  const level = score >= 75 ? "high" : score >= 45 ? "medium" : "low";

  return {
    score,
    level,
    recommendation:
      level === "high"
        ? "Pause non-critical work, recruit reviewers, enable stale automation, and reduce response expectations."
        : level === "medium"
          ? "Add triage rotation, document repeated answers, and label issues more aggressively."
          : "Current load appears manageable."
  };
}
