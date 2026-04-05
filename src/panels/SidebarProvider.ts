import * as vscode from "vscode";
import { TEMPLATES } from "../templates/gallery.js";
import { SUPPORTED_PROVIDERS } from "../prompts/providers.js";

/**
 * Sidebar webview that provides:
 * - Generate form (provider + description)
 * - Template gallery
 * - Diagram-from-code button
 * - Shape palette for drag-and-drop
 */
export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "archsketch.sidebar";
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((msg) => {
      switch (msg.type) {
        case "generate":
          vscode.commands.executeCommand("archsketch.generateDiagramWithOptions", {
            description: msg.description,
            provider: msg.provider,
          });
          break;
        case "loadTemplate":
          vscode.commands.executeCommand("archsketch.loadTemplate", msg.templateId);
          break;
        case "scanCode":
          vscode.commands.executeCommand("archsketch.diagramFromCode");
          break;
        case "scanFolder":
          vscode.commands.executeCommand("archsketch.diagramFromFolder");
          break;
        case "scanWorkspace":
          vscode.commands.executeCommand("archsketch.diagramFromWorkspace");
          break;
        case "insertShape":
          vscode.commands.executeCommand("archsketch.insertShape", msg.shape);
          break;
      }
    });
  }

  private _getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();

    const templateOptions = TEMPLATES.map(
      (t) =>
        `<div class="template-card" data-id="${t.id}">
          <div class="template-name">${t.name}</div>
          <div class="template-desc">${t.description}</div>
          <span class="template-badge">${t.provider.toUpperCase()}</span>
        </div>`
    ).join("\n");

    const providerOptions = SUPPORTED_PROVIDERS.map(
      (p) => `<option value="${p}">${p.toUpperCase()}</option>`
    ).join("\n");

    const shapePalette = getShapePaletteHtml();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      color: var(--vscode-foreground);
      padding: 0;
    }
    .section {
      padding: 10px 12px;
      border-bottom: 1px solid var(--vscode-panel-border, #333);
    }
    .section-title {
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      opacity: 0.7;
    }
    textarea, select, input {
      width: 100%;
      padding: 6px 8px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border, #444);
      border-radius: 3px;
      font-family: inherit;
      font-size: 12px;
      resize: vertical;
    }
    textarea { min-height: 70px; }
    select { cursor: pointer; }
    .row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
    .row label { font-size: 11px; min-width: 55px; }
    .row select, .row input { flex: 1; }
    button {
      width: 100%;
      padding: 6px 12px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      margin-top: 6px;
    }
    button:hover { background: var(--vscode-button-hoverBackground); }
    button.secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    button.secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }

    .template-card {
      padding: 8px 10px;
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 4px;
      margin-bottom: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .template-card:hover {
      background: var(--vscode-list-hoverBackground);
    }
    .template-name { font-weight: 600; font-size: 12px; }
    .template-desc { font-size: 11px; opacity: 0.7; margin-top: 2px; }
    .template-badge {
      display: inline-block;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 8px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      margin-top: 4px;
    }

    .shape-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
    }
    .shape-item {
      padding: 6px 4px;
      text-align: center;
      font-size: 10px;
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 3px;
      cursor: grab;
      transition: background 0.15s;
    }
    .shape-item:hover {
      background: var(--vscode-list-hoverBackground);
    }
    .shape-icon { font-size: 18px; line-height: 1; }

    .tabs {
      display: flex;
      border-bottom: 1px solid var(--vscode-panel-border);
    }
    .tab {
      flex: 1;
      padding: 6px 4px;
      text-align: center;
      font-size: 11px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      opacity: 0.6;
    }
    .tab:hover { opacity: 0.9; }
    .tab.active {
      opacity: 1;
      border-bottom-color: var(--vscode-focusBorder);
    }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
  </style>
