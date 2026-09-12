# CONTEXT.md

## Domain Overview

`@trydecember/tui` is an unbundled, copy-paste terminal UI component library designed specifically for **AI coding agents** built on **React and Ink**.

Modeled after the `shadcn/ui` philosophy, it does not distribute monolithic npm packages. Instead, developers run a lightweight CLI (`npx @trydecember/tui add <component>`) to copy raw, typed, customizable component templates directly into their codebase.

The project is hosted at `tui.trydecember.com` on Cloudflare Pages as a pure static Next.js export, providing both the web documentation, interactive `xterm.js` virtual terminal previews, and the static registry JSON endpoints (`/r/[name].json`).

---

## Ubiquitous Language & Glossary

- **`Turn`**: A single round of interaction between a user and an agent (user prompt, agent thought, tool calls, final response).
- **`StreamingText`**: Atomic component that progressively renders streaming LLM tokens with real-time markdown parsing and terminal syntax highlighting.
- **`CollapsibleReasoning`**: Atomic component representing the agent's chain-of-thought scratchpad ("Thinking..."), capable of being toggled open/closed.
- **`ToolCallCard`**: Atomic component representing an invoked tool execution, displaying tool name, parameter snippets, live spinner status (`pending` | `running` | `completed` | `failed`), execution duration, and expandable stdout/stderr.
- **`DiffViewer`**: Atomic component displaying unified or split code modifications with colored chunk headers, additions, and deletions.
- **`TokenGauge`**: Atomic meter displaying context window limits, token consumption, cache performance, or financial costs.
- **`Theme`**: The central design token contract (`theme.ts`) governing colors, glyphs, padding, and border styles across all installed components.
- **`Registry`**: The collection of static JSON payloads (`/r/[name].json` and `/r/index.json`) that serve raw component code and metadata to the CLI.
- **`TuiConfig` (`tui.json`)**: The local project configuration specifying component directories, TypeScript path aliases, and design system preferences.

---

## Core Domain Invariants & Rules

1. **Purely Controlled Primitives**: All components are stateless view components. The parent agent's state machine owns and orchestrates focus, keyboard listeners (`useInput`), expansion states, and lifecycle status.
2. **React + Ink Runtime**: All components target React (>=18/19) and Ink (>=6/7).
3. **Local Theme Ownership**: Components must consume design tokens from the local `theme.ts` via path aliases configured in `tui.json`.
4. **Auto-Resolved Dependencies**: If a component requires an external npm package (e.g., `diff`, `cli-spinners`), the registry declares it, and the CLI automatically installs it using the project's detected package manager (`bun`, `pnpm`, `npm`).
5. **Static Serverless Delivery**: No backend services exist. The registry and documentation are pure static assets served from edge CDNs.
6. **Client-Side Terminal Simulation**: The browser documentation uses `xterm.js` driven by client-side interactive state machines to simulate agent token streaming and state transitions without backend processes.
