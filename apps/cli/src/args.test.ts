import { describe, expect, it } from 'bun:test'
import { parseCliArgs, getHelpText } from './args'

describe('cli args parser', () => {
    it('should parse empty args', () => {
        const result = parseCliArgs([])
        expect(result.command).toBeUndefined()
        expect(result.positionals).toEqual([])
        expect(result.isHelp).toBe(false)
        expect(result.isVersion).toBe(false)
        expect(result.yes).toBe(false)
        expect(result.overwrite).toBe(false)
        expect(result.all).toBe(false)
    })

    it('should parse init command with flags', () => {
        const result = parseCliArgs(['init', '--yes', '--cwd', '/tmp/test'])
        expect(result.command).toBe('init')
        expect(result.yes).toBe(true)
        expect(result.cwd).toBe('/tmp/test')
    })

    it('should parse add command with positional components', () => {
        const result = parseCliArgs(['add', 'card', 'button', '--overwrite'])
        expect(result.command).toBe('add')
        expect(result.positionals).toEqual(['card', 'button'])
        expect(result.overwrite).toBe(true)
    })

    it('should parse add command with --all flag', () => {
        const result = parseCliArgs(['add', '--all'])
        expect(result.command).toBe('add')
        expect(result.all).toBe(true)
    })

    it('should parse diff command with component argument', () => {
        const result = parseCliArgs(['diff', 'button'])
        expect(result.command).toBe('diff')
        expect(result.positionals).toEqual(['button'])
    })

    it('should generate help text containing commands and options', () => {
        const help = getHelpText('0.1.0')
        expect(help).toContain('init')
        expect(help).toContain('add')
        expect(help).toContain('diff')
        expect(help).toContain('--all')
        expect(help).toContain('--overwrite')
    })
})
