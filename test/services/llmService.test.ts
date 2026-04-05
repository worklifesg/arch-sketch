import { describe, it, expect, vi, beforeEach } from "vitest";
import { LlmService } from "../../src/services/llmService.js";
import * as vscode from "vscode";

const VALID_XML = `<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="EC2" style="shape=mxgraph.aws4.resourceIcon;" vertex="1" parent="1">
      <mxGeometry x="100" y="100" width="60" height="60" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`;

function makeMockModel(response: string) {
  return {
    sendRequest: vi.fn().mockResolvedValue({
      text: (async function* () {
        yield response;
      })(),
    }),
  };
}

describe("LlmService", () => {
  let service: LlmService;
  const token = { isCancellationRequested: false, onCancellationRequested: vi.fn() } as unknown as vscode.CancellationToken;

  beforeEach(() => {
    service = new LlmService();
    vi.restoreAllMocks();
  });

  describe("generateDiagramXml", () => {
    it("returns extracted XML from a valid Copilot response", async () => {
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([makeMockModel(VALID_XML)] as never);

      const result = await service.generateDiagramXml("3-tier web app", "aws", token);
      expect(result).toContain("<mxGraphModel");
      expect(result).toContain("</mxGraphModel>");
    });

    it("throws when no Copilot model is available", async () => {
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([] as never);

      await expect(service.generateDiagramXml("test", "aws", token)).rejects.toThrow(
        /GitHub Copilot is required/
      );
    });

    it("extracts XML from markdown-fenced response", async () => {
      const fenced = "Here is the diagram:\n```xml\n" + VALID_XML + "\n```\nDone.";
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([makeMockModel(fenced)] as never);

      const result = await service.generateDiagramXml("test", "aws", token);
      expect(result).toContain("<mxGraphModel");
    });

    it("throws on response with no valid XML", async () => {
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue(
        [makeMockModel("Sorry, I cannot generate that.")] as never
      );

      await expect(service.generateDiagramXml("test", "aws", token)).rejects.toThrow(
        /Could not extract valid mxGraph XML/
      );
    });

    it("validates extracted XML has required elements", async () => {
      // Missing <root> and mxCell id="0"
      const incompleteXml = "<mxGraphModel><something/></mxGraphModel>";
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue(
        [makeMockModel(incompleteXml)] as never
      );

      await expect(service.generateDiagramXml("test", "aws", token)).rejects.toThrow(
        /does not contain a valid root element/
      );
    });

    it("passes correct messages to the model", async () => {
      const mockModel = makeMockModel(VALID_XML);
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([mockModel] as never);

      await service.generateDiagramXml("VPC with subnets", "aws", token);
      expect(mockModel.sendRequest).toHaveBeenCalledOnce();

      const messages = mockModel.sendRequest.mock.calls[0][0];
      // system prompt + examples (2 msgs per example for aws which has 1) + user request
      expect(messages.length).toBeGreaterThanOrEqual(3);
      // Last message should contain the description
      expect(messages[messages.length - 1].content).toContain("VPC with subnets");
    });
  });
});
