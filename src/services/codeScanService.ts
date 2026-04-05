import * as vscode from "vscode";
import { getSystemPrompt } from "../prompts/system.js";
import type { ScannedFile } from "./workspaceScanner.js";

/**
 * Scans Terraform, CloudFormation, or Kubernetes YAML files
 * and generates architecture diagrams from them.
 */
export class CodeScanService {
  /**
   * Generate an architecture diagram from multiple IaC files.
   * Feeds all file contents as a combined context so the AI can
   * understand cross-file references (modules, nested stacks, label selectors).
   */
  async generateFromMultipleFiles(
    files: ScannedFile[],
    provider: string,
    token: vscode.CancellationToken
  ): Promise<string> {
    const models = await vscode.lm.selectChatModels({ vendor: "copilot" });

    if (models.length === 0) {
      throw new Error(
        "GitHub Copilot is required. Please install and sign in."
      );
    }

    const model = models[0];
    const fileType = files[0].fileType;
    const systemPrompt = getSystemPrompt(provider);

    const multiFilePrompt = this.buildMultiFilePrompt(files);

    const messages: vscode.LanguageModelChatMessage[] = [
      vscode.LanguageModelChatMessage.User(systemPrompt),
      vscode.LanguageModelChatMessage.User(multiFilePrompt),
      vscode.LanguageModelChatMessage.User(
        `Now generate a single unified mxGraph XML architecture diagram that represents the COMPLETE infrastructure defined across all ${files.length} ${fileType} files above. Show all resources, their connections, and logical groupings.`
      ),
    ];

    const response = await model.sendRequest(messages, {}, token);

    let fullResponse = "";
    for await (const chunk of response.text) {
      fullResponse += chunk;
    }

    return this.extractXml(fullResponse);
  }

  /**
   * Build a combined prompt that presents each file with its path as context.
   * For large projects, files are truncated to fit within LLM limits.
   */
  private buildMultiFilePrompt(files: ScannedFile[]): string {
    const fileType = files[0].fileType;

    let header = `You are analyzing a multi-file ${fileType} project. Below are ALL the files in the project.
Pay special attention to cross-file references:\n`;

    if (fileType === "terraform") {
      header += `- module blocks that reference other directories
- resource references across files (e.g., aws_vpc.main.id used in another file)
- variable definitions and their usage
- output values consumed by other modules
- data source lookups that reference other resources\n`;
    } else if (fileType === "cloudformation") {
      header += `- Ref and Fn::GetAtt references across resources
- Nested stacks (AWS::CloudFormation::Stack)
- Cross-stack references via Exports/Imports
- DependsOn relationships
- Condition-based resources\n`;
    } else {
      header += `- Label selectors that connect Services to Deployments
- Ingress rules that route to Services
- ConfigMap/Secret references in Pod specs
- PVC claims and StorageClass references
- Namespace groupings\n`;
    }

    header += `\nAnalyze ALL files together to understand the full architecture.\n\n`;

    const fileSections = files.map(
      (f) => `--- File: ${f.relativePath} ---\n${f.content}`
    );

    return header + fileSections.join("\n\n");
  }

  async generateFromCode(
    code: string,
    fileType: "terraform" | "cloudformation" | "kubernetes",
    provider: string,
    token: vscode.CancellationToken
  ): Promise<string> {
    const models = await vscode.lm.selectChatModels({ vendor: "copilot" });

    if (models.length === 0) {
      throw new Error(
        "GitHub Copilot is required. Please install and sign in."
      );
    }

    const model = models[0];
    const systemPrompt = getSystemPrompt(provider);

    const scanPrompt = `You are also an expert at reading Infrastructure-as-Code files and understanding the architecture they define.

Given the following ${fileType} code, analyze it to understand:
1. What cloud resources are defined
2. How they connect to each other (networking, IAM, data flow)
3. The logical grouping (VPCs, subnets, namespaces, resource groups)

Then generate an mxGraph XML diagram that accurately represents this infrastructure.

${fileType === "terraform" ? "Look for resource blocks, data sources, module references, and variable interpolations to understand connections." : ""}
${fileType === "cloudformation" ? "Look for Resources, Ref/GetAtt references, DependsOn, and nested stacks." : ""}
${fileType === "kubernetes" ? "Look for Deployments, Services, Ingress, ConfigMaps, Secrets, PVCs, and label selectors to map connections." : ""}`;

    const messages: vscode.LanguageModelChatMessage[] = [
      vscode.LanguageModelChatMessage.User(systemPrompt),
      vscode.LanguageModelChatMessage.User(scanPrompt),
      vscode.LanguageModelChatMessage.User(
        `Generate a diagram from this ${fileType} code:\n\n${code}`
      ),
    ];

    const response = await model.sendRequest(messages, {}, token);

    let fullResponse = "";
    for await (const chunk of response.text) {
      fullResponse += chunk;
    }

    return this.extractXml(fullResponse);
  }

  private extractXml(response: string): string {
    const match = response.match(
      /<mxGraphModel[\s\S]*?<\/mxGraphModel>/
    );
    if (match) {
      return match[0];
    }

    const fenceMatch = response.match(/```(?:xml)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      const inner = fenceMatch[1].trim();
      const innerMatch = inner.match(
        /<mxGraphModel[\s\S]*?<\/mxGraphModel>/
      );
      if (innerMatch) {
        return innerMatch[0];
      }
    }

    throw new Error(
      "Could not extract valid mxGraph XML from the code scan response."
    );
  }

  detectFileType(
    fileName: string
  ): "terraform" | "cloudformation" | "kubernetes" | null {
    if (fileName.endsWith(".tf") || fileName.endsWith(".tfvars")) {
      return "terraform";
    }
    // Simple heuristic — will be refined with content inspection
    if (
      fileName.endsWith(".yaml") ||
      fileName.endsWith(".yml") ||
      fileName.endsWith(".json")
    ) {
      return null; // Ambiguous — need content inspection
    }
    return null;
  }

  detectFileTypeFromContent(
    content: string,
    fileName: string
  ): "terraform" | "cloudformation" | "kubernetes" | null {
    // Terraform
    if (
      fileName.endsWith(".tf") ||
      /^resource\s+"/.test(content) ||
      /^provider\s+"/.test(content)
    ) {
      return "terraform";
    }

    // CloudFormation
    if (
      content.includes("AWSTemplateFormatVersion") ||
      content.includes("aws-cdk")
    ) {
      return "cloudformation";
    }

    // Kubernetes
    if (
      content.includes("apiVersion:") &&
      content.includes("kind:")
    ) {
      return "kubernetes";
    }

    return null;
  }

  detectProviderFromCode(
    content: string,
    fileType: string
  ): string {
    if (fileType === "kubernetes") {
      return "kubernetes";
    }

    if (
      content.includes("aws_") ||
      content.includes("AWS::") ||
      content.includes("provider \"aws\"")
    ) {
      return "aws";
    }
    if (
      content.includes("azurerm_") ||
      content.includes("Microsoft.") ||
      content.includes("provider \"azurerm\"")
    ) {
      return "azure";
    }
    if (
      content.includes("google_") ||
      content.includes("provider \"google\"")
    ) {
      return "gcp";
    }

    return "general";
  }
}
