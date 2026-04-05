import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorkspaceScanner, type ScannedFile } from "../../src/services/workspaceScanner.js";
import * as vscode from "vscode";

describe("WorkspaceScanner", () => {
  let scanner: WorkspaceScanner;

  beforeEach(() => {
    scanner = new WorkspaceScanner();
    vi.clearAllMocks();
  });

  describe("pickAndScan", () => {
    it("returns null when user cancels folder picker", async () => {
      vi.mocked(vscode.window.showOpenDialog).mockResolvedValue(undefined as never);

      const result = await scanner.pickAndScan();
      expect(result).toBeNull();
    });

    it("returns empty array for empty folder", async () => {
      const folderUri = { fsPath: "/tmp/empty-project", scheme: "file", path: "/tmp/empty-project" };
      vi.mocked(vscode.window.showOpenDialog).mockResolvedValue([folderUri] as never);
      vi.mocked(vscode.workspace.findFiles).mockResolvedValue([]);

      const result = await scanner.pickAndScan();
      expect(result).toEqual([]);
    });
  });

  describe("scanFolder", () => {
    it("scans terraform files when .tf files are found", async () => {
      const folderUri = { fsPath: "/project", scheme: "file", path: "/project" };
      const tfFile1 = { fsPath: "/project/main.tf", scheme: "file", path: "/project/main.tf" };
      const tfFile2 = { fsPath: "/project/variables.tf", scheme: "file", path: "/project/variables.tf" };

      // First findFiles call (for .tf) returns results
      vi.mocked(vscode.workspace.findFiles).mockResolvedValueOnce([tfFile1, tfFile2] as never);

      vi.mocked(vscode.workspace.fs.readFile).mockImplementation((uri: any) => {
        if (uri.fsPath.includes("main.tf")) {
          return Promise.resolve(new TextEncoder().encode('resource "aws_instance" "web" {}'));
        }
        return Promise.resolve(new TextEncoder().encode('variable "name" {}'));
      });

      const result = await scanner.scanFolder(folderUri as never);

      expect(result).toHaveLength(2);
      expect(result[0].fileType).toBe("terraform");
      expect(result[0].relativePath).toBe("main.tf");
      expect(result[1].relativePath).toBe("variables.tf");
    });

    it("scans YAML files and classifies as kubernetes", async () => {
      const folderUri = { fsPath: "/k8s-project", scheme: "file", path: "/k8s-project" };

      // First findFiles call (for .tf) returns empty
      vi.mocked(vscode.workspace.findFiles).mockResolvedValueOnce([]);
      // Second findFiles call (for yaml/yml/json) returns k8s files
      const k8sFile = { fsPath: "/k8s-project/deploy.yaml", scheme: "file", path: "/k8s-project/deploy.yaml" };
      vi.mocked(vscode.workspace.findFiles).mockResolvedValueOnce([k8sFile] as never);

      vi.mocked(vscode.workspace.fs.readFile).mockResolvedValue(
        new TextEncoder().encode("apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web") as never
      );

      const result = await scanner.scanFolder(folderUri as never);

      expect(result).toHaveLength(1);
      expect(result[0].fileType).toBe("kubernetes");
    });

    it("classifies CloudFormation templates correctly", async () => {
      const folderUri = { fsPath: "/cfn-project", scheme: "file", path: "/cfn-project" };

      vi.mocked(vscode.workspace.findFiles).mockResolvedValueOnce([]);
      const cfnFile = { fsPath: "/cfn-project/template.yaml", scheme: "file", path: "/cfn-project/template.yaml" };
      vi.mocked(vscode.workspace.findFiles).mockResolvedValueOnce([cfnFile] as never);

      vi.mocked(vscode.workspace.fs.readFile).mockResolvedValue(
        new TextEncoder().encode('AWSTemplateFormatVersion: "2010-09-09"\nResources:\n  MyBucket:\n    Type: AWS::S3::Bucket') as never
      );

      const result = await scanner.scanFolder(folderUri as never);

      expect(result).toHaveLength(1);
      expect(result[0].fileType).toBe("cloudformation");
    });

    it("skips files that cannot be classified", async () => {
      const folderUri = { fsPath: "/mixed-project", scheme: "file", path: "/mixed-project" };

      vi.mocked(vscode.workspace.findFiles).mockResolvedValueOnce([]);
      const randomYaml = { fsPath: "/mixed-project/config.yaml", scheme: "file", path: "/mixed-project/config.yaml" };
      vi.mocked(vscode.workspace.findFiles).mockResolvedValueOnce([randomYaml] as never);

      vi.mocked(vscode.workspace.fs.readFile).mockResolvedValue(
        new TextEncoder().encode("name: just a config\nversion: 1.0") as never
      );

      const result = await scanner.scanFolder(folderUri as never);
      expect(result).toHaveLength(0);
    });

    it("respects MAX_CONTENT_BYTES limit", async () => {
      const folderUri = { fsPath: "/big-project", scheme: "file", path: "/big-project" };
      const files = Array.from({ length: 50 }, (_, i) => ({
        fsPath: `/big-project/file${i}.tf`,
        scheme: "file",
        path: `/big-project/file${i}.tf`,
      }));

      vi.mocked(vscode.workspace.findFiles).mockResolvedValueOnce(files as never);

      // Each file is ~10KB
      const bigContent = new TextEncoder().encode("x".repeat(10_000));
      vi.mocked(vscode.workspace.fs.readFile).mockResolvedValue(bigContent as never);

      const result = await scanner.scanFolder(folderUri as never);

      // Total should be capped at ~200KB → ~20 files
      expect(result.length).toBeLessThanOrEqual(21);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("summarize", () => {
    it("produces human-readable summary", () => {
      const files: ScannedFile[] = [
        { relativePath: "main.tf", content: "...", fileType: "terraform" },
        { relativePath: "variables.tf", content: "...", fileType: "terraform" },
        { relativePath: "outputs.tf", content: "...", fileType: "terraform" },
      ];

      const summary = WorkspaceScanner.summarize(files);
      expect(summary).toContain("3 files");
      expect(summary).toContain("3 terraform");
    });

    it("handles mixed file types", () => {
      const files: ScannedFile[] = [
        { relativePath: "main.tf", content: "...", fileType: "terraform" },
        { relativePath: "deploy.yaml", content: "...", fileType: "kubernetes" },
      ];

      const summary = WorkspaceScanner.summarize(files);
      expect(summary).toContain("2 files");
      expect(summary).toContain("terraform");
      expect(summary).toContain("kubernetes");
    });
  });
});
