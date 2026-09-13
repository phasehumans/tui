'use client'

import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import React, { useEffect, useRef } from 'react'

export interface TerminalInnerProps {
    mode?:
        | 'all'
        | 'diff-viewer'
        | 'streaming-text'
        | 'collapsible-reasoning'
        | 'tool-call-card'
        | 'token-gauge'
        | 'pill'
        | 'spinner'
        | 'text-area'
        | 'header'
        | 'mermaid'
        | 'markdown'
        | 'user-message'
        | 'error-message'
        | 'select-menu'
        | 'command-menu'
        | 'shortcuts-menu'
        | 'plan-approve-menu'
        | 'input-bar'
        | 'card'
        | 'button'
        | 'tabs'
        | 'dialog'
        | 'progress'
        | 'checkbox'
        | 'radio-group'
        | 'skeleton'
        | 'toast'
        | 'table'
    replayKey?: number
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function TerminalInner({ mode = 'all', replayKey = 0 }: TerminalInnerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const termRef = useRef<Terminal | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const term = new Terminal({
            theme: {
                background: '#141414',
                foreground: '#e2e2e2',
                cursor: '#fb923c',
                cursorAccent: '#141414',
                selectionBackground: 'rgba(251, 146, 60, 0.3)',
                black: '#2a2a2a',
                red: '#f87171',
                green: '#4ade80',
                yellow: '#fbbf24',
                blue: '#fb923c',
                magenta: '#c084fc',
                cyan: '#38bdf8',
                white: '#ffffff',
            },
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
            fontSize: 13.5,
            lineHeight: 1.45,
            cursorBlink: true,
            convertEol: true,
            disableStdin: true,
        })

        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        term.open(containerRef.current)
        fitAddon.fit()

        termRef.current = term

        const resizeObserver = new ResizeObserver(() => {
            try {
                fitAddon.fit()
            } catch {
                // Intentionally swallowed: fit observer resize handling
            }
        })
        resizeObserver.observe(containerRef.current)

        let isCancelled = false

        async function runSimulation() {
            if (!term) return
            term.clear()

            if (mode === 'diff-viewer') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview diff-viewer\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('\x1b[38;2;251;146;60m⌥\x1b[0m \x1b[1;38;2;226;226;226mpackages/auth/src/jwt.ts\x1b[0m')
                term.writeln('\x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m')
                term.writeln('\x1b[38;2;140;140;140m│ @@ -14,6 +14,8 @@ export function verifyToken(token)      │\x1b[0m')
                await sleep(150)
                if (isCancelled) return

                term.writeln('\x1b[48;2;63;19;22m\x1b[38;2;248;113;113m│ - const decoded = jwt.decode(token)                    │\x1b[0m')
                await sleep(200)
                if (isCancelled) return

                term.writeln('\x1b[48;2;18;47;30m\x1b[38;2;74;222;128m│ + const decoded = jwt.verify(token, process.env.SECRET)│\x1b[0m')
                await sleep(150)
                if (isCancelled) return

                term.writeln('\x1b[48;2;18;47;30m\x1b[38;2;74;222;128m│ + if (!decoded.exp || decoded.exp < Date.now()) return │\x1b[0m')
                term.writeln('\x1b[38;2;140;140;140m│   return decoded                                       │\x1b[0m')
                term.writeln('\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m')
                term.writeln('\x1b[38;2;92;92;92m  ... (12 more lines in diff chunk)\x1b[0m')
            } else if (mode === 'streaming-text') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview streaming-text\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                const tokens = [
                    'The', ' security', ' vulnerability', ' in', ' `packages/auth/src/jwt.ts`',
                    ' stemmed', ' from', ' using', ' unverified', ' token', ' payload', ' decoding.',
                    '\n\n',
                    'By', ' migrating', ' to', ' strict', ' cryptographic', ' verification',
                    ' with', ' expiry', ' validation,', ' replay', ' and', ' forgery', ' attacks',
                    ' are', ' eliminated.\n'
                ]

                for (const tok of tokens) {
                    term.write(tok)
                    await sleep(40)
                    if (isCancelled) return
                }

                term.write('\x1b[38;2;251;146;60m ▌\x1b[0m')
            } else if (mode === 'collapsible-reasoning') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview collapsible-reasoning\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('\x1b[38;2;251;146;60m⠋\x1b[0m \x1b[1;38;2;140;140;140mThinking...\x1b[0m \x1b[38;2;92;92;92m(analyzing ast)\x1b[0m')
                await sleep(600)
                if (isCancelled) return

