---
layout: default
title: Templates
---

# Starter Templates

ArchSketch includes 5 pre-built architecture templates to get you started quickly. Access them from the **Templates** tab in the sidebar.

## AWS 3-Tier Web Application

A classic three-tier architecture on AWS:

```
CloudFront CDN → Application Load Balancer → EC2 Auto Scaling Group → RDS Multi-AZ
```

Best for: Traditional web applications, content-heavy sites.

## AWS Serverless

A fully serverless architecture on AWS:

```
Cognito Auth → API Gateway → Lambda Functions → DynamoDB + S3
```

Best for: APIs, event-driven applications, low-traffic services.

## Kubernetes Microservices

A microservices architecture running on Kubernetes:

```
Ingress Controller → API Gateway → Order/Product/User Services → PostgreSQL + Redis
```

Best for: Container-native applications, service mesh architectures.

## Azure Web Application

An Azure-native web application with security:

```
Azure Front Door → App Service → SQL Database + Azure AD + Key Vault
```

Best for: Enterprise web applications, Azure-first organizations.

## GCP Data Pipeline

A data processing pipeline on Google Cloud:

```
Pub/Sub → Dataflow → BigQuery + Cloud Storage + Looker
```

Best for: Real-time analytics, ETL pipelines, data warehousing.

## Customizing Templates

After loading a template, you can:

1. **Refine with AI** — Use the chat to add, remove, or modify components
2. **Edit manually** — Drag, resize, and restyle shapes in the draw.io editor
3. **Export** — Save in any supported format
