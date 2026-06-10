import { describe, expect, it } from "vitest";
import { classifyIssue, analyzePullRequest, calculateBurnoutRisk } from "./index.js";

describe("classifyIssue", () => {
  it("classifies security issues", () => {
    const result = classifyIssue("Security vulnerability leaks token");
    expect(result.category).toBe("security");
    expect(result.priority).toBe("critical");
  });
});

describe("analyzePullRequest", () => {
  it("flags breaking changes", () => {
    const result = analyzePullRequest("Breaking migration", "Removes deprecated API", 4);
    expect(result.needsHumanReview).toBe(true);
  });
});

describe("calculateBurnoutRisk", () => {
  it("returns high risk for overloaded maintainers", () => {
    const result = calculateBurnoutRisk({
      openIssues: 500,
      openPullRequests: 80,
      weeklyIssueCount: 120,
      weeklyReviewCount: 100,
      maintainerCount: 2
    });
    expect(result.level).toBe("high");
  });
});
