'use client'

import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import React, { useEffect, useRef } from 'react'

import {
    getPrompt,
    executeCommand,
    autocomplete,
    createSelectMenuState,
    handleSelectMenuKey,
    renderSelectMenu,
    createSwitchState,
    handleSwitchKey,
    renderSwitch,
    createTabsState,
    handleTabsKey,
    renderTabs,
    createCheckboxState,
    handleCheckboxKey,
    renderCheckbox,
    createPlanApproveState,
    handlePlanApproveKey,
    renderPlanApprove,
    createInputBarState,
    handleInputBarKey,
    renderInputBar,
} from './terminal-shell'

export interface TerminalInnerProps {
    mode?: string
    lines?: string[]
    promptCmd?: string
    replayKey?: number
    heightClass?: string
    interactive?: boolean
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function TerminalInner({
    mode = 'all',
    lines,
    promptCmd,
    replayKey = 0,
    heightClass = 'h-64 sm:h-72',
    interactive = true,
}: TerminalInnerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const termRef = useRef<Terminal | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

        const term = new Terminal({
            theme: {
                background: '#0a0a0a',
                foreground: '#e2e2e2',
                cursor: '#ffffff',
                cursorAccent: '#0a0a0a',
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
            fontSize: isMobile ? 12 : 13.5,
            lineHeight: 1.45,
            cursorBlink: true,
            convertEol: true,
            disableStdin: !interactive,
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
        let currentLine = ''
        let cwd = '~/code/tui'
        const history: string[] = []
        let historyIndex = -1
        let shellActive = false

        type InteractiveComponentState =
            | { type: 'select-menu'; state: any; lineCount: number }
            | { type: 'switch'; state: any; lineCount: number }
            | { type: 'tabs'; state: any; lineCount: number }
            | { type: 'checkbox'; state: any; lineCount: number }
            | { type: 'plan-approve'; state: any; lineCount: number }
            | { type: 'input-bar'; state: any; lineCount: number }

        let interactiveState: InteractiveComponentState | null = null

        function renderInteractive(isUpdate = false) {
            if (!interactiveState) return
            let renderedLines: string[] = []
            let hint = ''

            switch (interactiveState.type) {
                case 'select-menu':
                    renderedLines = renderSelectMenu(interactiveState.state)
                    hint =
                        '  \x1b[38;2;102;102;102m[↑/↓ to navigate, Enter to select, q to exit to shell]\x1b[0m'
                    break
                case 'switch':
                    renderedLines = renderSwitch(interactiveState.state)
                    hint = '  \x1b[38;2;102;102;102m[Space to toggle, q to exit to shell]\x1b[0m'
                    break
                case 'tabs':
                    renderedLines = renderTabs(interactiveState.state)
                    hint =
                        '  \x1b[38;2;102;102;102m[Tab or ←/→ to switch, q to exit to shell]\x1b[0m'
                    break
                case 'checkbox':
                    renderedLines = renderCheckbox(interactiveState.state)
                    hint =
                        '  \x1b[38;2;102;102;102m[↑/↓ to navigate, Space to check, q to exit to shell]\x1b[0m'
                    break
                case 'plan-approve':
                    renderedLines = renderPlanApprove(interactiveState.state)
                    hint =
                        '  \x1b[38;2;102;102;102m[←/→ to toggle, Enter to confirm, q to exit to shell]\x1b[0m'
                    break
                case 'input-bar':
                    renderedLines = renderInputBar(interactiveState.state)
                    hint =
                        '  \x1b[38;2;102;102;102m[Type prompt and press Enter, q to exit to shell]\x1b[0m'
                    break
            }

            const total = [...renderedLines, hint]

            if (isUpdate && interactiveState.lineCount > 0) {
                term.write(`\x1b[${interactiveState.lineCount}A\r`)
            }

            for (const l of total) {
                term.write(`\x1b[2K${l}\r\n`)
            }

            interactiveState.lineCount = total.length
        }

        function startComponentMode(targetMode: string): boolean {
            if (
                targetMode === 'select-menu' ||
                targetMode === 'command-menu' ||
                targetMode === 'shortcuts-menu' ||
                targetMode === 'select-models' ||
                targetMode === 'select-branches'
            ) {
                let items: { label: string; value: string; hint?: string }[] | undefined
                if (targetMode === 'shortcuts-menu') {
                    items = [
                        { label: 'ctrl+c  Kill active task', value: 'kill' },
                        { label: 'ctrl+b  Background task', value: 'background' },
                        { label: 'ctrl+o  Toggle diff fold', value: 'diff' },
                        { label: '?       Show shortcuts', value: 'help' },
                    ]
                } else if (targetMode === 'select-models') {
                    items = [
                        { label: 'gemini-2.5-pro', value: 'gemini-2.5-pro', hint: '(recommended)' },
                        {
                            label: 'claude-3.7-sonnet',
                            value: 'claude-3.7-sonnet',
                            hint: '(hybrid reasoning)',
                        },
                        { label: 'gpt-4o', value: 'gpt-4o', hint: '(multimodal)' },
                        { label: 'deepseek-r1', value: 'deepseek-r1', hint: '(distilled math)' },
                    ]
                } else if (targetMode === 'select-branches') {
                    items = [
                        { label: 'main', value: 'main', hint: '(default branch)' },
                        { label: 'feature/auth', value: 'feature/auth', hint: '(2 commits ahead)' },
                        { label: 'fix/stream-overflow', value: 'fix/stream-overflow' },
                        { label: 'chore/deps', value: 'chore/deps' },
                    ]
                }
                interactiveState = {
                    type: 'select-menu',
                    state: createSelectMenuState(items),
                    lineCount: 0,
                }
                shellActive = false
                renderInteractive(false)
                return true
            }
            if (
                targetMode === 'switch' ||
                targetMode === 'glyph-toggle' ||
                targetMode === 'badge-variant'
            ) {
                const isBadge = targetMode === 'badge-variant'
                const label = isBadge ? 'Stream reasoning' : 'Auto-run tools'
                interactiveState = {
                    type: 'switch',
                    state: createSwitchState({
                        label,
                        checked: true,
                        variant: isBadge ? 'badge' : 'glyph',
                    }),
                    lineCount: 0,
                }
                shellActive = false
                renderInteractive(false)
                return true
            }
            if (
                targetMode === 'tabs' ||
                targetMode === 'tabs-default' ||
                targetMode === 'tabs-pill'
            ) {
                const tabs =
                    targetMode === 'tabs-pill'
                        ? ['Unified', 'Split', 'Tree']
                        : ['Overview', 'Changes', 'Terminal', 'Metrics']
                interactiveState = {
                    type: 'tabs',
                    state: createTabsState(tabs),
                    lineCount: 0,
                }
                shellActive = false
                renderInteractive(false)
                return true
            }
            if (
                targetMode === 'checkbox' ||
                targetMode === 'radio-group' ||
                targetMode === 'checkbox-default' ||
                targetMode === 'checkbox-minimal'
            ) {
                const items =
                    targetMode === 'checkbox-minimal'
                        ? [
                              { label: 'Dry run mode', checked: true },
                              { label: 'Verbose ANSI logging', checked: false },
                              { label: 'Send telemetry diagnostics', checked: false },
                          ]
                        : [
                              { label: 'Include unit tests', checked: true },
                              { label: 'Auto-format before commit', checked: true },
                              { label: 'Generate changelog entry', checked: false },
                          ]
                interactiveState = {
                    type: 'checkbox',
                    state: createCheckboxState(items),
                    lineCount: 0,
                }
                shellActive = false
                renderInteractive(false)
                return true
            }
            if (
                targetMode === 'dialog' ||
                targetMode === 'plan-approve-menu' ||
                targetMode === 'plan-auto' ||
                targetMode === 'plan-custom'
            ) {
                interactiveState = {
                    type: 'plan-approve',
                    state: createPlanApproveState(),
                    lineCount: 0,
                }
                shellActive = false
                renderInteractive(false)
                return true
            }
            if (
                targetMode === 'input-bar' ||
                targetMode === 'input-command' ||
                targetMode === 'input-multiline'
            ) {
                interactiveState = {
                    type: 'input-bar',
                    state: createInputBarState(
                        targetMode === 'input-command'
                            ? 'git commit -m "fix: resolve token stream issue"'
                            : ''
                    ),
                    lineCount: 0,
                }
                shellActive = false
                renderInteractive(false)
                return true
            }
            return false
        }

        async function runSpecificSimulation(targetMode: string) {
            if (targetMode === 'diff-viewer') {
                term.writeln(
                    '\x1b[38;2;251;146;60m⌥\x1b[0m \x1b[1;38;2;226;226;226mpackages/auth/src/jwt.ts\x1b[0m'
                )
                term.writeln(
                    '\x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m'
                )
                term.writeln(
                    '\x1b[38;2;140;140;140m│ @@ -14,6 +14,8 @@ export function verifyToken(token)      │\x1b[0m'
                )
                await sleep(150)
                if (isCancelled) return

                term.writeln(
                    '\x1b[48;2;63;19;22m\x1b[38;2;248;113;113m│ - const decoded = jwt.decode(token)                    │\x1b[0m'
                )
                await sleep(200)
                if (isCancelled) return

                term.writeln(
                    '\x1b[48;2;18;47;30m\x1b[38;2;74;222;128m│ + const decoded = jwt.verify(token, process.env.SECRET)│\x1b[0m'
                )
                await sleep(150)
                if (isCancelled) return

                term.writeln(
                    '\x1b[48;2;18;47;30m\x1b[38;2;74;222;128m│ + if (!decoded.exp || decoded.exp < Date.now()) return │\x1b[0m'
                )
                term.writeln(
                    '\x1b[38;2;140;140;140m│   return decoded                                       │\x1b[0m'
                )
                term.writeln(
                    '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m'
                )
                term.writeln('\x1b[38;2;92;92;92m  ... (12 more lines in diff chunk)\x1b[0m')
            } else if (targetMode === 'streaming-text') {
                const tokens = [
                    'The',
                    ' security',
                    ' vulnerability',
                    ' in',
                    ' `packages/auth/src/jwt.ts`',
                    ' stemmed',
                    ' from',
                    ' using',
                    ' unverified',
                    ' token',
                    ' payload',
                    ' decoding.',
                    '\n\n',
                    'By',
                    ' migrating',
                    ' to',
                    ' strict',
                    ' cryptographic',
                    ' verification',
                    ' with',
                    ' expiry',
                    ' validation,',
                    ' replay',
                    ' and',
                    ' forgery',
                    ' attacks',
                    ' are',
                    ' eliminated.\n',
                ]

                for (const tok of tokens) {
                    term.write(tok)
                    await sleep(40)
                    if (isCancelled) return
                }

                term.write('\x1b[38;2;251;146;60m ▌\x1b[0m')
            } else if (targetMode === 'collapsible-reasoning') {
                term.writeln(
                    '\x1b[38;2;251;146;60m⠋\x1b[0m \x1b[1;38;2;140;140;140mThinking...\x1b[0m \x1b[38;2;92;92;92m(analyzing ast)\x1b[0m'
                )
                await sleep(600)
                if (isCancelled) return

                term.write('\x1b[1A\x1b[2K')
                term.writeln(
                    '\x1b[38;2;140;140;140m▸\x1b[0m \x1b[1;38;2;226;226;226mReasoning\x1b[0m \x1b[38;2;92;92;92m(1.2s) [142 tokens]\x1b[0m'
                )
                await sleep(700)
                if (isCancelled) return

                term.write('\x1b[1A\x1b[2K')
                term.writeln(
                    '\x1b[38;2;251;146;60m▾\x1b[0m \x1b[1;38;2;226;226;226mReasoning\x1b[0m \x1b[38;2;92;92;92m(1.2s) [142 tokens]\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m\x1b[3m1. locate verifySessionToken function in jwt.ts\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m\x1b[3m2. verify signature against process.env.SECRET\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m\x1b[3m3. enforce expiration timestamp check before returning session\x1b[0m'
                )
            } else if (targetMode === 'tool-call-card') {
                term.writeln(
                    '\x1b[38;2;251;191;36m⠋\x1b[0m \x1b[1;38;2;251;146;60mbun test\x1b[0m \x1b[38;2;140;140;140mauth.test.ts\x1b[0m \x1b[38;2;92;92;92mrunning...\x1b[0m'
                )
                await sleep(700)
                if (isCancelled) return

                term.write('\x1b[1A\x1b[2K')
                term.writeln(
                    '\x1b[38;2;74;222;128m✔\x1b[0m \x1b[1;38;2;251;146;60mbun test\x1b[0m \x1b[38;2;140;140;140mauth.test.ts\x1b[0m \x1b[38;2;92;92;92m0.8s\x1b[0m \x1b[38;2;92;92;92m▾\x1b[0m'
                )
                term.writeln(
                    '\x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m'
                )
                term.writeln(
                    '\x1b[38;2;74;222;128m│ ✓ jwt.test.ts (4 passed)\x1b[0m                               │'
                )
                term.writeln(
                    '\x1b[38;2;74;222;128m│ ✓ session.test.ts (2 passed)\x1b[0m                           │'
                )
                term.writeln(
                    '\x1b[38;2;140;140;140m│ 6 pass · 0 fail · 26 expect() calls [28ms]             │\x1b[0m'
                )
                term.writeln(
                    '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m'
                )
            } else if (targetMode === 'token-gauge') {
                term.writeln('\x1b[38;2;140;140;140mNominal context:\x1b[0m')
                term.writeln(
                    '\x1b[38;2;140;140;140mContext:\x1b[0m \x1b[38;2;251;146;60m━━━━━━\x1b[0m\x1b[38;2;92;92;92m──────────────\x1b[0m \x1b[1;38;2;251;146;60m28%\x1b[0m \x1b[38;2;92;92;92m(36.4k / 128k)\x1b[0m'
                )
                await sleep(400)
                if (isCancelled) return

                term.writeln('')
                term.writeln('\x1b[38;2;140;140;140mWarning threshold:\x1b[0m')
                term.writeln(
                    '\x1b[38;2;251;191;36m━━━━━━━━━━━━━━──────\x1b[0m \x1b[1;38;2;251;191;36m72%\x1b[0m \x1b[38;2;92;92;92m(92.1k / 128k)\x1b[0m'
                )
                await sleep(400)
                if (isCancelled) return

                term.writeln('')
                term.writeln('\x1b[38;2;140;140;140mCritical context:\x1b[0m')
                term.writeln(
                    '\x1b[38;2;248;113;113m━━━━━━━━━━━━━━━━━━━─\x1b[0m \x1b[1;38;2;248;113;113m96%\x1b[0m \x1b[38;2;92;92;92m(122.8k / 128k)\x1b[0m \x1b[48;2;63;19;22m\x1b[38;2;248;113;113m[flush needed]\x1b[0m'
                )
            } else if (targetMode === 'pill') {
                term.writeln(
                    '  \x1b[48;2;42;42;42m\x1b[38;2;251;146;60m PR #42 \x1b[0m  \x1b[48;2;18;47;30m\x1b[38;2;74;222;128m approved \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;140;140;140m typescript \x1b[0m'
                )
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.writeln(
                    '  \x1b[48;2;63;19;22m\x1b[38;2;248;113;113m blocked \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;251;191;36m needs-review \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;92;92;92m v0.3.0 \x1b[0m'
                )
            } else if (targetMode === 'spinner') {
                term.writeln('')
                const dotCount = 5
                const totalCycle = dotCount + 2
                for (let i = 0; i < 18; i++) {
                    const head = i % totalCycle
                    let dots = ''
                    for (let c = 0; c < dotCount; c++) {
                        const d = (head - c + totalCycle) % totalCycle
                        if (d === 0) {
                            dots += '\x1b[38;2;251;146;60m●\x1b[0m'
                        } else if (d === 1) {
                            dots += '\x1b[38;2;160;160;160m●\x1b[0m'
                        } else {
                            dots += '\x1b[38;2;60;60;60m·\x1b[0m'
                        }
                        if (c < dotCount - 1) dots += ' '
                    }
                    term.write(
                        `\r  ${dots}  \x1b[38;2;140;140;140manalyzing workspace dependencies...\x1b[0m`
                    )
                    await sleep(85)
                    if (isCancelled) return
                }
                term.write('\r\x1b[2K')
                term.writeln(
                    '  \x1b[38;2;74;222;128m✔\x1b[0m \x1b[38;2;226;226;226mdependencies verified (0 vulnerabilities found)\x1b[0m'
                )
            } else if (targetMode === 'text-area') {
                term.write('  \x1b[38;2;251;146;60m❭\x1b[0m ')
                const inputScript = [
                    '/model',
                    ' gpt-4o',
                    ' inspect',
                    ' ',
                    '@packages/auth/jwt.ts',
                    ' for',
                    ' token',
                    ' replay',
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
                term.writeln(
                    '\x1b[38;2;92;92;92m  [Enter] send   [Ctrl+K] clear   [@] mention file   [/] commands\x1b[0m'
                )
            } else if (targetMode === 'header') {
                term.writeln(
                    '  \x1b[1;38;2;251;146;60m✱\x1b[0m \x1b[1;38;2;226;226;226mAgent CLI 0.3.0\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;140;140;140m~/code/december \x1b[38;2;92;92;92m(main)\x1b[0m'
                )
                term.writeln('')
                term.writeln('  \x1b[38;2;251;146;60mTips for getting started\x1b[0m')
                term.writeln(
                    '  \x1b[38;2;140;140;140mRun /init to scaffold workspace config and rules\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;140;140;140mType / to explore available commands and shortcuts\x1b[0m'
                )
            } else if (targetMode === 'mermaid') {
                term.writeln(
                    '  \x1b[38;2;226;226;226m❖ Mermaid Diagram (flowchart)\x1b[0m \x1b[38;2;92;92;92m(ctrl+o for code)\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m┌───────────────┐\x1b[0m       \x1b[38;2;42;42;42m┌───────────────┐\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m│\x1b[0m \x1b[38;2;226;226;226mClient (CLI)\x1b[0m  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;251;146;60m──►\x1b[0m  \x1b[38;2;42;42;42m│\x1b[0m \x1b[38;2;226;226;226mProxy Gateway\x1b[0m \x1b[38;2;42;42;42m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m└───────────────┘\x1b[0m       \x1b[38;2;42;42;42m└───────────────┘\x1b[0m'
                )
                term.writeln('                                  \x1b[38;2;251;146;60m│\x1b[0m')
                term.writeln('                                  \x1b[38;2;251;146;60m▼\x1b[0m')
                term.writeln(
                    '                          \x1b[38;2;42;42;42m┌───────────────┐\x1b[0m'
                )
                term.writeln(
                    '                          \x1b[38;2;42;42;42m│\x1b[0m \x1b[38;2;226;226;226mLLM Provider\x1b[0m  \x1b[38;2;42;42;42m│\x1b[0m'
                )
                term.writeln(
                    '                          \x1b[38;2;42;42;42m└───────────────┘\x1b[0m'
                )
            } else if (targetMode === 'markdown') {
                term.writeln('  \x1b[1;38;2;226;226;226m# API Specification\x1b[0m')
                term.writeln(
                    '  The endpoint supports \x1b[48;2;42;42;42m\x1b[38;2;251;146;60m bearer \x1b[0m token authentication.'
                )
                term.writeln('')
                term.writeln(
                    '  \x1b[38;2;92;92;92m┌───────────────┬────────┬─────────────────────────┐\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m│\x1b[0m \x1b[1;38;2;226;226;226mRoute        \x1b[0m \x1b[38;2;92;92;92m│\x1b[0m \x1b[1;38;2;226;226;226mMethod \x1b[0m \x1b[38;2;92;92;92m│\x1b[0m \x1b[1;38;2;226;226;226mDescription               \x1b[0m\x1b[38;2;92;92;92m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m├───────────────┼────────┼─────────────────────────┤\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m│\x1b[0m /v1/chat       \x1b[38;2;92;92;92m│\x1b[0m POST   \x1b[38;2;92;92;92m│\x1b[0m streaming completion    \x1b[38;2;92;92;92m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m│\x1b[0m /v1/models     \x1b[38;2;92;92;92m│\x1b[0m GET    \x1b[38;2;92;92;92m│\x1b[0m list available engines   \x1b[38;2;92;92;92m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m└───────────────┴────────┴─────────────────────────┘\x1b[0m'
                )
            } else if (targetMode === 'user-message') {
                term.writeln(
                    '  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[38;2;251;146;60mcheck security and token expiration in auth.ts\x1b[0m'
                )
                await sleep(400)
                if (isCancelled) return

                term.writeln('')
                term.writeln(
                    '  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[38;2;251;146;60m/grill-me verify all error conditions\x1b[0m'
                )
            } else if (targetMode === 'error-message') {
                term.writeln(
                    '  \x1b[1;38;2;248;113;113mRate limit or quota exhausted from LLM provider.\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;140;140;140mPlease upgrade your API key tier at \x1b[38;2;251;146;60mhttps://platform.openai.com/limits\x1b[0m'
                )
            } else if (targetMode === 'select-menu') {
                term.writeln('  \x1b[1;38;2;226;226;226mSelect active model engine:\x1b[0m')
                term.writeln('    \x1b[38;2;140;140;140mclaude-3-7-sonnet (Anthropic)\x1b[0m')
                term.writeln(
                    '  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[1;38;2;251;146;60mgpt-4o\x1b[0m \x1b[38;2;74;222;128m(Active)\x1b[0m \x1b[38;2;140;140;140m(OpenAI)\x1b[0m'
                )
                term.writeln('    \x1b[38;2;140;140;140mdeepseek-r1 (DeepSeek)\x1b[0m')
                term.writeln('    \x1b[38;2;140;140;140mgemini-2.5-flash (Google)\x1b[0m')
                term.writeln('')
                term.writeln(
                    '  \x1b[38;2;251;146;60m↑/↓\x1b[0m \x1b[38;2;140;140;140mNavigate\x1b[0m · \x1b[38;2;251;146;60menter\x1b[0m \x1b[38;2;140;140;140mSelect\x1b[0m · \x1b[38;2;251;146;60mesc\x1b[0m \x1b[38;2;140;140;140mCancel\x1b[0m'
                )
            } else if (targetMode === 'command-menu') {
                term.writeln(
                    '  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[1;38;2;251;146;60m/model\x1b[0m               \x1b[38;2;140;140;140mSwitch active LLM model engine\x1b[0m'
                )
                term.writeln(
                    '    \x1b[38;2;226;226;226m/plan\x1b[0m                \x1b[38;2;140;140;140mCreate an execution plan before running\x1b[0m'
                )
                term.writeln(
                    '    \x1b[38;2;226;226;226m/review\x1b[0m              \x1b[38;2;140;140;140mReview changes and git working diff\x1b[0m'
                )
                term.writeln(
                    '    \x1b[38;2;226;226;226m/skills\x1b[0m              \x1b[38;2;140;140;140mList available agent skills and tools\x1b[0m'
                )
                term.writeln('    \x1b[38;2;92;92;92m↓ 4 more\x1b[0m')
                term.writeln('')
                term.writeln(
                    '  \x1b[38;2;251;146;60m↑/↓\x1b[0m \x1b[38;2;140;140;140mNavigate\x1b[0m · \x1b[38;2;251;146;60menter\x1b[0m \x1b[38;2;140;140;140mSelect\x1b[0m · \x1b[38;2;251;146;60mtab\x1b[0m \x1b[38;2;140;140;140mComplete\x1b[0m · \x1b[38;2;251;146;60mesc\x1b[0m \x1b[38;2;140;140;140mCancel\x1b[0m'
                )
            } else if (targetMode === 'shortcuts-menu') {
                term.writeln(
                    '  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[1;38;2;251;146;60m/\x1b[0m                 \x1b[38;2;140;140;140mOpen slash commands palette\x1b[0m'
                )
                term.writeln(
                    '    \x1b[38;2;226;226;226m! <cmd>\x1b[0m           \x1b[38;2;140;140;140mExecute direct shell command\x1b[0m'
                )
                term.writeln(
                    '    \x1b[38;2;226;226;226m@<file>\x1b[0m           \x1b[38;2;140;140;140mMention file path from workspace\x1b[0m'
                )
                term.writeln(
                    '    \x1b[38;2;226;226;226mctrl+k\x1b[0m            \x1b[38;2;140;140;140mDelete from cursor to end of line\x1b[0m'
                )
                term.writeln(
                    '    \x1b[38;2;226;226;226mctrl+c\x1b[0m            \x1b[38;2;140;140;140mCancel generation / exit\x1b[0m'
                )
                term.writeln('    \x1b[38;2;92;92;92m↓ 6 more\x1b[0m')
                term.writeln('')
                term.writeln(
                    '  \x1b[38;2;251;146;60m↑/↓\x1b[0m \x1b[38;2;140;140;140mNavigate\x1b[0m · \x1b[38;2;251;146;60mesc\x1b[0m \x1b[38;2;140;140;140mClose\x1b[0m'
                )
            } else if (targetMode === 'plan-approve-menu') {
                term.writeln(
                    '  \x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;251;146;60m│ Plan: Migrate auth session token verification to ed25519 │\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m'
                )
                term.writeln(
                    '  \x1b[1;38;2;251;146;60m[PLAN] Plan ready. Please select an action:\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;251;146;60m❭\x1b[0m \x1b[38;2;74;222;128m[y] Approve & Execute\x1b[0m'
                )
                term.writeln('    \x1b[38;2;251;146;60m[r] Refine Plan\x1b[0m')
                term.writeln('    \x1b[38;2;251;146;60m[v] View Full Plan\x1b[0m')
                term.writeln('    \x1b[38;2;248;113;113m[n] Reject / Cancel\x1b[0m')
                term.writeln('')
                term.writeln(
                    '  \x1b[38;2;251;146;60my\x1b[0m \x1b[38;2;140;140;140mApprove\x1b[0m · \x1b[38;2;251;146;60mr\x1b[0m \x1b[38;2;140;140;140mRefine\x1b[0m · \x1b[38;2;251;146;60mv\x1b[0m \x1b[38;2;140;140;140mView\x1b[0m · \x1b[38;2;251;146;60mn\x1b[0m \x1b[38;2;140;140;140mReject\x1b[0m'
                )
            } else if (targetMode === 'input-bar') {
                term.writeln(
                    '  \x1b[38;2;42;42;42m────────────────────────────────────────────────────────\x1b[0m'
                )
                term.write('  \x1b[38;2;251;146;60m❭\x1b[0m ')
                const chunks = [
                    'verify',
                    ' jwt',
                    ' claims',
                    ' in',
                    ' @src/auth/jwt.ts',
                    ' and',
                    ' add',
                    ' tests',
                ]
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
                term.writeln(
                    '  \x1b[38;2;42;42;42m────────────────────────────────────────────────────────\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;140;140;140mgpt-4o (OpenAI) · 28k tokens\x1b[0m          \x1b[38;2;92;92;92m? for shortcuts\x1b[0m'
                )
            } else if (targetMode === 'card') {
                term.writeln(
                    '  \x1b[38;2;42;42;42m╭──────────────────────────────────────────────────────╮\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[1;38;2;226;226;226mSecurity Advisory\x1b[0m                                   \x1b[38;2;42;42;42m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;140;140;140mVulnerability CVE-2026-1184 in dependency tree\x1b[0m        \x1b[38;2;42;42;42m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m│\x1b[0m                                                      \x1b[38;2;42;42;42m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;248;113;113mSeverity: Critical · cvss 9.8\x1b[0m                       \x1b[38;2;42;42;42m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m│\x1b[0m                                                      \x1b[38;2;42;42;42m│\x1b[0m'
                )
                term.writeln(
                    "  \x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;92;92;92mRun 'tui audit fix' to apply patches\x1b[0m               \x1b[38;2;42;42;42m│\x1b[0m"
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m╰──────────────────────────────────────────────────────╯\x1b[0m'
                )
            } else if (targetMode === 'button') {
                term.writeln(
                    '  \x1b[48;2;251;146;60m\x1b[1;38;2;20;20;20m Deploy \x1b[0m   \x1b[48;2;42;42;42m\x1b[38;2;226;226;226m Review \x1b[0m   \x1b[38;2;248;113;113m[ Rollback ]\x1b[0m   \x1b[38;2;92;92;92mCancel\x1b[0m'
                )
                term.writeln('')
                term.writeln(
                    '  \x1b[38;2;92;92;92m(Use tab to switch focus, return to select)\x1b[0m'
                )
            } else if (targetMode === 'tabs') {
                term.writeln(
                    '  \x1b[48;2;251;146;60m\x1b[1;38;2;20;20;20m Overview \x1b[0m \x1b[38;2;140;140;140m Commits \x1b[0m \x1b[38;2;140;140;140m CI Checks \x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;42;42;42m────────────────────────────────────────────────────────\x1b[0m'
                )
                await sleep(200)
                if (isCancelled) return
                term.writeln(
                    '  \x1b[1;38;2;226;226;226mBranch main is 2 commits ahead of origin.\x1b[0m'
                )
                term.writeln('  \x1b[38;2;140;140;140mRemote tracked: origin/main\x1b[0m')
                term.writeln('  \x1b[38;2;74;222;128m✔ Working tree clean\x1b[0m')
            } else if (targetMode === 'dialog') {
                term.writeln(
                    '  \x1b[38;2;251;146;60m┌────────────────────────────────────────────────────────┐\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;251;146;60m│\x1b[0m  \x1b[1;38;2;226;226;226mConfirm Overwrite\x1b[0m                                     \x1b[38;2;251;146;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;251;146;60m│\x1b[0m                                                        \x1b[38;2;251;146;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;251;146;60m│\x1b[0m  \x1b[38;2;140;140;140mpackages/database/schema.prisma has unstaged local\x1b[0m    \x1b[38;2;251;146;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;251;146;60m│\x1b[0m  \x1b[38;2;140;140;140medits. Overwrite with upstream template?\x1b[0m               \x1b[38;2;251;146;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;251;146;60m│\x1b[0m                                                        \x1b[38;2;251;146;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;251;146;60m│\x1b[0m  \x1b[48;2;251;146;60m\x1b[1;38;2;20;20;20m Overwrite \x1b[0m  \x1b[38;2;140;140;140mCancel (esc)\x1b[0m                           \x1b[38;2;251;146;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;251;146;60m└────────────────────────────────────────────────────────┘\x1b[0m'
                )
            } else if (targetMode === 'progress') {
                term.writeln('  \x1b[1;38;2;226;226;226mIndexing codebase symbols...\x1b[0m')
                const steps = [15, 38, 68, 85, 100]
                for (const pct of steps) {
                    const filled = Math.round((pct / 100) * 30)
                    const empty = 30 - filled
                    const bar =
                        '\x1b[38;2;251;146;60m' +
                        '█'.repeat(filled) +
                        '\x1b[0m' +
                        '\x1b[38;2;50;50;50m' +
                        '░'.repeat(empty) +
                        '\x1b[0m'
                    term.write(`\r  [${bar}] \x1b[1;38;2;251;146;60m${pct}%\x1b[0m`)
                    await sleep(180)
                    if (isCancelled) return
                }
                term.writeln('')
                term.writeln('  \x1b[38;2;74;222;128m✔ Indexed 1,428 symbols in 480ms\x1b[0m')
            } else if (targetMode === 'checkbox') {
                term.writeln(
                    '  \x1b[38;2;251;146;60m[\x1b[1;38;2;74;222;128m✔\x1b[0m\x1b[38;2;251;146;60m]\x1b[0m \x1b[1;38;2;226;226;226mRun database migrations before tests\x1b[0m \x1b[38;2;251;146;60m◂ focused\x1b[0m'
                )
                term.writeln('  \x1b[38;2;92;92;92m[ ] Send anonymous usage telemetry\x1b[0m')
                term.writeln(
                    '  \x1b[38;2;92;92;92m[✔] Enable strict runtime schema validation\x1b[0m'
                )
                term.writeln('')
                term.writeln('  \x1b[38;2;92;92;92m(Press space or enter to toggle)\x1b[0m')
            } else if (targetMode === 'radio-group') {
                term.writeln(
                    '  \x1b[38;2;251;146;60m(•)\x1b[0m \x1b[1;38;2;226;226;226mClaude 3.7 Sonnet\x1b[0m   \x1b[38;2;92;92;92mrecommended · hybrid reasoning\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m( )\x1b[0m \x1b[38;2;140;140;140mGPT-4o\x1b[0m              \x1b[38;2;92;92;92mfast tool calling & vision\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;92;92;92m( )\x1b[0m \x1b[38;2;140;140;140mGemini 2.0 Flash\x1b[0m    \x1b[38;2;92;92;92multra-low latency & 1M context\x1b[0m'
                )
                term.writeln('')
                term.writeln('  \x1b[38;2;92;92;92m(Use ↑/↓ arrows to change selection)\x1b[0m')
            } else if (targetMode === 'skeleton') {
                term.writeln('  \x1b[38;2;60;60;60m░░░░░░░░░░░░░░░░░░░░░░░░\x1b[0m')
                term.writeln(
                    '  \x1b[38;2;60;60;60m░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\x1b[0m'
                )
                term.writeln('  \x1b[38;2;60;60;60m░░░░░░░░░░░░░░░░\x1b[0m')
            } else if (targetMode === 'toast') {
                term.writeln(
                    '  \x1b[38;2;74;222;128m✔\x1b[0m  \x1b[1;38;2;74;222;128mSuccess:\x1b[0m \x1b[38;2;226;226;226mBranch merged successfully to origin/main\x1b[0m'
                )
                await sleep(400)
                if (isCancelled) return
                term.writeln(
                    '  \x1b[38;2;248;113;113m✖\x1b[0m  \x1b[1;38;2;248;113;113mError:\x1b[0m   \x1b[38;2;226;226;226mFailed to authenticate with private registry\x1b[0m'
                )
            } else if (targetMode === 'table') {
                term.writeln(
                    '  \x1b[38;2;60;60;60m┌───────────────────┬──────────────┬──────────────┐\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;60;60;60m│\x1b[0m \x1b[1;38;2;226;226;226mModel             \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m \x1b[1;38;2;226;226;226mContext      \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m \x1b[1;38;2;226;226;226mPricing      \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;60;60;60m├───────────────────┼──────────────┼──────────────┤\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;60;60;60m│\x1b[0m \x1b[38;2;251;146;60mclaude-3-7-sonnet \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m 200k         \x1b[38;2;60;60;60m│\x1b[0m $3.00 / M    \x1b[38;2;60;60;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;60;60;60m│\x1b[0m \x1b[38;2;226;226;226mgpt-4o            \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m 128k         \x1b[38;2;60;60;60m│\x1b[0m $2.50 / M    \x1b[38;2;60;60;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;60;60;60m│\x1b[0m \x1b[38;2;226;226;226mgemini-2.0-flash  \x1b[0m\x1b[38;2;60;60;60m│\x1b[0m 1M           \x1b[38;2;60;60;60m│\x1b[0m $0.10 / M    \x1b[38;2;60;60;60m│\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;60;60;60m└───────────────────┴──────────────┴──────────────┘\x1b[0m'
                )
            } else if (targetMode === 'switch') {
                term.writeln(
                    '  \x1b[38;2;110;231;183m\x1b[1m(─●)\x1b[0m \x1b[1mAuto-run tool calls\x1b[0m   \x1b[38;2;102;102;102m(immediate execution)\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;102;102;102m(●─)\x1b[0m \x1b[38;2;170;170;170mRequire confirmation for bash commands\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;110;231;183m\x1b[1m[ ON ]\x1b[0m  \x1b[1mStreaming reasoning\x1b[0m'
                )
                term.writeln('')
                term.writeln(
                    '  \x1b[38;2;92;92;92m(Press space/return to toggle, ← / → to switch state)\x1b[0m'
                )
            } else if (targetMode === 'december') {
                // December terminal agent session
                term.writeln('  \x1b[1;38;2;255;255;255m✱ December CLI 0.3.28\x1b[0m')
                term.writeln('  \x1b[38;2;170;170;170m~/code/december (main)\x1b[0m')
                term.writeln('')
                term.writeln('  \x1b[38;2;137;180;248mTips for getting started\x1b[0m')
                term.writeln(
                    '  \x1b[38;2;170;170;170mRun /init to scaffold .december workspace for custom rules and skills\x1b[0m'
                )
                term.writeln(
                    '  \x1b[38;2;170;170;170mUse /handoff to continue this session in December (trydecember.com)\x1b[0m'
                )
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.write('  \x1b[38;2;137;180;248m❭ \x1b[0m')
                const userPrompt = 'refactor auth middleware to verify jwt token expiration'
                for (const char of userPrompt) {
                    term.write(`\x1b[38;2;137;180;248m${char}\x1b[0m`)
                    await sleep(18)
                    if (isCancelled) return
                }
                term.writeln('')
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                term.writeln(
                    '    \x1b[3;38;2;170;170;170mExamining auth middleware and token verification logic...\x1b[0m'
                )
                await sleep(250)
                if (isCancelled) return
                term.writeln(
                    '    \x1b[3;38;2;170;170;170mAdding cryptographic signature verification and expiration check.\x1b[0m'
                )
                await sleep(350)
                if (isCancelled) return

                term.writeln('')
                term.write(
                    '  \x1b[38;2;137;180;248m⠋\x1b[0m \x1b[38;2;253;214;99mread_file\x1b[0m\x1b[38;2;170;170;170m(path: "packages/auth/src/jwt.ts")\x1b[0m'
                )
                await sleep(300)
                if (isCancelled) return

                term.write('\r\x1b[2K')
                term.writeln(
                    '  \x1b[38;2;253;214;99m● read_file\x1b[0m\x1b[38;2;170;170;170m(path: "packages/auth/src/jwt.ts")\x1b[0m'
                )
                await sleep(250)
                if (isCancelled) return

                term.write(
                    '  \x1b[38;2;137;180;248m⠋\x1b[0m \x1b[38;2;253;214;99medit_file\x1b[0m\x1b[38;2;170;170;170m(path: "packages/auth/src/jwt.ts")\x1b[0m'
                )
                await sleep(300)
                if (isCancelled) return

                term.write('\r\x1b[2K')
                term.writeln(
                    '  \x1b[38;2;253;214;99m● edit_file\x1b[0m\x1b[38;2;170;170;170m(path: "packages/auth/src/jwt.ts")\x1b[0m \x1b[38;2;102;102;102m(ctrl+o to collapse)\x1b[0m'
                )
                await sleep(150)
                if (isCancelled) return

                term.writeln(
                    '    \x1b[38;2;170;170;170m@@ -14,6 +14,8 @@ export function verifyToken(token) {\x1b[0m'
                )
                await sleep(120)
                if (isCancelled) return
                term.writeln(
                    '    \x1b[48;2;63;19;22m\x1b[38;2;252;165;165m- const decoded = jwt.decode(token)\x1b[0m'
                )
                await sleep(120)
                if (isCancelled) return
                term.writeln(
                    '    \x1b[48;2;18;47;30m\x1b[38;2;110;231;183m+ const decoded = jwt.verify(token, process.env.JWT_SECRET!)\x1b[0m'
                )
                await sleep(120)
                if (isCancelled) return
                term.writeln(
                    "    \x1b[48;2;18;47;30m\x1b[38;2;110;231;183m+ if (!decoded.exp || decoded.exp < Date.now() / 1000) throw new AuthError('token expired')\x1b[0m"
                )
                await sleep(300)
                if (isCancelled) return

                term.writeln('')
                const streamTokens = [
                    '  Refactored',
                    ' JWT',
                    ' verification',
                    ' in',
                    ' `packages/auth/src/jwt.ts`:\n',
                    '  • Replaced',
                    ' unverified',
                    ' jwt.decode',
                    ' with',
                    ' cryptographic',
                    ' jwt.verify\n',
                    '  • Added',
                    ' expiration',
                    ' claim',
                    ' check',
                    ' against',
                    ' current',
                    ' epoch\n',
                    '  • Handled',
                    ' expired',
                    ' token',
                    ' errors',
                    ' with',
                    ' descriptive',
                    ' 401',
                    ' response\n',
                ]
                for (const tok of streamTokens) {
                    term.write(tok)
                    await sleep(20)
                    if (isCancelled) return
                }
                await sleep(250)
                if (isCancelled) return

                term.writeln('')
                const cols = term.cols || 80
                const sep = '─'.repeat(Math.max(40, cols - 6))
                term.writeln(`  \x1b[38;2;51;51;51m${sep}\x1b[0m`)
                term.writeln(
                    '  \x1b[38;2;137;180;248m❭ \x1b[0m\x1b[38;2;102;102;102mAsk December to build...\x1b[0m'
                )
                term.writeln(`  \x1b[38;2;51;51;51m${sep}\x1b[0m`)
                const modelText = 'gemini-3.7-flash (Subscription)'
                const hintText = '? for shortcuts'
                const spacesCount = Math.max(2, cols - 6 - modelText.length - hintText.length)
                const spaces = ' '.repeat(spacesCount)
                term.writeln(
                    `  \x1b[38;2;170;170;170m${modelText}\x1b[0m${spaces}\x1b[38;2;102;102;102m${hintText}\x1b[0m`
                )
            } else {
                term.writeln(
                    `  \x1b[38;2;248;113;113mComponent "${targetMode}" preview not found. Run "tui list" for available components.\x1b[0m`
                )
            }
        }

        let lastPreviewedComponent: string | null = null

        async function launchPreview(comp: string) {
            interactiveState = null
            shellActive = false
            currentLine = ''
            lastPreviewedComponent = comp
            term.writeln('')
            term.writeln(`${getPrompt(cwd)}tui preview ${comp}`)
            term.writeln('')

            const handled = startComponentMode(comp)
            if (!handled) {
                await runSpecificSimulation(comp)
                if (!isCancelled) {
                    term.writeln('')
                    term.write(getPrompt(cwd))
                    shellActive = true
                }
            }
        }

        async function replayComponent() {
            interactiveState = null
            shellActive = false
            currentLine = ''

            if (!lastPreviewedComponent && lines && lines.length > 0) {
                term.writeln('')
                if (promptCmd) {
                    term.writeln(`${getPrompt(cwd)}${promptCmd}`)
                } else {
                    term.writeln(`${getPrompt(cwd)}tui preview ${mode}`)
                }
                term.writeln('')
                for (const line of lines) {
                    term.writeln(line)
                    await sleep(35)
                    if (isCancelled) return
                }
                if (interactive && !isCancelled) {
                    term.writeln('')
                    term.write(getPrompt(cwd))
                    shellActive = true
                }
                return
            }

            const targetComp = lastPreviewedComponent || mode
            await launchPreview(targetComp)
        }

        let dataDisposable: { dispose: () => void } | null = null

        if (interactive) {
            dataDisposable = term.onData((data) => {
                if (interactiveState) {
                    if (data === 'q' || data === '\x03' || data === '\x1b') {
                        interactiveState = null
                        term.writeln('')
                        term.writeln('  \x1b[38;2;102;102;102m[exited component mode]\x1b[0m')
                        term.writeln('')
                        term.write(getPrompt(cwd))
                        shellActive = true
                        currentLine = ''
                        return
                    }

                    let changed = false
                    switch (interactiveState.type) {
                        case 'select-menu': {
                            const next = handleSelectMenuKey(interactiveState.state, data)
                            if (next !== interactiveState.state) {
                                interactiveState.state = next
                                changed = true
                            }
                            break
                        }
                        case 'switch': {
                            const next = handleSwitchKey(interactiveState.state, data)
                            if (next !== interactiveState.state) {
                                interactiveState.state = next
                                changed = true
                            }
                            break
                        }
                        case 'tabs': {
                            const next = handleTabsKey(interactiveState.state, data)
                            if (next !== interactiveState.state) {
                                interactiveState.state = next
                                changed = true
                            }
                            break
                        }
                        case 'checkbox': {
                            const next = handleCheckboxKey(interactiveState.state, data)
                            if (next !== interactiveState.state) {
                                interactiveState.state = next
                                changed = true
                            }
                            break
                        }
                        case 'plan-approve': {
                            const next = handlePlanApproveKey(interactiveState.state, data)
                            if (next !== interactiveState.state) {
                                interactiveState.state = next
                                changed = true
                            }
                            break
                        }
                        case 'input-bar': {
                            const next = handleInputBarKey(interactiveState.state, data)
                            if (next !== interactiveState.state) {
                                interactiveState.state = next
                                changed = true
                            }
                            break
                        }
                    }

                    if (changed) {
                        renderInteractive(true)
                    }
                    return
                }

                if (!shellActive) {
                    if (data === '\x03' || data === '\r') {
                        isCancelled = true
                        term.writeln('')
                        term.write(getPrompt(cwd))
                        shellActive = true
                        currentLine = ''
                    }
                    return
                }

                // Shell REPL Mode
                if (data === '\r') {
                    term.write('\r\n')
                    const trimmed = currentLine.trim()
                    if (trimmed) {
                        history.push(trimmed)
                        historyIndex = history.length
                        const res = executeCommand(trimmed, { cwd })
                        if (res.type === 'clear') {
                            term.clear()
                            term.write(getPrompt(cwd))
                        } else if (res.type === 'cd') {
                            cwd = res.newCwd
                            if (res.output) {
                                term.writeln(res.output)
                                term.writeln('')
                            }
                            term.write(getPrompt(cwd))
                        } else if (res.type === 'preview') {
                            launchPreview(res.component)
                        } else if (res.type === 'replay') {
                            replayComponent()
                        } else if (
                            res.type === 'output' ||
                            res.type === 'error' ||
                            res.type === 'theme'
                        ) {
                            term.writeln(res.output)
                            term.writeln('')
                            term.write(getPrompt(cwd))
                        }
                    } else {
                        term.write(getPrompt(cwd))
                    }
                    currentLine = ''
                } else if (data === '\x7f' || data === '\b') {
                    if (currentLine.length > 0) {
                        currentLine = currentLine.slice(0, -1)
                        term.write('\b \b')
                    }
                } else if (data === '\t') {
                    const res = autocomplete(currentLine, { cwd })
                    if (res.completed !== currentLine) {
                        const backspaces = '\b \b'.repeat(currentLine.length)
                        term.write(backspaces + res.completed)
                        currentLine = res.completed
                    } else if (res.suggestions && res.suggestions.length > 0) {
                        term.writeln(
                            '\r\n  \x1b[38;2;170;170;170m' + res.suggestions.join('   ') + '\x1b[0m'
                        )
                        term.write(getPrompt(cwd) + currentLine)
                    }
                } else if (data === '\x1b[A') {
                    if (history.length > 0) {
                        if (historyIndex > 0) historyIndex--
                        else historyIndex = history.length - 1
                        const cmd = history[historyIndex] || ''
                        const backspaces = '\b \b'.repeat(currentLine.length)
                        term.write(backspaces + cmd)
                        currentLine = cmd
                    }
                } else if (data === '\x1b[B') {
                    if (history.length > 0) {
                        if (historyIndex < history.length - 1) {
                            historyIndex++
                            const cmd = history[historyIndex] || ''
                            const backspaces = '\b \b'.repeat(currentLine.length)
                            term.write(backspaces + cmd)
                            currentLine = cmd
                        } else {
                            historyIndex = history.length
                            const backspaces = '\b \b'.repeat(currentLine.length)
                            term.write(backspaces)
                            currentLine = ''
                        }
                    }
                } else if (data === '\x03') {
                    term.write('^C\r\n' + getPrompt(cwd))
                    currentLine = ''
                    historyIndex = history.length
                } else if (data === '\x0c') {
                    term.clear()
                    term.write(getPrompt(cwd) + currentLine)
                } else if (data.length === 1 && data >= ' ' && data <= '~') {
                    currentLine += data
                    term.write(data)
                }
            })
        }

        async function runSimulation() {
            if (!term) return
            term.clear()

            if (promptCmd) {
                term.writeln(`${getPrompt(cwd)}${promptCmd}`)
                term.writeln('')
            }

            const handled = startComponentMode(mode)
            if (handled) {
                return
            }

            if (lines && lines.length > 0) {
                for (const line of lines) {
                    term.writeln(line)
                    await sleep(35)
                    if (isCancelled) return
                }
                if (interactive && !isCancelled) {
                    term.writeln('')
                    term.write(getPrompt(cwd))
                    shellActive = true
                }
                return
            }

            if (!promptCmd) {
                const initialCmd = mode === 'december' ? 'december' : `tui preview ${mode}`
                term.writeln(`${getPrompt(cwd)}${initialCmd}`)
                term.writeln('')
            }

            await runSpecificSimulation(mode)
            if (!isCancelled) {
                term.writeln('')
                term.write(getPrompt(cwd))
                shellActive = true
            }
        }

        runSimulation()

        return () => {
            isCancelled = true
            dataDisposable?.dispose()
            resizeObserver.disconnect()
            term.dispose()
        }
    }, [mode, lines, promptCmd, replayKey, heightClass, interactive])

    return (
        <div
            onClick={() => termRef.current?.focus()}
            className="w-full overflow-x-auto no-scrollbar touch-scroll bg-[#0a0a0a] cursor-text"
        >
            <div ref={containerRef} className={`${heightClass || 'h-48 sm:h-60'} w-full`} />
        </div>
    )
}
