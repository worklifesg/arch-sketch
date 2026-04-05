import { describe, it, expect } from "vitest";
import { getSystemPrompt } from "../../src/prompts/system.js";

describe("getSystemPrompt", () => {
  it("returns a non-empty string", () => {
    const prompt = getSystemPrompt("aws");
    expect(prompt.length).toBeGreaterThan(100);
  });

  it("includes provider-specific shape references for AWS", () => {
    const prompt = getSystemPrompt("aws");
    expect(prompt).toContain("AWS");
    expect(prompt).toContain("mxgraph.aws4");
    expect(prompt).toContain("ec2");
  });

  it("includes Azure shapes for azure provider", () => {
    const prompt = getSystemPrompt("azure");
    expect(prompt).toContain("Azure");
    expect(prompt).toContain("mxgraph.azure2");
  });

  it("includes GCP shapes for gcp provider", () => {
    const prompt = getSystemPrompt("gcp");
    expect(prompt).toContain("GCP");
    expect(prompt).toContain("mxgraph.gcp2");
  });

  it("includes K8s shapes for kubernetes provider", () => {
    const prompt = getSystemPrompt("kubernetes");
    expect(prompt).toContain("mxgraph.kubernetes");
  });

  it("includes CRITICAL label positioning rules", () => {
    const prompt = getSystemPrompt("aws");
    expect(prompt).toContain("verticalLabelPosition=bottom");
    expect(prompt).toContain("verticalAlign=top");
  });

  it("includes CRITICAL edge/arrow rules", () => {
    const prompt = getSystemPrompt("aws");
    expect(prompt).toContain("edgeStyle=orthogonalEdgeStyle");
    expect(prompt).toContain("orthogonalLoop=1");
    expect(prompt).toContain("jettySize=auto");
  });

  it("includes general shapes section", () => {
    const prompt = getSystemPrompt("aws");
    expect(prompt).toContain("General Shapes");
    expect(prompt).toContain("swimlane");
  });
});
