# ArchSketch

**Generate cloud architecture diagrams from natural language using AI — right inside VS Code.**

ArchSketch uses GitHub Copilot's Language Model API to turn plain English descriptions into editable draw.io diagrams. No API keys needed — it uses your existing Copilot subscription.

## Features

- **Natural Language → Diagram**: Describe your architecture, get a fully rendered diagram
- **Cloud Provider Support**: AWS, Azure, GCP, Kubernetes, and general architecture shapes
- **Embedded draw.io Editor**: Full draw.io editing experience inside VS Code
- **Export Options**: Save as `.drawio`, SVG, PNG, or copy HTML embed code
- **Dark/Light Theme**: Automatically matches your VS Code theme

## Quick Start

1. Install the extension from the VS Code Marketplace
2. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run **"ArchSketch: Generate Cloud Architecture Diagram"**
4. Describe your architecture (e.g., "3-tier AWS web app with ALB, ECS Fargate, and Aurora PostgreSQL")
5. Edit the generated diagram in the embedded draw.io editor
6. Export as SVG, PNG, .drawio, or HTML embed

## Requirements

- VS Code 1.90.0+
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension (for AI generation)

## Commands

| Command | Description |
|---------|-------------|
| `ArchSketch: Generate Cloud Architecture Diagram` | Generate a diagram from a text description |
| `ArchSketch: Open .drawio in Preview` | Open an existing .drawio file in the editor |
| `ArchSketch: Export as SVG` | Export the current diagram as SVG |
| `ArchSketch: Export as PNG` | Export the current diagram as PNG |
| `ArchSketch: Export HTML Embed Code` | Copy an HTML embed snippet to clipboard |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `archsketch.defaultProvider` | `aws` | Default cloud provider for shapes (aws, azure, gcp, kubernetes, general) |
| `archsketch.theme` | `auto` | draw.io editor theme (light, dark, auto) |
| `archsketch.defaultExportFormat` | `svg` | Default export format (svg, png, drawio) |

## Supported Providers

- **AWS** — EC2, Lambda, ECS, EKS, S3, RDS, DynamoDB, ALB, CloudFront, SQS, SNS, and 30+ more
- **Azure** — VMs, App Service, AKS, Functions, SQL Database, Cosmos DB, and more
- **GCP** — Compute Engine, Cloud Run, GKE, Cloud SQL, Pub/Sub, and more
- **Kubernetes** — Pods, Deployments, Services, Ingress, StatefulSets, ConfigMaps, and more
- **General** — Servers, databases, cloud shapes, load balancers, firewalls

## Development

```bash
git clone https://github.com/archsketch/archsketch
cd archsketch
npm install
npm run build
```

Press `F5` in VS Code to launch the Extension Development Host.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](LICENSE)
