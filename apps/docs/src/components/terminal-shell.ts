// Terminal Shell and Interactive State Engine for @trydecember/tui
// Operates 100% client-side inside virtual terminal emulator (xterm.js)

export function getPrompt(cwd = '~/code/tui'): string {
    return `\x1b[38;2;74;222;128muser@december\x1b[0m:\x1b[38;2;137;180;248m${cwd}\x1b[0m$ `
}

export const PROMPT_STRING = getPrompt('~/code/tui')

export const PROMPT_PLAIN = 'user@december:~/code/tui$ '

export const SIMULATED_FS: Record<string, { dirs: string[]; files: Record<string, string> }> = {
    '~': {
        dirs: ['code'],
        files: {
            '.bashrc': '# december bashrc\nexport THEME=emerald\n',
        },
    },
    '~/code': {
        dirs: ['tui', 'december'],
        files: {},
    },
    '~/code/tui': {
        dirs: ['apps', 'packages', 'docs'],
        files: {
            'package.json': JSON.stringify(
                {
                    name: '@trydecember/tui',
                    version: '0.3.28',
                    private: true,
                    workspaces: ['apps/*', 'packages/*'],
                },
                null,
                2
            ),
            'tui.json': JSON.stringify(
                {
                    $schema: 'https://tui.trydecember.com/schema.json',
                    style: 'default',
                    aliases: {
                        components: '@/components',
                        theme: '@/theme',
                    },
                },
                null,
                2
            ),
            'theme.ts':
                '// @trydecember/tui theme tokens\nexport const THEME = createTheme("default")\n',
            'README.md':
                '# @trydecember/tui\nUnbundled, copy-paste terminal UI component library for React + Ink.\n',
            'tsconfig.json':
                '{\n  "compilerOptions": {\n    "target": "ESNext",\n    "module": "ESNext"\n  }\n}\n',
        },
    },
    '~/code/tui/apps': {
        dirs: ['docs', 'cli'],
        files: {
            'package.json': '{\n  "name": "apps"\n}\n',
        },
    },
    '~/code/tui/packages': {
        dirs: ['registry', 'core'],
        files: {
            'package.json': '{\n  "name": "packages"\n}\n',
        },
    },
    '~/code/tui/docs': {
        dirs: [],
        files: {
            'index.md': '# Documentation\n',
        },
    },
}

export const AVAILABLE_COMPONENTS: string[] = [
    'collapsible-reasoning',
    'tool-call-card',
    'diff-viewer',
    'streaming-text',
    'token-gauge',
    'pill',
    'spinner',
    'matrix-loader',
    'text-area',
    'header',
    'mermaid',
    'markdown',
    'user-message',
    'error-message',
    'select-menu',
    'command-menu',
    'shortcuts-menu',
    'plan-approve-menu',
    'input-bar',
    'card',
    'button',
    'tabs',
    'dialog',
    'progress',
    'checkbox',
    'radio-group',
    'skeleton',
    'toast',
    'table',
    'switch',
]

export const AVAILABLE_THEMES = [
    'default',
    'amber',
    'emerald',
    'cyan',
    'monochrome',
    'zinc',
    'slate',
]

export interface ParsedCommand {
    command: string
    args: string[]
}

export function parseCommand(raw: string): ParsedCommand {
    const trimmed = raw.trim()
    if (!trimmed) return { command: '', args: [] }
    const parts = trimmed.split(/\s+/)
    return {
        command: parts[0] || '',
        args: parts.slice(1),
    }
}

export interface ShellContext {
    cwd?: string
    theme?: string
}

export type CommandResult =
    | { type: 'output'; output: string }
    | { type: 'clear' }
    | { type: 'preview'; component: string }
    | { type: 'theme'; themePreset: string; output: string }
    | { type: 'cd'; newCwd: string; output?: string }
    | { type: 'replay' }
    | { type: 'error'; output: string }

