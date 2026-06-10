<p align="center">
  <img src="assets/logo.png" width="220" alt="AI Maintainer OS Logo">
</p>

<h1 align="center">AI Maintainer OS</h1>

<p align="center">
AI-powered operating system for OSS maintainers
</p>

---

# AI Maintainer OS

Reduce maintainer burnout with AI-powered repository operations.

AI Maintainer OS helps open-source maintainers automate issue triage, pull-request review, repository health monitoring, contributor analytics, and weekly reporting while keeping humans in control.

---

## Why

Open-source maintainers spend a significant amount of unpaid time:

* Triaging issues
* Reviewing pull requests
* Managing labels
* Answering repetitive questions
* Monitoring contributor activity
* Preparing release reports

AI Maintainer OS reduces repetitive maintenance work so maintainers can focus on building software instead of managing queues.

---

## Why Now

Open-source projects are receiving more issues, pull requests, AI-generated contributions, and support requests than ever before.

Most maintainers are volunteers.

AI can help reduce repetitive maintenance work while preserving human judgment.

AI Maintainer OS is designed to support maintainers, not replace them.

---

## Features

* Issue Intelligence
* PR Intelligence
* Contributor Health
* Burnout Detection
* GitHub Actions
* MCP Server
* Discord Integration
* Weekly Reports

---

## Quick Start

### Install

```bash
git clone https://github.com/ShinnosukeShimura/ai-maintainer-os.git

cd ai-maintainer-os

pnpm install
```

### Run Issue Triage

```bash
pnpm cli triage-issue \
  --title "Bug: Login fails after OAuth callback" \
  --body "Users receive a blank page after login"
```

### Run Burnout Analysis

```bash
pnpm cli burnout \
  --issues 120 \
  --prs 35 \
  --weekly-issues 50 \
  --weekly-reviews 25 \
  --maintainers 2
```

### Run MCP Server

```bash
pnpm mcp
```

---

## Architecture

```text
GitHub Issues / Pull Requests
                │
                ▼
        AI Maintainer OS
                │
 ┌──────────────┼──────────────┐
 ▼              ▼              ▼
Labels       Comments      Reports
                │
                ▼
       Discord / MCP Server
```

AI Maintainer OS sits between repository activity and maintainer workflows.

It analyzes issues, pull requests, and repository health signals, then generates actionable recommendations while keeping maintainers in control.

No automatic merges.

No automatic code changes.

Human judgment remains the final authority.

---

## Example Workflow

### Issue Triage

1. A contributor opens an issue
2. AI Maintainer OS classifies the issue
3. Suggested labels are applied
4. A triage summary is generated
5. Maintainers review and decide

### Repository Health

1. Repository metrics are collected
2. Contributor activity is analyzed
3. Burnout risk is calculated
4. Weekly reports are generated
5. Reports are sent to Discord or MCP clients

---

## Vision

Build an open-source operating system for repository health, contributor management, and maintainer sustainability.

Human judgment remains in control.

AI provides recommendations, summaries, and automation support.

---

## Roadmap

### Current

* GitHub Actions
* Issue Classification
* PR Analysis
* Contributor Health Scoring
* Burnout Detection

### Planned

* OpenAI-powered triage
* Discord notifications
* GitHub App
* MCP integrations
* Maintainer dashboard

### Long-term Vision

Create an open-source operating system for repository health and maintainer sustainability.

---

## Open Source Philosophy

AI Maintainer OS is built around a simple principle:

> AI should reduce maintainer workload, not remove maintainer control.

Maintainers remain responsible for decisions.

AI assists with analysis, classification, prioritization, and reporting.

---

## License

MIT
