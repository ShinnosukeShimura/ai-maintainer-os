# AI Maintainer OS

AI Maintainer OS is an open-source toolkit for reducing repetitive OSS maintenance work.

It helps maintainers triage issues, review pull requests, detect contributor-health signals,
generate weekly repository reports, and route important updates to GitHub, Discord, and AI agents.

> Human-in-the-loop by design. AI Maintainer OS recommends actions; maintainers stay in control.

## Why this exists

Open source maintainers spend large amounts of unpaid time on repetitive operational work:

- Reading and classifying issues
- Reviewing pull requests
- Answering duplicate support requests
- Labeling and routing work
- Tracking stale contributors and overloaded maintainers
- Preparing weekly updates and release notes

AI Maintainer OS turns these recurring maintenance tasks into repeatable, auditable workflows.

## Core features

- **Issue Intelligence**: classify issues as bug, feature, docs, support, security, or question
- **PR Intelligence**: summarize changes, flag breaking changes, detect release-note candidates
- **Contributor Health**: identify high-value contributors, inactive contributors, and onboarding opportunities
- **Burnout Detection**: estimate maintainer load from issue and PR volume
- **GitHub Action**: run automatic triage on new issues and pull requests
- **MCP Server**: expose repository-intelligence tools to AI agents
- **Discord Bot**: send weekly repo-health summaries to a maintainer channel
- **CLI**: run the same workflows locally or in CI

## Repository structure

```txt
apps/
  cli/              Command-line interface
  github-action/    GitHub Action entrypoint
  mcp-server/       MCP server for AI agents
  discord-bot/      Discord bot for weekly reports

packages/
  core/             Scoring and classification logic
  github/           GitHub API client
  ai/               AI provider abstraction
  reports/          Markdown report generator

docs/
  ARCHITECTURE.md
  ROADMAP.md
  OPENAI_CODEX_FOR_OSS_APPLICATION.md
```

## Quick start

```bash
pnpm install
pnpm build
pnpm cli triage-issue --title "Bug: login fails" --body "The app crashes after login"
```

## GitHub Action usage

```yaml
name: AI Maintainer OS

on:
  issues:
    types: [opened, edited]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  ai-maintainer:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./apps/github-action
        with:
          mode: auto
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Environment variables

```env
OPENAI_API_KEY=
GITHUB_TOKEN=
GITHUB_REPOSITORY=
DISCORD_BOT_TOKEN=
DISCORD_CHANNEL_ID=
```

## License

MIT
