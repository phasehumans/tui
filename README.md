# @trydecember/tui

> An unbundled, copy-paste terminal UI component library for React and Ink AI coding agents.

[![npm version](https://img.shields.io/npm/v/@trydecember/tui.svg)](https://www.npmjs.com/package/@trydecember/tui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-tui.trydecember.com-blue)](https://tui.trydecember.com)

---

## Overview

`@trydecember/tui` is an unbundled, copy-paste terminal UI component library built on **React and Ink**.

Instead of forcing your AI coding agent into a monolithic npm package with rigid styles and fixed event handlers, `@trydecember/tui` lets you copy raw, typed, fully customizable components directly into your codebase via a CLI.

- **Interactive Previews & Documentation**: [tui.trydecember.com](https://tui.trydecember.com)
- **Built for AI Agents**: Primitives tailored for LLM token streaming, tool executions, collapsible reasoning thoughts, diff inspection, and context gauges.
- **Zero Server Overhead**: The registry is served statically from edge CDNs (`tui.trydecember.com/r/*.json`).

---

## Quick Start

### 1. Initialize your project

Run the `init` command in your React + Ink repository:

```bash
npx @trydecember/tui init
# or bun
bunx @trydecember/tui init
# or pnpm
pnpm dlx @trydecember/tui init
```

This auto-detects your package manager, project structure, and TypeScript aliases (`@/*`), then creates `tui.json` and your local `theme.ts` design tokens.

### 2. Add components

Add any component from the registry directly into your project:

```bash
npx @trydecember/tui add streaming-text
npx @trydecember/tui add collapsible-reasoning
npx @trydecember/tui add tool-call-card
npx @trydecember/tui add diff-viewer
npx @trydecember/tui add token-gauge
```

To browse and select interactively from all 30+ components:

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

## Core Invariants

1. **Controlled Primitives**: All components are stateless view components. The parent agent state machine owns state, focus orchestration, and keyboard listeners (`useInput`).
2. **React + Ink Runtime**: Targets modern React (>=18/19) and Ink (>=6/7).
3. **Local Theme Ownership**: Components consume design tokens from your local `theme.ts` via path aliases defined in `tui.json`.
4. **Auto-Resolved Dependencies**: Third-party packages (e.g. `marked`, `cli-highlight`) are automatically installed using your detected package manager (`bun`, `pnpm`, `npm`).

---

## Monorepo Architecture

```
tui/
├── apps/
│   ├── cli/             # @trydecember/tui CLI distributed on npm
│   └── docs/            # Next.js static documentation site & xterm.js preview
└── packages/
    ├── registry/        # Component source code & static JSON builder
    └── core/            # Shared types and utilities
```

---

## Development

Prerequisites: [Bun](https://bun.sh) (>= 1.2)

```bash
# Install dependencies
bun install

# Start documentation and CLI in watch mode
bun run dev

# Run all test suites across the monorepo
bun run test

# Run typechecking
bun run typecheck

# Build registry JSON, CLI bundle, and static docs export
bun run build
```

---

## License

MIT © [December](https://trydecember.com)
