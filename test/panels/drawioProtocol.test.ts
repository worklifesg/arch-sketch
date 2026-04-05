import { describe, it, expect } from "vitest";
import {
  createLoadMessage,
  createExportMessage,
  createConfigureMessage,
} from "../../src/panels/drawioProtocol.js";

describe("drawioProtocol", () => {
  describe("createLoadMessage", () => {
    it("creates a load action with xml and autosave", () => {
      const msg = createLoadMessage("<mxGraphModel/>");
      expect(msg.action).toBe("load");
      expect(msg.xml).toBe("<mxGraphModel/>");
      expect(msg.autosave).toBe(1);
    });
  });

  describe("createExportMessage", () => {
    it("maps svg to xmlsvg format", () => {
      const msg = createExportMessage("svg");
      expect(msg.action).toBe("export");
      expect(msg.format).toBe("xmlsvg");
    });

    it("maps png to xmlpng format", () => {
      const msg = createExportMessage("png");
      expect(msg.action).toBe("export");
      expect(msg.format).toBe("xmlpng");
    });
  });

  describe("createConfigureMessage", () => {
    it("sets darkColor for dark theme", () => {
      const msg = createConfigureMessage(true);
      expect(msg.action).toBe("configure");
      expect(msg.config.darkColor).toBe("#1e1e1e");
      expect(msg.config.lightColor).toBeUndefined();
    });

    it("sets lightColor for light theme", () => {
      const msg = createConfigureMessage(false);
      expect(msg.action).toBe("configure");
      expect(msg.config.lightColor).toBe("#ffffff");
      expect(msg.config.darkColor).toBeUndefined();
    });
  });
});
