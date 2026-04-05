---
layout: default
title: FAQ
---

# Frequently Asked Questions

## General

### Do I need an API key?

No. ArchSketch uses the VS Code Language Model API provided by GitHub Copilot. If you have Copilot installed and signed in, it works automatically.

### Does it work offline?

The AI generation requires an internet connection (for Copilot). The draw.io editor loads from `embed.diagrams.net`. Editing existing diagrams locally saved as `.drawio` files does not require generation.

### Which VS Code versions are supported?

VS Code 1.90.0 and later. The extension uses the Language Model API which was stabilized in that release.

## Diagrams

### The generated diagram doesn't look right

- Try a more specific description — name services explicitly
- Mention the cloud provider in your prompt
- Use iterative refinement to fix specific parts
- Rearrange shapes manually in the draw.io editor

### Can I edit the diagram after generation?

Yes. The embedded draw.io editor supports full editing: drag, resize, add shapes, change styles, add text, and more. You can also use AI refinement to modify it through conversation.

### Can I open existing .drawio files?

Yes. Use **"ArchSketch: Open .drawio in Preview"** from the Command Palette, or click a `.drawio` file and use the sidebar.

## Code Scanning

### What IaC formats are supported?

Terraform (`.tf`), CloudFormation (YAML/JSON), and Kubernetes manifests (YAML).

### Why is my workspace scan incomplete?

The scanner has a 200KB content limit to respect LLM context windows. For large projects, scan specific folders instead of the entire workspace.

### Does it analyze actual infrastructure?

No. ArchSketch reads your code files locally. It does not connect to AWS/Azure/GCP APIs or read deployed infrastructure state.

## Troubleshooting

### "No language model available"

Ensure the GitHub Copilot extension is installed and you're signed in. Check the Copilot status in the VS Code status bar.

### Extension not appearing in activity bar

Try reloading the window (`Ctrl+Shift+P` → "Developer: Reload Window"). If it still doesn't appear, check that the extension is enabled in the Extensions view.

### VSIX won't install

Verify your VS Code version is 1.90.0 or later. Run `code --version` to check.
