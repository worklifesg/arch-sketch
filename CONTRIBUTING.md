# Contributing to ArchSketch

## Development Setup

```bash
git clone https://github.com/archsketch/archsketch
cd archsketch
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

### Packaging

```bash
npx vsce package     # Creates .vsix file
```

## Project Structure

```
src/
├── extension.ts              # Entry point, command registration
├── panels/
│   ├── DiagramPanel.ts       # Webview panel lifecycle
│   └── drawioProtocol.ts     # draw.io iframe JSON protocol
├── prompts/
│   ├── system.ts             # System prompt + shape catalogs
│   ├── examples.ts           # Few-shot examples
│   └── providers.ts          # Provider type helpers
└── services/
    ├── llmService.ts         # VS Code LM API integration
    └── exportService.ts      # Export to .drawio/SVG/PNG/HTML
```

## Pull Request Guidelines

- Keep PRs focused on a single change
- Run `npm run lint` before submitting
- Update CHANGELOG.md for user-facing changes
- Add/update examples in `src/prompts/examples.ts` for new diagram types
