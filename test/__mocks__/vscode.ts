/**
 * Mock of the vscode module for unit testing.
 * Only stubs the APIs actually used by our services.
 */
import { vi } from "vitest";

export const window = {
  showInputBox: vi.fn(),
  showSaveDialog: vi.fn(),
  showOpenDialog: vi.fn(),
  showInformationMessage: vi.fn(),
  showWarningMessage: vi.fn(),
  showErrorMessage: vi.fn(),
  showQuickPick: vi.fn(),
  withProgress: vi.fn((_opts: unknown, task: Function) =>
    task({ report: vi.fn() }, { isCancellationRequested: false })
  ),
  activeTextEditor: undefined as unknown,
  createWebviewPanel: vi.fn(),
  registerWebviewViewProvider: vi.fn(),
  activeColorTheme: { kind: 1 },
};

export const workspace = {
  getConfiguration: vi.fn(() => ({
    get: vi.fn((key: string, defaultValue: unknown) => defaultValue),
  })),
  fs: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
  findFiles: vi.fn().mockResolvedValue([]),
  workspaceFolders: undefined as unknown,
};

export const commands = {
  registerCommand: vi.fn(),
  executeCommand: vi.fn(),
};

export const env = {
  clipboard: {
    writeText: vi.fn(),
  },
};

export const Uri = {
  file: (path: string) => ({ fsPath: path, scheme: "file", path }),
  parse: (str: string) => ({ fsPath: str, scheme: "file", path: str }),
};

export const ViewColumn = {
  Beside: 2,
};

export const ColorThemeKind = {
  Light: 1,
  Dark: 2,
  HighContrast: 3,
};

export enum ProgressLocation {
  Notification = 15,
}

export const CancellationTokenSource = class {
  token = { isCancellationRequested: false, onCancellationRequested: vi.fn() };
  cancel = vi.fn();
  dispose = vi.fn();
};

// Language Model API mock
export const lm = {
  selectChatModels: vi.fn(),
};

export const LanguageModelChatMessage = {
  User: (content: string) => ({ role: "user", content }),
  Assistant: (content: string) => ({ role: "assistant", content }),
};

export class RelativePattern {
  constructor(
    public base: unknown,
    public pattern: string
  ) {}
}