export function executeCommand(raw: string, context: ShellContext = {}): CommandResult {
    const { command, args } = parseCommand(raw)
    const cwd = context.cwd || '~/code/tui'
    if (!command) return { type: 'output', output: '' }

    if (command === 'clear') {
        return { type: 'clear' }
    }

    if (command === 'pwd') {
        const fullPath = cwd.startsWith('~/')
            ? '/home/user/' + cwd.slice(2)
            : cwd === '~'
              ? '/home/user'
              : cwd
        return { type: 'output', output: fullPath }
    }

    if (command === 'whoami') {
        return { type: 'output', output: 'user' }
    }

    if (command === 'date') {
        return { type: 'output', output: new Date().toUTCString() }
    }

    if (command === 'uname') {
        return { type: 'output', output: 'Linux december 6.8.0-agent x86_64 GNU/Linux' }
    }

    if (command === 'echo') {
        return { type: 'output', output: args.join(' ') }
    }

    if (command === 'bun') {
        return { type: 'output', output: '1.3.14' }
    }

    if (command === 'node') {
        return { type: 'output', output: 'v22.14.0' }
    }

    if (command === 'npm') {
        return { type: 'output', output: '10.8.2' }
    }

    if (command === 'git') {
        const sub = args[0]
        if (sub === 'status') {
            return {
                type: 'output',
                output: "On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean",
            }
        }
        if (sub === 'branch') {
            return { type: 'output', output: '* main' }
        }
        if (sub === 'log') {
            return {
                type: 'output',
                output: '\x1b[38;2;251;146;60mcommit 17e079e\x1b[0m (HEAD -> main)\nAuthor: chaitanya <dev.chaitanyasonawane@gmail.com>\nDate:   Mon Sep 14 2026\n\n    feat(docs): add interactive terminal shell repl and component controls',
            }
        }
        return { type: 'output', output: 'git version 2.43.0' }
    }

    if (command === 'ls' || command === 'dir') {
        const isLa = args.includes('-la') || args.includes('-l') || args.includes('-al')
        const current = SIMULATED_FS[cwd] || { dirs: [], files: {} }
        if (isLa) {
            const lines = [
                'total 40',
                'drwxr-xr-x  8 user user 4096 Sep 14 07:30 .',
                'drwxr-xr-x  3 user user 4096 Sep 14 07:00 ..',
            ]
            for (const d of current.dirs) {
                lines.push(
                    `drwxr-xr-x  2 user user 4096 Sep 14 07:25 \x1b[1;38;2;137;180;248m${d}\x1b[0m`
                )
            }
            for (const [f, content] of Object.entries(current.files)) {
                const size = content.length.toString().padStart(4, ' ')
                lines.push(`-rw-r--r--  1 user user ${size} Sep 14 07:25 ${f}`)
            }
            return { type: 'output', output: lines.join('\n') }
        } else {
            const dirItems = current.dirs.map((d) => `\x1b[1;38;2;137;180;248m${d}/\x1b[0m`)
            const fileItems = Object.keys(current.files)
            const all = [...dirItems, ...fileItems]
            return { type: 'output', output: '  ' + all.join('   ') }
        }
    }

    if (command === 'cd') {
        const target = args[0]
        if (!target || target === '~') {
            return { type: 'cd', newCwd: '~' }
        }
        if (target === '..') {
            if (cwd === '~') return { type: 'cd', newCwd: '~' }
            const parts = cwd.split('/')
            parts.pop()
            const up = parts.join('/') || '~'
            return { type: 'cd', newCwd: up }
        }
        if (target === '.') {
            return { type: 'cd', newCwd: cwd }
        }
        const candidate = `${cwd}/${target}`.replace('~//', '~/')
        if (SIMULATED_FS[candidate]) {
            return { type: 'cd', newCwd: candidate }
        }
        if (SIMULATED_FS[target]) {
            return { type: 'cd', newCwd: target }
        }
        return {
            type: 'error',
            output: `cd: no such file or directory: ${target}`,
        }
    }

    if (command === 'cat') {
        const fileName = args[0]
        if (!fileName) {
            return { type: 'error', output: 'usage: cat <file>' }
        }
        const current = SIMULATED_FS[cwd] || { dirs: [], files: {} }
        const content = current.files[fileName]
        if (content !== undefined) {
            return { type: 'output', output: content.trimEnd() }
        }
        return {
            type: 'error',
            output: `cat: no such file: ${fileName}`,
        }
    }

    if (command === 'help') {
        const helpLines = [
            '\x1b[1;38;2;251;146;60mDecember TUI Interactive Shell\x1b[0m',
            'Available commands:',
            '  \x1b[38;2;137;180;248mtui preview <component>\x1b[0m   Render and interact with a component',
            '  \x1b[38;2;137;180;248mtui add <component>\x1b[0m       Simulate adding a component to project',
            '  \x1b[38;2;137;180;248mtui list\x1b[0m                  List all 30 available UI components',
            '  \x1b[38;2;137;180;248mtui theme <preset>\x1b[0m        Switch active theme (emerald, amber, cyan...)',
            '  \x1b[38;2;137;180;248mreplay\x1b[0m                    Re-run current component animation',
            '  \x1b[38;2;137;180;248mclear\x1b[0m                     Clear the terminal screen',
            '  \x1b[38;2;137;180;248mhelp\x1b[0m                      Show this help message',
            '',
            'Tips:',
            '  • Press \x1b[38;2;253;214;99mTab\x1b[0m for autocompletion of commands and component names.',
            '  • Use \x1b[38;2;253;214;99m↑/↓\x1b[0m arrows to navigate through command history.',
            '  • In interactive component mode, press \x1b[38;2;253;214;99mq\x1b[0m or \x1b[38;2;253;214;99mCtrl+C\x1b[0m to return here.',
        ]
        return { type: 'output', output: helpLines.join('\n') }
    }

    if (command === 'replay') {
        return { type: 'replay' }
    }

    if (command === 'tui') {
        const subcommand = args[0]?.toLowerCase()

        if (!subcommand || subcommand === 'help') {
            return executeCommand('help')
        }

        if (subcommand === 'list') {
            const lines = [
                '\x1b[1;38;2;251;146;60mAvailable Components (30):\x1b[0m',
                '  \x1b[38;2;170;170;170mprimitives:\x1b[0m   button, pill, switch, checkbox, radio-group, input-bar, text-area, tabs',
                '  \x1b[38;2;170;170;170mmenus:\x1b[0m        select-menu, command-menu, shortcuts-menu, plan-approve-menu',
                '  \x1b[38;2;170;170;170mfeedback:\x1b[0m     spinner, matrix-loader, progress, skeleton, toast, dialog',
                '  \x1b[38;2;170;170;170magent flows:\x1b[0m  collapsible-reasoning, tool-call-card, diff-viewer, streaming-text, token-gauge',
                '  \x1b[38;2;170;170;170mdisplay:\x1b[0m      card, header, mermaid, markdown, table, user-message, error-message',
                '',
                'Run \x1b[38;2;137;180;248mtui preview <component>\x1b[0m to test any component live.',
            ]
            return { type: 'output', output: lines.join('\n') }
        }

        if (subcommand === 'preview') {
            const comp = args[1]?.toLowerCase()
            if (!comp) {
                return {
                    type: 'error',
                    output: 'usage: tui preview <component>\nExample: tui preview select-menu',
                }
            }
            if (!AVAILABLE_COMPONENTS.includes(comp)) {
                return {
                    type: 'error',
                    output: `component "${comp}" not found in registry.\nRun \x1b[38;2;137;180;248mtui list\x1b[0m to see all available components.`,
                }
            }
            return { type: 'preview', component: comp }
        }

        if (subcommand === 'add') {
            const comp = args[1]?.toLowerCase()
            if (!comp) {
                return {
                    type: 'error',
                    output: 'usage: tui add <component>\nExample: tui add select-menu',
                }
            }
            if (!AVAILABLE_COMPONENTS.includes(comp)) {
                return {
                    type: 'error',
                    output: `error: component "${comp}" does not exist in registry.`,
                }
            }

            const lines = [
                `\x1b[38;2;74;222;128m✔\x1b[0m fetched \x1b[1m${comp}\x1b[0m from registry`,
                `\x1b[38;2;74;222;128m✔\x1b[0m verified dependencies`,
                `\x1b[38;2;74;222;128m✔\x1b[0m created \x1b[38;2;137;180;248mcomponents/${comp}.tsx\x1b[0m`,
                `\x1b[38;2;74;222;128m✔\x1b[0m updated tui.json`,
                '',
                `Component \x1b[1;38;2;251;146;60m${comp}\x1b[0m installed! Import via:`,
                `\x1b[38;2;170;170;170mimport { ${toPascalCase(comp)} } from '@/components/${comp}'\x1b[0m`,
            ]
            return { type: 'output', output: lines.join('\n') }
        }

        if (subcommand === 'theme') {
            const preset = args[1]?.toLowerCase()
            if (!preset) {
                return {
                    type: 'error',
                    output: `usage: tui theme <preset>\nAvailable presets: ${AVAILABLE_THEMES.join(', ')}`,
                }
            }
            if (!AVAILABLE_THEMES.includes(preset)) {
                return {
                    type: 'error',
                    output: `invalid theme preset "${preset}". Available: ${AVAILABLE_THEMES.join(', ')}`,
                }
            }
            return {
                type: 'theme',
                themePreset: preset,
                output: `\x1b[38;2;74;222;128m✔\x1b[0m switched active theme preset to \x1b[1;38;2;251;146;60m${preset}\x1b[0m`,
            }
        }

        return {
            type: 'error',
            output: `unknown tui subcommand: "${subcommand}". Run "tui help" for options.`,
        }
    }

    return {
        type: 'error',
        output: `command not found: ${command}. Type "help" for available commands.`,
    }
}

