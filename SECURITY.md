# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

To report a vulnerability, use [GitHub Security Advisories](https://github.com/worklifesg/arch-sketch/security/advisories/new) (preferred) or email **worklife_sg@outlook.com** with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

You should receive a response within 72 hours. We will coordinate disclosure with you.

## Security Design

ArchSketch is designed with a minimal attack surface:

- **No API keys stored** — Authentication is handled entirely by the GitHub Copilot extension
- **No outbound network calls** from the extension itself — only the embedded draw.io iframe loads from `embed.diagrams.net`
- **Content Security Policy** — Webviews use strict CSP with nonce-based script sources; no `unsafe-eval` or `unsafe-inline`
- **No eval()** — LLM responses are parsed with regex-based XML extraction, never executed as code
- **Input validation** — User prompts are passed as-is to the VS Code Language Model API (sandboxed by VS Code)
- **Dependency auditing** — `npm audit --audit-level=high` runs in CI on every push and PR
- **CodeQL scanning** — Weekly automated analysis for JavaScript/TypeScript vulnerabilities
- **Dependency review** — PRs that introduce dependencies with known vulnerabilities are blocked
