---
layout: default
title: Configuration
---

# Configuration

ArchSketch settings can be configured in VS Code settings (`Ctrl+,`).

## Settings Reference

### `archsketch.defaultProvider`

The cloud provider used by default when generating diagrams.

| Value | Description |
|-------|-------------|
| `aws` (default) | Amazon Web Services shapes |
| `azure` | Microsoft Azure shapes |
| `gcp` | Google Cloud Platform shapes |
| `kubernetes` | Kubernetes resource shapes |
| `general` | Generic architecture shapes |

You can override this per-request by mentioning the provider in your prompt (e.g., "Azure web app with...").

### `archsketch.theme`

Controls the draw.io editor theme.

| Value | Description |
|-------|-------------|
| `auto` (default) | Matches your VS Code theme (dark/light) |
| `light` | Force light theme |
| `dark` | Force dark theme |

### `archsketch.defaultExportFormat`

Default format when exporting diagrams.

| Value | Description |
|-------|-------------|
| `svg` (default) | Scalable vector graphics |
| `png` | Raster image |
| `drawio` | Native draw.io XML |