export function autocomplete(
    input: string,
    context?: ShellContext
): { completed: string; suggestions?: string[] } {
    const trimmedStart = input.trimStart()

    // Base commands
    const topCommands = [
        'tui',
        'help',
        'clear',
        'replay',
        'ls',
        'cd',
        'pwd',
        'cat',
        'echo',
        'whoami',
        'uname',
        'git',
        'date',
        'bun',
        'node',
    ]
    if (!trimmedStart.includes(' ')) {
        const matches = topCommands.filter((c) => c.startsWith(trimmedStart))
        if (matches.length === 1 && matches[0]) {
            return { completed: `${matches[0]} ` }
        }
        if (matches.length > 1) {
            return { completed: input, suggestions: matches }
        }
        return { completed: input }
    }

    // cd autocompletion
    if (trimmedStart.startsWith('cd ')) {
        const rest = trimmedStart.slice(3).trimStart()
        const cwd = context?.cwd || '~/code/tui'
        const current = SIMULATED_FS[cwd] || { dirs: [], files: {} }
        const available = [...current.dirs, '..', '~']
        if (!rest) {
            return { completed: input, suggestions: available }
        }
        const matches = available.filter((d) => d.startsWith(rest))
        if (matches.length === 1 && matches[0]) {
            return { completed: `cd ${matches[0]} ` }
        }
        if (matches.length > 1) {
            return { completed: input, suggestions: matches }
        }
        return { completed: input }
    }

    // cat autocompletion
    if (trimmedStart.startsWith('cat ')) {
        const rest = trimmedStart.slice(4).trimStart()
        const cwd = context?.cwd || '~/code/tui'
        const current = SIMULATED_FS[cwd] || { dirs: [], files: {} }
        const files = Object.keys(current.files)
        if (!rest) {
            return { completed: input, suggestions: files }
        }
        const matches = files.filter((f) => f.startsWith(rest))
        if (matches.length === 1 && matches[0]) {
            return { completed: `cat ${matches[0]} ` }
        }
        if (matches.length > 1) {
            return { completed: input, suggestions: matches }
        }
        return { completed: input }
    }

    // git autocompletion
    if (trimmedStart.startsWith('git ')) {
        const rest = trimmedStart.slice(4).trimStart()
        const gitSubs = ['status', 'branch', 'log']
        if (!rest) {
            return { completed: input, suggestions: gitSubs }
        }
        const matches = gitSubs.filter((s) => s.startsWith(rest))
        if (matches.length === 1 && matches[0]) {
            return { completed: `git ${matches[0]} ` }
        }
        if (matches.length > 1) {
            return { completed: input, suggestions: matches }
        }
        return { completed: input }
    }

    // Subcommands of tui
    if (trimmedStart.startsWith('tui ')) {
        const rest = trimmedStart.slice(4).trimStart()
        const tuiSubcommands = ['preview', 'add', 'list', 'theme', 'help']

        if (!rest.includes(' ')) {
            if (!rest) {
                return { completed: input, suggestions: tuiSubcommands }
            }
            const matches = tuiSubcommands.filter((sub) => sub.startsWith(rest))
            if (matches.length === 1 && matches[0]) {
                return { completed: `tui ${matches[0]} ` }
            }
            if (matches.length > 1) {
                return { completed: input, suggestions: matches }
            }
            return { completed: input }
        }

        // Subcommand with argument: e.g. tui preview <comp> or tui add <comp>
        if (rest.startsWith('preview ') || rest.startsWith('add ')) {
            const isPreview = rest.startsWith('preview ')
            const sub = isPreview ? 'preview' : 'add'
            const compQuery = rest.slice(sub.length + 1).trimStart()

            const matches = AVAILABLE_COMPONENTS.filter((c) => c.startsWith(compQuery))
            if (matches.length === 1 && matches[0]) {
                return { completed: `tui ${sub} ${matches[0]} ` }
            }
            if (matches.length > 1) {
                return { completed: input, suggestions: matches }
            }
            return { completed: input }
        }

        if (rest.startsWith('theme ')) {
            const themeQuery = rest.slice(6).trimStart()
            const matches = AVAILABLE_THEMES.filter((t) => t.startsWith(themeQuery))
            if (matches.length === 1 && matches[0]) {
                return { completed: `tui theme ${matches[0]} ` }
            }
            if (matches.length > 1) {
                return { completed: input, suggestions: matches }
            }
            return { completed: input }
        }
    }

    return { completed: input }
}

