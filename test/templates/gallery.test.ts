import { describe, it, expect } from "vitest";
import {
  TEMPLATES,
  getTemplatesForProvider,
  getTemplateById,
} from "../../src/templates/gallery.js";

describe("gallery", () => {
  describe("TEMPLATES", () => {
    it("has at least 5 templates", () => {
      expect(TEMPLATES.length).toBeGreaterThanOrEqual(5);
    });

    it("each template has required fields", () => {
      for (const t of TEMPLATES) {
        expect(t.id).toBeTruthy();
        expect(t.name).toBeTruthy();
        expect(t.description).toBeTruthy();
        expect(t.provider).toBeTruthy();
        expect(t.xml).toContain("<mxGraphModel");
      }
    });

    it("template IDs are unique", () => {
      const ids = TEMPLATES.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("getTemplatesForProvider", () => {
    it("returns AWS templates", () => {
      const aws = getTemplatesForProvider("aws");
      expect(aws.length).toBeGreaterThanOrEqual(1);
      expect(aws.every((t) => t.provider === "aws")).toBe(true);
    });

    it("returns empty array for unknown provider", () => {
      expect(getTemplatesForProvider("digitalocean")).toHaveLength(0);
    });
  });

  describe("getTemplateById", () => {
    it("returns the matching template", () => {
      const t = getTemplateById("aws-3tier");
      expect(t).toBeDefined();
      expect(t!.name).toContain("3-Tier");
    });

    it("returns undefined for unknown ID", () => {
      expect(getTemplateById("nonexistent")).toBeUndefined();
    });
  });
});
