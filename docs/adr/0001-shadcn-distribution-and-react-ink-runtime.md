# ADR-0001: Unbundled Copy-Paste Distribution for React & Ink Terminal Agents

## Status

Accepted

## Context

AI coding agents require rich, dynamic terminal interfaces (streaming markdown, collapsible reasoning blocks, status cards, and diff viewers). Existing CLI component solutions are either monolithic npm packages with rigid styling or one-off snippets with inconsistent design systems. Developers building agents require full ownership of layout, styling, and keyboard interactions.

## Decision

1. We adopt the `shadcn/ui` unbundled distribution pattern: components are distributed as raw TypeScript/React templates dropped directly into the consumer's repository via a CLI (`npx @trydecember/tui add <component>`).
2. The runtime target is strictly **React + Ink**.
3. All components are designed as **controlled view primitives**. The consumer agent application owns all state, focus orchestration, and keyboard input listeners (`useInput`), preventing collisions on `process.stdin`.
4. Visual styles, colors, and border glyphs are unified through a locally owned, strongly typed `theme.ts` file created upon initialization (`tui init`).
5. Project path aliases are managed via `tui.json`, with the CLI dynamically rewriting import paths upon installation.
6. Third-party dependencies (such as diffing engines or spinners) are declared in the registry item schema and automatically installed by the CLI using the detected package manager (`bun`, `pnpm`, `npm`).

## Consequences

- Developers have complete ownership and customization over their terminal UI components.
- The project leverages existing battle-tested components from `december/packages/tui`.
- Non-React/Ink CLIs (e.g., pure bash or raw ANSI scripts) are out of scope for v1.
