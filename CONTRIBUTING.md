# Contributing to ArchSketch

Thank you for considering contributing! This guide covers development setup, project structure, and pull request guidelines.

## Development Setup

```bash
git clone https://github.com/worklifesg/arch-sketch.git
cd arch-sketch
npm install
npm run build
```

### Running in Development

1. Open the project in VS Code
2. Press `F5` to launch the Extension Development Host
3. In the new window, run commands via the Command Palette (`Ctrl+Shift+P`)

### Building

```bash
npm run build        # One-time build
npm run watch        # Watch mode for development
npm run lint         # Type-check without emitting
```

### Testing

```bash
npm test             # Run all 89 tests
npm run test:watch   # Watch mode (re-runs on save)
npm run test:coverage # Coverage report (threshold: 45%)
```

Tests are in `test/` mirroring the `src/` structure. We use [vitest](https://vitest.dev/) with `@vitest/coverage-v8`.

### Packaging

```bash
npx vsce package --no-dependencies   # Creates .vsix file
```

## Project Structure

```
src/
├── extension.ts                 # Entry point, command registration
├── panels/
│   ├── DiagramPanel.ts          # Webview panel lifecycle
│   ├── SidebarProvider.ts       # Activity bar sidebar (Generate / Templates / Shapes)
│   └── drawioProtocol.ts        # draw.io iframe JSON protocol
├── prompts/
│   ├── system.ts                # System prompt + shape catalogs
│   ├── examples.ts              # Few-shot examples for LLM
│   └── providers.ts             # Provider type helpers
├── services/
│   ├── llmService.ts            # VS Code Language Model API integration
│   ├── exportService.ts         # Export to .drawio / SVG / PNG / HTML
│   ├── refinementService.ts     # Iterative AI refinement logic
│   ├── codeScanService.ts       # Single + multi-file IaC scanning
│   └── workspaceScanner.ts      # Workspace-wide file discovery
├── shapes/
│   └── shapeMap.ts              # Provider → shape mxGraph mappings
└── templates/
    └── gallery.ts               # 5 pre-built starter templates

test/
├── __mocks__/vscode.ts          # VS Code API mock for vitest
├── panels/                      # Panel tests
├── prompts/                     # Prompt tests
├── services/                    # Service tests
├── shapes/                      # Shape tests
├── templates/                   # Template tests
└── performance/                 # Performance benchmarks
```

## Pull Request Guidelines

### Branch Protection

Both `main` and `develop` are protected branches. **No one can push directly** — all changes must go through pull requests.

| Rule | `main` | `develop` |
|------|--------|-----------|
| Direct push | Blocked | Blocked |
| PRs required | Yes | Yes |
| Approving reviews | 1 (code owner) | 1 (code owner) |
| CI must pass (`quality`) | Yes | Yes |
| Stale reviews dismissed | Yes | Yes |
| Force push | Blocked | Blocked |
| Branch deletion | Blocked | Blocked |

A [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) file ensures only the maintainer (`@worklifesg`) can approve merges.

### Contribution Workflow

1. **Fork** the repository (external contributors) or create a feature branch from `develop`
2. Make your changes on your branch
3. Run `npm run lint` and `npm test` before submitting
4. Open a PR targeting `develop` (never `main` directly)
5. Wait for CI to pass and a **code owner review**
6. Once approved, the maintainer will merge your PR

### PR Best Practices

1. Keep PRs focused on a single change
2. Update `CHANGELOG.md` for user-facing changes
3. Add/update tests for new functionality
4. Add/update examples in `src/prompts/examples.ts` for new diagram types

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning via release-please:

```
feat: add Azure Container Apps shape
fix: correct label position on database nodes
docs: update README with new templates
chore: bump vitest to 4.2.0
```

## Security

To report a security vulnerability, see [SECURITY.md](SECURITY.md). Do **not** open a public issue.

## Code of Conduct

Be respectful, inclusive, and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.
