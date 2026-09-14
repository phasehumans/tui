import { describe, expect, it } from 'bun:test'
import {
    PROMPT_STRING,
    getPrompt,
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

describe('terminal-shell basic commands (ls, cd, pwd, cat, echo, etc.)', () => {
    it('should execute ls listing directories and files', () => {
        const result = executeCommand('ls')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toContain('apps')
            expect(result.output).toContain('packages')
            expect(result.output).toContain('package.json')
            expect(result.output).toContain('tui.json')
        }
    })

    it('should execute ls -la with permission bits and sizes', () => {
        const result = executeCommand('ls -la')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toContain('drwxr-xr-x')
            expect(result.output).toContain('package.json')
        }
    })

    it('should execute pwd returning current directory', () => {
        const result = executeCommand('pwd', { cwd: '~/code/tui' })
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toBe('/home/user/code/tui')
        }
    })

    it('should execute cd into child directory', () => {
        const result = executeCommand('cd packages', { cwd: '~/code/tui' })
        expect(result.type).toBe('cd')
        if (result.type === 'cd') {
            expect(result.newCwd).toBe('~/code/tui/packages')
        }
    })

    it('should execute cd .. going up one directory', () => {
        const result = executeCommand('cd ..', { cwd: '~/code/tui/packages' })
        expect(result.type).toBe('cd')
        if (result.type === 'cd') {
            expect(result.newCwd).toBe('~/code/tui')
        }
    })

    it('should execute cd ~ going to home directory', () => {
        const result = executeCommand('cd ~', { cwd: '~/code/tui/packages' })
        expect(result.type).toBe('cd')
        if (result.type === 'cd') {
            expect(result.newCwd).toBe('~')
        }
    })

    it('should error when cd into non-existent directory', () => {
        const result = executeCommand('cd nonexistent', { cwd: '~/code/tui' })
        expect(result.type).toBe('error')
        if (result.type === 'error') {
            expect(result.output).toContain('no such file or directory: nonexistent')
        }
    })

    it('should execute cat package.json displaying file contents', () => {
        const result = executeCommand('cat package.json')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toContain('@trydecember/tui')
            expect(result.output).toContain('workspaces')
        }
    })

    it('should error when cat non-existent file', () => {
        const result = executeCommand('cat missing.txt')
        expect(result.type).toBe('error')
        if (result.type === 'error') {
            expect(result.output).toContain('no such file: missing.txt')
        }
    })

    it('should execute echo returning passed text', () => {
        const result = executeCommand('echo hello world')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toBe('hello world')
        }
    })

    it('should execute whoami returning username', () => {
        const result = executeCommand('whoami')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toBe('user')
        }
    })

    it('should execute uname returning system architecture', () => {
        const result = executeCommand('uname -a')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toContain('Linux')
            expect(result.output).toContain('x86_64')
        }
    })

    it('should execute git status showing clean branch', () => {
        const result = executeCommand('git status')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toContain('On branch main')
            expect(result.output).toContain('working tree clean')
        }
    })

    it('should execute date returning date string', () => {
        const result = executeCommand('date')
        expect(result.type).toBe('output')
        if (result.type === 'output') {
            expect(result.output).toContain('202')
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

    it('should suggest directories for cd', () => {
        const res = autocomplete('cd ')
        expect(res.suggestions).toContain('apps')
        expect(res.suggestions).toContain('packages')
    })

    it('should autocomplete cd ap to cd apps', () => {
        const res = autocomplete('cd ap')
        expect(res.completed).toBe('cd apps ')
    })

    it('should suggest files for cat', () => {
        const res = autocomplete('cat ')
        expect(res.suggestions).toContain('package.json')
        expect(res.suggestions).toContain('README.md')
    })

    it('should autocomplete cat pack to cat package.json', () => {
        const res = autocomplete('cat pack')
        expect(res.completed).toBe('cat package.json ')
    })

    it('should suggest git subcommands', () => {
        const res = autocomplete('git ')
        expect(res.suggestions).toContain('status')
        expect(res.suggestions).toContain('branch')
        expect(res.suggestions).toContain('log')
    })

    it('should autocomplete git st to git status', () => {
        const res = autocomplete('git st')
        expect(res.completed).toBe('git status ')
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

        const badgeOffState = createSwitchState({
            label: 'Stream tokens',
            checked: false,
            variant: 'badge',
        })
        const badgeOffLines = renderSwitch(badgeOffState)
        expect(badgeOffLines.join('\n')).toContain('[ OFF ]')

        const badgeOnState = createSwitchState({
            label: 'Stream tokens',
            checked: true,
            variant: 'badge',
        })
        const badgeOnLines = renderSwitch(badgeOnState)
        expect(badgeOnLines.join('\n')).toContain('[ ON ]')
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
