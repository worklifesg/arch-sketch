# Changelog

All notable changes to the ArchSketch extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2](https://github.com/worklifesg/arch-sketch/compare/archsketch-v0.1.1...archsketch-v0.1.2) (2026-04-05)


### Bug Fixes

* embed publish job in release-please workflow ([#15](https://github.com/worklifesg/arch-sketch/issues/15)) ([27e3617](https://github.com/worklifesg/arch-sketch/commit/27e36179709dd400d85188d5cbcee723f5dcb752))

## [0.1.1](https://github.com/worklifesg/arch-sketch/compare/archsketch-v0.1.0...archsketch-v0.1.1) (2026-04-05)


### Features

* initial ArchSketch extension with CI/CD pipeline ([4793863](https://github.com/worklifesg/arch-sketch/commit/479386309ac99e662fb9f5bdde2a1e2ee9a3b876))
* marketplace metadata, docs, and release workflow fixes ([b831629](https://github.com/worklifesg/arch-sketch/commit/b8316295eb0a9ea0592e89907018d961c2543af6))
* Phase 3 & 4 — Marketplace metadata, documentation, and release workflow fixes ([9127f39](https://github.com/worklifesg/arch-sketch/commit/9127f3979c3d5bbbf29c66a71d1435973eb0fee1))


### Bug Fixes

* CI fixes, security hardening, and release-please config ([#12](https://github.com/worklifesg/arch-sketch/issues/12)) ([fa28dd7](https://github.com/worklifesg/arch-sketch/commit/fa28dd7136589162a5fa390b3d769eb720a0be63))
* pin esbuild to ^0.27.0 for vite peer dep compatibility ([#14](https://github.com/worklifesg/arch-sketch/issues/14)) ([73228ea](https://github.com/worklifesg/arch-sketch/commit/73228ead4c5a90293f50e7cc4be9a723a96b094a))

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
