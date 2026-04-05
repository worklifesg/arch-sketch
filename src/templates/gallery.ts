/**
 * Pre-built diagram templates for common architectures.
 */
export interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  provider: string;
  xml: string;
}

export const TEMPLATES: DiagramTemplate[] = [
  {
    id: "aws-3tier",
    name: "AWS 3-Tier Web App",
    description:
      "Classic 3-tier: CloudFront → ALB → EC2 Auto Scaling → RDS Multi-AZ",
    provider: "aws",
    xml: `<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="Users" style="shape=mxgraph.basic.person;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#dae8fc;strokeColor=#6c8ebf;labelBackgroundColor=none;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="500" y="20" width="40" height="50" as="geometry"/>
    </mxCell>
    <mxCell id="3" value="CloudFront" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cloudfront;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#8C4FFF;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="130" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="4" value="VPC" style="swimlane;startSize=30;rounded=1;container=1;collapsible=0;fillColor=none;strokeColor=#8C4FFF;fontColor=#8C4FFF;html=1;fontSize=13;fontStyle=1;dashed=1;" vertex="1" parent="1">
      <mxGeometry x="200" y="250" width="640" height="480" as="geometry"/>
    </mxCell>
    <mxCell id="5" value="Public Subnet" style="swimlane;startSize=25;rounded=1;container=1;collapsible=0;fillColor=none;strokeColor=#7AA116;fontColor=#7AA116;html=1;fontSize=11;dashed=1;" vertex="1" parent="4">
      <mxGeometry x="30" y="40" width="580" height="140" as="geometry"/>
    </mxCell>
    <mxCell id="6" value="ALB" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.application_load_balancer;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#F58534;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="5">
      <mxGeometry x="260" y="35" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="7" value="Private Subnet" style="swimlane;startSize=25;rounded=1;container=1;collapsible=0;fillColor=none;strokeColor=#00A4A6;fontColor=#00A4A6;html=1;fontSize=11;dashed=1;" vertex="1" parent="4">
      <mxGeometry x="30" y="210" width="580" height="240" as="geometry"/>
    </mxCell>
    <mxCell id="8" value="EC2 (AZ-a)" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#ED7100;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="7">
      <mxGeometry x="130" y="40" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="9" value="EC2 (AZ-b)" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#ED7100;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="7">
      <mxGeometry x="390" y="40" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="10" value="RDS Primary" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.rds;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#C925D1;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="7">
      <mxGeometry x="130" y="150" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="11" value="RDS Standby" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.rds;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#C925D1;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="7">
      <mxGeometry x="390" y="150" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="20" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="2" target="3" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="21" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="3" target="6" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="22" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="6" target="8" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="23" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="6" target="9" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="24" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="8" target="10" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="25" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="9" target="11" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="26" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;dashed=1;strokeColor=#999999;" edge="1" source="10" target="11" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`,
  },
  {
    id: "aws-serverless",
    name: "AWS Serverless",
    description:
      "API Gateway → Lambda → DynamoDB with S3 static hosting and Cognito auth",
    provider: "aws",
    xml: `<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="Users" style="shape=mxgraph.basic.person;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#dae8fc;strokeColor=#6c8ebf;labelBackgroundColor=none;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="500" y="20" width="40" height="50" as="geometry"/>
    </mxCell>
    <mxCell id="3" value="CloudFront" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cloudfront;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#8C4FFF;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="130" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="4" value="S3 Static Site" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.s3;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#3F8624;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="340" y="130" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="5" value="Cognito" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cognito;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#DD344C;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="640" y="130" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="6" value="API Gateway" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.api_gateway;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#E7157B;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="280" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="7" value="Lambda" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#ED7100;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="420" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="8" value="DynamoDB" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.dynamodb;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#C925D1;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="560" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="9" value="SQS" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.sqs;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#E7157B;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="650" y="420" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="20" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="2" target="3" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="21" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;dashed=1;" edge="1" source="3" target="4" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="22" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="3" target="6" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="23" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;dashed=1;" edge="1" source="6" target="5" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="24" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="6" target="7" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="25" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="7" target="8" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="26" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="7" target="9" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`,
  },
  {
    id: "k8s-microservices",
    name: "Kubernetes Microservices",
    description:
      "Ingress → API Gateway → multiple microservice deployments with shared DB",
    provider: "kubernetes",
    xml: `<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="K8s Cluster" style="swimlane;startSize=30;rounded=1;container=1;collapsible=0;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;html=1;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="60" y="20" width="980" height="620" as="geometry"/>
    </mxCell>
    <mxCell id="3" value="Ingress" style="shape=mxgraph.kubernetes.ing;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="440" y="30" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="4" value="API Gateway" style="shape=mxgraph.kubernetes.svc;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="440" y="150" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="5" value="User Service" style="shape=mxgraph.kubernetes.deploy;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="160" y="300" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="6" value="Order Service" style="shape=mxgraph.kubernetes.deploy;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="440" y="300" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="7" value="Payment Service" style="shape=mxgraph.kubernetes.deploy;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="720" y="300" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="8" value="PostgreSQL" style="shape=mxgraph.kubernetes.stateful_set;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="300" y="470" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="9" value="Redis" style="shape=mxgraph.kubernetes.stateful_set;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="580" y="470" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="20" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="3" target="4" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="21" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="4" target="5" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="22" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="4" target="6" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="23" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="4" target="7" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="24" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="5" target="8" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="25" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="6" target="8" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="26" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="6" target="9" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="27" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="7" target="9" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`,
  },
  {
    id: "azure-webapp",
    name: "Azure Web App",
    description:
      "Front Door → App Service → SQL Database with Azure AD and Key Vault",
    provider: "azure",
    xml: `<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="Users" style="shape=mxgraph.basic.person;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#dae8fc;strokeColor=#6c8ebf;labelBackgroundColor=none;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="500" y="20" width="40" height="50" as="geometry"/>
    </mxCell>
    <mxCell id="3" value="Front Door" style="shape=mxgraph.azure2.networking.front_doors;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="130" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="4" value="App Service" style="shape=mxgraph.azure2.app_services.app_services;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="280" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="5" value="Azure AD" style="shape=mxgraph.azure2.identity.azure_active_directory;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="680" y="280" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="6" value="Key Vault" style="shape=mxgraph.azure2.security.key_vaults;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="300" y="280" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="7" value="SQL Database" style="shape=mxgraph.azure2.databases.sql_databases;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="430" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="8" value="Redis Cache" style="shape=mxgraph.azure2.databases.cache_redis;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="680" y="430" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="20" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="2" target="3" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="21" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="3" target="4" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="22" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;dashed=1;" edge="1" source="4" target="5" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="23" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;dashed=1;" edge="1" source="4" target="6" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="24" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="4" target="7" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="25" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="4" target="8" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`,
  },
  {
    id: "gcp-data-pipeline",
    name: "GCP Data Pipeline",
    description:
      "Pub/Sub → Dataflow → BigQuery with Cloud Storage and Looker",
    provider: "gcp",
    xml: `<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="Data Sources" style="shape=mxgraph.basic.person;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#dae8fc;strokeColor=#6c8ebf;labelBackgroundColor=none;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="160" y="310" width="40" height="50" as="geometry"/>
    </mxCell>
    <mxCell id="3" value="Pub/Sub" style="shape=mxgraph.gcp2.cloud_pubsub;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="320" y="300" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="4" value="Cloud Storage" style="shape=mxgraph.gcp2.cloud_storage;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="160" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="5" value="Dataflow" style="shape=mxgraph.gcp2.cloud_dataflow;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="300" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="6" value="BigQuery" style="shape=mxgraph.gcp2.bigquery;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="660" y="300" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="7" value="Looker" style="rounded=1;whiteSpace=wrap;html=1;verticalLabelPosition=middle;verticalAlign=middle;align=center;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="830" y="300" width="80" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="20" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="2" target="3" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="21" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="3" target="5" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="22" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="5" target="4" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="23" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="5" target="6" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="24" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;" edge="1" source="6" target="7" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`,
  },
];

export function getTemplatesForProvider(
  provider?: string
): DiagramTemplate[] {
  if (!provider) {
    return TEMPLATES;
  }
  return TEMPLATES.filter((t) => t.provider === provider);
}

export function getTemplateById(
  id: string
): DiagramTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
