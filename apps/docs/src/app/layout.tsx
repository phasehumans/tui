import type { Metadata } from 'next'
import './globals.css'
import '@xterm/xterm/css/xterm.css'

export const metadata: Metadata = {
    title: '@trydecember/tui - UI library for terminal agents',
    description:
        'An unbundled, copy-paste UI component library for terminal agents built with React & Ink.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-[#090d16] text-zinc-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
                {children}
            </body>
        </html>
    )
}
