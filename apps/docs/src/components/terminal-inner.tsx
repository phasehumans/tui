'use client'

import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import React, { useEffect, useRef } from 'react'

export interface TerminalInnerProps {
    mode?: 'streaming' | 'diff' | 'tool' | 'reasoning' | 'all'
}

export function TerminalInner({ mode = 'all' }: TerminalInnerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const termRef = useRef<Terminal | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const term = new Terminal({
            theme: {
                background: '#0a0e17',
                foreground: '#f1f5f9',
                cursor: '#89b4f8',
                black: '#1e293b',
                red: '#f87171',
                green: '#4ade80',
                yellow: '#facc15',
                blue: '#89b4f8',
                magenta: '#c084fc',
                cyan: '#38bdf8',
                white: '#f8fafc',
            },
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 13,
            lineHeight: 1.4,
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
                // Intentionally swallowed: fit observer
            }
        })
        resizeObserver.observe(containerRef.current)

        let isCancelled = false

        // Run authentic terminal simulation
        async function runSimulation() {
            if (!term) return

            term.clear()
            term.writeln('\x1b[38;2;137;180;248m❭\x1b[0m \x1b[1mdecember review src/auth.ts\x1b[0m')
            await sleep(400)
            if (isCancelled) return

            // 1. Collapsible Reasoning Block
            term.writeln('')
            term.writeln(
                '\x1b[38;2;137;180;248m●\x1b[0m \x1b[1;38;2;170;170;170mReasoning\x1b[0m \x1b[38;2;102;102;102m(1.2s) [142 tokens]\x1b[0m'
            )
            term.writeln(
                '  \x1b[38;2;102;102;102m\x1b[3mExamining JWT signature verification and session expiry checks...\x1b[0m'
            )
            await sleep(600)
            if (isCancelled) return

            // 2. Tool Call Card
            term.writeln('')
            term.writeln(
                '\x1b[38;2;74;222;128m✔\x1b[0m \x1b[1;38;2;137;180;248mread_file\x1b[0m \x1b[38;2;170;170;170mpackages/auth/src/jwt.ts\x1b[0m \x1b[38;2;102;102;102m0.1s\x1b[0m'
            )
            await sleep(500)
            if (isCancelled) return

            // 3. Diff Viewer
            term.writeln('')
            term.writeln('\x1b[38;2;137;180;248m⌥ packages/auth/src/jwt.ts\x1b[0m')
            term.writeln(
                '\x1b[38;2;51;51;51m┌────────────────────────────────────────────────────────┐\x1b[0m'
            )
            term.writeln(
                '\x1b[38;2;170;170;170m│ @@ -14,6 +14,8 @@ export function verifySessionToken(token) │\x1b[0m'
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
                '\x1b[38;2;51;51;51m└────────────────────────────────────────────────────────┘\x1b[0m'
            )
            await sleep(600)
            if (isCancelled) return

            // 4. Streaming Text
            term.writeln('')
            const streamTokens = [
                'Fixed',
                ' potential',
                ' timing',
                ' attack',
                ' and',
                ' missing',
                ' signature',
                ' check',
                ' in',
                ' JWT',
                ' validation.\n',
            ]
            for (const token of streamTokens) {
                term.write(token)
                await sleep(50)
                if (isCancelled) return
            }

            // 5. Token Gauge
            term.writeln('')
            term.writeln(
                '\x1b[38;2;170;170;170mContext:\x1b[0m \x1b[38;2;137;180;248m━━━━━━\x1b[0m\x1b[38;2;102;102;102m──────────────\x1b[0m \x1b[1;38;2;137;180;248m28%\x1b[0m \x1b[38;2;102;102;102m(36.4k / 128k)\x1b[0m'
            )
        }

        runSimulation()

        return () => {
            isCancelled = true
            resizeObserver.disconnect()
            term.dispose()
        }
    }, [mode])

    return (
        <div className="relative rounded-xl border border-zinc-800 bg-[#0a0e17] p-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-xs text-zinc-500 font-mono">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
                    <span className="ml-2 text-zinc-400">tui.trydecember.com — agent-preview</span>
                </div>
                <div className="text-[10px] text-zinc-500">xterm.js · 80x24</div>
            </div>
            <div ref={containerRef} className="h-72 w-full" />
        </div>
    )
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
