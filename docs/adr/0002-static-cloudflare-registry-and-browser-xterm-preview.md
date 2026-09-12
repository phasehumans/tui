# ADR-0002: Static Cloudflare Pages Registry and Browser-Side xterm.js Previews

## Status

Accepted

## Context

The project requires a public documentation site (`tui.trydecember.com`) that allows developers to:

1. Browse component documentation, props, and copy-paste commands.
2. Interactively preview terminal components directly in the browser via `xterm.js`.
3. Serve as the registry distribution endpoint for the CLI (`npx @trydecember/tui add ...`).

Hosting dynamic Node.js PTY processes or WebSockets in the cloud introduces significant server costs, execution timeouts, maintenance overhead, and security risks (arbitrary execution in terminal sandboxes).

## Decision

1. We build the documentation site using **Next.js (App Router)** configured for **Static HTML Export** (`output: 'export'`) and deploy it to **Cloudflare Pages**.
2. The component registry is generated at build time (`bun run build:registry`) into granular, static JSON endpoints (`public/r/[name].json` and `public/r/index.json`).
3. The interactive web terminal (`xterm.js`) runs purely in the client browser using dynamic imports (`next/dynamic` with `ssr: false`).
4. Terminal interactivity is driven by **client-side state-machine simulation** (emitting ANSI escape sequences, typing delays, and layout redraws directly to the `xterm.js` canvas), requiring zero backend compute.

## Consequences

- $0 operational and hosting costs on Cloudflare Pages edge CDN.
- Zero server maintenance, zero backend security vulnerabilities, and 99.999% uptime with global edge caching.
- Instant, authentic terminal previews for web visitors without network latency.
- Registry endpoints are served as static JSON files with sub-20ms global response times.
