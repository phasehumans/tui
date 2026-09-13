# AGENTS.md

## Agent skills

### Issue tracker

Issues and PRDs for this repo live as GitHub issues (`phasehumans/december`). See `docs/agents/issue-tracker.md`.

### Triage labels

Uses canonical triage label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (`CONTEXT.md` + `docs/adr/` at repo root). See `docs/agents/domain.md`.

## Server Module Architecture & Service Standards

Reference gold standard modules: `auth`, `notification`, `session`.

- **File Responsibility Separation**:
    - `<module>.routes.ts`: Defines Express routes delegating to controller functions (`export default <module>Router`).
    - `<module>.controller.ts`: Handles HTTP requests using `asyncHandler`, parses validation schemas via Zod (`.parse()`), and returns `sendSuccess(res, message, data, status)` or throws `AppError(message, status)`. Exports `<module>Controller` object.
    - `<module>.service.ts`: Business logic functions. Exports `<module>Service` object.
    - `<module>.repository.ts`: Database / Prisma queries. Exports `<module>Repository` object.
    - `<module>.schema.ts`: Zod request validation schemas.
    - `<module>.types.ts`: Centralized TypeScript interfaces and types.
    - `<module>.utils.ts`: Module helper functions.

- **Service Layer Rules**:
    - **Arrow Functions**: All service functions must be declared as private `const functionName = async (data: TypeName) => { ... }` arrow functions.
    - **Single Parameter & Destructuring**: Service functions accept a single typed `data` object parameter and destructure its fields on the **first line** inside the function body (`const { prop1, prop2 } = data`).
    - **Type Centralization**: Service parameter types and interfaces must be defined in `<module>.types.ts` and imported into `<module>.service.ts`.
    - **Singleton Export**: Individual service functions must not be exported directly. Export exclusively via a single object at the end of the file (`export const <module>Service = { ... }`).

## Testing & Environment

- **Test Environment & DB Setup**: Tests run against `.env.test`.
- **Database Migrations for Tests**: Before running integration or server tests against the test database, deploy test migrations:
    ```bash
    bun --cwd packages/database db:migrate:test
    ```

## Code Quality & Linting Standards

- **No Empty Catch Blocks**: Never leave catch blocks empty (`catch (e) {}`). Always include a descriptive comment explaining why the error is ignored (e.g. `// Intentionally swallowed: fallback handled`), or log/handle the error.
- **No `require()` Imports**: Never use CommonJS `require()`. Always use top-level ES module `import` statements (`import ... from '...'`).
- **Scoped Switch Cases**: Always enclose `case` blocks in curly braces `{ ... }` when declaring `const` or `let` variables inside a `switch` statement.
- **Complete React Hook Dependencies**: Ensure all `useEffect`, `useCallback`, and `useMemo` hooks have complete dependency arrays or explicitly documented refs.

## Git & Pull Request Guidelines

- **Lowercase Only for Git & PRs**: Always write commit messages, PR reviews/review comments, and PR titles/descriptions/messages strictly in lowercase only.

# CONTEXT.md

## Domain Overview

`@trydecember/tui` is an unbundled, copy-paste terminal UI component library designed specifically for **AI coding agents** built on **React and Ink**.

It does not distribute monolithic npm packages. Instead, developers run a lightweight CLI (`npx @trydecember/tui add <component>`) to copy raw, typed, customizable component templates directly into their codebase.

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
