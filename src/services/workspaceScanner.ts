import * as vscode from "vscode";

export interface ScannedFile {
  relativePath: string;
  content: string;
  fileType: "terraform" | "cloudformation" | "kubernetes";
}

/**
 * Discovers and reads IaC files from a workspace folder or selected directory.
 * Supports Terraform modules, CloudFormation stacks, and Kubernetes manifests.
 */
export class WorkspaceScanner {
  /** File extensions to glob for */
  private static readonly PATTERNS: Record<string, string[]> = {
    terraform: ["**/*.tf"],
    cloudformation: ["**/*.yaml", "**/*.yml", "**/*.json"],
    kubernetes: ["**/*.yaml", "**/*.yml"],
  };

  /** Max total content size (~200KB) to avoid exceeding LLM context limits */
  static readonly MAX_CONTENT_BYTES = 200_000;

  /**
   * Prompt user to pick a folder and scan it for IaC files.
   * Returns null if the user cancels.
   */
  async pickAndScan(): Promise<ScannedFile[] | null> {
    const uris = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: "Scan Folder for IaC Files",
    });

    if (!uris || uris.length === 0) {
      return null;
    }

    return this.scanFolder(uris[0]);
  }

  /**
   * Scan a folder URI for IaC files and return their contents.
   */
  async scanFolder(folderUri: vscode.Uri): Promise<ScannedFile[]> {
    const files: ScannedFile[] = [];
    let totalSize = 0;

    // Try Terraform first (.tf files are unambiguous)
    const tfFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(folderUri, "**/*.tf"),
      "**/node_modules/**",
      100
    );

    if (tfFiles.length > 0) {
      for (const uri of tfFiles) {
        if (totalSize >= WorkspaceScanner.MAX_CONTENT_BYTES) {
          break;
        }
        const content = await this.readFile(uri);
        if (content) {
          totalSize += content.length;
          files.push({
            relativePath: this.relativePath(folderUri, uri),
            content,
            fileType: "terraform",
          });
        }
      }
      return files;
    }

    // Scan YAML/YML/JSON — need content inspection to classify
    const yamlFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(folderUri, "**/*.{yaml,yml,json}"),
      "{**/node_modules/**,**/.terraform/**,**/package*.json,**/tsconfig.json}",
      200
    );

    for (const uri of yamlFiles) {
      if (totalSize >= WorkspaceScanner.MAX_CONTENT_BYTES) {
        break;
      }
      const content = await this.readFile(uri);
      if (!content) {
        continue;
      }

      const fileType = this.classifyContent(content, uri.fsPath);
      if (fileType) {
        totalSize += content.length;
        files.push({
          relativePath: this.relativePath(folderUri, uri),
          content,
          fileType,
        });
      }
    }

    return files;
  }

  /**
   * Scan all open workspace folders for IaC files (for the "Scan Workspace" flow).
   */
  async scanWorkspace(): Promise<ScannedFile[]> {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      throw new Error("No workspace folder is open.");
    }

    const allFiles: ScannedFile[] = [];
    for (const folder of folders) {
      const files = await this.scanFolder(folder.uri);
      allFiles.push(...files);
    }
    return allFiles;
  }

  private async readFile(uri: vscode.Uri): Promise<string | null> {
    try {
      const raw = await vscode.workspace.fs.readFile(uri);
      return new TextDecoder().decode(raw);
    } catch {
      return null;
    }
  }

  private relativePath(base: vscode.Uri, file: vscode.Uri): string {
    const basePath = base.fsPath.endsWith("/") ? base.fsPath : base.fsPath + "/";
    return file.fsPath.startsWith(basePath)
      ? file.fsPath.slice(basePath.length)
      : file.fsPath;
  }

  private classifyContent(
    content: string,
    filePath: string
  ): "cloudformation" | "kubernetes" | null {
    // CloudFormation
    if (
      content.includes("AWSTemplateFormatVersion") ||
      content.includes("aws-cdk") ||
      content.includes("AWS::") // SAM / nested stacks
    ) {
      return "cloudformation";
    }

    // Kubernetes
    if (content.includes("apiVersion:") && content.includes("kind:")) {
      return "kubernetes";
    }

    // JSON CloudFormation
    if (
      filePath.endsWith(".json") &&
      (content.includes('"AWSTemplateFormatVersion"') ||
        content.includes('"Resources"'))
    ) {
      return "cloudformation";
    }

    return null;
  }

  /**
   * Build a combined summary of file metadata (for display before scanning).
   */
  static summarize(files: ScannedFile[]): string {
    const byType: Record<string, number> = {};
    for (const f of files) {
      byType[f.fileType] = (byType[f.fileType] || 0) + 1;
    }
    const parts = Object.entries(byType)
      .map(([type, count]) => `${count} ${type}`)
      .join(", ");
    return `Found ${files.length} files (${parts})`;
  }
}