function toPascalCase(str: string): string {
    return str
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Component State Machines
// ─────────────────────────────────────────────────────────────────────────────

// 1. SelectMenu State
export interface SelectMenuItem {
    label: string
    value: string
    hint?: string
}

export interface SelectMenuState {
    items: SelectMenuItem[]
    selectedIndex: number
    submitted?: string
}

export function createSelectMenuState(
    items?: Array<{ label: string; value: string; hint?: string }>
): SelectMenuState {
    return {
        items: items || [
            { label: 'gemini-2.5-pro', value: 'gemini', hint: '(recommended)' },
            { label: 'claude-3.7-sonnet', value: 'claude', hint: '(thinking)' },
            { label: 'gpt-4o', value: 'gpt4o' },
            { label: 'deepseek-r1', value: 'deepseek' },
        ],
        selectedIndex: 0,
    }
}

export function handleSelectMenuKey(state: SelectMenuState, key: string): SelectMenuState {
    if (key === '\x1b[A' || key === 'k') {
        // Up arrow or k
        return {
            ...state,
            selectedIndex: Math.max(0, state.selectedIndex - 1),
        }
    }
    if (key === '\x1b[B' || key === 'j') {
        // Down arrow or j
        return {
            ...state,
            selectedIndex: Math.min(state.items.length - 1, state.selectedIndex + 1),
        }
    }
    if (key === '\r') {
        // Enter
        const selected = state.items[state.selectedIndex]
        return {
            ...state,
            submitted: selected ? selected.value : undefined,
        }
    }
    return state
}

export function renderSelectMenu(state: SelectMenuState): string[] {
    const lines: string[] = [
        '  \x1b[38;2;102;102;102m┌─ Model Selector ───────────────────────────────┐\x1b[0m',
    ]
    state.items.forEach((item, idx) => {
        const isSelected = idx === state.selectedIndex
        const glyph = isSelected
            ? '\x1b[38;2;251;146;60m●\x1b[0m'
            : '\x1b[38;2;102;102;102m○\x1b[0m'
        const labelStr = isSelected
            ? `\x1b[1;38;2;255;255;255m${item.label}\x1b[0m`
            : `\x1b[38;2;170;170;170m${item.label}\x1b[0m`
        const hintStr = item.hint ? ` \x1b[38;2;102;102;102m${item.hint}\x1b[0m` : ''
        lines.push(`  \x1b[38;2;102;102;102m│\x1b[0m  ${glyph} ${labelStr}${hintStr}`)
    })
    lines.push('  \x1b[38;2;102;102;102m└────────────────────────────────────────────────┘\x1b[0m')
    if (state.submitted) {
        lines.push(`  \x1b[38;2;74;222;128m✔ Confirmed selection: ${state.submitted}\x1b[0m`)
    }
    return lines
}

// 2. Switch State
export interface SwitchState {
    label: string
    checked: boolean
}

export function createSwitchState(opts?: { label?: string; checked?: boolean }): SwitchState {
    return {
        label: opts?.label || 'Automatic token streaming',
        checked: opts?.checked ?? false,
    }
}

export function handleSwitchKey(state: SwitchState, key: string): SwitchState {
    if (key === ' ' || key === '\r') {
        return { ...state, checked: !state.checked }
    }
    return state
}

export function renderSwitch(state: SwitchState): string[] {
    const glyph = state.checked
        ? '\x1b[38;2;74;222;128m─● ON \x1b[0m'
        : '\x1b[38;2;102;102;102m●─ OFF\x1b[0m'
    const statusText = state.checked
        ? '\x1b[38;2;74;222;128mactive\x1b[0m'
        : '\x1b[38;2;102;102;102mdisabled\x1b[0m'
    return [
        `  ${glyph}  \x1b[1;38;2;255;255;255m${state.label}\x1b[0m  (${statusText})`,
        '  \x1b[38;2;102;102;102m[Press Space to toggle]\x1b[0m',
    ]
}

// 3. Tabs State
export interface TabsState {
    tabs: string[]
    activeTab: number
}

export function createTabsState(tabs?: string[]): TabsState {
    return {
        tabs: tabs || ['Overview', 'Configuration', 'Telemetry'],
        activeTab: 0,
    }
}

export function handleTabsKey(state: TabsState, key: string): TabsState {
    const total = state.tabs.length
    if (key === '\t' || key === '\x1b[C' || key === 'l') {
        // Tab, right arrow, or l
        return { ...state, activeTab: (state.activeTab + 1) % total }
    }
    if (key === '\x1b[D' || key === 'h') {
        // Left arrow or h
        return { ...state, activeTab: (state.activeTab - 1 + total) % total }
    }
    return state
}

export function renderTabs(state: TabsState): string[] {
    const renderedTabs = state.tabs.map((tab, idx) => {
        const isActive = idx === state.activeTab
        return isActive
            ? `\x1b[1;38;2;251;146;60m[ ${tab} ]\x1b[0m`
            : `\x1b[38;2;102;102;102m  ${tab}  \x1b[0m`
    })
    const separator = '─'.repeat(48)
    const contentSamples = [
        'Agent running in headless background mode.',
        'Local path aliases resolved from tui.json.',
        'Token consumption: 42.1k / 128k (32%).',
    ]
    return [
        `  ${renderedTabs.join(' ')}`,
        `  \x1b[38;2;51;51;51m${separator}\x1b[0m`,
        `  \x1b[38;2;170;170;170m${contentSamples[state.activeTab] || 'Tab content'}\x1b[0m`,
        '',
        '  \x1b[38;2;102;102;102m[Use Tab or ← / → arrows to switch tabs]\x1b[0m',
    ]
}

// 4. Checkbox State
export interface CheckboxItem {
    label: string
    checked: boolean
}

export interface CheckboxState {
    items: CheckboxItem[]
    cursor: number
}

export function createCheckboxState(items?: CheckboxItem[]): CheckboxState {
    return {
        items: items || [
            { label: 'Run ESLint on save', checked: true },
            { label: 'Format with Biome', checked: true },
            { label: 'Auto-stage git diffs', checked: false },
            { label: 'Send telemetry logs', checked: false },
        ],
        cursor: 0,
    }
}

export function handleCheckboxKey(state: CheckboxState, key: string): CheckboxState {
    if (key === '\x1b[A' || key === 'k') {
        return { ...state, cursor: Math.max(0, state.cursor - 1) }
    }
    if (key === '\x1b[B' || key === 'j') {
        return { ...state, cursor: Math.min(state.items.length - 1, state.cursor + 1) }
    }
    if (key === ' ' || key === '\r') {
        const nextItems = state.items.map((item, idx) =>
            idx === state.cursor ? { ...item, checked: !item.checked } : item
        )
        return { ...state, items: nextItems }
    }
    return state
}

export function renderCheckbox(state: CheckboxState): string[] {
    const lines: string[] = []
    state.items.forEach((item, idx) => {
        const isCursor = idx === state.cursor
        const cursorGlyph = isCursor ? '\x1b[38;2;251;146;60m❭\x1b[0m' : ' '
        const checkGlyph = item.checked
            ? '\x1b[38;2;74;222;128m[✔]\x1b[0m'
            : '\x1b[38;2;102;102;102m[ ]\x1b[0m'
        const labelStr = isCursor
            ? `\x1b[1;38;2;255;255;255m${item.label}\x1b[0m`
            : `\x1b[38;2;170;170;170m${item.label}\x1b[0m`
        lines.push(`  ${cursorGlyph} ${checkGlyph} ${labelStr}`)
    })
    lines.push('  \x1b[38;2;102;102;102m[↑/↓ to navigate, Space to check/uncheck]\x1b[0m')
    return lines
}

// 5. PlanApproveMenu State
export interface PlanApproveState {
    choice: 'approve' | 'reject'
    submitted?: 'approve' | 'reject'
}

export function createPlanApproveState(): PlanApproveState {
    return { choice: 'approve' }
}

export function handlePlanApproveKey(state: PlanApproveState, key: string): PlanApproveState {
    if (key === '\x1b[C' || key === '\x1b[D' || key === '\t' || key === 'h' || key === 'l') {
        return {
            ...state,
            choice: state.choice === 'approve' ? 'reject' : 'approve',
        }
    }
    if (key === '\r') {
        return { ...state, submitted: state.choice }
    }
    return state
}

export function renderPlanApprove(state: PlanApproveState): string[] {
    const approveBtn =
        state.choice === 'approve'
            ? '\x1b[1;38;2;74;222;128m[ ✔ Approve Plan ]\x1b[0m'
            : '\x1b[38;2;102;102;102m  Approve Plan  \x1b[0m'
    const rejectBtn =
        state.choice === 'reject'
            ? '\x1b[1;38;2;248;113;113m[ ✖ Reject & Edit ]\x1b[0m'
            : '\x1b[38;2;102;102;102m  Reject & Edit  \x1b[0m'

    const lines = [
        '  \x1b[1;38;2;255;255;255mAgent proposed execution plan:\x1b[0m',
        '  \x1b[38;2;170;170;170m1. Verify token signature\x1b[0m',
        '  \x1b[38;2;170;170;170m2. Check payload expiration timestamp\x1b[0m',
        '  \x1b[38;2;170;170;170m3. Return 401 on validation failure\x1b[0m',
        '',
        `  ${approveBtn}   ${rejectBtn}`,
        '',
        '  \x1b[38;2;102;102;102m[← / → or Tab to toggle, Enter to confirm]\x1b[0m',
    ]
    if (state.submitted) {
        lines.push(
            `  \x1b[38;2;251;146;60m● Action confirmed: ${state.submitted.toUpperCase()}\x1b[0m`
        )
    }
    return lines
}

// 6. InputBar State
export interface InputBarState {
    text: string
    submitted?: string
}

export function createInputBarState(): InputBarState {
    return { text: '' }
}

export function handleInputBarKey(state: InputBarState, key: string): InputBarState {
    if (key === '\r') {
        return { ...state, submitted: state.text, text: '' }
    }
    if (key === '\x7f' || key === '\b') {
        return { ...state, text: state.text.slice(0, -1) }
    }
    if (key.length === 1 && key >= ' ' && key <= '~') {
        return { ...state, text: state.text + key }
    }
    return state
}

export function renderInputBar(state: InputBarState): string[] {
    const separator = '─'.repeat(48)
    const lines = [
        `  \x1b[38;2;51;51;51m${separator}\x1b[0m`,
        `  \x1b[38;2;137;180;248m❭\x1b[0m ${state.text}\x1b[7m \x1b[0m`,
        `  \x1b[38;2;51;51;51m${separator}\x1b[0m`,
        '  \x1b[38;2;102;102;102mgemini-2.5-flash                ? for shortcuts\x1b[0m',
        '  \x1b[38;2;102;102;102m[Type prompt and press Enter]\x1b[0m',
    ]
    if (state.submitted) {
        lines.push(`  \x1b[38;2;74;222;128m✔ Dispatched: "${state.submitted}"\x1b[0m`)
    }
    return lines
}
