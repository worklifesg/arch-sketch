import * as vscode from "vscode";

export class ExportService {
  async saveAsDrawio(xml: string): Promise<void> {
    const uri = await vscode.window.showSaveDialog({
      filters: { "Draw.io files": ["drawio"] },
      defaultUri: vscode.Uri.file("architecture.drawio"),
    });

    if (!uri) {
      return;
    }

    const mxfileXml = this.wrapInMxfile(xml);
    await vscode.workspace.fs.writeFile(
      uri,
      new TextEncoder().encode(mxfileXml)
    );
    vscode.window.showInformationMessage(
      `ArchSketch: Saved to ${uri.fsPath}`
    );
  }

  async saveAsSvg(dataUri: string): Promise<void> {
    const uri = await vscode.window.showSaveDialog({
      filters: { "SVG files": ["svg"] },
      defaultUri: vscode.Uri.file("architecture.svg"),
    });

    if (!uri) {
      return;
    }

    const data = this.decodeDataUri(dataUri);
    await vscode.workspace.fs.writeFile(uri, data);
    vscode.window.showInformationMessage(
      `ArchSketch: SVG saved to ${uri.fsPath}`
    );
  }

  async saveAsPng(dataUri: string): Promise<void> {
    const uri = await vscode.window.showSaveDialog({
      filters: { "PNG files": ["png"] },
      defaultUri: vscode.Uri.file("architecture.png"),
    });

    if (!uri) {
      return;
    }

    const data = this.decodeDataUri(dataUri);
    await vscode.workspace.fs.writeFile(uri, data);
    vscode.window.showInformationMessage(
      `ArchSketch: PNG saved to ${uri.fsPath}`
    );
  }

  async copyHtmlEmbed(xml: string): Promise<void> {
    const compressed = encodeURIComponent(xml);
    const html = `<!-- ArchSketch Diagram Embed -->
<div style="width:100%;max-width:1100px;margin:0 auto;">
  <iframe
    frameborder="0"
    style="width:100%;height:600px;border:0;"
    src="https://viewer.diagrams.net/?highlight=0000ff&nav=1&xml=${compressed}"
    allowfullscreen>
  </iframe>
</div>`;

    await vscode.env.clipboard.writeText(html);
    vscode.window.showInformationMessage(
      "ArchSketch: HTML embed code copied to clipboard"
    );
  }

  private wrapInMxfile(xml: string): string {
    // If it's already wrapped in mxfile, return as-is
    if (xml.includes("<mxfile")) {
      return xml;
    }

    return `<mxfile host="app.diagrams.net" type="device">
  <diagram id="archsketch" name="Architecture">
    ${xml}
  </diagram>
</mxfile>`;
  }

  private decodeDataUri(dataUri: string): Uint8Array {
    // Handle data:image/svg+xml;base64,... or data:image/png;base64,...
    const base64Match = dataUri.match(/^data:[^;]+;base64,(.+)$/);
    if (base64Match) {
      return Uint8Array.from(
        Buffer.from(base64Match[1], "base64")
      );
    }

    // Handle data:image/svg+xml,... (URL-encoded)
    const uriMatch = dataUri.match(/^data:[^,]+,(.+)$/);
    if (uriMatch) {
      return new TextEncoder().encode(
        decodeURIComponent(uriMatch[1])
      );
    }

    // Assume raw content
    return new TextEncoder().encode(dataUri);
  }
}
