/**
 * Maps shape IDs from the sidebar palette to their mxGraph XML cell snippets.
 * Used when inserting shapes via AI refinement.
 */
export const SHAPE_XML_MAP: Record<string, string> = {
  // AWS
  "aws-ec2": "EC2 instance",
  "aws-lambda": "Lambda function",
  "aws-ecs": "ECS container service",
  "aws-eks": "EKS Kubernetes cluster",
  "aws-alb": "Application Load Balancer",
  "aws-cloudfront": "CloudFront CDN distribution",
  "aws-s3": "S3 storage bucket",
  "aws-rds": "RDS database",
  "aws-dynamodb": "DynamoDB table",
  "aws-sqs": "SQS message queue",
  "aws-sns": "SNS notification topic",
  "aws-cognito": "Cognito user pool for authentication",

  // Azure
  "azure-vm": "Azure Virtual Machine",
  "azure-appservice": "Azure App Service",
  "azure-aks": "Azure Kubernetes Service (AKS)",
  "azure-functions": "Azure Functions",
  "azure-sqldb": "Azure SQL Database",
  "azure-cosmosdb": "Azure Cosmos DB",

  // GCP
  "gcp-gce": "Google Compute Engine instance",
  "gcp-cloudrun": "Google Cloud Run service",
  "gcp-gke": "Google Kubernetes Engine cluster",
  "gcp-cloudsql": "Google Cloud SQL database",
  "gcp-pubsub": "Google Pub/Sub messaging",
  "gcp-bigquery": "Google BigQuery data warehouse",

  // Kubernetes
  "k8s-pod": "Kubernetes Pod",
  "k8s-deploy": "Kubernetes Deployment",
  "k8s-svc": "Kubernetes Service",
  "k8s-ing": "Kubernetes Ingress",
  "k8s-cm": "Kubernetes ConfigMap",
  "k8s-secret": "Kubernetes Secret",
};
