---
layout: default
title: Features
---

# Features

## Natural Language Generation

Describe your architecture in plain English. ArchSketch uses GitHub Copilot's Language Model API to produce editable draw.io diagrams with proper shapes, labels, and connections.

**Tips for better results:**
- Name specific services (e.g., "ECS Fargate" not just "containers")
- Describe data flow direction (e.g., "users connect through CloudFront to ALB")
- Mention the cloud provider if not using the default

## Multi-Provider Shape Library

ArchSketch includes native shapes for major cloud providers:

| Provider | Example Shapes |
|----------|---------------|
| AWS | EC2, Lambda, ECS, EKS, ALB, CloudFront, S3, RDS, DynamoDB, SQS, SNS, Cognito |
| Azure | VM, App Service, AKS, Functions, SQL Database, Cosmos DB |
| GCP | GCE, Cloud Run, GKE, Cloud SQL, Pub/Sub, BigQuery |
| Kubernetes | Pod, Deployment, Service, Ingress, ConfigMap, Secret |

## Starter Templates

Five pre-built architectures to jumpstart your diagram:

1. **AWS 3-Tier** — CloudFront → ALB → EC2 Auto Scaling → RDS Multi-AZ
2. **AWS Serverless** — API Gateway → Lambda → DynamoDB + S3 + Cognito
3. **K8s Microservices** — Ingress → API Gateway → 3 services + PostgreSQL + Redis
4. **Azure Web App** — Front Door → App Service → SQL Database + Azure AD + Key Vault
5. **GCP Data Pipeline** — Pub/Sub → Dataflow → BigQuery + Cloud Storage + Looker

## Iterative Refinement

After generating a diagram, use the refinement chat to modify it:
- "Add a Redis cache between the API and database"
- "Replace EC2 with ECS Fargate"
- "Add an SQS queue for async processing"

The AI preserves existing components and only modifies what you ask for.

## Code Scanning

See the dedicated [Code Scanning](code-scanning.md) guide for generating diagrams from Terraform, CloudFormation, and Kubernetes manifests.

## Export Formats

| Format | Command | Use Case |
|--------|---------|----------|
| `.drawio` | Save file | Editable diagram |
| SVG | Export as SVG | Documentation, wikis |
| PNG | Export as PNG | Slides, chat |
| HTML | Export HTML Embed | Web pages, blogs |
