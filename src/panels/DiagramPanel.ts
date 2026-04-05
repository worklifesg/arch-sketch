import * as vscode from "vscode";
import {
  createLoadMessage,
  createExportMessage,
  createConfigureMessage,
  type DrawioMessage,
} from "./drawioProtocol.js";

export interface ExportData {
  format: "svg" | "png" | "html" | "drawio";
  data: string;
}

export interface RefineRequest {
  instruction: string;
  currentXml: string;
}

type ExportDataListener = (data: ExportData) => void;
type RefineListener = (req: RefineRequest) => void;

export class DiagramPanel {
  public static currentPanel: DiagramPanel | undefined;
  private static _exportListeners: ExportDataListener[] = [];
  private static _refineListeners: RefineListener[] = [];

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _currentXml: string = "";
  private _pages: string[] = []; // XML per page
  private _currentPageIndex: number = 0;
  private _isReady: boolean = false;
  private _pendingXml: string | undefined;
  private _pendingExport: "svg" | "png" | "html" | undefined;

  public static createOrShow(extensionUri: vscode.Uri): DiagramPanel {
    const column = vscode.ViewColumn.Beside;

    if (DiagramPanel.currentPanel) {
      DiagramPanel.currentPanel._panel.reveal(column);
      return DiagramPanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      "archsketch.diagram",
      "ArchSketch Diagram",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri],
      }
    );

    DiagramPanel.currentPanel = new DiagramPanel(panel, extensionUri);
    return DiagramPanel.currentPanel;
  }

  public static onExportData(listener: ExportDataListener): void {
    DiagramPanel._exportListeners.push(listener);
  }

  public static onRefine(listener: RefineListener): void {
    DiagramPanel._refineListeners.push(listener);
  }

  public getCurrentXml(): string {
    return this._currentXml;
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._panel.webview.html = this._getHtmlContent();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      (message: { type: string } & Record<string, unknown>) => {
        this._handleMessage(message);
      },
      null,
      this._disposables
    );
  }

  public loadDiagram(xml: string): void {
    this._currentXml = xml;

    if (this._isReady) {
      this._postToDrawio(createLoadMessage(xml));
    } else {
      this._pendingXml = xml;
    }
  }

  public requestExport(format: "svg" | "png" | "html"): void {
    if (format === "html") {
      // HTML export uses the current XML directly
      for (const listener of DiagramPanel._exportListeners) {
        listener({ format: "html", data: this._currentXml });
      }
      return;
    }

    if (this._isReady) {
      this._postToDrawio(createExportMessage(format));
      this._pendingExport = format;
    }
  }

  public saveAsDrawio(): void {
    for (const listener of DiagramPanel._exportListeners) {
      listener({ format: "drawio", data: this._currentXml });
    }
  }

  private _handleMessage(message: { type: string } & Record<string, unknown>): void {
    switch (message.type) {
      case "drawio-ready":
        this._onDrawioReady();
        break;
      case "drawio-event": {
        const event = message.event as DrawioMessage;
        this._onDrawioEvent(event);
        break;
      }
      case "save-drawio":
        this.saveAsDrawio();
        break;
      case "export-svg":
        this.requestExport("svg");
        break;
      case "export-png":
        this.requestExport("png");
        break;
      case "export-html":
        this.requestExport("html");
        break;
      case "refine": {
        const instruction = message.instruction as string;
        if (instruction) {
          for (const listener of DiagramPanel._refineListeners) {
            listener({ instruction, currentXml: this._currentXml });
          }
        }
        break;
      }
      case "add-page": {
        // Save current page XML and create a blank new page
        this._pages[this._currentPageIndex] = this._currentXml;
        this._currentPageIndex = (message.pageIndex as number) ?? this._pages.length;
        const blankXml = `<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>`;
        this._pages[this._currentPageIndex] = blankXml;
        this._currentXml = blankXml;
        if (this._isReady) {
          this._postToDrawio(createLoadMessage(blankXml));
        }
        break;
      }
      case "switch-page": {
        // Save current page and load requested one
        this._pages[this._currentPageIndex] = this._currentXml;
        this._currentPageIndex = message.pageIndex as number;
        const pageXml = this._pages[this._currentPageIndex] ?? "";
        if (pageXml && this._isReady) {
          this._currentXml = pageXml;
          this._postToDrawio(createLoadMessage(pageXml));
        }
        break;
      }
    }
  }

  private _onDrawioReady(): void {
    this._isReady = true;

    // Configure theme
    const isDark =
      vscode.window.activeColorTheme.kind ===
        vscode.ColorThemeKind.Dark ||
      vscode.window.activeColorTheme.kind ===
        vscode.ColorThemeKind.HighContrast;
    this._postToDrawio(createConfigureMessage(isDark));

    // Load pending diagram
    if (this._pendingXml) {
      this._postToDrawio(createLoadMessage(this._pendingXml));
      this._pendingXml = undefined;
    }
  }

  private _onDrawioEvent(event: DrawioMessage): void {
    if (event.event === "export" && event.data) {
      const format = this._pendingExport ?? "svg";
      this._pendingExport = undefined;

      for (const listener of DiagramPanel._exportListeners) {
        listener({ format, data: event.data });
      }
    }

    if (event.event === "autosave" && event.xml) {
      this._currentXml = event.xml;
    }

    if (event.event === "save" && event.xml) {
      this._currentXml = event.xml;
    }

    if (event.event === "init") {
      // draw.io iframe is ready — signal back
      this._onDrawioReady();
    }
  }

  private _postToDrawio(message: object): void {
    this._panel.webview.postMessage({
      type: "drawio-action",
      payload: message,
    });
  }

  private dispose(): void {
    DiagramPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const d = this._disposables.pop();
      d?.dispose();
    }
  }

  private _getHtmlContent(): string {
    const nonce = getNonce();
    const config = vscode.workspace.getConfiguration("archsketch");
    const themeConfig = config.get<string>("theme", "auto");
    let darkParam = "auto";
    if (themeConfig === "dark") {
      darkParam = "1";
    } else if (themeConfig === "light") {
      darkParam = "0";
    }

    return `<!DOCTYPE html>
<html lang="en" style="height:100%;margin:0;padding:0;">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             frame-src https://embed.diagrams.net;
             script-src 'nonce-${nonce}';
             style-src 'unsafe-inline';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ArchSketch Diagram</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--vscode-editor-background, #1e1e1e);
      color: var(--vscode-editor-foreground, #cccccc);
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
    }
    .toolbar {
      display: flex;
      gap: 6px;
      padding: 6px 10px;
      background: var(--vscode-titleBar-activeBackground, #2d2d2d);
      border-bottom: 1px solid var(--vscode-panel-border, #444);
      align-items: center;
      flex-wrap: wrap;
    }
    .toolbar button {
      background: var(--vscode-button-background, #0e639c);
      color: var(--vscode-button-foreground, #ffffff);
      border: none;
      padding: 4px 12px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    }
    .toolbar button:hover {
      background: var(--vscode-button-hoverBackground, #1177bb);
    }
    .toolbar button.secondary {
      background: var(--vscode-button-secondaryBackground, #3a3d41);
      color: var(--vscode-button-secondaryForeground, #cccccc);
    }
    .toolbar button.secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground, #505050);
    }
    .toolbar .spacer { flex: 1; }
    .toolbar .title {
      font-weight: bold;
      font-size: 13px;
      opacity: 0.8;
    }
    #diagram-frame {
      flex: 1;
      border: none;
      width: 100%;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 14px;
      opacity: 0.6;
    }
    .loading.hidden { display: none; }
    .refine-bar {
      display: flex;
      gap: 6px;
      padding: 6px 10px;
      background: var(--vscode-titleBar-activeBackground, #2d2d2d);
      border-top: 1px solid var(--vscode-panel-border, #444);
      align-items: center;
    }
    .refine-bar input {
      flex: 1;
      padding: 5px 10px;
      background: var(--vscode-input-background, #3c3c3c);
      color: var(--vscode-input-foreground, #cccccc);
      border: 1px solid var(--vscode-input-border, #555);
      border-radius: 3px;
      font-size: 12px;
      font-family: inherit;
    }
    .refine-bar button {
      background: var(--vscode-button-background, #0e639c);
      color: var(--vscode-button-foreground, #ffffff);
      border: none;
      padding: 5px 14px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    }
    .refine-bar button:hover {
      background: var(--vscode-button-hoverBackground, #1177bb);
    }
    .page-tabs {
      display: flex;
      gap: 0;
      background: var(--vscode-titleBar-activeBackground, #2d2d2d);
      border-bottom: 1px solid var(--vscode-panel-border, #444);
      align-items: center;
      padding: 0 10px;
      font-size: 11px;
    }
    .page-tab {
      padding: 4px 14px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      opacity: 0.6;
    }
    .page-tab:hover { opacity: 0.9; }
    .page-tab.active { opacity: 1; border-bottom-color: var(--vscode-focusBorder, #007acc); }
    .page-tab-add {
      padding: 4px 8px;
      cursor: pointer;
      opacity: 0.5;
      font-size: 14px;
    }
    .page-tab-add:hover { opacity: 1; }
  </style>
</head>
<body>
  <div class="toolbar">
    <span class="title">ArchSketch</span>
    <span class="spacer"></span>
    <button class="secondary" id="btn-save-drawio">Save .drawio</button>
    <button class="secondary" id="btn-export-svg">Export SVG</button>
    <button class="secondary" id="btn-export-png">Export PNG</button>
    <button class="secondary" id="btn-export-html">Copy HTML</button>
  </div>

  <div class="page-tabs" id="page-tabs">
    <div class="page-tab active" data-page="0">Page 1</div>
    <div class="page-tab-add" id="btn-add-page" title="Add page">+</div>
  </div>

  <div class="loading" id="loading">Loading draw.io editor...</div>

  <iframe
    id="diagram-frame"
    src="https://embed.diagrams.net/?embed=1&proto=json&spin=1&libraries=1&dark=${darkParam}"
    style="display:none;"
  ></iframe>

  <div class="refine-bar">
    <input type="text" id="refine-input" placeholder="Refine: e.g., 'Add a Redis cache between EC2 and RDS'" />
    <button id="btn-refine">Refine</button>
  </div>

  <script nonce="${nonce}">
    (function() {
      const vscode = acquireVsCodeApi();
      const iframe = document.getElementById('diagram-frame');
      const loading = document.getElementById('loading');
      const refineInput = document.getElementById('refine-input');
      let drawioReady = false;
      let pages = ['Page 1'];
      let currentPage = 0;

      // Listen for messages from draw.io iframe
      window.addEventListener('message', function(evt) {
        // Messages from draw.io iframe
        if (evt.source === iframe.contentWindow) {
          try {
            const msg = JSON.parse(evt.data);

            if (msg.event === 'init') {
              drawioReady = true;
              loading.classList.add('hidden');
              iframe.style.display = 'block';
              vscode.postMessage({ type: 'drawio-ready' });
            } else {
              vscode.postMessage({ type: 'drawio-event', event: msg });
            }
          } catch(e) {
            // Ignore non-JSON messages
          }
          return;
        }

        // Messages from VS Code extension host
        const msg = evt.data;
        if (msg && msg.type === 'drawio-action' && msg.payload) {
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              JSON.stringify(msg.payload),
              'https://embed.diagrams.net'
            );
          }
        }
      });

      // Toolbar buttons
      document.getElementById('btn-save-drawio').addEventListener('click', function() {
        vscode.postMessage({ type: 'save-drawio' });
      });
      document.getElementById('btn-export-svg').addEventListener('click', function() {
        vscode.postMessage({ type: 'export-svg' });
      });
      document.getElementById('btn-export-png').addEventListener('click', function() {
        vscode.postMessage({ type: 'export-png' });
      });
      document.getElementById('btn-export-html').addEventListener('click', function() {
        vscode.postMessage({ type: 'export-html' });
      });

      // Refinement chat
      document.getElementById('btn-refine').addEventListener('click', function() {
        const instruction = refineInput.value.trim();
        if (instruction) {
          vscode.postMessage({ type: 'refine', instruction: instruction });
          refineInput.value = '';
          refineInput.placeholder = 'Refining diagram...';
          setTimeout(function() {
            refineInput.placeholder = "Refine: e.g., 'Add a Redis cache between EC2 and RDS'";
          }, 5000);
        }
      });
      refineInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          document.getElementById('btn-refine').click();
        }
      });

      // Multi-page tabs
      document.getElementById('btn-add-page').addEventListener('click', function() {
        pages.push('Page ' + (pages.length + 1));
        currentPage = pages.length - 1;
        vscode.postMessage({ type: 'add-page', pageIndex: currentPage, pageName: pages[currentPage] });
        renderPageTabs();
      });

      function renderPageTabs() {
        const container = document.getElementById('page-tabs');
        container.innerHTML = '';
        pages.forEach(function(name, i) {
          const tab = document.createElement('div');
          tab.className = 'page-tab' + (i === currentPage ? ' active' : '');
          tab.textContent = name;
          tab.dataset.page = i;
          tab.addEventListener('click', function() {
            currentPage = i;
            vscode.postMessage({ type: 'switch-page', pageIndex: i });
            renderPageTabs();
          });
          container.appendChild(tab);
        });
        const addBtn = document.createElement('div');
        addBtn.className = 'page-tab-add';
        addBtn.id = 'btn-add-page';
        addBtn.title = 'Add page';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', function() {
          pages.push('Page ' + (pages.length + 1));
          currentPage = pages.length - 1;
          vscode.postMessage({ type: 'add-page', pageIndex: currentPage, pageName: pages[currentPage] });
          renderPageTabs();
        });
        container.appendChild(addBtn);
      }
    })();
  </script>
</body>
</html>`;
  }
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
