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
    {
        name: 'pill',
        type: 'ui',
        title: 'Pill',
        description: 'Compact badge chip for metadata, tags, and status labels.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/pill.tsx',
                target: 'pill.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'spinner',
        type: 'ui',
        title: 'Spinner',
        description: 'Animated terminal dot spinner with an optional status label.',
        dependencies: ['ink-spinner'],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/spinner.tsx',
                target: 'spinner.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'text-area',
        type: 'ui',
        title: 'Text Area',
        description:
            'Multiline terminal input with inverse block cursor, history navigation, slash commands, and @file mentions.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/text-area.tsx',
                target: 'text-area.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'header',
        type: 'ui',
        title: 'Header Banner',
        description:
            'Session status banner with Git branch detection, current directory path, and actionable tips.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/header.tsx',
                target: 'header.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'mermaid',
        type: 'ui',
        title: 'Mermaid Diagram',
        description: 'Pure terminal Unicode renderer for flowchart, sequence, and pie diagrams.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/mermaid.tsx',
                target: 'mermaid.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'markdown',
        type: 'ui',
        title: 'Markdown Renderer',
        description:
            'Terminal markdown parser supporting tables, lists, syntax-highlighted codeblocks, and inline diagrams.',
        dependencies: ['marked', 'cli-highlight'],
        devDependencies: ['@types/marked'],
        registryDependencies: ['theme', 'mermaid'],
        files: [
            {
                path: 'components/markdown.tsx',
                target: 'markdown.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'user-message',
        type: 'ui',
        title: 'User Message',
        description: 'Terminal user prompt message bubble with prompt chevron glyph.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/user-message.tsx',
                target: 'user-message.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'error-message',
        type: 'ui',
        title: 'Error Message',
        description:
            'Formatted terminal error display with automatic hint extraction and clickable link styling.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/error-message.tsx',
                target: 'error-message.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'select-menu',
        type: 'ui',
        title: 'Select Menu',
        description:
            'Keyboard-navigable terminal selection list with active state, hints, and keybinding footer.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme', 'menu-footer'],
        files: [
            {
                path: 'components/select-menu.tsx',
                target: 'select-menu.tsx',
                type: 'ui',
            },
            {
                path: 'components/menu-footer.tsx',
                target: 'menu-footer.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'command-menu',
        type: 'ui',
        title: 'Command Menu',
        description:
            'Slash command palette with real-time fuzzy filtering, pagination window, and tab completion.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme', 'menu-footer'],
        files: [
            {
                path: 'components/command-menu.tsx',
                target: 'command-menu.tsx',
                type: 'ui',
            },
            {
                path: 'components/menu-footer.tsx',
                target: 'menu-footer.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'shortcuts-menu',
        type: 'ui',
        title: 'Shortcuts Menu',
        description:
            'Interactive terminal keyboard shortcuts overlay menu with navigation and pagination.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme', 'menu-footer'],
        files: [
            {
                path: 'components/shortcuts-menu.tsx',
                target: 'shortcuts-menu.tsx',
                type: 'ui',
            },
            {
                path: 'components/menu-footer.tsx',
                target: 'menu-footer.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'plan-approve-menu',
        type: 'ui',
        title: 'Plan Approval Menu',
        description:
            'Agent workflow action menu for reviewing, refining, approving, or rejecting execution plans.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme', 'menu-footer'],
        files: [
            {
                path: 'components/plan-approve-menu.tsx',
                target: 'plan-approve-menu.tsx',
                type: 'ui',
            },
            {
                path: 'components/menu-footer.tsx',
                target: 'menu-footer.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'input-bar',
        type: 'ui',
        title: 'Input Bar',
        description:
            'Complete terminal agent input bar with multiline prompt, slash commands, file mentions, and status display.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: [
            'theme',
            'text-area',
            'command-menu',
            'shortcuts-menu',
            'menu-footer',
        ],
        files: [
            {
                path: 'components/input-bar.tsx',
                target: 'input-bar.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'card',
        type: 'ui',
        title: 'Card',
        description:
            'Displays a boxed card container with optional header, title, description, content, and footer.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/card.tsx',
                target: 'card.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'button',
        type: 'ui',
        title: 'Button',
        description:
            'Interactive terminal button and action chip with variants (default, secondary, destructive, outline, ghost, link, bracket) and keyboard focus.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/button.tsx',
                target: 'button.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'tabs',
        type: 'ui',
        title: 'Tabs',
        description:
            'A set of layered sections of content—known as tab panels—that are displayed one at a time via keyboard arrows.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/tabs.tsx',
                target: 'tabs.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'dialog',
        type: 'ui',
        title: 'Dialog',
        description:
            'A modal dialog overlay that interrupts the user with important content and expects a response (confirm or cancel).',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/dialog.tsx',
                target: 'dialog.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'progress',
        type: 'ui',
        title: 'Progress',
        description:
            'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/progress.tsx',
                target: 'progress.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'checkbox',
        type: 'ui',
        title: 'Checkbox',
        description:
            'A control that allows the user to toggle between checked and not-checked states via space or enter.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/checkbox.tsx',
                target: 'checkbox.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'radio-group',
        type: 'ui',
        title: 'Radio Group',
        description:
            'A set of checkable buttons—known as radio buttons—where no more than one can be checked at a time.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/radio-group.tsx',
                target: 'radio-group.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'skeleton',
        type: 'ui',
        title: 'Skeleton',
        description: 'Use to show a placeholder while content is loading in terminal agents.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/skeleton.tsx',
                target: 'skeleton.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'toast',
        type: 'ui',
        title: 'Toast',
        description:
            'A succinct message that is displayed temporarily to provide feedback about an operation.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/toast.tsx',
                target: 'toast.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'table',
        type: 'ui',
        title: 'Table',
        description:
            'A responsive terminal data grid component supporting structured column headers, rows, and cells.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/table.tsx',
                target: 'table.tsx',
                type: 'ui',
            },
        ],
    },
    {
        name: 'switch',
        type: 'ui',
        title: 'Switch',
        description:
            'A binary state toggle switch for terminal interfaces with glyph track and badge display variants.',
        dependencies: [],
        devDependencies: [],
        registryDependencies: ['theme'],
        files: [
            {
                path: 'components/switch.tsx',
                target: 'switch.tsx',
                type: 'ui',
            },
        ],
    },
]
