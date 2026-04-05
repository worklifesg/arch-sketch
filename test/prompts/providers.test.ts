import { describe, it, expect } from "vitest";
import {
  isValidProvider,
  getProviderDisplayName,
  SUPPORTED_PROVIDERS,
} from "../../src/prompts/providers.js";

describe("providers", () => {
  describe("SUPPORTED_PROVIDERS", () => {
    it("includes all expected providers", () => {
      expect(SUPPORTED_PROVIDERS).toContain("aws");
      expect(SUPPORTED_PROVIDERS).toContain("azure");
      expect(SUPPORTED_PROVIDERS).toContain("gcp");
      expect(SUPPORTED_PROVIDERS).toContain("kubernetes");
      expect(SUPPORTED_PROVIDERS).toContain("general");
    });
  });

  describe("isValidProvider", () => {
    it("returns true for supported providers", () => {
      for (const p of SUPPORTED_PROVIDERS) {
        expect(isValidProvider(p)).toBe(true);
      }
    });

    it("returns false for unsupported values", () => {
      expect(isValidProvider("digitalocean")).toBe(false);
      expect(isValidProvider("")).toBe(false);
      expect(isValidProvider("AWS")).toBe(false); // case-sensitive
    });
  });

  describe("getProviderDisplayName", () => {
    it("returns human-readable names", () => {
      expect(getProviderDisplayName("aws")).toBe("Amazon Web Services");
      expect(getProviderDisplayName("azure")).toBe("Microsoft Azure");
      expect(getProviderDisplayName("gcp")).toBe("Google Cloud Platform");
      expect(getProviderDisplayName("kubernetes")).toBe("Kubernetes");
      expect(getProviderDisplayName("general")).toBe("General Architecture");
    });
  });
});
