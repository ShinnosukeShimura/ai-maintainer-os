import * as core from "@actions/core";
import * as github from "@actions/github";
import { classifyIssue } from "@ai-maintainer-os/core";
import { renderIssueTriageComment } from "@ai-maintainer-os/reports";
import { addLabelsToIssue, commentOnIssue } from "@ai-maintainer-os/github";

async function run() {
  try {
    const mode = core.getInput("mode") || "auto";
    const context = github.context;

    if ((mode === "auto" || mode === "issue") && context.payload.issue) {
      const issue = context.payload.issue;
      const result = classifyIssue(issue.title ?? "", issue.body ?? "");
      await addLabelsToIssue({
        issueNumber: issue.number,
        labels: result.labels
      });
      await commentOnIssue({
        issueNumber: issue.number,
        body: renderIssueTriageComment(result)
      });
      core.info(`Triaged issue #${issue.number}`);
      return;
    }

    core.info("No supported event payload found.");
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

run();
