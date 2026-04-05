---
layout: default
title: Getting Started
---

# Getting Started

## Prerequisites

- **VS Code 1.90.0** or later
- **GitHub Copilot** extension installed and signed in

## Installation

### From the VS Code Marketplace

1. Open VS Code
2. Go to the Extensions view (`Ctrl+Shift+X`)
3. Search for **"ArchSketch"**
4. Click **Install**

### From a VSIX file

1. Download the `.vsix` file from [GitHub Releases](https://github.com/worklifesg/arch-sketch/releases)
2. In VS Code, open the Command Palette (`Ctrl+Shift+P`)
3. Run **"Extensions: Install from VSIX..."**
4. Select the downloaded file

## Your First Diagram

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Run **"ArchSketch: Generate Cloud Architecture Diagram"**
3. Enter a description, for example:

   > 3-tier AWS web application with CloudFront CDN, Application Load Balancer, ECS Fargate containers, and Aurora PostgreSQL database

4. Wait a few seconds while Copilot generates the diagram
5. The diagram opens in an embedded draw.io editor where you can rearrange, edit, and style components

## Using the Sidebar

Click the **ArchSketch** icon in the activity bar (left side) to open the sidebar panel with three tabs:

- **Generate** — Type a description and hit Ctrl+Enter to generate
- **Templates** — Click a starter template to get going fast
- **Shapes** — Browse and insert individual shapes, filtered by cloud provider

## Exporting

Use the Command Palette to export your diagram:

- **Export as SVG** — Scalable vector, great for documentation
- **Export as PNG** — Raster image for sharing
- **Export HTML Embed Code** — Interactive embed for web pages
- **Save as .drawio** — Native draw.io format for further editing
