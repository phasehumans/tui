'use client'

import { Copy, Check, RotateCcw, ExternalLink, Menu, X } from 'lucide-react'
import React, { useState, useEffect, useCallback, useRef } from 'react'

import { CodeBlock } from '../components/code-block'
import { TerminalPreview } from '../components/terminal-preview'
import { DOC_ITEMS, type DocItem } from '../data/docs-data'

type PackageManager = 'bun' | 'pnpm' | 'npm'

const cleanTitle = (name: string) => name.replace(/^<|(\s*\/?>)$/g, '').trim()

export default function DocsPage() {
    const [activeId, setActiveId] = useState<string>('introduction')
    const [replayKey, setReplayKey] = useState<number>(0)
    const [copiedKey, setCopiedKey] = useState<string | null>(null)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false)
    const [activeTocId, setActiveTocId] = useState<string>('overview')
    const [pm, setPm] = useState<PackageManager>('bun')

    const mainRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const savedPm = localStorage.getItem('tui-pm') as PackageManager | null
        if (savedPm && (savedPm === 'bun' || savedPm === 'pnpm' || savedPm === 'npm')) {
            setPm(savedPm)
        }
    }, [])

    const handleSelectPm = (selectedPm: PackageManager) => {
        setPm(selectedPm)
        try {
            localStorage.setItem('tui-pm', selectedPm)
        } catch {
            // Intentionally swallowed: local storage failure
        }
    }

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '')
            if (hash && DOC_ITEMS.some((item) => item.id === hash)) {
                setActiveId(hash)
            }
        }

        handleHashChange()
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    const selectDocItem = useCallback((id: string) => {
        setActiveId(id)
        window.location.hash = id
        setMobileSidebarOpen(false)
        setReplayKey((k) => k + 1)
        const doc = DOC_ITEMS.find((d) => d.id === id)
        if (doc && doc.toc[0]) {
            setActiveTocId(doc.toc[0].id)
        }
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: 'auto' })
        }
    }, [])

    const activeItem: DocItem =
        DOC_ITEMS.find((item) => item.id === activeId) ?? (DOC_ITEMS[0] as DocItem)

    const currentIndex = DOC_ITEMS.findIndex((item) => item.id === activeItem.id)
    const prevItem = currentIndex > 0 ? DOC_ITEMS[currentIndex - 1] : null
    const nextItem = currentIndex < DOC_ITEMS.length - 1 ? DOC_ITEMS[currentIndex + 1] : null

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopiedKey(key)
                setTimeout(() => {
                    setCopiedKey((curr) => (curr === key ? null : curr))
                }, 1800)
            })
            .catch(() => {
                // Intentionally swallowed: clipboard fallback handled
            })
    }

    const scrollToSection = (targetId: string) => {
        setActiveTocId(targetId)
        const mainContainer = mainRef.current
        const targetElement = document.getElementById(targetId)

        if (targetElement && mainContainer) {
            const containerRect = mainContainer.getBoundingClientRect()
            const targetRect = targetElement.getBoundingClientRect()
            const relativeOffset = targetRect.top - containerRect.top + mainContainer.scrollTop - 16

            mainContainer.scrollTo({
                top: Math.max(0, relativeOffset),
                behavior: 'smooth',
            })
        }
    }

    const handleMainScroll = () => {
        const mainContainer = mainRef.current
        if (!mainContainer) return

        const containerRect = mainContainer.getBoundingClientRect()
        const sections = activeItem.toc
            .map((t) => ({ id: t.id, el: document.getElementById(t.id) }))
            .filter((item): item is { id: string; el: HTMLElement } => item.el !== null)

        if (sections.length === 0) return

        if (
            mainContainer.scrollTop + mainContainer.clientHeight >=
            mainContainer.scrollHeight - 30
        ) {
            const last = sections[sections.length - 1]
            if (last) {
                setActiveTocId(last.id)
                return
            }
        }

        let currentSectionId = sections[0]?.id || 'overview'
        for (const section of sections) {
            if (section.el.getBoundingClientRect().top - containerRect.top <= 120) {
                currentSectionId = section.id
            }
        }
        setActiveTocId(currentSectionId)
    }

    const formatInstallCmd = (cmd: string, manager: PackageManager) => {
        if (!cmd) return ''
        if (manager === 'bun') {
            return cmd.replace(/^npx\s+/, 'bunx ')
        }
        if (manager === 'pnpm') {
            return cmd.replace(/^npx\s+/, 'pnpm dlx ')
        }
        return cmd
    }

    const gettingStartedItems = DOC_ITEMS.filter((item) => item.category === 'getting-started')
    const componentItems = DOC_ITEMS.filter((item) => item.category === 'components')

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#141414] text-[#e2e2e2] font-mono text-[14px]">
            {/* Header: Clean, borderless, compact typography */}
            <header className="shrink-0 bg-[#141414] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-30 max-w-[1300px] w-full mx-auto">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="lg:hidden p-1 text-[#8c8c8c] hover:text-white"
                        aria-label="Toggle navigation"
                    >
                        {mobileSidebarOpen ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Menu className="h-4 w-4" />
                        )}
                    </button>

                    <a
                        href="#introduction"
                        onClick={(e) => {
                            e.preventDefault()
                            selectDocItem('introduction')
                        }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-[#fb923c] font-bold text-[1.35rem] leading-none">
                            ✱
                        </span>
                        <span className="font-bold text-white text-[1.3rem] tracking-[-0.02em] leading-none">
                            tui
                        </span>
                        <span className="hidden sm:inline text-[0.88rem] text-[#8c8c8c] ml-1 leading-none">
                            a ui library for terminal agents
                        </span>
                    </a>
                </div>

                <div className="flex items-center gap-3 sm:gap-5 text-[0.88rem] text-[#8c8c8c]">
                    <a
                        href="https://github.com/phasehumans/tui"
                        target="_blank"
                        rel="noreferrer"
                        className="link flex items-center gap-1.5"
                    >
                        <span>github</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <a
                        href="https://npmjs.com/package/@trydecember/tui"
                        target="_blank"
                        rel="noreferrer"
                        className="link accent-link hidden sm:inline"
                    >
                        @trydecember/tui
                    </a>
                </div>
            </header>

            {/* Main Area: Borderless layout with independent scrolling */}
            <div className="flex-1 min-h-0 flex overflow-hidden w-full max-w-[1300px] mx-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-6">
                {/* Left Sidebar: content shifted to left side */}
                <aside
                    className={`
                        fixed inset-y-16 left-0 z-20 w-52 bg-[#141414] py-2 pr-4 pl-0 overflow-y-auto flex flex-col gap-6 transition-transform duration-150
                        lg:static lg:h-full lg:translate-x-0 shrink-0 lg:-ml-3
                        ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl bg-[#141414] pl-4' : '-translate-x-full lg:translate-x-0'}
                    `}
                >
                    {/* Getting Started */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] font-semibold text-[#5c5c5c] uppercase tracking-wider px-1.5">
                            getting started
                        </span>
                        <div className="flex flex-col gap-0.5">
                            {gettingStartedItems.map((item) => {
                                const isActive = item.id === activeItem.id
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => selectDocItem(item.id)}
                                        className={`
                                            flex items-center justify-between px-2 py-1.5 rounded-[3px] text-left text-[0.92rem] transition-colors cursor-pointer
                                            ${isActive ? 'bg-white/[0.06] text-white font-semibold' : 'text-[#8c8c8c] hover:text-white hover:bg-white/[0.02]'}
                                        `}
                                    >
                                        <span>{item.navLabel}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Components */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] font-semibold text-[#5c5c5c] uppercase tracking-wider px-1.5">
                            components (
                            {DOC_ITEMS.filter((i) => i.category === 'components').length})
                        </span>
                        <div className="flex flex-col gap-0.5">
                            {componentItems.map((item) => {
                                const isActive = item.id === activeItem.id
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => selectDocItem(item.id)}
                                        className={`
                                            flex items-center justify-between px-2 py-1.5 rounded-[3px] text-left text-[0.92rem] transition-colors cursor-pointer
                                            ${isActive ? 'bg-white/[0.06] text-white font-semibold' : 'text-[#8c8c8c] hover:text-white hover:bg-white/[0.02]'}
                                        `}
                                    >
                                        <span>{item.navLabel}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </aside>

                {/* Mobile Backdrop */}
                {mobileSidebarOpen && (
                    <div
                        onClick={() => setMobileSidebarOpen(false)}
                        className="fixed inset-0 z-10 bg-black/60 backdrop-blur-xs lg:hidden"
                    />
                )}

                {/* Middle Content Pane */}
                <main
                    ref={mainRef}
                    onScroll={handleMainScroll}
                    className="flex-1 h-full min-h-0 overflow-y-auto py-2 pl-4 sm:pl-8 pr-4 sm:pr-8 flex flex-col gap-8"
                >
                    {/* Overview Header */}
                    <section id="overview" className="flex flex-col gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-[-0.01em]">
                            {cleanTitle(activeItem.title)}
                        </h1>

                        <p className="text-[0.88rem] text-[#8c8c8c] leading-[1.6] max-w-2xl">
                            {activeItem.description}
                        </p>
                    </section>

                    {/* Installation Block */}
                    {activeItem.installCmd && (
                        <div id="install-cmd" className="max-w-2xl flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs text-[#8c8c8c] pb-1">
                                <span className="text-[1.05rem] font-semibold text-white tracking-[-0.01em]">
                                    {activeItem.toc.find((t) => t.id === 'install-cmd')?.label ||
                                        'installation'}
                                </span>
                                <div className="flex items-center gap-1 bg-[#181818] p-0.5 rounded-[4px]">
                                    {(['bun', 'pnpm', 'npm'] as PackageManager[]).map((mgr) => (
                                        <button
                                            key={mgr}
                                            onClick={() => handleSelectPm(mgr)}
                                            className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
                                                pm === mgr
                                                    ? 'bg-[#282828] text-[#fb923c] font-semibold'
                                                    : 'hover:text-white'
                                            }`}
                                        >
                                            {mgr}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div
                                onClick={() =>
                                    handleCopy(
                                        formatInstallCmd(activeItem.installCmd!, pm),
                                        'install-top'
                                    )
                                }
                                className="cmd-box cursor-pointer"
                                title="click to copy command"
                            >
                                <div className="cmd-code">
                                    <span className="tok-pfx">$</span>
                                    <span>{formatInstallCmd(activeItem.installCmd!, pm)}</span>
                                </div>
                                <button
                                    aria-label="copy command"
                                    className="text-[#5c5c5c] hover:text-white p-0.5 cursor-pointer"
                                >
                                    {copiedKey === 'install-top' ? (
                                        <Check className="h-3.5 w-3.5 text-[#fb923c]" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Terminal Preview (Always shown first) */}
                    {activeItem.terminalMode && (
                        <section id="preview" className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between pb-1">
                                <span className="text-[1.05rem] font-semibold text-white tracking-[-0.01em]">
                                    preview
                                </span>

                                <button
                                    onClick={() => setReplayKey((k) => k + 1)}
                                    className="text-[0.8rem] text-[#8c8c8c] hover:text-white flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#202020] transition-colors"
                                    title="replay terminal animation"
                                >
                                    <RotateCcw className="h-3 w-3 text-[#8c8c8c]" />
                                    <span>replay</span>
                                </button>
                            </div>

                            <div className="rounded-[4px] bg-[#111111] p-3 overflow-hidden border border-[#222222]">
                                <TerminalPreview
                                    mode={activeItem.terminalMode}
                                    replayKey={replayKey}
                                />
                            </div>
                        </section>
                    )}

                    {/* Usage Code Block (Directly below Terminal Preview) */}
                    {activeItem.codeSnippet && (
                        <section id="usage" className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[1.05rem] font-semibold text-white tracking-[-0.01em]">
                                    usage
                                </span>
                                <button
                                    onClick={() => handleCopy(activeItem.codeSnippet!, 'usage-btn')}
                                    className="text-[0.8rem] text-[#8c8c8c] hover:text-white flex items-center gap-1"
                                >
                                    {copiedKey === 'usage-btn' ? (
                                        <>
                                            <Check className="h-3 w-3 text-[#fb923c]" />
                                            <span className="text-[#fb923c]">copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3 w-3" />
                                            <span>copy code</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="rounded-[4px] bg-[#181818] p-4 text-[0.84rem] overflow-x-auto">
                                <CodeBlock code={activeItem.codeSnippet} language="tsx" />
                            </div>
                        </section>
                    )}

                    {/* Component Variations / Examples Section */}
                    {activeItem.variations && activeItem.variations.length > 0 && (
                        <section id="examples" className="flex flex-col gap-5">
                            <div className="flex items-center justify-between pb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[1.05rem] font-semibold text-white tracking-[-0.01em]">
                                        examples
                                    </span>
                                    <span className="text-[0.75rem] font-mono text-[#fb923c] px-1.5 py-0.5 rounded bg-[#fb923c]/10">
                                        {activeItem.variations.length} variations
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {activeItem.variations.map((variation, vIdx) => {
                                    const copyKey = `var-${activeItem.id}-${variation.id}`
                                    return (
                                        <div
                                            key={variation.id}
                                            id={`example-${variation.id}`}
                                            className="flex flex-col gap-3 rounded-[4px] border border-[#222222] bg-[#141414] p-4 transition-colors hover:border-[#2e2e2e]"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[0.78rem] font-mono text-[#fb923c]">
                                                            0{vIdx + 1}
                                                        </span>
                                                        <h3 className="text-[0.95rem] font-semibold text-white tracking-[-0.01em]">
                                                            {variation.title}
                                                        </h3>
                                                    </div>
                                                    {variation.description && (
                                                        <p className="text-[0.84rem] text-[#8c8c8c] pl-6">
                                                            {variation.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        handleCopy(variation.codeSnippet, copyKey)
                                                    }
                                                    className="text-[0.78rem] text-[#8c8c8c] hover:text-white flex items-center gap-1 shrink-0 px-2 py-1 rounded bg-[#1c1c1c] border border-[#2a2a2a] hover:border-[#383838] transition-colors"
                                                    title="copy code snippet"
                                                >
                                                    {copiedKey === copyKey ? (
                                                        <>
                                                            <Check className="h-3 w-3 text-[#fb923c]" />
                                                            <span className="text-[#fb923c]">
                                                                copied
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="h-3 w-3" />
                                                            <span>copy code</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Variation Terminal Preview */}
                                            {(variation.terminalLines ||
                                                variation.terminalMode) && (
                                                <div className="rounded-[4px] bg-[#111111] p-3 overflow-hidden border border-[#1f1f1f]">
                                                    <TerminalPreview
                                                        mode={variation.terminalMode}
                                                        lines={variation.terminalLines}
                                                        heightClass="h-28 sm:h-32"
                                                    />
                                                </div>
                                            )}

                                            {/* Variation Code Snippet */}
                                            <div className="rounded-[4px] bg-[#181818] p-3 text-[0.82rem] overflow-x-auto border border-[#222222]">
                                                <CodeBlock
                                                    code={variation.codeSnippet}
                                                    language="tsx"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* Rich Document Sections (Introduction, Installation, Theming, etc.) */}
                    {activeItem.sections && activeItem.sections.length > 0 && (
                        <div className="flex flex-col gap-10">
                            {activeItem.sections.map((section) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="flex flex-col gap-3.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-[1.15rem] font-bold text-white tracking-[-0.01em]">
                                            {section.title}
                                        </h2>
                                        {section.codeSnippet && (
                                            <button
                                                onClick={() =>
                                                    handleCopy(
                                                        section.codeSnippet!,
                                                        `sec-${section.id}`
                                                    )
                                                }
                                                className="text-[0.8rem] text-[#8c8c8c] hover:text-white flex items-center gap-1 cursor-pointer"
                                                title="copy code"
                                            >
                                                {copiedKey === `sec-${section.id}` ? (
                                                    <>
                                                        <Check className="h-3.5 w-3.5 text-[#fb923c]" />
                                                        <span className="text-[#fb923c]">
                                                            copied
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3.5 w-3.5" />
                                                        <span>copy code</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {section.description && (
                                        <p className="text-[0.88rem] text-[#8c8c8c] leading-[1.6] max-w-3xl">
                                            {section.description}
                                        </p>
                                    )}

                                    {section.points && section.points.length > 0 && (
                                        <div className="flex flex-col gap-2 pt-1">
                                            {section.points.map((pt, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-2.5 text-[0.85rem] text-[#8c8c8c]"
                                                >
                                                    <span className="text-[#fb923c] font-bold min-w-[20px]">
                                                        0{idx + 1}
                                                    </span>
                                                    <span className="leading-[1.55]">{pt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {section.codeSnippet && (
                                        <div className="rounded-[4px] bg-[#181818] p-4 text-[0.84rem] overflow-x-auto border border-[#222222]">
                                            <CodeBlock
                                                code={section.codeSnippet}
                                                language={section.language || 'tsx'}
                                            />
                                        </div>
                                    )}

                                    {section.items && section.items.length > 0 && (
                                        <div className="flex flex-col gap-3 pt-1">
                                            {section.items.map((item, itemIdx) => {
                                                const itemCopyKey = `item-${section.id}-${itemIdx}`
                                                return (
                                                    <div
                                                        key={itemIdx}
                                                        className="rounded-[4px] border border-[#222222] bg-[#141414] p-4 flex flex-col gap-2.5 transition-colors hover:border-[#2e2e2e]"
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <h3 className="text-[0.95rem] font-semibold text-white tracking-[-0.01em]">
                                                                {item.title}
                                                            </h3>
                                                            {item.codeSnippet && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleCopy(
                                                                            item.codeSnippet!,
                                                                            itemCopyKey
                                                                        )
                                                                    }
                                                                    className="text-[0.78rem] text-[#8c8c8c] hover:text-white flex items-center gap-1 shrink-0 px-2 py-1 rounded bg-[#1c1c1c] border border-[#2a2a2a] hover:border-[#383838] transition-colors cursor-pointer"
                                                                    title="copy code snippet"
                                                                >
                                                                    {copiedKey === itemCopyKey ? (
                                                                        <>
                                                                            <Check className="h-3 w-3 text-[#fb923c]" />
                                                                            <span className="text-[#fb923c]">
                                                                                copied
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy className="h-3 w-3" />
                                                                            <span>copy code</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {item.description && (
                                                            <p className="text-[0.85rem] text-[#8c8c8c] leading-[1.55]">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        {item.codeSnippet && (
                                                            <div className="rounded-[4px] bg-[#181818] p-3 text-[0.82rem] overflow-x-auto border border-[#222222] mt-1">
                                                                <CodeBlock
                                                                    code={item.codeSnippet}
                                                                    language={
                                                                        item.language || 'tsx'
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </section>
                            ))}
                        </div>
                    )}

                    {/* Overview Points (Numbered steps) */}
                    {activeItem.points && !activeItem.sections && (
                        <section id="points" className="flex flex-col gap-2.5">
                            <span className="text-[1.05rem] font-semibold text-white tracking-[-0.01em]">
                                principles
                            </span>
                            <div className="flex flex-col gap-2">
                                {activeItem.points.map((pt, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2.5 text-[0.85rem] text-[#8c8c8c]"
                                    >
                                        <span className="text-[#fb923c] font-bold min-w-[20px]">
                                            0{idx + 1}
                                        </span>
                                        <span className="leading-[1.55]">{pt}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Props Reference Table */}
                    {activeItem.props && activeItem.props.length > 0 && (
                        <section id="props" className="flex flex-col gap-2.5">
                            <span className="text-[1.05rem] font-semibold text-white tracking-[-0.01em]">
                                api reference
                            </span>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-left text-[0.84rem]">
                                    <thead>
                                        <tr className="bg-[#181818]/60 text-[#5c5c5c] text-[0.78rem]">
                                            <th className="py-2.5 px-3 font-semibold">prop</th>
                                            <th className="py-2.5 px-3 font-semibold">type</th>
                                            <th className="py-2.5 px-3 font-semibold">default</th>
                                            <th className="py-2.5 px-3 font-semibold">
                                                description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeItem.props.map((p, idx) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-white/[0.025] transition-colors"
                                            >
                                                <td className="py-2 px-3 text-white font-medium whitespace-nowrap">
                                                    {p.prop}
                                                </td>
                                                <td className="py-2 px-3 text-[#8c8c8c] whitespace-nowrap font-mono text-[0.8rem]">
                                                    {p.type}
                                                </td>
                                                <td className="py-2 px-3 text-[#5c5c5c] whitespace-nowrap">
                                                    {p.default || '-'}
                                                </td>
                                                <td className="py-2 px-3 text-[#e2e2e2]">
                                                    {p.desc}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Pagination (Prev / Next) */}
                    <div className="pt-4 pb-2 flex items-center justify-between text-[0.85rem]">
                        {prevItem ? (
                            <button
                                onClick={() => selectDocItem(prevItem.id)}
                                className="flex flex-col items-start gap-0.5 p-1 rounded hover:text-white transition-colors"
                            >
                                <span className="text-[#5c5c5c] text-[0.75rem]">← previous</span>
                                <span className="text-[#8c8c8c] hover:text-white">
                                    {prevItem.navLabel}
                                </span>
                            </button>
                        ) : (
                            <div />
                        )}

                        {nextItem && (
                            <button
                                onClick={() => selectDocItem(nextItem.id)}
                                className="flex flex-col items-end gap-0.5 p-1 rounded hover:text-white transition-colors"
                            >
                                <span className="text-[#5c5c5c] text-[0.75rem]">next →</span>
                                <span className="text-[#8c8c8c] hover:text-white">
                                    {nextItem.navLabel}
                                </span>
                            </button>
                        )}
                    </div>
                </main>

                {/* Right Table of Contents: "On This Page", positioned to right side */}
                <aside className="hidden xl:block w-48 shrink-0 h-full overflow-y-auto pl-10 pr-0 py-2 text-left ml-auto xl:-mr-3">
                    <div className="flex flex-col gap-3">
                        <span className="text-[0.92rem] font-semibold text-white tracking-tight">
                            on this page
                        </span>
                        <div className="flex flex-col gap-1">
                            {activeItem.toc.map((item) => {
                                const isActive = activeTocId === item.id
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`
                                            text-left text-[0.88rem] transition-colors py-1 cursor-pointer
                                            ${isActive ? 'text-white font-medium' : 'text-[#8c8c8c] hover:text-white'}
                                        `}
                                    >
                                        <span>{item.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
