import { describe, expect, it } from 'bun:test'
import {
    PROMPT_STRING,
    parseCommand,
    executeCommand,
    autocomplete,
    AVAILABLE_COMPONENTS,
    createSelectMenuState,
    handleSelectMenuKey,
    renderSelectMenu,
    createSwitchState,
    handleSwitchKey,
    renderSwitch,
    createTabsState,
    handleTabsKey,
    renderTabs,
    createCheckboxState,
    handleCheckboxKey,
    renderCheckbox,
    createPlanApproveState,
    handlePlanApproveKey,
    createInputBarState,
    handleInputBarKey,
} from './terminal-shell'

describe('terminal-shell prompt', () => {
    it('should format generic prompt user@december:~/code/tui$', () => {
        expect(PROMPT_STRING).toContain('user@december')
        expect(PROMPT_STRING).toContain('~/code/tui')
        expect(PROMPT_STRING).toContain('$')
    })
})

describe('terminal-shell command parser', () => {
    it('should parse simple command without args', () => {
        const parsed = parseCommand('help')
        expect(parsed).toEqual({ command: 'help', args: [] })
    })

    it('should parse command with args', () => {
        const parsed = parseCommand('tui preview select-menu')
        expect(parsed).toEqual({ command: 'tui', args: ['preview', 'select-menu'] })
    })

    it('should ignore multiple whitespace characters', () => {
        const parsed = parseCommand('  tui   add    switch  ')
        expect(parsed).toEqual({ command: 'tui', args: ['add', 'switch'] })
    })
})

describe('terminal-shell execution', () => {
    it('should execute help command with list of commands', () => {
        const result = executeCommand('help')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toContain('tui preview <component>')
            expect(result.output).toContain('tui add <component>')
            expect(result.output).toContain('tui list')
            expect(result.output).toContain('tui theme <preset>')
            expect(result.output).toContain('clear')
        }
    })

    it('should execute clear command', () => {
        const result = executeCommand('clear')
        expect(result.type).toBe('clear')
    })

    it('should execute tui list command displaying all components', () => {
        const result = executeCommand('tui list')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toContain('select-menu')
            expect(result.output).toContain('switch')
            expect(result.output).toContain('diff-viewer')
            expect(result.output).toContain('streaming-text')
        }
    })

    it('should execute tui add command for valid component', () => {
        const result = executeCommand('tui add select-menu')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toContain('select-menu')
            expect(result.output).toContain('components/select-menu.tsx')
        }
    })

    it('should return error when tui add is missing component name', () => {
        const result = executeCommand('tui add')
        expect(result.type).toBe('error')
        if (result.type === 'error') {
            expect(result.output).toContain('usage: tui add <component>')
        }
    })

    it('should execute tui preview command for valid component', () => {
        const result = executeCommand('tui preview select-menu')
        expect(result.type).toBe('preview')
        if (result.type === 'preview') {
            expect(result.component).toBe('select-menu')
        }
    })

    it('should execute tui theme command with valid preset', () => {
        const result = executeCommand('tui theme emerald')
        expect(result.type).toBe('theme')
        if (result.type === 'theme') {
            expect(result.themePreset).toBe('emerald')
            expect(result.output).toContain('emerald')
        }
    })

    it('should report command not found for unknown commands', () => {
        const result = executeCommand('foobar')
        expect(result.type).toBe('error')
        if (result.type === 'error') {
            expect(result.output).toContain('command not found: foobar')
        }
    })
})

describe('terminal-shell autocomplete', () => {
    it('should suggest tui subcommands when typing tui', () => {
        const res = autocomplete('tui ')
        expect(res.suggestions).toContain('preview')
        expect(res.suggestions).toContain('add')
        expect(res.suggestions).toContain('list')
        expect(res.suggestions).toContain('theme')
    })

    it('should autocomplete tui pre to tui preview', () => {
        const res = autocomplete('tui pre')
        expect(res.completed).toBe('tui preview ')
    })

    it('should autocomplete component name for tui preview sw', () => {
        const res = autocomplete('tui preview sw')
        expect(res.completed).toBe('tui preview switch ')
    })

    it('should autocomplete help command', () => {
        const res = autocomplete('hel')
        expect(res.completed).toBe('help ')
    })
})

