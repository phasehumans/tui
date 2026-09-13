import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/data/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                bg: '#141414',
                border: '#2a2a2a',
                'border-subtle': '#202020',
                text: '#e2e2e2',
                'text-bright': '#ffffff',
                'text-muted': '#8c8c8c',
                'text-dim': '#5c5c5c',
                accent: '#fb923c',
                'accent-hover': '#fdba74',
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'monospace'],
            },
        },
    },
    plugins: [],
}

export default config

