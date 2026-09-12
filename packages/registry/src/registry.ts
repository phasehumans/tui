export interface RegistryFile {
    name: string
    content: string
    target: string
}

export interface RegistryItem {
    name: string
    type: 'ui' | 'lib' | 'theme'
    title: string
    description: string
    dependencies?: string[]
    devDependencies?: string[]
    registryDependencies?: string[]
    files: Array<{
        path: string
        target: string
        type: 'ui' | 'lib' | 'theme'
    }>
}

export const REGISTRY_ITEMS: RegistryItem[] = [
    {
        name: 'theme',
        type: 'theme',
        title: 'Theme Tokens',
        description: 'Central design tokens for terminal agents (colors, glyphs, padding).',
        dependencies: [],
        devDependencies: [],
        registryDependencies: [],
        files: [
            {
                path: 'theme.ts',
                target: 'theme.ts',
                type: 'theme',
            },
        ],
    },
    {
        name: 'collapsible-reasoning',
        type: 'ui',
        title: 'Collapsible Reasoning',
        description: 'Foldable chain-of-thought block with duration and token count.',
        dependencies: ['ink-spinner'],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/collapsible-reasoning.tsx',
                target: 'collapsible-reasoning.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'tool-call-card',
        type: 'ui',
        title: 'Tool Call Card',
        description:
            'Execution status card for tool calls with live spinners and expandable stdout.',
        dependencies: ['ink-spinner'],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/tool-call-card.tsx',
                target: 'tool-call-card.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'diff-viewer',
        type: 'ui',
        title: 'Diff Viewer',
        description: 'Red and green chunk diff renderer with line truncation and branch glyphs.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/diff-viewer.tsx',
                target: 'diff-viewer.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'streaming-text',
        type: 'ui',
        title: 'Streaming Text',
        description: 'Smooth text and markdown stream renderer with terminal cursor indicator.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/streaming-text.tsx',
                target: 'streaming-text.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'token-gauge',
        type: 'ui',
        title: 'Token Gauge',
        description: 'Visual terminal meter for context window and token usage monitoring.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/token-gauge.tsx',
                target: 'token-gauge.tsx',
                type: 'ui',
            },
        ],
    },
]