describe('interactive component state - SelectMenu', () => {
    it('should advance and reverse selection on arrow keys', () => {
        let state = createSelectMenuState([
            { label: 'gemini-2.5-pro', value: 'gemini' },
            { label: 'claude-3.7-sonnet', value: 'claude' },
            { label: 'gpt-4o', value: 'gpt4o' },
        ])
        expect(state.selectedIndex).toBe(0)

        // Down arrow
        state = handleSelectMenuKey(state, '\x1b[B')
        expect(state.selectedIndex).toBe(1)

        // Down arrow again
        state = handleSelectMenuKey(state, '\x1b[B')
        expect(state.selectedIndex).toBe(2)

        // Down arrow at bottom doesn't overflow
        state = handleSelectMenuKey(state, '\x1b[B')
        expect(state.selectedIndex).toBe(2)

        // Up arrow
        state = handleSelectMenuKey(state, '\x1b[A')
        expect(state.selectedIndex).toBe(1)

        // Up arrow to top
        state = handleSelectMenuKey(state, '\x1b[A')
        expect(state.selectedIndex).toBe(0)

        // Up arrow at top doesn't underflow
        state = handleSelectMenuKey(state, '\x1b[A')
        expect(state.selectedIndex).toBe(0)
    })

    it('should render formatted select menu lines with cursor glyph', () => {
        const state = createSelectMenuState([
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
        ])
        const lines = renderSelectMenu(state)
        expect(lines[1]).toContain('●')
        expect(lines[1]).toContain('Option A')
        expect(lines[2]).toContain('○')
        expect(lines[2]).toContain('Option B')
    })
})

describe('interactive component state - Switch', () => {
    it('should toggle checked state on Space key', () => {
        let state = createSwitchState({ label: 'Auto-save checkpoints', checked: false })
        expect(state.checked).toBe(false)

        state = handleSwitchKey(state, ' ')
        expect(state.checked).toBe(true)

        state = handleSwitchKey(state, ' ')
        expect(state.checked).toBe(false)
    })

    it('should render correct glyphs for on/off states', () => {
        const offState = createSwitchState({ label: 'Feature flag', checked: false })
        const offLines = renderSwitch(offState)
        expect(offLines.join('\n')).toContain('●─ OFF')

        const onState = createSwitchState({ label: 'Feature flag', checked: true })
        const onLines = renderSwitch(onState)
        expect(onLines.join('\n')).toContain('─● ON')
    })
})

describe('interactive component state - Tabs', () => {
    it('should cycle active tabs on right/left arrows and tab key', () => {
        let state = createTabsState(['Overview', 'Schema', 'Settings'])
        expect(state.activeTab).toBe(0)

        // Right arrow
        state = handleTabsKey(state, '\x1b[C')
        expect(state.activeTab).toBe(1)

        // Tab key
        state = handleTabsKey(state, '\t')
        expect(state.activeTab).toBe(2)

        // Tab key wraps around
        state = handleTabsKey(state, '\t')
        expect(state.activeTab).toBe(0)

        // Left arrow wraps around backwards
        state = handleTabsKey(state, '\x1b[D')
        expect(state.activeTab).toBe(2)
    })

    it('should render active tab highlighting', () => {
        const state = createTabsState(['Overview', 'Schema'])
        const lines = renderTabs(state)
        expect(lines.join('\n')).toContain('[ Overview ]')
    })
})

describe('interactive component state - Checkbox', () => {
    it('should navigate and toggle checkbox items', () => {
        let state = createCheckboxState([
            { label: 'Lint on save', checked: false },
            { label: 'Format code', checked: true },
        ])
        expect(state.cursor).toBe(0)
        expect(state.items[0]!.checked).toBe(false)

        // Toggle first item
        state = handleCheckboxKey(state, ' ')
        expect(state.items[0]!.checked).toBe(true)

        // Down arrow
        state = handleCheckboxKey(state, '\x1b[B')
        expect(state.cursor).toBe(1)

        // Toggle second item off
        state = handleCheckboxKey(state, ' ')
        expect(state.items[1]!.checked).toBe(false)
    })
})

describe('interactive component state - PlanApproveMenu', () => {
    it('should switch between approve and reject', () => {
        let state = createPlanApproveState()
        expect(state.choice).toBe('approve')

        state = handlePlanApproveKey(state, '\x1b[C')
        expect(state.choice).toBe('reject')

        state = handlePlanApproveKey(state, '\x1b[D')
        expect(state.choice).toBe('approve')
    })
})

describe('interactive component state - InputBar', () => {
    it('should accept characters and backspace', () => {
        let state = createInputBarState()
        expect(state.text).toBe('')

        state = handleInputBarKey(state, 'h')
        state = handleInputBarKey(state, 'i')
        expect(state.text).toBe('hi')

        state = handleInputBarKey(state, '\x7f')
        expect(state.text).toBe('h')
    })
})

