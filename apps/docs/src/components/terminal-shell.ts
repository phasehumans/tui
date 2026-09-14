// Terminal Shell and Interactive State Engine for @trydecember/tui
// Operates 100% client-side inside virtual terminal emulator (xterm.js)

export const PROMPT_STRING =
    '\x1b[38;2;74;222;128muser@december\x1b[0m:\x1b[38;2;137;180;248m~/code/tui\x1b[0m$ '

export const PROMPT_PLAIN = 'user@december:~/code/tui$ '

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

export type CommandResult =
    | { type: 'output'; output: string }
    | { type: 'clear' }
    | { type: 'preview'; component: string }
    | { type: 'theme'; themePreset: string; output: string }
    | { type: 'replay' }
    | { type: 'error'; output: string }

export function executeCommand(raw: string): CommandResult {
    const { command, args } = parseCommand(raw)
    if (!command) return { type: 'output', output: '' }

    if (command === 'clear') {
        return { type: 'clear' }
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

export function autocomplete(input: string): { completed: string; suggestions?: string[] } {
    const trimmedStart = input.trimStart()

    // Base commands
    const topCommands = ['tui', 'help', 'clear', 'replay']
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
    lines.push(
        '  \x1b[38;2;102;102;102m└────────────────────────────────────────────────┘\x1b[0m'
    )
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

