import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { classifyIssue, analyzePullRequest, calculateBurnoutRisk } from "@ai-maintainer-os/core";

const server = new Server(
  {
    name: "ai-maintainer-os",
    version: "0.1.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "triage_issue",
      description: "Classify an OSS issue and suggest labels.",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" }
        },
        required: ["title"]
      }
    },
    {
      name: "review_pull_request",
      description: "Analyze PR risk and suggest review labels.",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" },
          filesChanged: { type: "number" }
        },
        required: ["title"]
      }
    },
    {
      name: "calculate_burnout_risk",
      description: "Estimate maintainer burnout risk from repository workload.",
      inputSchema: {
        type: "object",
        properties: {
          openIssues: { type: "number" },
          openPullRequests: { type: "number" },
          weeklyIssueCount: { type: "number" },
          weeklyReviewCount: { type: "number" },
          maintainerCount: { type: "number" }
        },
        required: ["openIssues", "openPullRequests", "weeklyIssueCount", "weeklyReviewCount", "maintainerCount"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const args = request.params.arguments as Record<string, unknown>;

  if (request.params.name === "triage_issue") {
    return {
      content: [{
        type: "text",
        text: JSON.stringify(classifyIssue(String(args.title), String(args.body ?? "")), null, 2)
      }]
    };
  }

  if (request.params.name === "review_pull_request") {
    return {
      content: [{
        type: "text",
        text: JSON.stringify(analyzePullRequest(
          String(args.title),
          String(args.body ?? ""),
          Number(args.filesChanged ?? 0)
        ), null, 2)
      }]
    };
  }

  if (request.params.name === "calculate_burnout_risk") {
    return {
      content: [{
        type: "text",
        text: JSON.stringify(calculateBurnoutRisk({
          openIssues: Number(args.openIssues),
          openPullRequests: Number(args.openPullRequests),
          weeklyIssueCount: Number(args.weeklyIssueCount),
          weeklyReviewCount: Number(args.weeklyReviewCount),
          maintainerCount: Number(args.maintainerCount)
        }), null, 2)
      }]
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
