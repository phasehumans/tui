'use client'

import { Copy, Check, RotateCcw, Menu, X } from 'lucide-react'
import React, { useState, useEffect, useCallback, useRef } from 'react'

import { CodeBlock } from '../components/code-block'
import { TerminalPreview } from '../components/terminal-preview'
import { DOC_ITEMS, type DocItem } from '../data/docs-data'

type PackageManager = 'bun' | 'pnpm' | 'npm'

const cleanTitle = (name: string) => name.replace(/^<|(\s*\/?>)$/g, '').trim()

export default function DocsPage() {
    const [activeId, setActiveId] = useState<string>('installation')
    const [replayKey, setReplayKey] = useState<number>(0)
    const [variantReplayKeys, setVariantReplayKeys] = useState<Record<string, number>>({})
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
            if (hash === 'introduction') {
                setActiveId('installation')
            } else if (hash === 'theming') {
                setActiveId('themes')
            } else if (hash && DOC_ITEMS.some((item) => item.id === hash)) {
                setActiveId(hash)
            }
        }

        handleHashChange()
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileSidebarOpen(false)
            }
        }
        if (mobileSidebarOpen) {
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [mobileSidebarOpen])

    useEffect(() => {
        if (mobileSidebarOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileSidebarOpen])

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
        if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
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
        <div className="h-dvh w-full overflow-hidden flex flex-col bg-[#141414] text-[#e2e2e2] font-mono text-[14px]">
            {/* Header: Clean, borderless, compact typography */}
            <header className="shrink-0 bg-[#141414] px-4 sm:px-6 py-3.5 sm:py-5 flex items-center justify-between z-30 max-w-[1300px] w-full mx-auto">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="lg:hidden -ml-1.5 p-1.5 rounded text-[#8c8c8c] hover:text-white hover:bg-white/[0.04] transition-colors flex items-center justify-center min-w-[36px] min-h-[36px] focus:outline-none focus-visible:outline-none"
                        aria-label="Toggle navigation"
                        aria-expanded={mobileSidebarOpen}
                        aria-controls="sidebar-nav"
                    >
                        {mobileSidebarOpen ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Menu className="h-4 w-4" />
                        )}
                    </button>

                    <a
                        href="#installation"
                        onClick={(e) => {
                            e.preventDefault()
                            selectDocItem('installation')
                        }}
                        className="flex items-center gap-2 py-1"
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

                <div className="flex items-center gap-3 sm:gap-5 text-[0.82rem] sm:text-[0.88rem] text-[#8c8c8c] shrink-0">
                    <a
                        href="https://github.com/phasehumans/tui"
                        target="_blank"
                        rel="noreferrer"
                        className="py-1 px-1 text-[#8c8c8c] hover:text-white transition-colors"
                    >
                        <span>github</span>
                    </a>
                    <a
                        href="https://npmjs.com/package/@trydecember/tui"
                        target="_blank"
                        rel="noreferrer"
                        className="py-1 text-[#fb923c] hover:text-[#fdba74] transition-colors"
                    >
                        @trydecember/tui
                    </a>
                </div>
            </header>

            {/* Main Area: Borderless layout with independent scrolling */}
            <div className="flex-1 min-h-0 flex overflow-hidden w-full max-w-[1300px] mx-auto px-0 sm:px-6 pt-2 sm:pt-6 pb-4 sm:pb-6">
                {/* Left Sidebar: Drawer on mobile, column on desktop */}
                <aside
                    id="sidebar-nav"
                    className={`
                        fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#141414] border-r border-[#222222] p-5 flex flex-col gap-6 overflow-y-auto no-scrollbar shadow-2xl transition-transform duration-200 ease-in-out touch-scroll
                        lg:static lg:z-auto lg:h-full lg:w-52 lg:max-w-none lg:border-r-0 lg:p-0 lg:py-2 lg:pr-4 lg:shadow-none lg:translate-x-0 shrink-0 lg:-ml-3 lg:transition-none
                        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}
                >
                    {/* Mobile Drawer Header */}
                    <div className="flex items-center justify-between pb-1 lg:hidden shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[#fb923c] font-bold text-[1.2rem] leading-none">
                                ✱
                            </span>
                            <span className="font-bold text-white text-[1.1rem] tracking-[-0.02em] leading-none">
                                tui
                            </span>
                            <span className="text-[0.8rem] text-[#8c8c8c] ml-1">docs</span>
                        </div>
                        <button
                            onClick={() => setMobileSidebarOpen(false)}
                            className="p-2 -mr-2 text-[#8c8c8c] hover:text-white rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Close navigation"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

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
                                            flex items-center justify-between px-2.5 py-2 sm:py-1.5 rounded-[3px] text-left text-[0.92rem] transition-colors cursor-pointer min-h-[38px] sm:min-h-0 focus:outline-none focus-visible:outline-none
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
                            components
                        </span>
                        <div className="flex flex-col gap-0.5">
                            {componentItems.map((item) => {
                                const isActive = item.id === activeItem.id
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => selectDocItem(item.id)}
                                        className={`
                                            flex items-center justify-between px-2.5 py-2 sm:py-1.5 rounded-[3px] text-left text-[0.92rem] transition-colors cursor-pointer min-h-[38px] sm:min-h-0 focus:outline-none focus-visible:outline-none
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
                        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs lg:hidden"
                        aria-hidden="true"
                    />
                )}

                {/* Middle Content Pane */}
                <main
                    ref={mainRef}
                    onScroll={handleMainScroll}
                    className="flex-1 h-full min-h-0 overflow-y-auto no-scrollbar touch-scroll py-2 px-4 sm:px-8 flex flex-col gap-6 sm:gap-8"
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
                                            className={`px-2.5 py-1 sm:py-0.5 rounded-[3px] text-xs transition-colors cursor-pointer min-h-[28px] sm:min-h-0 ${
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
                                <div className="cmd-code code-scroll">
                                    <span className="tok-pfx">$</span>
                                    <span>{formatInstallCmd(activeItem.installCmd!, pm)}</span>
                                </div>
                                <button
                                    aria-label="copy command"
                                    className="text-[#5c5c5c] hover:text-white p-1 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center shrink-0"
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
                                    className="text-[0.78rem] text-[#8c8c8c] hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/[0.04] transition-colors cursor-pointer"
                                    title="replay terminal animation"
                                >
                                    <RotateCcw className="h-3 w-3 text-[#8c8c8c]" />
                                    <span>replay</span>
                                </button>
                            </div>

                            {/* Terminal Canvas */}
                            <div className="rounded-[4px] bg-[#0a0a0a] p-3 sm:p-4">
                                <TerminalPreview
                                    mode={activeItem.terminalMode}
                                    replayKey={replayKey}
                                    heightClass={activeItem.terminalHeight}
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
                                    className="text-[0.8rem] text-[#8c8c8c] hover:text-white flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/[0.04] transition-colors min-h-[32px]"
                                >
                                    {copiedKey === 'usage-btn' ? (
                                        <>
                                            <Check className="h-3.5 w-3.5 text-[#fb923c]" />
                                            <span className="text-[#fb923c]">copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3.5 w-3.5" />
                                            <span>copy code</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="rounded-[4px] bg-[#181818] p-3 sm:p-4 text-[0.84rem] overflow-x-auto code-scroll border border-[#222222]">
                                <CodeBlock code={activeItem.codeSnippet} language="tsx" />
                            </div>
                        </section>
                    )}

                    {/* Component Variations Section */}
                    {activeItem.variations && activeItem.variations.length > 0 && (
                        <section id="variations" className="flex flex-col gap-8">
                            <div className="flex items-center justify-between pb-1">
                                <span className="text-[1.05rem] font-semibold text-white tracking-[-0.01em]">
                                    variations
                                </span>
                            </div>

                            <div className="flex flex-col gap-14">
                                {activeItem.variations.map((variation, vIdx) => {
                                    const copyKey = `var-${activeItem.id}-${variation.id}`
                                    const promptCommand = `tui preview ${activeItem.id} --${variation.id}`
                                    const vReplayKey = variantReplayKeys[variation.id] || 0

                                    return (
                                        <div
                                            key={variation.id}
                                            id={`variation-${variation.id}`}
                                            className="flex flex-col gap-6"
                                        >
                                            {/* 1. Variant Heading */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-[0.82rem] font-mono text-[#fb923c]">
                                                        0{vIdx + 1}
                                                    </span>
                                                    <h3 className="text-[1.05rem] font-semibold text-white tracking-[-0.01em]">
                                                        {variation.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* 2. Terminal Preview */}
                                            {(variation.terminalLines ||
                                                variation.terminalMode) && (
                                                <div className="flex flex-col gap-2.5">
                                                    <div className="flex items-center justify-between pb-1">
                                                        <span className="text-[0.82rem] font-medium text-[#8c8c8c] font-mono">
                                                            preview
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                setVariantReplayKeys((prev) => ({
                                                                    ...prev,
                                                                    [variation.id]:
                                                                        (prev[variation.id] || 0) +
                                                                        1,
                                                                }))
                                                            }
                                                            className="text-[0.78rem] text-[#8c8c8c] hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/[0.04] transition-colors cursor-pointer"
                                                            title="replay terminal animation"
                                                        >
                                                            <RotateCcw className="h-3 w-3 text-[#8c8c8c]" />
                                                            <span>replay</span>
                                                        </button>
                                                    </div>
                                                    <div className="rounded-[4px] bg-[#0a0a0a] p-3 sm:p-4">
                                                        <TerminalPreview
                                                            mode={
                                                                variation.terminalMode ||
                                                                variation.id
                                                            }
                                                            lines={variation.terminalLines}
                                                            promptCmd={promptCommand}
                                                            replayKey={vReplayKey}
                                                            interactive={true}
                                                            heightClass={activeItem.terminalHeight}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* 3. Usage Code */}
                                            <div className="flex flex-col gap-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[0.82rem] font-medium text-[#8c8c8c] font-mono">
                                                        usage
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleCopy(
                                                                variation.codeSnippet,
                                                                copyKey
                                                            )
                                                        }
                                                        className="text-[0.8rem] text-[#8c8c8c] hover:text-white flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/[0.04] transition-colors min-h-[32px] cursor-pointer"
                                                        title="copy code snippet"
                                                    >
                                                        {copiedKey === copyKey ? (
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
                                                </div>
                                                <div className="rounded-[4px] bg-[#181818] p-3 sm:p-4 text-[0.84rem] overflow-x-auto code-scroll border border-[#222222]">
                                                    <CodeBlock
                                                        code={variation.codeSnippet}
                                                        language="tsx"
                                                    />
                                                </div>
                                            </div>

                                            {/* 4. Other Info */}
                                            {variation.description && (
                                                <div className="flex flex-col gap-1 rounded-[4px] bg-[#141414] p-3 sm:p-3.5 border border-[#222222]">
                                                    <span className="text-[0.75rem] font-mono uppercase tracking-wider text-[#8c8c8c]">
                                                        info
                                                    </span>
                                                    <p className="text-[0.85rem] text-[#cccccc] leading-relaxed">
                                                        {variation.description}
                                                    </p>
                                                </div>
                                            )}
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
                                        <div className="rounded-[4px] bg-[#181818] p-3 sm:p-4 text-[0.84rem] overflow-x-auto code-scroll border border-[#222222]">
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
                                                        className="rounded-[4px] border border-[#222222] bg-[#141414] p-3.5 sm:p-4 flex flex-col gap-2.5 transition-colors hover:border-[#2e2e2e]"
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
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
                                                                    className="self-start sm:self-auto text-[0.78rem] text-[#8c8c8c] hover:text-white flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded bg-[#1c1c1c] border border-[#2a2a2a] hover:border-[#383838] transition-colors min-h-[32px] cursor-pointer"
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
                                                            <div className="rounded-[4px] bg-[#181818] p-3 text-[0.82rem] overflow-x-auto code-scroll border border-[#222222] mt-1">
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
                            <div className="w-full overflow-x-auto code-scroll rounded-[4px] border border-[#222222]">
                                <table className="w-full min-w-[500px] text-left text-[0.84rem]">
                                    <thead>
                                        <tr className="bg-[#181818]/80 text-[#5c5c5c] text-[0.78rem] border-b border-[#222222]">
                                            <th className="py-2.5 px-3 font-semibold">prop</th>
                                            <th className="py-2.5 px-3 font-semibold">type</th>
                                            <th className="py-2.5 px-3 font-semibold">default</th>
                                            <th className="py-2.5 px-3 font-semibold">
                                                description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1f1f1f]">
                                        {activeItem.props.map((p, idx) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-white/[0.025] transition-colors"
                                            >
                                                <td className="py-2.5 px-3 text-white font-medium whitespace-nowrap">
                                                    {p.prop}
                                                </td>
                                                <td className="py-2.5 px-3 text-[#8c8c8c] whitespace-nowrap font-mono text-[0.8rem]">
                                                    {p.type}
                                                </td>
                                                <td className="py-2.5 px-3 text-[#5c5c5c] whitespace-nowrap">
                                                    {p.default || 'none'}
                                                </td>
                                                <td className="py-2.5 px-3 text-[#e2e2e2]">
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
                    <div className="pt-4 pb-2 flex items-center justify-between text-[0.85rem] gap-2">
                        {prevItem ? (
                            <button
                                onClick={() => selectDocItem(prevItem.id)}
                                className="flex flex-col items-start gap-0.5 p-2 rounded hover:bg-white/[0.04] text-left transition-colors min-h-[44px] justify-center focus:outline-none focus-visible:outline-none"
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
                                className="flex flex-col items-end gap-0.5 p-2 rounded hover:bg-white/[0.04] text-right transition-colors min-h-[44px] justify-center focus:outline-none focus-visible:outline-none"
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
                <aside className="hidden xl:block w-48 shrink-0 h-full overflow-y-auto no-scrollbar pl-10 pr-0 py-2 text-left ml-auto xl:-mr-3">
                    <div className="flex flex-col gap-3">
                        <span className="text-[0.92rem] font-semibold text-white tracking-tight">
                            on this page
                        </span>
                        <div className="flex flex-col gap-1">
                            {activeItem.toc.map((item) => {
                                const isActive = activeTocId === item.id
                                const isSubItem =
                                    item.id.startsWith('variation-') ||
                                    item.id.startsWith('example-')
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`
                                            text-left transition-colors cursor-pointer truncate focus:outline-none focus-visible:outline-none
                                            ${isSubItem ? 'pl-2.5 text-[0.80rem] py-0.5' : 'text-[0.88rem] py-1'}
                                            ${
                                                isActive
                                                    ? 'text-white font-medium'
                                                    : isSubItem
                                                      ? 'text-[#707070] hover:text-[#e2e2e2]'
                                                      : 'text-[#8c8c8c] hover:text-white'
                                            }
                                        `}
                                        title={item.label}
                                    >
                                        <span className="truncate block">{item.label}</span>
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
