import { describe, it, expect } from "vitest";
import { getExamplesForProvider, EXAMPLES } from "../../src/prompts/examples.js";

describe("getExamplesForProvider", () => {
  it("returns AWS examples for 'aws' provider", () => {
    const examples = getExamplesForProvider("aws");
    expect(examples.length).toBeGreaterThanOrEqual(1);
    expect(examples.every((e) => e.provider === "aws")).toBe(true);
  });

  it("returns kubernetes examples for 'kubernetes' provider", () => {
    const examples = getExamplesForProvider("kubernetes");
    expect(examples.length).toBeGreaterThanOrEqual(1);
    expect(examples.every((e) => e.provider === "kubernetes")).toBe(true);
  });

  it("returns fallback examples for unknown provider", () => {
    const examples = getExamplesForProvider("unknown");
    expect(examples.length).toBeGreaterThanOrEqual(1);
  });

  it("all examples contain valid mxGraphModel XML", () => {
    for (const example of EXAMPLES) {
      expect(example.xml).toContain("<mxGraphModel");
      expect(example.xml).toContain("</mxGraphModel>");
      expect(example.xml).toContain('<mxCell id="0"');
    }
  });

  it("all examples have labels with verticalLabelPosition=bottom", () => {
    for (const example of EXAMPLES) {
      // Any cell with a value (label) and a resource icon shape should have bottom labels
      const valueMatches = example.xml.match(/value="[^"]+?"[^>]*style="[^"]*resourceIcon[^"]*"/g);
      if (valueMatches) {
        for (const match of valueMatches) {
          expect(match).toContain("verticalLabelPosition=bottom");
        }
      }
    }
  });
});
