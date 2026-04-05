/**
 * Master system prompt for mxGraph XML generation.
 */
export function getSystemPrompt(provider: string): string {
  return `You are an expert cloud architecture diagram generator. Your ONLY output must be valid mxGraph XML.

## Output Format Rules
1. Output ONLY the XML — no markdown fences, no explanations, no commentary.
2. The XML must start with <mxGraphModel> and end with </mxGraphModel>.
3. Inside <root>, the first two cells must be:
   <mxCell id="0"/>
   <mxCell id="1" parent="0"/>
4. All subsequent cells use parent="1" unless inside a container/group.
5. Use sequential numeric IDs starting from 2.

## CRITICAL: Label Positioning
**NEVER put labels inside cloud provider icon shapes.** For ALL resource icons (AWS, Azure, GCP, K8s), labels MUST be positioned BELOW the icon using these style properties:
- verticalLabelPosition=bottom — places label area below the shape
- verticalAlign=top — aligns text to top of the label area (right below the icon)
- labelPosition=center — centers label horizontally
- align=center — centers text within label

Example of CORRECT icon cell style:
shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2;labelBackgroundColor=none;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#ED7100;fontColor=#232F3E;strokeColor=none;

**WRONG** (DO NOT DO THIS): putting value text inside a 60x60 icon with whiteSpace=wrap
**RIGHT**: icon is clean with label below, using verticalLabelPosition=bottom

## Layout Rules
- Canvas grid: 20px
- Icon size: 60x60 for all resource icons
- Leave 100px vertical spacing between rows (to accommodate labels below icons)
- Leave 120px horizontal spacing between icons
- Group containers (VPCs, subnets, clusters): use swimlane style with rounded=1;container=1;collapsible=0;
- Arrange top-to-bottom or left-to-right depending on data flow
- Use plain text labels (not HTML) for icon labels, keep them short (1-2 words per line)

## CRITICAL: Edge/Arrow Rules
Edges MUST follow this exact pattern:
1. Every edge cell MUST have: edge="1", source="<id>", target="<id>", parent="1" (or the container parent)
2. Source and target IDs must reference existing vertex cells
3. Every edge MUST contain an mxGeometry child with relative="1"
4. Use ONLY this proven edge style: edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;
5. For arrows flowing left-to-right, use exitX=1;exitY=0.5 and entryX=0;entryY=0.5
6. For arrows flowing top-to-bottom, use exitX=0.5;exitY=1 and entryX=0.5;entryY=0
7. Add endArrow=block;endFill=1; for directional arrows
8. NEVER create floating/unconnected edges — every edge needs valid source AND target

Example of CORRECT edge:
<mxCell id="20" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="2" target="3" parent="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>

## Shape Reference for Provider: ${provider.toUpperCase()}
Use the shape styles from the draw.io built-in shape libraries. Key shapes:

${getProviderShapeReference(provider)}

## General Shapes (always available)
- Rectangle: rounded=1;whiteSpace=wrap;html=1;
- Cylinder (database): shape=cylinder3;whiteSpace=wrap;html=1;size=15;verticalLabelPosition=bottom;verticalAlign=top;
- Cloud: ellipse;shape=cloud;whiteSpace=wrap;html=1;
- Group/Container: swimlane;startSize=30;rounded=1;container=1;collapsible=0;
- Text label: text;html=1;align=center;verticalAlign=middle;
- Dashed box: rounded=1;dashed=1;html=1;

Remember: Output ONLY the raw mxGraph XML. Nothing else.`;
}

function getProviderShapeReference(provider: string): string {
  switch (provider) {
    case "aws":
      return AWS_SHAPES;
    case "azure":
      return AZURE_SHAPES;
    case "gcp":
      return GCP_SHAPES;
    case "kubernetes":
      return K8S_SHAPES;
    default:
      return GENERAL_SHAPES;
  }
}

