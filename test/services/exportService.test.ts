import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExportService } from "../../src/services/exportService.js";
import * as vscode from "vscode";

const SAMPLE_XML = `<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
  </root>
</mxGraphModel>`;

describe("ExportService", () => {
  let service: ExportService;

  beforeEach(() => {
    service = new ExportService();
    vi.clearAllMocks();
  });

  describe("saveAsDrawio", () => {
    it("wraps XML in mxfile and writes to selected path", async () => {
      const fakeUri = { fsPath: "/tmp/test.drawio", scheme: "file", path: "/tmp/test.drawio" };
      vi.mocked(vscode.window.showSaveDialog).mockResolvedValue(fakeUri as never);
      vi.mocked(vscode.workspace.fs.writeFile).mockResolvedValue(undefined as never);

      await service.saveAsDrawio(SAMPLE_XML);

      expect(vscode.workspace.fs.writeFile).toHaveBeenCalledOnce();
      const written = new TextDecoder().decode(
        vi.mocked(vscode.workspace.fs.writeFile).mock.calls[0][1] as Uint8Array
      );
      expect(written).toContain("<mxfile");
      expect(written).toContain("<mxGraphModel");
    });

    it("does not write if user cancels save dialog", async () => {
      vi.mocked(vscode.window.showSaveDialog).mockResolvedValue(undefined as never);

      await service.saveAsDrawio(SAMPLE_XML);

      expect(vscode.workspace.fs.writeFile).not.toHaveBeenCalled();
    });

    it("preserves already-wrapped mxfile XML", async () => {
      const mxfileXml = `<mxfile><diagram>${SAMPLE_XML}</diagram></mxfile>`;
      const fakeUri = { fsPath: "/tmp/test.drawio", scheme: "file", path: "/tmp/test.drawio" };
      vi.mocked(vscode.window.showSaveDialog).mockResolvedValue(fakeUri as never);
      vi.mocked(vscode.workspace.fs.writeFile).mockResolvedValue(undefined as never);

      await service.saveAsDrawio(mxfileXml);

      const written = new TextDecoder().decode(
        vi.mocked(vscode.workspace.fs.writeFile).mock.calls[0][1] as Uint8Array
      );
      // Should NOT double-wrap
      expect(written.match(/<mxfile/g)!.length).toBe(1);
    });
  });

  describe("saveAsSvg", () => {
    it("decodes base64 SVG data URI and writes file", async () => {
      const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
      const dataUri = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString("base64")}`;
      const fakeUri = { fsPath: "/tmp/test.svg", scheme: "file", path: "/tmp/test.svg" };
      vi.mocked(vscode.window.showSaveDialog).mockResolvedValue(fakeUri as never);
      vi.mocked(vscode.workspace.fs.writeFile).mockResolvedValue(undefined as never);

      await service.saveAsSvg(dataUri);

      expect(vscode.workspace.fs.writeFile).toHaveBeenCalledOnce();
      const written = vi.mocked(vscode.workspace.fs.writeFile).mock.calls[0][1] as Uint8Array;
      expect(new TextDecoder().decode(written)).toContain("<svg");
    });
  });

  describe("saveAsPng", () => {
    it("does not write if user cancels", async () => {
      vi.mocked(vscode.window.showSaveDialog).mockResolvedValue(undefined as never);

      await service.saveAsPng("data:image/png;base64,iVBOR");

      expect(vscode.workspace.fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe("copyHtmlEmbed", () => {
    it("copies HTML embed to clipboard", async () => {
      await service.copyHtmlEmbed(SAMPLE_XML);

      expect(vscode.env.clipboard.writeText).toHaveBeenCalledOnce();
      const html = vi.mocked(vscode.env.clipboard.writeText).mock.calls[0][0];
      expect(html).toContain("viewer.diagrams.net");
      expect(html).toContain("<iframe");
    });
  });
});