</head>
<body>
  <div class="tabs">
    <div class="tab active" data-tab="generate">Generate</div>
    <div class="tab" data-tab="templates">Templates</div>
    <div class="tab" data-tab="shapes">Shapes</div>
  </div>

  <!-- Generate Tab -->
  <div class="tab-content active" id="tab-generate">
    <div class="section">
      <div class="section-title">Describe Architecture</div>
      <div class="row">
        <label>Provider</label>
        <select id="provider">
          ${providerOptions}
        </select>
      </div>
      <textarea id="description" placeholder="e.g., 3-tier AWS app with ALB, ECS Fargate, Aurora PostgreSQL, and ElastiCache Redis"></textarea>
      <button id="btn-generate">Generate Diagram</button>
    </div>

    <div class="section">
      <div class="section-title">From Code</div>
      <button class="secondary" id="btn-scan-code">Scan Active File</button>
      <button class="secondary" id="btn-scan-folder" style="margin-top:4px;">Scan Folder (Multi-File)</button>
      <button class="secondary" id="btn-scan-workspace" style="margin-top:4px;">Scan Entire Workspace</button>
      <div style="font-size:10px;opacity:0.6;margin-top:4px;">
        Supports: Terraform modules, CloudFormation stacks, K8s manifests.
        Multi-file scan reads all files in a folder to understand cross-references.
      </div>
    </div>
  </div>

  <!-- Templates Tab -->
  <div class="tab-content" id="tab-templates">
    <div class="section">
      <div class="section-title">Starter Templates</div>
      ${templateOptions}
    </div>
  </div>

  <!-- Shapes Tab -->
  <div class="tab-content" id="tab-shapes">
    <div class="section">
      <div class="section-title">Cloud Shapes</div>
      <div class="row">
        <label>Filter</label>
        <select id="shape-provider-filter">
          <option value="all">All</option>
          ${providerOptions}
        </select>
      </div>
      ${shapePalette}
    </div>
  </div>

  <script nonce="${nonce}">
    (function() {
      const vscode = acquireVsCodeApi();

      // Tab switching
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          tab.classList.add('active');
          document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        });
      });

      // Generate
      document.getElementById('btn-generate').addEventListener('click', () => {
        const desc = document.getElementById('description').value.trim();
        const provider = document.getElementById('provider').value;
        if (desc) {
          vscode.postMessage({ type: 'generate', description: desc, provider: provider });
        }
      });

      // Ctrl+Enter to generate
      document.getElementById('description').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          document.getElementById('btn-generate').click();
        }
      });

      // Scan code
      document.getElementById('btn-scan-code').addEventListener('click', () => {
        vscode.postMessage({ type: 'scanCode' });
      });

      // Scan folder (multi-file)
      document.getElementById('btn-scan-folder').addEventListener('click', () => {
        vscode.postMessage({ type: 'scanFolder' });
      });

      // Scan workspace
      document.getElementById('btn-scan-workspace').addEventListener('click', () => {
        vscode.postMessage({ type: 'scanWorkspace' });
      });

      // Template cards
      document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
          vscode.postMessage({ type: 'loadTemplate', templateId: card.dataset.id });
        });
      });

      // Shape items
      document.querySelectorAll('.shape-item').forEach(item => {
        item.addEventListener('click', () => {
          vscode.postMessage({ type: 'insertShape', shape: item.dataset.shape });
        });
      });

      // Shape filter
      document.getElementById('shape-provider-filter').addEventListener('change', (e) => {
        const val = e.target.value;
        document.querySelectorAll('.shape-item').forEach(item => {
          if (val === 'all' || item.dataset.provider === val) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    })();
  </script>
</body>
</html>`;
  }
}

function getShapePaletteHtml(): string {
  const shapes = [
    { icon: "🖥️", name: "EC2", provider: "aws", shape: "aws-ec2" },
    { icon: "⚡", name: "Lambda", provider: "aws", shape: "aws-lambda" },
    { icon: "🐳", name: "ECS", provider: "aws", shape: "aws-ecs" },
    { icon: "☸️", name: "EKS", provider: "aws", shape: "aws-eks" },
    { icon: "⚖️", name: "ALB", provider: "aws", shape: "aws-alb" },
    { icon: "🌐", name: "CloudFront", provider: "aws", shape: "aws-cloudfront" },
    { icon: "📦", name: "S3", provider: "aws", shape: "aws-s3" },
    { icon: "🗄️", name: "RDS", provider: "aws", shape: "aws-rds" },
    { icon: "⚡", name: "DynamoDB", provider: "aws", shape: "aws-dynamodb" },
    { icon: "📨", name: "SQS", provider: "aws", shape: "aws-sqs" },
    { icon: "📢", name: "SNS", provider: "aws", shape: "aws-sns" },
    { icon: "🔑", name: "Cognito", provider: "aws", shape: "aws-cognito" },
    { icon: "🖥️", name: "VM", provider: "azure", shape: "azure-vm" },
    { icon: "🌐", name: "App Service", provider: "azure", shape: "azure-appservice" },
    { icon: "☸️", name: "AKS", provider: "azure", shape: "azure-aks" },
    { icon: "⚡", name: "Functions", provider: "azure", shape: "azure-functions" },
    { icon: "🗄️", name: "SQL DB", provider: "azure", shape: "azure-sqldb" },
    { icon: "🌍", name: "Cosmos DB", provider: "azure", shape: "azure-cosmosdb" },
    { icon: "🖥️", name: "GCE", provider: "gcp", shape: "gcp-gce" },
    { icon: "🚀", name: "Cloud Run", provider: "gcp", shape: "gcp-cloudrun" },
    { icon: "☸️", name: "GKE", provider: "gcp", shape: "gcp-gke" },
    { icon: "🗄️", name: "Cloud SQL", provider: "gcp", shape: "gcp-cloudsql" },
    { icon: "📨", name: "Pub/Sub", provider: "gcp", shape: "gcp-pubsub" },
    { icon: "📊", name: "BigQuery", provider: "gcp", shape: "gcp-bigquery" },
    { icon: "📦", name: "Pod", provider: "kubernetes", shape: "k8s-pod" },
    { icon: "🔄", name: "Deployment", provider: "kubernetes", shape: "k8s-deploy" },
    { icon: "🌐", name: "Service", provider: "kubernetes", shape: "k8s-svc" },
    { icon: "🚪", name: "Ingress", provider: "kubernetes", shape: "k8s-ing" },
    { icon: "📒", name: "ConfigMap", provider: "kubernetes", shape: "k8s-cm" },
    { icon: "🔐", name: "Secret", provider: "kubernetes", shape: "k8s-secret" },
  ];

  return `<div class="shape-grid">
    ${shapes
      .map(
        (s) =>
          `<div class="shape-item" data-shape="${s.shape}" data-provider="${s.provider}" title="Click to insert">
            <div class="shape-icon">${s.icon}</div>
            <div>${s.name}</div>
          </div>`
      )
      .join("\n")}
  </div>`;
}

function getNonce(): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