                term.write('\x1b[1A\x1b[2K')
                term.writeln('\x1b[38;2;140;140;140m▸\x1b[0m \x1b[1;38;2;226;226;226mReasoning\x1b[0m \x1b[38;2;92;92;92m(1.2s) [142 tokens]\x1b[0m')
                await sleep(700)
                if (isCancelled) return

                term.write('\x1b[1A\x1b[2K')
                term.writeln('\x1b[38;2;251;146;60m▾\x1b[0m \x1b[1;38;2;226;226;226mReasoning\x1b[0m \x1b[38;2;92;92;92m(1.2s) [142 tokens]\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m\x1b[3m1. locate verifySessionToken function in jwt.ts\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m\x1b[3m2. verify signature against process.env.SECRET\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m\x1b[3m3. enforce expiration timestamp check before returning session\x1b[0m')
            } else if (mode === 'tool-call-card') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview tool-call-card\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('\x1b[38;2;251;191;36m⠋\x1b[0m \x1b[1;38;2;251;146;60mbun test\x1b[0m \x1b[38;2;140;140;140mauth.test.ts\x1b[0m \x1b[38;2;92;92;92mrunning...\x1b[0m')
                await sleep(700)
                if (isCancelled) return

                term.write('\x1b[1A\x1b[2K')
                term.writeln('\x1b[38;2;74;222;128m✔\x1b[0m \x1b[1;38;2;251;146;60mbun test\x1b[0m \x1b[38;2;140;140;140mauth.test.ts\x1b[0m \x1b[38;2;92;92;92m0.8s\x1b[0m \x1b[38;2;92;92;92m▾\x1b[0m')
                term.writeln('\x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m')
                term.writeln('\x1b[38;2;74;222;128m│ ✓ jwt.test.ts (4 passed)\x1b[0m                               │')
                term.writeln('\x1b[38;2;74;222;128m│ ✓ session.test.ts (2 passed)\x1b[0m                           │')
                term.writeln('\x1b[38;2;140;140;140m│ 6 pass · 0 fail · 26 expect() calls [28ms]             │\x1b[0m')
                term.writeln('\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m')
            } else if (mode === 'token-gauge') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview token-gauge\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('\x1b[38;2;140;140;140mNominal context:\x1b[0m')
                term.writeln('\x1b[38;2;140;140;140mContext:\x1b[0m \x1b[38;2;251;146;60m━━━━━━\x1b[0m\x1b[38;2;92;92;92m──────────────\x1b[0m \x1b[1;38;2;251;146;60m28%\x1b[0m \x1b[38;2;92;92;92m(36.4k / 128k)\x1b[0m')
                await sleep(400)
                if (isCancelled) return

                term.writeln('')
                term.writeln('\x1b[38;2;140;140;140mWarning threshold:\x1b[0m')
                term.writeln('\x1b[38;2;251;191;36m━━━━━━━━━━━━━━──────\x1b[0m \x1b[1;38;2;251;191;36m72%\x1b[0m \x1b[38;2;92;92;92m(92.1k / 128k)\x1b[0m')
                await sleep(400)
                if (isCancelled) return

                term.writeln('')
                term.writeln('\x1b[38;2;140;140;140mCritical context:\x1b[0m')
                term.writeln('\x1b[38;2;248;113;113m━━━━━━━━━━━━━━━━━━━─\x1b[0m \x1b[1;38;2;248;113;113m96%\x1b[0m \x1b[38;2;92;92;92m(122.8k / 128k)\x1b[0m \x1b[48;2;63;19;22m\x1b[38;2;248;113;113m[flush needed]\x1b[0m')
            } else if (mode === 'pill') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview pill\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[48;2;42;42;42m\x1b[38;2;251;146;60m PR #42 \x1b[0m  \x1b[48;2;18;47;30m\x1b[38;2;74;222;128m approved \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;140;140;140m typescript \x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[48;2;63;19;22m\x1b[38;2;248;113;113m blocked \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;251;191;36m needs-review \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;92;92;92m v0.3.0 \x1b[0m')
            } else if (mode === 'spinner') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview spinner\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
                term.writeln('')
                for (let i = 0; i < 15; i++) {
                    const f = frames[i % frames.length]
                    term.write(`\r  \x1b[38;2;251;146;60m${f}\x1b[0m \x1b[38;2;140;140;140manalyzing workspace dependencies...\x1b[0m`)
                    await sleep(80)
                    if (isCancelled) return
                }
                term.write('\r\x1b[2K')
                term.writeln('  \x1b[38;2;74;222;128m✔\x1b[0m \x1b[38;2;226;226;226mdependencies verified (0 vulnerabilities found)\x1b[0m')
            } else if (mode === 'text-area') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview text-area\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.write('  \x1b[38;2;251;146;60m❭\x1b[0m ')
                const inputScript = [
                    '/model', ' gpt-4o', ' inspect', ' ', '@packages/auth/jwt.ts', ' for', ' token', ' replay'
                ]
                for (const chunk of inputScript) {
                    if (chunk.startsWith('/') || chunk.startsWith('@')) {
                        term.write(`\x1b[38;2;251;146;60m${chunk}\x1b[0m`)
                    } else {
                        term.write(`\x1b[38;2;226;226;226m${chunk}\x1b[0m`)
                    }
                    await sleep(100)
                    if (isCancelled) return
                }
                term.write('\x1b[38;2;251;146;60m ▌\x1b[0m')
                term.writeln('')
                term.writeln('')
                term.writeln('\x1b[38;2;92;92;92m  [Enter] send   [Ctrl+K] clear   [@] mention file   [/] commands\x1b[0m')
            } else if (mode === 'header') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview header\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[1;38;2;251;146;60m✱\x1b[0m \x1b[1;38;2;226;226;226mAgent CLI 0.3.0\x1b[0m')
                term.writeln('  \x1b[38;2;140;140;140m~/code/december \x1b[38;2;92;92;92m(main)\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60mTips for getting started\x1b[0m')
                term.writeln('  \x1b[38;2;140;140;140mRun /init to scaffold workspace config and rules\x1b[0m')
                term.writeln('  \x1b[38;2;140;140;140mType / to explore available commands and shortcuts\x1b[0m')
            } else if (mode === 'mermaid') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview mermaid\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;226;226;226m❖ Mermaid Diagram (flowchart)\x1b[0m \x1b[38;2;92;92;92m(ctrl+o for code)\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m┌───────────────┐\x1b[0m       \x1b[38;2;42;42;42m┌───────────────┐\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m│\x1b[0m \x1b[38;2;226;226;226mClient (CLI)\x1b[0m  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;251;146;60m──►\x1b[0m  \x1b[38;2;42;42;42m│\x1b[0m \x1b[38;2;226;226;226mProxy Gateway\x1b[0m \x1b[38;2;42;42;42m│\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m└───────────────┘\x1b[0m       \x1b[38;2;42;42;42m└───────────────┘\x1b[0m')
                term.writeln('                                  \x1b[38;2;251;146;60m│\x1b[0m')
                term.writeln('                                  \x1b[38;2;251;146;60m▼\x1b[0m')
                term.writeln('                          \x1b[38;2;42;42;42m┌───────────────┐\x1b[0m')
                term.writeln('                          \x1b[38;2;42;42;42m│\x1b[0m \x1b[38;2;226;226;226mLLM Provider\x1b[0m  \x1b[38;2;42;42;42m│\x1b[0m')
                term.writeln('                          \x1b[38;2;42;42;42m└───────────────┘\x1b[0m')
            } else if (mode === 'markdown') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview markdown\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[1;38;2;226;226;226m# API Specification\x1b[0m')
                term.writeln('  The endpoint supports \x1b[48;2;42;42;42m\x1b[38;2;251;146;60m bearer \x1b[0m token authentication.')
                term.writeln('')
                term.writeln('  \x1b[38;2;92;92;92m┌───────────────┬────────┬─────────────────────────┐\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m│\x1b[0m \x1b[1;38;2;226;226;226mRoute        \x1b[0m \x1b[38;2;92;92;92m│\x1b[0m \x1b[1;38;2;226;226;226mMethod \x1b[0m \x1b[38;2;92;92;92m│\x1b[0m \x1b[1;38;2;226;226;226mDescription               \x1b[0m\x1b[38;2;92;92;92m│\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m├───────────────┼────────┼─────────────────────────┤\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m│\x1b[0m /v1/chat       \x1b[38;2;92;92;92m│\x1b[0m POST   \x1b[38;2;92;92;92m│\x1b[0m streaming completion    \x1b[38;2;92;92;92m│\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m│\x1b[0m /v1/models     \x1b[38;2;92;92;92m│\x1b[0m GET    \x1b[38;2;92;92;92m│\x1b[0m list available engines   \x1b[38;2;92;92;92m│\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m└───────────────┴────────┴─────────────────────────┘\x1b[0m')
            } else if (mode === 'user-message') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview user-message\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[38;2;251;146;60mcheck security and token expiration in auth.ts\x1b[0m')
                await sleep(400)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[38;2;251;146;60m/grill-me verify all error conditions\x1b[0m')
            } else if (mode === 'error-message') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview error-message\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[1;38;2;248;113;113mRate limit or quota exhausted from LLM provider.\x1b[0m')
                term.writeln('  \x1b[38;2;140;140;140mPlease upgrade your API key tier at \x1b[38;2;251;146;60mhttps://platform.openai.com/limits\x1b[0m')
            } else if (mode === 'select-menu') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview select-menu\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[1;38;2;226;226;226mSelect active model engine:\x1b[0m')
                term.writeln('    \x1b[38;2;140;140;140mclaude-3-7-sonnet — Anthropic\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[1;38;2;251;146;60mgpt-4o\x1b[0m \x1b[38;2;74;222;128m(Active)\x1b[0m \x1b[38;2;140;140;140m— OpenAI\x1b[0m')
                term.writeln('    \x1b[38;2;140;140;140mdeepseek-r1 — DeepSeek\x1b[0m')
                term.writeln('    \x1b[38;2;140;140;140mgemini-2.5-flash — Google\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m↑/↓\x1b[0m \x1b[38;2;140;140;140mNavigate\x1b[0m · \x1b[38;2;251;146;60menter\x1b[0m \x1b[38;2;140;140;140mSelect\x1b[0m · \x1b[38;2;251;146;60mesc\x1b[0m \x1b[38;2;140;140;140mCancel\x1b[0m')
            } else if (mode === 'command-menu') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview command-menu\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[1;38;2;251;146;60m/model\x1b[0m               \x1b[38;2;140;140;140mSwitch active LLM model engine\x1b[0m')
                term.writeln('    \x1b[38;2;226;226;226m/plan\x1b[0m                \x1b[38;2;140;140;140mCreate an execution plan before running\x1b[0m')
                term.writeln('    \x1b[38;2;226;226;226m/review\x1b[0m              \x1b[38;2;140;140;140mReview changes and git working diff\x1b[0m')
                term.writeln('    \x1b[38;2;226;226;226m/skills\x1b[0m              \x1b[38;2;140;140;140mList available agent skills and tools\x1b[0m')
                term.writeln('    \x1b[38;2;92;92;92m↓ 4 more\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m↑/↓\x1b[0m \x1b[38;2;140;140;140mNavigate\x1b[0m · \x1b[38;2;251;146;60menter\x1b[0m \x1b[38;2;140;140;140mSelect\x1b[0m · \x1b[38;2;251;146;60mtab\x1b[0m \x1b[38;2;140;140;140mComplete\x1b[0m · \x1b[38;2;251;146;60mesc\x1b[0m \x1b[38;2;140;140;140mCancel\x1b[0m')
            } else if (mode === 'shortcuts-menu') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview shortcuts-menu\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[1;38;2;251;146;60m/\x1b[0m                 \x1b[38;2;140;140;140mOpen slash commands palette\x1b[0m')
                term.writeln('    \x1b[38;2;226;226;226m! <cmd>\x1b[0m           \x1b[38;2;140;140;140mExecute direct shell command\x1b[0m')
                term.writeln('    \x1b[38;2;226;226;226m@<file>\x1b[0m           \x1b[38;2;140;140;140mMention file path from workspace\x1b[0m')
                term.writeln('    \x1b[38;2;226;226;226mctrl+k\x1b[0m            \x1b[38;2;140;140;140mDelete from cursor to end of line\x1b[0m')
                term.writeln('    \x1b[38;2;226;226;226mctrl+c\x1b[0m            \x1b[38;2;140;140;140mCancel generation / exit\x1b[0m')
                term.writeln('    \x1b[38;2;92;92;92m↓ 6 more\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m↑/↓\x1b[0m \x1b[38;2;140;140;140mNavigate\x1b[0m · \x1b[38;2;251;146;60mesc\x1b[0m \x1b[38;2;140;140;140mClose\x1b[0m')
            } else if (mode === 'plan-approve-menu') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview plan-approve-menu\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m│ Plan: Migrate auth session token verification to ed25519 │\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m')
                term.writeln('  \x1b[1;38;2;251;146;60m[PLAN] Plan ready. Please select an action:\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[38;2;74;222;128m[y] Approve & Execute\x1b[0m')
                term.writeln('    \x1b[38;2;251;146;60m[r] Refine Plan\x1b[0m')
                term.writeln('    \x1b[38;2;251;146;60m[v] View Full Plan\x1b[0m')
                term.writeln('    \x1b[38;2;248;113;113m[n] Reject / Cancel\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60my\x1b[0m \x1b[38;2;140;140;140mApprove\x1b[0m · \x1b[38;2;251;146;60mr\x1b[0m \x1b[38;2;140;140;140mRefine\x1b[0m · \x1b[38;2;251;146;60mv\x1b[0m \x1b[38;2;140;140;140mView\x1b[0m · \x1b[38;2;251;146;60mn\x1b[0m \x1b[38;2;140;140;140mReject\x1b[0m')
            } else if (mode === 'input-bar') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview input-bar\x1b[0m')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;42;42;42m────────────────────────────────────────────────────────\x1b[0m')
                term.write('  \x1b[38;2;251;146;60m❭\x1b[0m ')
                const chunks = ['verify', ' jwt', ' claims', ' in', ' @src/auth/jwt.ts', ' and', ' add', ' tests']
                for (const c of chunks) {
                    if (c.startsWith('@')) {
                        term.write(`\x1b[38;2;251;146;60m${c}\x1b[0m `)
                    } else {
                        term.write(`\x1b[38;2;226;226;226m${c}\x1b[0m `)
                    }
                    await sleep(80)
                    if (isCancelled) return
                }
                term.write('\x1b[38;2;251;146;60m▌\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;42;42;42m────────────────────────────────────────────────────────\x1b[0m')
                term.writeln('  \x1b[38;2;140;140;140mgpt-4o (OpenAI) · 28k tokens\x1b[0m          \x1b[38;2;92;92;92m? for shortcuts\x1b[0m')
            } else if (mode === 'card') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview card\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;42;42;42m╭──────────────────────────────────────────────────────╮\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[1;38;2;226;226;226mSecurity Advisory\x1b[0m                                   \x1b[38;2;42;42;42m│\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;140;140;140mVulnerability CVE-2026-1184 in dependency tree\x1b[0m        \x1b[38;2;42;42;42m│\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m│\x1b[0m                                                      \x1b[38;2;42;42;42m│\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;248;113;113mSeverity: Critical · cvss 9.8\x1b[0m                       \x1b[38;2;42;42;42m│\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m│\x1b[0m                                                      \x1b[38;2;42;42;42m│\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;92;92;92mRun \'tui audit fix\' to apply patches\x1b[0m               \x1b[38;2;42;42;42m│\x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m╰──────────────────────────────────────────────────────╯\x1b[0m')
            } else if (mode === 'button') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview button\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[48;2;251;146;60m\x1b[1;38;2;20;20;20m Deploy \x1b[0m   \x1b[48;2;42;42;42m\x1b[38;2;226;226;226m Review \x1b[0m   \x1b[38;2;248;113;113m[ Rollback ]\x1b[0m   \x1b[38;2;92;92;92mCancel\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;92;92;92m(Use tab to switch focus, return to select)\x1b[0m')
            } else if (mode === 'tabs') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview tabs\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[48;2;251;146;60m\x1b[1;38;2;20;20;20m Overview \x1b[0m \x1b[38;2;140;140;140m Commits \x1b[0m \x1b[38;2;140;140;140m CI Checks \x1b[0m')
                term.writeln('  \x1b[38;2;42;42;42m────────────────────────────────────────────────────────\x1b[0m')
                await sleep(200)
                if (isCancelled) return
                term.writeln('  \x1b[1;38;2;226;226;226mBranch main is 2 commits ahead of origin.\x1b[0m')
                term.writeln('  \x1b[38;2;140;140;140mRemote tracked: origin/main\x1b[0m')
                term.writeln('  \x1b[38;2;74;222;128m✔ Working tree clean\x1b[0m')
            } else if (mode === 'dialog') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview dialog\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m┌────────────────────────────────────────────────────────┐\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m│\x1b[0m  \x1b[1;38;2;226;226;226mConfirm Overwrite\x1b[0m                                     \x1b[38;2;251;146;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m│\x1b[0m                                                        \x1b[38;2;251;146;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m│\x1b[0m  \x1b[38;2;140;140;140mpackages/database/schema.prisma has unstaged local\x1b[0m    \x1b[38;2;251;146;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m│\x1b[0m  \x1b[38;2;140;140;140medits. Overwrite with upstream template?\x1b[0m               \x1b[38;2;251;146;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m│\x1b[0m                                                        \x1b[38;2;251;146;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m│\x1b[0m  \x1b[48;2;251;146;60m\x1b[1;38;2;20;20;20m Overwrite \x1b[0m  \x1b[38;2;140;140;140mCancel (esc)\x1b[0m                           \x1b[38;2;251;146;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;251;146;60m└────────────────────────────────────────────────────────┘\x1b[0m')
            } else if (mode === 'progress') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview progress\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[1;38;2;226;226;226mIndexing codebase symbols...\x1b[0m')
                const steps = [15, 38, 68, 85, 100]
                for (const pct of steps) {
                    const filled = Math.round((pct / 100) * 30)
                    const empty = 30 - filled
                    const bar = '\x1b[38;2;251;146;60m' + '█'.repeat(filled) + '\x1b[0m' + '\x1b[38;2;50;50;50m' + '░'.repeat(empty) + '\x1b[0m'
                    term.write(`\r  [${bar}] \x1b[1;38;2;251;146;60m${pct}%\x1b[0m`)
                    await sleep(180)
                    if (isCancelled) return
                }
                term.writeln('')
                term.writeln('  \x1b[38;2;74;222;128m✔ Indexed 1,428 symbols in 480ms\x1b[0m')
            } else if (mode === 'checkbox') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview checkbox\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m[\x1b[1;38;2;74;222;128m✔\x1b[0m\x1b[38;2;251;146;60m]\x1b[0m \x1b[1;38;2;226;226;226mRun database migrations before tests\x1b[0m \x1b[38;2;251;146;60m◂ focused\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m[ ] Send anonymous usage telemetry\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m[✔] Enable strict runtime schema validation\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;92;92;92m(Press space or enter to toggle)\x1b[0m')
            } else if (mode === 'radio-group') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview radio-group\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60m(•)\x1b[0m \x1b[1;38;2;226;226;226mClaude 3.7 Sonnet\x1b[0m   \x1b[38;2;92;92;92mrecommended · hybrid reasoning\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m( )\x1b[0m \x1b[38;2;140;140;140mGPT-4o\x1b[0m              \x1b[38;2;92;92;92mfast tool calling & vision\x1b[0m')
                term.writeln('  \x1b[38;2;92;92;92m( )\x1b[0m \x1b[38;2;140;140;140mGemini 2.0 Flash\x1b[0m    \x1b[38;2;92;92;92multra-low latency & 1M context\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;92;92;92m(Use ↑/↓ arrows to change selection)\x1b[0m')
            } else if (mode === 'skeleton') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview skeleton\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;60;60;60m░░░░░░░░░░░░░░░░░░░░░░░░\x1b[0m')
                term.writeln('  \x1b[38;2;60;60;60m░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\x1b[0m')
                term.writeln('  \x1b[38;2;60;60;60m░░░░░░░░░░░░░░░░\x1b[0m')
            } else if (mode === 'toast') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview toast\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;74;222;128m✔\x1b[0m  \x1b[1;38;2;74;222;128mSuccess:\x1b[0m \x1b[38;2;226;226;226mBranch merged successfully to origin/main\x1b[0m')
                await sleep(400)
                if (isCancelled) return
                term.writeln('  \x1b[38;2;248;113;113m✖\x1b[0m  \x1b[1;38;2;248;113;113mError:\x1b[0m   \x1b[38;2;226;226;226mFailed to authenticate with private registry\x1b[0m')
            } else if (mode === 'table') {
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mtui preview table\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln('  \x1b[38;2;60;60;60m┌───────────────────┬──────────────┬──────────────┐\x1b[0m')
                term.writeln('  \x1b[38;2;60;60;60m│\x1b[0m \x1b[1;38;2;226;226;226mModel             \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m \x1b[1;38;2;226;226;226mContext      \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m \x1b[1;38;2;226;226;226mPricing      \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;60;60;60m├───────────────────┼──────────────┼──────────────┤\x1b[0m')
                term.writeln('  \x1b[38;2;60;60;60m│\x1b[0m \x1b[38;2;251;146;60mclaude-3-7-sonnet \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m 200k         \x1b[38;2;60;60;60m│\x1b[0m $3.00 / M    \x1b[38;2;60;60;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;60;60;60m│\x1b[0m \x1b[38;2;226;226;226mgpt-4o            \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m 128k         \x1b[38;2;60;60;60m│\x1b[0m $2.50 / M    \x1b[38;2;60;60;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;60;60;60m│\x1b[0m \x1b[38;2;226;226;226mgemini-2.0-flash  \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m 1M           \x1b[38;2;60;60;60m│\x1b[0m $0.10 / M    \x1b[38;2;60;60;60m│\x1b[0m')
                term.writeln('  \x1b[38;2;60;60;60m└───────────────────┴──────────────┴──────────────┘\x1b[0m')
            } else {
                // 'all' mode: Full agent session
                term.writeln('\x1b[38;2;251;146;60m❭\x1b[0m \x1b[1mdecember review packages/auth/src/jwt.ts\x1b[0m')
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln(
                    '\x1b[38;2;251;146;60m●\x1b[0m \x1b[1;38;2;226;226;226mReasoning\x1b[0m \x1b[38;2;92;92;92m(1.2s) [142 tokens]\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m\x1b[3mExamining JWT signature verification and session expiry checks...\x1b[0m'
                )
                await sleep(500)
                if (isCancelled) return

                term.writeln('')
                term.writeln(
                    '\x1b[38;2;74;222;128m✔\x1b[0m \x1b[1;38;2;251;146;60mread_file\x1b[0m \x1b[38;2;140;140;140mpackages/auth/src/jwt.ts\x1b[0m \x1b[38;2;92;92;92m0.1s\x1b[0m'
                )
                await sleep(400)
                if (isCancelled) return

                term.writeln('')
                term.writeln('\x1b[38;2;251;146;60m⌥ packages/auth/src/jwt.ts\x1b[0m')
                term.writeln(
                    '\x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m'
                )
                term.writeln(
                    '\x1b[38;2;140;140;140m│ @@ -14,6 +14,8 @@ export function verifyToken(token)      │\x1b[0m'
                )
                term.writeln(
                    '\x1b[48;2;63;19;22m\x1b[38;2;248;113;113m│ - const decoded = jwt.decode(token)                    │\x1b[0m'
                )
                term.writeln(
                    '\x1b[48;2;18;47;30m\x1b[38;2;74;222;128m│ + const decoded = jwt.verify(token, process.env.SECRET)│\x1b[0m'
                )
                term.writeln(
                    '\x1b[48;2;18;47;30m\x1b[38;2;74;222;128m│ + if (!decoded.exp || decoded.exp < Date.now()) return │\x1b[0m'
                )
                term.writeln(
                    '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m'
                )
                await sleep(400)
                if (isCancelled) return

                term.writeln('')
                const streamTokens = [
                    'Fixed', ' potential', ' timing', ' attack', ' and', ' missing',
                    ' signature', ' check', ' in', ' JWT', ' validation.\n'
                ]
                for (const token of streamTokens) {
                    term.write(token)
                    await sleep(35)
                    if (isCancelled) return
                }

                term.writeln('')
                term.writeln(
                    '\x1b[38;2;140;140;140mContext:\x1b[0m \x1b[38;2;251;146;60m━━━━━━\x1b[0m\x1b[38;2;92;92;92m──────────────\x1b[0m \x1b[1;38;2;251;146;60m28%\x1b[0m \x1b[38;2;92;92;92m(36.4k / 128k)\x1b[0m'
                )
            }
        }

        runSimulation()

        return () => {
            isCancelled = true
            resizeObserver.disconnect()
            term.dispose()
        }
    }, [mode, replayKey])

    return (
        <div className="w-full">
            <div ref={containerRef} className="h-64 sm:h-72 w-full" />
        </div>
    )
}
