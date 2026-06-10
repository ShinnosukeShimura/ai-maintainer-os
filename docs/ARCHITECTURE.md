# Architecture

AI Maintainer OS is structured as a monorepo.

## Data flow

1. GitHub issue, pull request, or repository stats are received.
2. Core rules produce deterministic baseline classifications.
3. Optional AI provider improves summaries and recommendations.
4. Output is routed to:
   - GitHub labels and comments
   - Discord reports
   - MCP tools
   - CLI output

## Design principles

- Human-in-the-loop
- Auditable recommendations
- Deterministic fallback without AI API access
- OSS-first integrations
- Low-friction GitHub Action adoption
