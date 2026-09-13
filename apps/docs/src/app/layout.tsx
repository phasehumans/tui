import type { Metadata } from 'next'
import './globals.css'
import '@xterm/xterm/css/xterm.css'

export const metadata: Metadata = {
    title: 'tui — the shadcn/ui for terminal agents',
    description:
        'an unbundled, copy-paste ui component library for terminal agents built with react & ink.',
    icons: {
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text x='50%' y='53%' dominant-baseline='middle' text-anchor='middle' font-size='31' fill='%23fb923c' font-family='system-ui, -apple-system, sans-serif'>✱</text></svg>",
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen bg-[#141414] text-[#e2e2e2] antialiased">{children}</body>
        </html>
    )
}
