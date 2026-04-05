import * as vscode from "vscode";
import { DiagramPanel } from "./panels/DiagramPanel.js";
import { SidebarProvider } from "./panels/SidebarProvider.js";
import { LlmService } from "./services/llmService.js";
import { ExportService } from "./services/exportService.js";
import { RefinementService } from "./services/refinementService.js";
import { CodeScanService } from "./services/codeScanService.js";
import { WorkspaceScanner } from "./services/workspaceScanner.js";
import { getTemplateById } from "./templates/gallery.js";
import { SHAPE_XML_MAP } from "./shapes/shapeMap.js";

export function activate(context: vscode.ExtensionContext) {
  const llmService = new LlmService();
  const exportService = new ExportService();
  const refinementService = new RefinementService();
  const codeScanService = new CodeScanService();
  const workspaceScanner = new WorkspaceScanner();

  // Register sidebar
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SidebarProvider.viewType,
      sidebarProvider
    )
  );

  context.subscriptions.push(
    // Original generate command (from command palette)
    vscode.commands.registerCommand(
      "archsketch.generateDiagram",
      async () => {
        const description = await vscode.window.showInputBox({
          prompt: "Describe your cloud architecture",
          placeHolder:
            "e.g., 3-tier AWS web app with ALB, ECS, and RDS PostgreSQL",
          ignoreFocusOut: true,
        });

        if (!description) {
          return;
        }

        const config = vscode.workspace.getConfiguration("archsketch");
        const provider = config.get<string>("defaultProvider", "aws");

        await generateAndShow(context, llmService, description, provider);
      }
    ),

    // Generate with options (from sidebar)
    vscode.commands.registerCommand(
      "archsketch.generateDiagramWithOptions",
      async (opts: { description: string; provider: string }) => {
        await generateAndShow(
          context,
          llmService,
          opts.description,
          opts.provider
        );
      }
    ),

    // Load template
    vscode.commands.registerCommand(
      "archsketch.loadTemplate",
      async (templateId: string) => {
        const template = getTemplateById(templateId);
        if (!template) {
          vscode.window.showErrorMessage(
            `ArchSketch: Template "${templateId}" not found.`
          );
          return;
        }

        const panel = DiagramPanel.createOrShow(context.extensionUri);
        panel.loadDiagram(template.xml);
        vscode.window.showInformationMessage(
          `ArchSketch: Loaded template "${template.name}"`
        );
      }
    ),

    // Diagram from code
    vscode.commands.registerCommand(
      "archsketch.diagramFromCode",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showWarningMessage(
            "ArchSketch: Open a Terraform, CloudFormation, or Kubernetes file first."
          );
          return;
        }

        const content = editor.document.getText();
        const fileName = editor.document.fileName;
        const fileType = codeScanService.detectFileTypeFromContent(
          content,
          fileName
        );

        if (!fileType) {
          const pick = await vscode.window.showQuickPick(
            ["terraform", "cloudformation", "kubernetes"],
            { placeHolder: "What type of infrastructure code is this?" }
          );
          if (!pick) {
            return;
          }
          await scanAndShow(
            context,
            codeScanService,
            content,
            pick as "terraform" | "cloudformation" | "kubernetes",
            codeScanService.detectProviderFromCode(content, pick)
          );
          return;
        }

        const provider = codeScanService.detectProviderFromCode(
          content,
          fileType
        );
        await scanAndShow(
          context,
          codeScanService,
          content,
          fileType,
          provider
        );
      }
    ),

    // Diagram from multiple IaC files (folder / project scan)
    vscode.commands.registerCommand(
      "archsketch.diagramFromFolder",
      async () => {
        const files = await workspaceScanner.pickAndScan();
        if (!files || files.length === 0) {
          vscode.window.showWarningMessage(
            "ArchSketch: No Terraform, CloudFormation, or Kubernetes files found in the selected folder."
          );
          return;
        }

        const summary = WorkspaceScanner.summarize(files);
        const proceed = await vscode.window.showInformationMessage(
          `ArchSketch: ${summary}. Generate architecture diagram?`,
          "Generate",
          "Cancel"
        );
        if (proceed !== "Generate") {
          return;
        }

        const provider = codeScanService.detectProviderFromCode(
          files.map((f) => f.content).join("\n"),
          files[0].fileType
        );
        await multiScanAndShow(
          context,
          codeScanService,
          files,
          provider
        );
      }
    ),

    // Diagram from all IaC files in current workspace
    vscode.commands.registerCommand(
      "archsketch.diagramFromWorkspace",
      async () => {
        try {
          const files = await workspaceScanner.scanWorkspace();
          if (files.length === 0) {
            vscode.window.showWarningMessage(
              "ArchSketch: No IaC files found in the workspace."
            );
            return;
          }

          const summary = WorkspaceScanner.summarize(files);
          const proceed = await vscode.window.showInformationMessage(
            `ArchSketch: ${summary}. Generate architecture diagram?`,
            "Generate",
            "Cancel"
          );
          if (proceed !== "Generate") {
            return;
          }

          const provider = codeScanService.detectProviderFromCode(
            files.map((f) => f.content).join("\n"),
            files[0].fileType
          );
          await multiScanAndShow(context, codeScanService, files, provider);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          vscode.window.showErrorMessage(`ArchSketch: ${message}`);
        }
      }
    ),

    // Insert shape into current diagram
    vscode.commands.registerCommand(
      "archsketch.insertShape",
      async (shapeId: string) => {
        const panel = DiagramPanel.currentPanel;
        if (!panel) {
          vscode.window.showWarningMessage(
            "ArchSketch: Open a diagram first."
          );
          return;
        }

        const shapeXml = SHAPE_XML_MAP[shapeId];
        if (!shapeXml) {
          return;
        }

        // Use refinement to ask AI to insert this shape
        const config = vscode.workspace.getConfiguration("archsketch");
        const provider = config.get<string>("defaultProvider", "aws");

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "ArchSketch: Inserting shape...",
            cancellable: true,
          },
          async (_progress, token) => {
            try {
              const xml = await refinementService.refineDiagram(
                panel.getCurrentXml(),
                `Add a ${shapeId.replace(/[-_]/g, " ")} component to the diagram in a logical position.`,
                provider,
                token
              );
              panel.loadDiagram(xml);
            } catch (err: unknown) {
              const message =
                err instanceof Error ? err.message : String(err);
              vscode.window.showErrorMessage(
                `ArchSketch: ${message}`
              );
            }
          }
        );
      }
    ),

    vscode.commands.registerCommand("archsketch.openDiagram", async () => {
      const uris = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: { "Draw.io files": ["drawio", "xml"] },
      });

      if (!uris || uris.length === 0) {
        return;
      }

      const content = await vscode.workspace.fs.readFile(uris[0]);
      const xml = new TextDecoder().decode(content);
      const panel = DiagramPanel.createOrShow(context.extensionUri);
      panel.loadDiagram(xml);
    }),

    vscode.commands.registerCommand("archsketch.exportSvg", async () => {
      const panel = DiagramPanel.currentPanel;
      if (!panel) {
        vscode.window.showWarningMessage(
          "ArchSketch: No diagram is open."
        );
        return;
      }
      panel.requestExport("svg");
    }),

    vscode.commands.registerCommand("archsketch.exportPng", async () => {
      const panel = DiagramPanel.currentPanel;
      if (!panel) {
        vscode.window.showWarningMessage(
          "ArchSketch: No diagram is open."
        );
        return;
      }
      panel.requestExport("png");
    }),

    vscode.commands.registerCommand("archsketch.exportHtml", async () => {
      const panel = DiagramPanel.currentPanel;
      if (!panel) {
        vscode.window.showWarningMessage(
          "ArchSketch: No diagram is open."
        );
        return;
      }
      panel.requestExport("html");
    })
  );

  // Listen for export data from the webview
  DiagramPanel.onExportData(async (data) => {
    try {
      switch (data.format) {
        case "svg":
          await exportService.saveAsSvg(data.data);
          break;
        case "png":
          await exportService.saveAsPng(data.data);
          break;
        case "html":
          await exportService.copyHtmlEmbed(data.data);
          break;
        case "drawio":
          await exportService.saveAsDrawio(data.data);
          break;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      vscode.window.showErrorMessage(`ArchSketch export: ${message}`);
    }
  });

  // Listen for refinement requests from the webview chat bar
  DiagramPanel.onRefine(async (req) => {
    const config = vscode.workspace.getConfiguration("archsketch");
    const provider = config.get<string>("defaultProvider", "aws");

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "ArchSketch: Refining diagram...",
        cancellable: true,
      },
      async (_progress, token) => {
        try {
          const xml = await refinementService.refineDiagram(
            req.currentXml,
            req.instruction,
            provider,
            token
          );
          DiagramPanel.currentPanel?.loadDiagram(xml);
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : String(err);
          vscode.window.showErrorMessage(
            `ArchSketch refinement: ${message}`
          );
        }
      }
    );
  });
}