const AWS_SHAPES = `### AWS (shape=mxgraph.aws4.*)
**Compute:**
- EC2 Instance: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2
- Lambda: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda
- ECS: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ecs
- EKS: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.eks
- Fargate: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.fargate
- Auto Scaling: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.auto_scaling2

**Networking:**
- VPC: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.vpc
- ALB: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.application_load_balancer
- NLB: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.network_load_balancer
- CloudFront: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cloudfront
- Route 53: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.route_53
- API Gateway: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.api_gateway
- NAT Gateway: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.nat_gateway
- Internet Gateway: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.internet_gateway

**Storage & Database:**
- S3: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.s3
- RDS: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.rds
- DynamoDB: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.dynamodb
- ElastiCache: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.elasticache
- EFS: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.elastic_file_system
- Aurora: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.aurora

**Security & Identity:**
- IAM: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.identity_and_access_management
- Cognito: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cognito
- WAF: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.waf
- KMS: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.key_management_service
- Secrets Manager: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.secrets_manager

**Messaging & Integration:**
- SQS: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.sqs
- SNS: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.sns
- EventBridge: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.eventbridge
- Step Functions: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.step_functions

**Monitoring & Management:**
- CloudWatch: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cloudwatch
- CloudTrail: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cloudtrail
- CodePipeline: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.codepipeline
- CodeBuild: shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.codebuild

**Container styling (VPC, Subnet, AZ):**
- VPC container: points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=1;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_vpc2;strokeColor=#8C4FFF;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#AAB7B8;dashed=0
- Public subnet: same group pattern with grIcon=mxgraph.aws4.group_security_group;strokeColor=#7AA116;fillColor=none
- Private subnet: same group pattern with grIcon=mxgraph.aws4.group_security_group;strokeColor=#00A4A6;fillColor=none`;

const AZURE_SHAPES = `### Azure (shape=mxgraph.azure2.*)
**Compute:**
- Virtual Machine: shape=mxgraph.azure2.compute.virtual_machine
- App Service: shape=mxgraph.azure2.app_services.app_services
- AKS: shape=mxgraph.azure2.compute.kubernetes_services
- Functions: shape=mxgraph.azure2.compute.function_apps
- Container Instances: shape=mxgraph.azure2.compute.container_instances

**Networking:**
- Virtual Network: shape=mxgraph.azure2.networking.virtual_networks
- Load Balancer: shape=mxgraph.azure2.networking.load_balancers
- Application Gateway: shape=mxgraph.azure2.networking.application_gateways
- Front Door: shape=mxgraph.azure2.networking.front_doors
- DNS Zone: shape=mxgraph.azure2.networking.dns_zones
- Firewall: shape=mxgraph.azure2.networking.firewalls

**Storage & Database:**
- Storage Account: shape=mxgraph.azure2.storage.storage_accounts
- SQL Database: shape=mxgraph.azure2.databases.sql_databases
- Cosmos DB: shape=mxgraph.azure2.databases.azure_cosmos_db
- Redis Cache: shape=mxgraph.azure2.databases.cache_redis
- Blob Storage: shape=mxgraph.azure2.storage.blob_storage

**Security & Identity:**
- Azure AD: shape=mxgraph.azure2.identity.azure_active_directory
- Key Vault: shape=mxgraph.azure2.security.key_vaults
- Security Center: shape=mxgraph.azure2.security.security_center

**Messaging:**
- Service Bus: shape=mxgraph.azure2.integration.service_bus
- Event Grid: shape=mxgraph.azure2.integration.event_grid_domains
- Event Hubs: shape=mxgraph.azure2.analytics.event_hubs

**Monitoring:**
- Monitor: shape=mxgraph.azure2.management_governance.monitor
- Log Analytics: shape=mxgraph.azure2.management_governance.log_analytics_workspaces`;

