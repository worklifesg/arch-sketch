/**
 * Few-shot examples of architecture descriptions → mxGraph XML.
 */
export interface PromptExample {
  description: string;
  provider: string;
  xml: string;
}

export const EXAMPLES: PromptExample[] = [
  {
    description: "Simple 3-tier AWS web app with ALB, EC2, and RDS",
    provider: "aws",
    xml: `<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="Users" style="shape=mxgraph.basic.person;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#dae8fc;strokeColor=#6c8ebf;labelBackgroundColor=none;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="490" y="20" width="40" height="50" as="geometry"/>
    </mxCell>
    <mxCell id="3" value="Application&#xa;Load Balancer" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.application_load_balancer;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#F58534;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="480" y="150" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="4" value="EC2 Instance 1" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#ED7100;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="340" y="310" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="5" value="EC2 Instance 2" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#ED7100;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="620" y="310" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="6" value="RDS PostgreSQL" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.rds;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#C925D1;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="480" y="470" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="7" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="2" target="3" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="8" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="3" target="4" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="9" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="3" target="5" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="10" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="4" target="6" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="11" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="5" target="6" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`,
  },
  {
    description: "Kubernetes cluster with ingress, services, and pods",
    provider: "kubernetes",
    xml: `<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="Cluster" style="swimlane;startSize=30;rounded=1;container=1;collapsible=0;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;html=1;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="100" y="40" width="800" height="560" as="geometry"/>
    </mxCell>
    <mxCell id="3" value="Ingress" style="shape=mxgraph.kubernetes.ing;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="360" y="40" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="4" value="Frontend Service" style="shape=mxgraph.kubernetes.svc;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="200" y="180" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="5" value="Backend Service" style="shape=mxgraph.kubernetes.svc;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="520" y="180" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="6" value="Frontend Pods" style="shape=mxgraph.kubernetes.pod;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="200" y="340" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="7" value="Backend Pods" style="shape=mxgraph.kubernetes.pod;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="520" y="340" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="8" value="Database&#xa;StatefulSet" style="shape=mxgraph.kubernetes.stateful_set;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelPosition=center;fillColor=#326CE5;strokeColor=none;labelBackgroundColor=none;fontColor=#232F3E;fontSize=11;" vertex="1" parent="2">
      <mxGeometry x="520" y="470" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="9" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="3" target="4" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="10" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="3" target="5" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="11" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="4" target="6" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="12" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="5" target="7" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="13" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=block;endFill=1;" edge="1" source="7" target="8" parent="2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`,
  },
];

export function getExamplesForProvider(provider: string): PromptExample[] {
  const matching = EXAMPLES.filter((e) => e.provider === provider);
  return matching.length > 0 ? matching : EXAMPLES.slice(0, 1);
}
