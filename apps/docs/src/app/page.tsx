import { Terminal, Copy, ArrowRight, Check, Code2, Sparkles, Box } from 'lucide-react'
import { TerminalPreview } from '../components/terminal-preview'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-12 lg:p-24 max-w-7xl mx-auto">
            {/* Navigation Header */}
            <header className="w-full flex items-center justify-between py-4 border-b border-zinc-800/60 mb-16">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                        ❭_
                    </div>
                    <span className="font-semibold tracking-tight text-white font-mono">
                        @trydecember/tui
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono">
                        v0.1.0
                    </span>
                </div>
                <nav className="flex items-center gap-6 text-sm text-zinc-400">
                    <a href="#components" className="hover:text-white transition-colors">
                        Components
                    </a>
                    <a href="#quickstart" className="hover:text-white transition-colors">
                        Quickstart
                    </a>
                    <a
                        href="https://github.com/phasehumans/tui"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                    >
                        GitHub
                    </a>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
                <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono w-fit">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>The shadcn/ui for Terminal Agents</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        A UI library for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            terminal coding agents.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
                        An unbundled, copy-paste component library for React and Ink. Stop wrestling
                        with ANSI cursor codes, line wrapping, and terminal diffs. Own the code and
                        build modern agent experiences.
                    </p>

                    {/* Quickstart Command */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs sm:text-sm text-zinc-200">
                            <span className="text-zinc-500">$</span>
                            <span>npx @trydecember/tui add diff-viewer</span>
                            <button
                                aria-label="Copy command"
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Virtual xterm.js Canvas */}
                <div className="lg:col-span-6">
                    <TerminalPreview />
                </div>
            </section>

            {/* Core Differentiators */}
            <section id="features" className="w-full py-16 border-t border-zinc-800/60 mb-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                        Designed for the Agent Era
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base">
                        Generic CLI libraries provide basic inputs and prompts. We provide
                        primitives built explicitly for LLM agent loops.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col gap-3">
                        <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Terminal className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-white">Agent-First Primitives</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Out-of-the-box components for streaming markdown tokens, folding
                            chain-of-thought blocks, and live tool cards.
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <Code2 className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-white">Zero Lock-In (Copy-Paste)</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            No rigid, black-box npm packages. Run the CLI, drop raw React/Ink source
                            code into your project, and tweak it as you wish.
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Box className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-white">Controlled View Invariants</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Pure, stateless components. Prevent rogue keyboard hooks from clashing
                            over stdin—your agent state machine stays in control.
                        </p>
                    </div>
                </div>
            </section>

            {/* Component Catalog */}
            <section id="components" className="w-full py-16 border-t border-zinc-800/60 mb-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                            Flagship Components
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Run the add command to copy any of these primitives directly into your
                            repository.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            name: 'diff-viewer',
                            title: '<DiffViewer />',
                            desc: 'Red/green split or unified chunk diffing with file headers and branch glyphs.',
                            cmd: 'npx @trydecember/tui add diff-viewer',
                        },
                        {
                            name: 'streaming-text',
                            title: '<StreamingText />',
                            desc: 'Smooth text and progressive markdown stream renderer with terminal cursor indicator.',
                            cmd: 'npx @trydecember/tui add streaming-text',
                        },
                        {
                            name: 'collapsible-reasoning',
                            title: '<CollapsibleReasoning />',
                            desc: 'Foldable chain-of-thought scratchpad block with duration and token count badges.',
                            cmd: 'npx @trydecember/tui add collapsible-reasoning',
                        },
                        {
                            name: 'tool-call-card',
                            title: '<ToolCallCard />',
                            desc: 'Execution status card with live spinner, duration indicator, and expandable stdout.',
                            cmd: 'npx @trydecember/tui add tool-call-card',
                        },
                        {
                            name: 'token-gauge',
                            title: '<TokenGauge />',
                            desc: 'Visual terminal meter for context window capacity and token usage monitoring.',
                            cmd: 'npx @trydecember/tui add token-gauge',
                        },
                        {
                            name: 'theme',
                            title: 'theme.ts',
                            desc: 'Central typed design token contract for unified colors, borders, and glyphs.',
                            cmd: 'npx @trydecember/tui init',
                        },
                    ].map((comp) => (
                        <div
                            key={comp.name}
                            className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                        >
                            <div>
                                <h3 className="font-mono font-bold text-cyan-400 text-base mb-2">
                                    {comp.title}
                                </h3>
                                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                                    {comp.desc}
                                </p>
                            </div>
                            <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                                <span className="truncate mr-2">{comp.cmd}</span>
                                <Copy className="h-3.5 w-3.5 shrink-0 hover:text-white cursor-pointer" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono">
                <div>© 2026 Phase Humans Inc. · Built for AI coding agents.</div>
                <div className="mt-4 sm:mt-0 flex gap-6">
                    <a href="https://trydecember.com" className="hover:text-zinc-300">
                        trydecember.com
                    </a>
                    <a href="https://github.com/phasehumans/tui" className="hover:text-zinc-300">
                        GitHub
                    </a>
                </div>
            </footer>
        </main>
    )
}
