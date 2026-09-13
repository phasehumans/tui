'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import type { TerminalInnerProps } from './terminal-inner'

const TerminalInner = dynamic(
    () => import('./terminal-inner').then((mod) => mod.TerminalInner),
    {
        ssr: false,
        loading: () => (
            <div className="h-64 sm:h-72 w-full animate-pulse rounded border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#5c5c5c] font-mono text-xs">
                loading virtual terminal...
            </div>
        ),
    }
)

export interface TerminalPreviewProps {
    mode?: TerminalInnerProps['mode']
    replayKey?: number
}

export function TerminalPreview({ mode = 'all', replayKey = 0 }: TerminalPreviewProps) {
    return <TerminalInner mode={mode} replayKey={replayKey} />
}
