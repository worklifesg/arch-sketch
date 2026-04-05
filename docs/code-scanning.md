---
layout: default
title: Code Scanning
---

# Code Scanning

ArchSketch can generate architecture diagrams directly from your infrastructure-as-code files.

## Supported Formats

| Format | File Extensions | Detection |
|--------|----------------|-----------|
| Terraform | `.tf` | `resource`, `module`, `data` blocks |
| CloudFormation | `.yaml`, `.json` | `AWSTemplateFormatVersion`, `Resources` |
| Kubernetes | `.yaml` | `apiVersion`, `kind` fields |

## Single File Scan

1. Open a Terraform, CloudFormation, or Kubernetes file
2. Run **"ArchSketch: Generate Diagram from Code"** from the Command Palette
3. ArchSketch detects the file type, extracts resources, and generates a diagram

## Multi-File Scan (Folder)

For projects spanning multiple files (e.g., Terraform modules):

1. Run **"ArchSketch: Scan Folder for Architecture Diagram"**
2. Select a folder in the file picker
3. ArchSketch discovers all IaC files, analyzes cross-file references, and generates a unified diagram

### Cross-File Intelligence

The multi-file scanner detects relationships across files:

- **Terraform** — Module references, resource interpolations (`${module.vpc.id}`), output/variable chains
- **CloudFormation** — Nested stacks, `Ref`/`Fn::GetAtt`, cross-stack `Exports`/`Imports`
- **Kubernetes** — Label selectors, Ingress routing rules, PVC ↔ PV bindings

## Workspace Scan

For a full project overview:

1. Run **"ArchSketch: Scan Workspace for Architecture Diagram"**
2. ArchSketch scans the entire open workspace for IaC files
3. Generates a comprehensive architecture diagram

### Limits

- Maximum **200KB** of combined file content (to respect LLM context limits)
- Automatically excludes: `node_modules`, `.terraform`, `package.json`, `tsconfig.json`, and other non-IaC files

## Tips

- For large projects, use folder scan on specific directories rather than workspace scan
- The scanner auto-detects the cloud provider from your code (e.g., `aws_` resource prefixes → AWS shapes)
- You can refine the generated diagram using iterative AI refinement after scanning
