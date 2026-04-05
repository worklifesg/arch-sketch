import { describe, it, expect } from "vitest";
import { getSystemPrompt } from "../../src/prompts/system.js";
import { getExamplesForProvider } from "../../src/prompts/examples.js";
import { TEMPLATES } from "../../src/templates/gallery.js";
import { SHAPE_XML_MAP } from "../../src/shapes/shapeMap.js";

/**
 * Performance benchmarks — ensure key operations complete within acceptable time.
 */

function measure(fn: () => void, iterations = 1000): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  return (performance.now() - start) / iterations; // ms per call
}

describe("Performance benchmarks", () => {
  describe("Prompt construction", () => {
    it("getSystemPrompt builds in < 1ms per call", () => {
      const providers = ["aws", "azure", "gcp", "kubernetes", "general"];
      for (const provider of providers) {
        const avg = measure(() => getSystemPrompt(provider));
        expect(avg, `getSystemPrompt(${provider}) took ${avg.toFixed(3)}ms`).toBeLessThan(1);
      }
    });

    it("getExamplesForProvider runs in < 0.1ms per call", () => {
      const avg = measure(() => getExamplesForProvider("aws"));
      expect(avg, `getExamplesForProvider took ${avg.toFixed(4)}ms`).toBeLessThan(0.1);
    });
  });

  describe("XML extraction (regex)", () => {
    it("extractXml regex handles large XML in < 5ms", () => {
      // Simulate a large mxGraphModel (~50KB)
      const cells = Array.from({ length: 500 }, (_, i) =>
        `    <mxCell id="${i + 2}" value="Node${i}" style="rounded=1;" vertex="1" parent="1"><mxGeometry x="${i * 10}" y="${i * 10}" width="60" height="60" as="geometry"/></mxCell>`
      ).join("\n");
      const largeXml = `<mxGraphModel>\n  <root>\n    <mxCell id="0"/>\n    <mxCell id="1" parent="0"/>\n${cells}\n  </root>\n</mxGraphModel>`;
      const wrappedResponse = `Here is the diagram:\n\`\`\`xml\n${largeXml}\n\`\`\`\nDone.`;

      const regex = /<mxGraphModel[\s\S]*?<\/mxGraphModel>/;
      const avg = measure(() => {
        regex.exec(wrappedResponse);
      }, 100);

      expect(avg, `Large XML extraction took ${avg.toFixed(3)}ms`).toBeLessThan(5);
    });
  });

  describe("XML validation", () => {
    it("validates large XML with string includes in < 0.5ms", () => {
      const cells = Array.from({ length: 500 }, (_, i) =>
        `    <mxCell id="${i + 2}" value="Node${i}" vertex="1" parent="1"/>`
      ).join("\n");
      const largeXml = `<mxGraphModel>\n  <root>\n    <mxCell id="0"/>\n    <mxCell id="1" parent="0"/>\n${cells}\n  </root>\n</mxGraphModel>`;

      const avg = measure(() => {
        largeXml.includes("<mxGraphModel");
        largeXml.includes("</mxGraphModel>");
        largeXml.includes("<root>");
        largeXml.includes('mxCell id="0"');
      }, 1000);

      expect(avg, `Validation took ${avg.toFixed(4)}ms`).toBeLessThan(0.5);
    });
  });

  describe("Template and shape lookups", () => {
    it("template array iteration is < 0.01ms", () => {
      const avg = measure(() => {
        TEMPLATES.filter((t) => t.provider === "aws");
      }, 10000);
      expect(avg).toBeLessThan(0.01);
    });

    it("shape map lookup is O(1) and < 0.001ms", () => {
      const avg = measure(() => {
        void SHAPE_XML_MAP["aws-ec2"];
        void SHAPE_XML_MAP["k8s-pod"];
        void SHAPE_XML_MAP["gcp-gke"];
      }, 100000);
      expect(avg).toBeLessThan(0.001);
    });
  });

  describe("System prompt size", () => {
    it("system prompt is under 10KB for all providers", () => {
      const providers = ["aws", "azure", "gcp", "kubernetes", "general"];
      for (const provider of providers) {
        const prompt = getSystemPrompt(provider);
        const sizeKB = new TextEncoder().encode(prompt).length / 1024;
        expect(sizeKB, `${provider} prompt is ${sizeKB.toFixed(1)}KB`).toBeLessThan(10);
      }
    });
  });
});
