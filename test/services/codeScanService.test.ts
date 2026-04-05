import { describe, it, expect, vi, beforeEach } from "vitest";
import { CodeScanService } from "../../src/services/codeScanService.js";
import * as vscode from "vscode";

const VALID_XML = `<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
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

describe("CodeScanService", () => {
  let service: CodeScanService;
  const token = { isCancellationRequested: false, onCancellationRequested: vi.fn() } as unknown as vscode.CancellationToken;

  beforeEach(() => {
    service = new CodeScanService();
    vi.restoreAllMocks();
  });

  describe("detectFileType", () => {
    it("detects .tf as terraform", () => {
      expect(service.detectFileType("main.tf")).toBe("terraform");
    });

    it("detects .tfvars as terraform", () => {
      expect(service.detectFileType("vars.tfvars")).toBe("terraform");
    });

    it("returns null for ambiguous .yaml", () => {
      expect(service.detectFileType("stack.yaml")).toBeNull();
    });

    it("returns null for unknown extensions", () => {
      expect(service.detectFileType("readme.md")).toBeNull();
    });
  });

  describe("detectFileTypeFromContent", () => {
    it("detects terraform from resource block", () => {
      const content = 'resource "aws_instance" "web" {\n  ami = "ami-123"\n}';
      expect(service.detectFileTypeFromContent(content, "main.tf")).toBe("terraform");
    });

    it("detects terraform from .tf extension alone", () => {
      expect(service.detectFileTypeFromContent("some content", "main.tf")).toBe("terraform");
    });

    it("detects cloudformation from AWSTemplateFormatVersion", () => {
      const content = 'AWSTemplateFormatVersion: "2010-09-09"\nResources:';
      expect(service.detectFileTypeFromContent(content, "template.yaml")).toBe("cloudformation");
    });

    it("detects kubernetes from apiVersion + kind", () => {
      const content = "apiVersion: apps/v1\nkind: Deployment\nmetadata:";
      expect(service.detectFileTypeFromContent(content, "deploy.yaml")).toBe("kubernetes");
    });

    it("returns null for plain YAML without IaC markers", () => {
      const content = "name: my-config\nversion: 1.0";
      expect(service.detectFileTypeFromContent(content, "config.yaml")).toBeNull();
    });
  });

  describe("detectProviderFromCode", () => {
    it("returns 'kubernetes' for kubernetes file type", () => {
      expect(service.detectProviderFromCode("apiVersion: v1", "kubernetes")).toBe("kubernetes");
    });

    it("detects aws from aws_ prefix in terraform", () => {
      expect(
        service.detectProviderFromCode('resource "aws_instance" "web" {}', "terraform")
      ).toBe("aws");
    });

    it("detects azure from azurerm_ prefix", () => {
      expect(
        service.detectProviderFromCode('resource "azurerm_resource_group" "rg" {}', "terraform")
      ).toBe("azure");
    });

    it("detects gcp from google_ prefix", () => {
      expect(
        service.detectProviderFromCode('resource "google_compute_instance" "vm" {}', "terraform")
      ).toBe("gcp");
    });

    it("detects aws from AWS:: in cloudformation", () => {
      expect(
        service.detectProviderFromCode("Type: AWS::EC2::Instance", "cloudformation")
      ).toBe("aws");
    });

    it("returns 'general' for unrecognized providers", () => {
      expect(service.detectProviderFromCode("resource \"other_thing\" {}", "terraform")).toBe(
        "general"
      );
    });
  });

  describe("generateFromCode", () => {
    it("returns XML for valid terraform code", async () => {
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([makeMockModel(VALID_XML)] as never);

      const result = await service.generateFromCode(
        'resource "aws_instance" "web" {}',
        "terraform",
        "aws",
        token
      );
      expect(result).toContain("<mxGraphModel");
    });

    it("throws when no Copilot model is available", async () => {
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([] as never);

      await expect(
        service.generateFromCode("code", "terraform", "aws", token)
      ).rejects.toThrow(/GitHub Copilot is required/);
    });
  });

  describe("generateFromMultipleFiles", () => {
    const sampleFiles = [
      {
        relativePath: "main.tf",
        content: 'resource "aws_vpc" "main" { cidr_block = "10.0.0.0/16" }',
        fileType: "terraform" as const,
      },
      {
        relativePath: "ec2.tf",
        content: 'resource "aws_instance" "web" { subnet_id = aws_subnet.public.id }',
        fileType: "terraform" as const,
      },
      {
        relativePath: "rds.tf",
        content: 'resource "aws_db_instance" "db" { engine = "postgres" }',
        fileType: "terraform" as const,
      },
    ];

    it("returns XML from multi-file terraform scan", async () => {
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([makeMockModel(VALID_XML)] as never);

      const result = await service.generateFromMultipleFiles(sampleFiles, "aws", token);
      expect(result).toContain("<mxGraphModel");
    });

    it("throws when no Copilot model is available", async () => {
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([] as never);

      await expect(
        service.generateFromMultipleFiles(sampleFiles, "aws", token)
      ).rejects.toThrow(/GitHub Copilot is required/);
    });

    it("includes all file paths in the prompt sent to the model", async () => {
      const mockModel = makeMockModel(VALID_XML);
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([mockModel] as never);

      await service.generateFromMultipleFiles(sampleFiles, "aws", token);

      const messages = mockModel.sendRequest.mock.calls[0][0];
      const allContent = messages.map((m: { content: string }) => m.content).join("\n");
      expect(allContent).toContain("main.tf");
      expect(allContent).toContain("ec2.tf");
      expect(allContent).toContain("rds.tf");
    });

    it("includes cross-file reference guidance for terraform", async () => {
      const mockModel = makeMockModel(VALID_XML);
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([mockModel] as never);

      await service.generateFromMultipleFiles(sampleFiles, "aws", token);

      const messages = mockModel.sendRequest.mock.calls[0][0];
      const allContent = messages.map((m: { content: string }) => m.content).join("\n");
      expect(allContent).toContain("module blocks");
      expect(allContent).toContain("cross-file references");
    });

    it("includes k8s-specific guidance for kubernetes files", async () => {
      const k8sFiles = [
        { relativePath: "deploy.yaml", content: "apiVersion: apps/v1\nkind: Deployment", fileType: "kubernetes" as const },
        { relativePath: "service.yaml", content: "apiVersion: v1\nkind: Service", fileType: "kubernetes" as const },
      ];
      const mockModel = makeMockModel(VALID_XML);
      vi.mocked(vscode.lm.selectChatModels).mockResolvedValue([mockModel] as never);

      await service.generateFromMultipleFiles(k8sFiles, "kubernetes", token);

      const messages = mockModel.sendRequest.mock.calls[0][0];
      const allContent = messages.map((m: { content: string }) => m.content).join("\n");
      expect(allContent).toContain("Label selectors");
    });
  });
});
