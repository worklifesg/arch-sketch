# Changelog

All notable changes to the ArchSketch extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Extension icon and marketplace metadata (gallery banner, badges, categories)
- `SECURITY.md` with vulnerability reporting process
- GitHub Pages documentation site
- Comprehensive README with all features, use cases, and troubleshooting

## [0.1.0] - 2026-04-04

### Added
- Natural language to mxGraph XML generation via VS Code Language Model API
- Embedded draw.io editor in webview panel
- Cloud provider shape support: AWS (12), Azure (6), GCP (6), Kubernetes (6)
- Export to `.drawio`, SVG, PNG, and HTML embed code
- Open existing `.drawio` files in preview
- Dark/light theme support (auto-detect from VS Code theme)
- Configuration settings for default provider, theme, and export format
- Sidebar panel with three tabs: Generate, Templates, Shapes
- 5 starter templates: AWS 3-Tier, AWS Serverless, K8s Microservices, Azure Web App, GCP Data Pipeline
- Iterative AI refinement — modify diagrams through conversation
- Code scanning: generate diagrams from Terraform, CloudFormation, and Kubernetes YAML
- Multi-file scanning: scan folders and workspaces with cross-file reference analysis
- Shape palette with provider filtering and drag-and-drop insertion
- CI/CD pipeline with quality gates, CodeQL security scanning, and dependabot
- Publishing workflows for VS Code Marketplace and Open VSX Registry
- Pre-release channel for beta/rc/alpha releases
- Release-please for automated semantic versioning