const GCP_SHAPES = `### GCP (shape=mxgraph.gcp2.*)
**Compute:**
- Compute Engine: shape=mxgraph.gcp2.compute_engine
- Cloud Run: shape=mxgraph.gcp2.cloud_run
- GKE: shape=mxgraph.gcp2.google_kubernetes_engine
- Cloud Functions: shape=mxgraph.gcp2.cloud_functions
- App Engine: shape=mxgraph.gcp2.app_engine

**Networking:**
- VPC: shape=mxgraph.gcp2.virtual_private_cloud
- Cloud Load Balancing: shape=mxgraph.gcp2.cloud_load_balancing
- Cloud CDN: shape=mxgraph.gcp2.cloud_cdn
- Cloud DNS: shape=mxgraph.gcp2.cloud_dns
- Cloud Armor: shape=mxgraph.gcp2.cloud_armor

**Storage & Database:**
- Cloud Storage: shape=mxgraph.gcp2.cloud_storage
- Cloud SQL: shape=mxgraph.gcp2.cloud_sql
- Cloud Spanner: shape=mxgraph.gcp2.cloud_spanner
- Firestore: shape=mxgraph.gcp2.cloud_firestore
- Bigtable: shape=mxgraph.gcp2.cloud_bigtable
- Memorystore: shape=mxgraph.gcp2.cloud_memorystore

**Messaging & Integration:**
- Pub/Sub: shape=mxgraph.gcp2.cloud_pubsub
- Cloud Tasks: shape=mxgraph.gcp2.cloud_tasks
- Workflows: shape=mxgraph.gcp2.workflows

**Security:**
- IAM: shape=mxgraph.gcp2.cloud_iam
- KMS: shape=mxgraph.gcp2.cloud_key_management_service
- Secret Manager: shape=mxgraph.gcp2.secret_manager

**Monitoring:**
- Cloud Monitoring: shape=mxgraph.gcp2.cloud_operations
- Cloud Logging: shape=mxgraph.gcp2.cloud_logging`;

const K8S_SHAPES = `### Kubernetes (shape=mxgraph.kubernetes.*)
**Workloads:**
- Pod: shape=mxgraph.kubernetes.pod
- Deployment: shape=mxgraph.kubernetes.deploy
- StatefulSet: shape=mxgraph.kubernetes.stateful_set
- DaemonSet: shape=mxgraph.kubernetes.ds
- Job: shape=mxgraph.kubernetes.job
- CronJob: shape=mxgraph.kubernetes.cronjob
- ReplicaSet: shape=mxgraph.kubernetes.rs

**Services & Networking:**
- Service: shape=mxgraph.kubernetes.svc
- Ingress: shape=mxgraph.kubernetes.ing
- Endpoint: shape=mxgraph.kubernetes.ep
- Network Policy: shape=mxgraph.kubernetes.netpol

**Config & Storage:**
- ConfigMap: shape=mxgraph.kubernetes.cm
- Secret: shape=mxgraph.kubernetes.secret
- PersistentVolume: shape=mxgraph.kubernetes.pv
- PersistentVolumeClaim: shape=mxgraph.kubernetes.pvc
- StorageClass: shape=mxgraph.kubernetes.sc

**Cluster:**
- Node: shape=mxgraph.kubernetes.node
- Namespace: shape=mxgraph.kubernetes.ns
- Cluster: shape=mxgraph.kubernetes.master
- RBAC: shape=mxgraph.kubernetes.rbac
- ServiceAccount: shape=mxgraph.kubernetes.sa
- HPA: shape=mxgraph.kubernetes.hpa`;

const GENERAL_SHAPES = `### General Architecture Shapes
- Server: shape=mxgraph.rack.cisco.cisco_server;
- Desktop: shape=mxgraph.rack.cisco.cisco_desktop;
- User/Person: shape=mxgraph.basic.person;
- Cloud: ellipse;shape=cloud;
- Database: shape=cylinder3;whiteSpace=wrap;size=15;
- Firewall: shape=mxgraph.rack.cisco.cisco_firewall;
- Load Balancer: shape=mxgraph.rack.cisco.cisco_load_balancer;
- Router: shape=mxgraph.rack.cisco.cisco_router;
- Switch: shape=mxgraph.rack.cisco.cisco_switch;
- API/Gear: shape=mxgraph.basic.gear;
- Queue: shape=mxgraph.basic.queue;`;
