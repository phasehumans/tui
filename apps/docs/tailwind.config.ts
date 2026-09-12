import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: '#89B4F8',
                background: '#090d16',
                surface: '#0f172a',
                border: '#1e293b',
            },
        },
    },
    plugins: [],
}

export default config
