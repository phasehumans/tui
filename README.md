# @trydecember/tui

> **a ui library for terminal agents.**

## The Vision

An unbundled, copy-paste UI component library for the terminal—modeled entirely after the `shadcn/ui` philosophy.

Instead of installing a rigid, monolithic npm package, developers use a CLI tool to drop raw, highly-styled React/Ink components directly into their source code. They completely own the code, the layout, and the styling.

### The Focus: Terminal Agents

While most CLI libraries focus on basic forms, `@trydecember/tui` is built explicitly for the modern era of **AI coding agents** (like the December agent).

## Core Differentiators

1. **Agent-First Components**: Built-in primitives for AI workflows (streaming markdown, collapsible reasoning, side-by-side git diffs, tool execution cards).
2. **Interactive Web Docs**: A documentation site featuring an in-browser `xterm.js` virtual terminal. Users can interact with the CLI components using their keyboard directly on the website before copying the code.
3. **The "shadcn" Distribution**: You don't import black boxes. You run `npx @trydecember/tui add diff-view` and edit the source code yourself.

---

## Component Catalog (Agent Focus)

- `<StreamingText>`: Smooth, syntax-highlighted markdown streaming for LLM outputs.
- `<CollapsibleReasoning>`: Foldable "Thinking..." blocks to keep terminal history clean.
- `<ToolCallCard>`: Execution blocks showing background commands, spinners, and expandable outputs.
- `<DiffViewer>`: Red/green chunk diffing for proposed code changes.
- `<TokenGauge>`: Minimal progress/cost meters for context windows.
- _Plus core primitives:_ `Select`, `TextInput`, `Confirm`, `Table`.

---

## Plan of Action (Roadmap)

### Phase 1: Architecture & Foundation

- Initialize monorepo structure (`apps/cli`, `apps/docs`, `packages/core`).
- Define the `theme.ts` token contract (colors, Unicode borders, focus states).
- Extract and clean up existing UI primitives from your `december/packages/tui` codebase into standalone, zero-dependency component templates.

### Phase 2: Core Components & Registry

- Finalize the first batch of flagship Agent components (`StreamingText`, `ToolCallCard`, `Select`).
- Define the `registry.json` schema (the API that maps components to their source code and peer dependencies).

### Phase 3: The CLI Distribution Tool

- Build the `npx @trydecember/tui add <component>` CLI tool.
- Implement the `init` command to scaffold `tui.json` and create the local `components/ui/` folder in a user's project.

### Phase 4: The Interactive Web Playground

- Build the Next.js documentation site.
- Implement the client-side `xterm.js` virtual terminal pipe to run the components live in the browser so users can test them before copying the code.
