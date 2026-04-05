import { describe, it, expect, vi, beforeEach } from "vitest";
import { RefinementService } from "../../src/services/refinementService.js";
import * as vscode from "vscode";

const ORIGINAL_XML = `<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="EC2" vertex="1" parent="1">
      <mxGeometry x="100" y="100" width="60" height="60" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`;

const REFINED_XML = `<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="EC2" vertex="1" parent="1">
      <mxGeometry x="100" y="100" width="60" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="3" value="RDS" vertex="1" parent="1">
      <mxGeometry x="100" y="300" width="60" height="60" as="geometry"/>
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

describe("RefinementService", () => {
  let service: RefinementService;
  const token = { isCancellationRequested: false, onCancellationRequested: vi.fn() } as unknown as vscode.CancellationToken;

  beforeEach(() => {
    service = new RefinementService();
    vi.restoreAllMocks();
  });

  it("returns refined XML from model response", async () => {
    vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([makeMockModel(REFINED_XML)] as never);

    const result = await service.refineDiagram(ORIGINAL_XML, "Add an RDS database", "aws", token);
    expect(result).toContain("RDS");
    expect(result).toContain("<mxGraphModel");
  });

  it("throws when no Copilot model is available", async () => {
    vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([] as never);

    await expect(
      service.refineDiagram(ORIGINAL_XML, "test", "aws", token)
    ).rejects.toThrow(/GitHub Copilot is required/);
  });

  it("extracts XML from fenced response", async () => {
    const fenced = "Updated diagram:\n```xml\n" + REFINED_XML + "\n```";
    vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([makeMockModel(fenced)] as never);

    const result = await service.refineDiagram(ORIGINAL_XML, "Add RDS", "aws", token);
    expect(result).toContain("<mxGraphModel");
  });

  it("throws on response without valid XML", async () => {
    vi.mocked(vscode.lm.selectChatModels).mockResolvedValue(
      [makeMockModel("I'm sorry, I can't modify that.")] as never
    );

    await expect(
      service.refineDiagram(ORIGINAL_XML, "test", "aws", token)
    ).rejects.toThrow(/Could not extract valid mxGraph XML/);
  });

  it("passes current XML and instruction in messages", async () => {
    const mockModel = makeMockModel(REFINED_XML);
    vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([mockModel] as never);

    await service.refineDiagram(ORIGINAL_XML, "Add a load balancer", "aws", token);

    const messages = mockModel.sendRequest.mock.calls[0][0];
    // Should contain: system prompt, current XML, assistant ack, user instruction
    expect(messages.length).toBe(4);
    expect(messages[1].content).toContain(ORIGINAL_XML);
    expect(messages[3].content).toContain("Add a load balancer");
  });
});
