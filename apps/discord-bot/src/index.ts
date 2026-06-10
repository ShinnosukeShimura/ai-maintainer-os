import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { calculateBurnoutRisk } from "@ai-maintainer-os/core";
import { getRepositoryStats } from "@ai-maintainer-os/github";
import { renderWeeklyReport } from "@ai-maintainer-os/reports";

const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;
const repository = process.env.GITHUB_REPOSITORY;

if (!token || !channelId || !repository) {
  throw new Error("DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID, and GITHUB_REPOSITORY are required");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  const channel = await client.channels.fetch(channelId);
  if (!channel || !("send" in channel)) {
    throw new Error("Discord channel not found or cannot send messages");
  }

  const stats = await getRepositoryStats({ repository });
  const burnout = calculateBurnoutRisk({
    openIssues: stats.openIssues,
    openPullRequests: stats.openPullRequests,
    weeklyIssueCount: stats.openIssues,
    weeklyReviewCount: stats.openPullRequests,
    maintainerCount: 1
  });

  await channel.send(renderWeeklyReport({
    repository,
    openIssues: stats.openIssues,
    openPullRequests: stats.openPullRequests,
    burnoutLevel: burnout.level,
    burnoutScore: burnout.score,
    recommendation: burnout.recommendation
  }));

  await client.destroy();
});

await client.login(token);
