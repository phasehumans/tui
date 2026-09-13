# @trydecember/tui

> An unbundled, copy-paste terminal UI component library for React and Ink AI coding agents.

`@trydecember/tui` delivers raw, customizable TypeScript/React components directly into your codebase. No monolithic node_modules dependencies: you retain complete ownership over styling, layout, and keyboard interactions.

Documentation and live browser previews: [tui.trydecember.com](https://tui.trydecember.com)

---

## Quick Start

### 1. Initialize your project

Run `init` in your React + Ink project directory:

```bash
npx @trydecember/tui init
# or with bun
bunx @trydecember/tui init
# or with pnpm
pnpm dlx @trydecember/tui init
```

This will:

- Detect your framework, package manager, and TypeScript path aliases (`@/*`).
- Create `tui.json` to store your configuration.
- Generate your centralized `theme.ts` design tokens.

### 2. Add components

Add any component from the registry:

```bash
npx @trydecember/tui add streaming-text
npx @trydecember/tui add collapsible-reasoning
npx @trydecember/tui add tool-call-card
npx @trydecember/tui add diff-viewer
npx @trydecember/tui add token-gauge
```

To view an interactive selection menu of all available components:

```bash
npx @trydecember/tui add
```

Or install all available components at once:

```bash
npx @trydecember/tui add --all
```

### 3. Check for upstream updates

Compare your local components against the latest registry definitions:

```bash
npx @trydecember/tui diff
```

---

## CLI Options

| Flag                   | Description                                                                         |
| :--------------------- | :---------------------------------------------------------------------------------- |
| `-y`, `--yes`          | Skip confirmation prompts and accept defaults                                       |
| `-a`, `--all`          | Add all components from the registry                                                |
| `-t`, `--theme <name>` | Theme preset (`default`, `amber`, `emerald`, `cyan`, `monochrome`, `zinc`, `slate`) |
| `--overwrite`          | Overwrite existing local component files                                            |
| `--cwd <path>`         | Specify working directory                                                           |
| `-v`, `--version`      | Output version number                                                               |
| `-h`, `--help`         | Display CLI help menu                                                               |

---

## Invariants

- **Controlled Primitives**: All components are stateless view components. The parent agent state machine owns state, focus orchestration, and keyboard input (`useInput`).
- **Local Theme Ownership**: Components consume tokens from your local `theme.ts` via path aliases configured in `tui.json`.
- **Auto-Resolved Dependencies**: Third-party dependencies are automatically installed using your project's detected package manager (`bun`, `pnpm`, `npm`).

## License

MIT © [December](https://trydecember.com)
