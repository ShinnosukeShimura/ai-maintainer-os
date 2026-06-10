#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import { classifyIssue, analyzePullRequest, calculateBurnoutRisk } from "@ai-maintainer-os/core";
import { renderWeeklyReport } from "@ai-maintainer-os/reports";
import { getRepositoryStats } from "@ai-maintainer-os/github";

const program = new Command();

program
  .name("ai-maintainer-os")
  .description("AI-assisted operating system for OSS maintainers")
  .version("0.1.0");

program
  .command("triage-issue")
  .requiredOption("--title <title>")
  .option("--body <body>", "")
  .action((opts) => {
    console.log(JSON.stringify(classifyIssue(opts.title, opts.body), null, 2));
  });

program
  .command("review-pr")
  .requiredOption("--title <title>")
  .option("--body <body>", "")
  .option("--files <number>", "Changed files", "0")
  .action((opts) => {
    console.log(JSON.stringify(analyzePullRequest(opts.title, opts.body, Number(opts.files)), null, 2));
  });

program
  .command("burnout")
  .requiredOption("--issues <number>")
  .requiredOption("--prs <number>")
  .requiredOption("--weekly-issues <number>")
  .requiredOption("--weekly-reviews <number>")
  .option("--maintainers <number>", "1")
  .action((opts) => {
    console.log(JSON.stringify(calculateBurnoutRisk({
      openIssues: Number(opts.issues),
      openPullRequests: Number(opts.prs),
      weeklyIssueCount: Number(opts.weeklyIssues),
      weeklyReviewCount: Number(opts.weeklyReviews),
      maintainerCount: Number(opts.maintainers)
    }), null, 2));
  });

program
  .command("weekly-report")
  .option("--repo <owner/repo>", process.env.GITHUB_REPOSITORY)
  .option("--maintainers <number>", "1")
  .action(async (opts) => {
    const stats = await getRepositoryStats({ repository: opts.repo });
    const burnout = calculateBurnoutRisk({
      openIssues: stats.openIssues,
      openPullRequests: stats.openPullRequests,
      weeklyIssueCount: stats.openIssues,
      weeklyReviewCount: stats.openPullRequests,
      maintainerCount: Number(opts.maintainers)
    });
    console.log(renderWeeklyReport({
      repository: opts.repo,
      openIssues: stats.openIssues,
      openPullRequests: stats.openPullRequests,
      burnoutLevel: burnout.level,
      burnoutScore: burnout.score,
      recommendation: burnout.recommendation
    }));
  });

program.parse();
