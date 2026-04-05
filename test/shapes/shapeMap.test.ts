import { describe, it, expect } from "vitest";
import { SHAPE_XML_MAP } from "../../src/shapes/shapeMap.js";

describe("shapeMap", () => {
  it("contains shapes for all major providers", () => {
    const keys = Object.keys(SHAPE_XML_MAP);
    expect(keys.some((k) => k.startsWith("aws-"))).toBe(true);
    expect(keys.some((k) => k.startsWith("azure-"))).toBe(true);
    expect(keys.some((k) => k.startsWith("gcp-"))).toBe(true);
    expect(keys.some((k) => k.startsWith("k8s-"))).toBe(true);
  });

  it("has at least 30 shapes", () => {
    expect(Object.keys(SHAPE_XML_MAP).length).toBeGreaterThanOrEqual(30);
  });

  it("all values are non-empty description strings", () => {
    for (const [key, value] of Object.entries(SHAPE_XML_MAP)) {
      expect(value, `Shape ${key} has empty value`).toBeTruthy();
      expect(typeof value).toBe("string");
    }
  });

  it("includes expected AWS shapes", () => {
    expect(SHAPE_XML_MAP["aws-ec2"]).toBeDefined();
    expect(SHAPE_XML_MAP["aws-lambda"]).toBeDefined();
    expect(SHAPE_XML_MAP["aws-s3"]).toBeDefined();
  });

  it("includes expected K8s shapes", () => {
    expect(SHAPE_XML_MAP["k8s-pod"]).toBeDefined();
    expect(SHAPE_XML_MAP["k8s-svc"]).toBeDefined();
    expect(SHAPE_XML_MAP["k8s-deploy"]).toBeDefined();
  });
});
