'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import type { TerminalInnerProps } from './terminal-inner'

const TerminalInner = dynamic(() => import('./terminal-inner').then((mod) => mod.TerminalInner), {
    ssr: false,
    loading: () => (
        <div className="h-64 sm:h-72 w-full animate-pulse rounded border border-[#2a2a2a] bg-[#0a0a0a] flex items-center justify-center text-[#5c5c5c] font-mono text-xs">
            loading virtual terminal...
        </div>
    ),
})

export interface TerminalPreviewProps {
    mode?: TerminalInnerProps['mode']
    lines?: string[]
    promptCmd?: string
    replayKey?: number
    heightClass?: string
    interactive?: boolean
}

export function TerminalPreview({
    mode = 'all',
    lines,
    promptCmd,
    replayKey = 0,
    heightClass = 'h-64 sm:h-72',
    interactive,
}: TerminalPreviewProps) {
    return (
        <TerminalInner
            mode={mode}
            lines={lines}
            promptCmd={promptCmd}
            replayKey={replayKey}
            heightClass={heightClass}
            interactive={interactive}
        />
    )
}