async function generateAndShow(
  context: vscode.ExtensionContext,
  llmService: LlmService,
  description: string,
  provider: string
): Promise<void> {
  const panel = DiagramPanel.createOrShow(context.extensionUri);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "ArchSketch: Generating diagram...",
      cancellable: true,
    },
    async (_progress, token) => {
      try {
        const xml = await llmService.generateDiagramXml(
          description,
          provider,
          token
        );
        panel.loadDiagram(xml);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(
          `ArchSketch: ${message}`
        );
      }
    }
  );
}

async function scanAndShow(
  context: vscode.ExtensionContext,
  codeScanService: CodeScanService,
  content: string,
  fileType: "terraform" | "cloudformation" | "kubernetes",
  provider: string
): Promise<void> {
  const panel = DiagramPanel.createOrShow(context.extensionUri);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `ArchSketch: Scanning ${fileType} code...`,
      cancellable: true,
    },
    async (_progress, token) => {
      try {
        const xml = await codeScanService.generateFromCode(
          content,
          fileType,
          provider,
          token
        );
        panel.loadDiagram(xml);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(
          `ArchSketch: ${message}`
        );
      }
    }
  );
}

async function multiScanAndShow(
  context: vscode.ExtensionContext,
  codeScanService: CodeScanService,
  files: import("./services/workspaceScanner.js").ScannedFile[],
  provider: string
): Promise<void> {
  const panel = DiagramPanel.createOrShow(context.extensionUri);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `ArchSketch: Scanning ${files.length} ${files[0].fileType} files...`,
      cancellable: true,
    },
    async (progress, token) => {
      try {
        progress.report({ message: "Analyzing cross-file references..." });
        const xml = await codeScanService.generateFromMultipleFiles(
          files,
          provider,
          token
        );
        panel.loadDiagram(xml);
        vscode.window.showInformationMessage(
          `ArchSketch: Generated diagram from ${files.length} files`
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(
          `ArchSketch: ${message}`
        );
      }
    }
  );
}

export function deactivate() {}
