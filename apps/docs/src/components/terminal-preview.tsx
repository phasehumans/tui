'use client'

import dynamic from 'next/dynamic'

export const TerminalPreview = dynamic(
    () => import('./terminal-inner').then((mod) => mod.TerminalInner),
    {
        ssr: false,
        loading: () => (
            <div className="h-80 w-full animate-pulse rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-500 font-mono text-xs">
                Initializing virtual terminal...
            </div>
        ),
    }
)
