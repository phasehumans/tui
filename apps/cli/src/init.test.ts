import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'bun:test'

import { handleInitCommand } from './commands/init'
import { getTuiConfig } from './utils/config'
import {
    detectFramework,
    detectPackageManager,
    detectTsConfigAliases,
    detectProject,
} from './utils/project'
import { generateThemeFile, VALID_THEME_PRESETS } from './utils/theme-generator'

describe('project auto-detection', () => {
    it('should detect Next.js framework from package.json', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tui-detect-next-'))
        fs.writeFileSync(
            path.join(tmp, 'package.json'),
            JSON.stringify({ dependencies: { next: '14.2.0', react: '18.2.0' } }),
            'utf8'
        )

        const fw = detectFramework(tmp)
        expect(fw.name).toBe('next')
        expect(fw.label).toBe('Next.js')
        fs.rmSync(tmp, { recursive: true, force: true })
    })

    it('should detect Vite framework from package.json', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tui-detect-vite-'))
        fs.writeFileSync(
            path.join(tmp, 'package.json'),
            JSON.stringify({ devDependencies: { vite: '5.0.0' } }),
            'utf8'
        )

        const fw = detectFramework(tmp)
        expect(fw.name).toBe('vite')
        expect(fw.label).toBe('Vite')
        fs.rmSync(tmp, { recursive: true, force: true })
    })

    it('should detect package manager from lockfiles', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tui-detect-pm-'))
        fs.writeFileSync(path.join(tmp, 'pnpm-lock.yaml'), '', 'utf8')

        const pm = detectPackageManager(tmp)
        expect(pm).toBe('pnpm')
        fs.rmSync(tmp, { recursive: true, force: true })
    })

    it('should detect tsconfig path alias @/*', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tui-detect-alias-'))
        fs.mkdirSync(path.join(tmp, 'src'), { recursive: true })
        fs.writeFileSync(
            path.join(tmp, 'tsconfig.json'),
            JSON.stringify({
                compilerOptions: {
                    paths: {
                        '@/*': ['./src/*'],
                    },
                },
            }),
            'utf8'
        )

        const tsInfo = detectTsConfigAliases(tmp)
        expect(tsInfo.hasTsConfig).toBe(true)
        expect(tsInfo.aliasPrefix).toBe('@/')
        expect(tsInfo.suggestedUiAlias).toBe('@/components/ui')
        expect(tsInfo.hasSrc).toBe(true)
        fs.rmSync(tmp, { recursive: true, force: true })
    })

    it('should detect tsconfig path alias ~/*', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tui-detect-tilde-'))
        fs.mkdirSync(path.join(tmp, 'src'), { recursive: true })
        fs.writeFileSync(
            path.join(tmp, 'tsconfig.json'),
            JSON.stringify({
                compilerOptions: {
                    paths: {
                        '~/*': ['./src/*'],
                    },
                },
            }),
            'utf8'
        )

        const tsInfo = detectTsConfigAliases(tmp)
        expect(tsInfo.aliasPrefix).toBe('~/')
        expect(tsInfo.suggestedUiAlias).toBe('~/components/ui')
        fs.rmSync(tmp, { recursive: true, force: true })
    })
})

describe('theme preset generator', () => {
    it('should include all valid theme presets', () => {
        expect(VALID_THEME_PRESETS).toContain('default')
        expect(VALID_THEME_PRESETS).toContain('amber')
        expect(VALID_THEME_PRESETS).toContain('emerald')
        expect(VALID_THEME_PRESETS).toContain('cyan')
        expect(VALID_THEME_PRESETS).toContain('monochrome')
        expect(VALID_THEME_PRESETS).toContain('zinc')
        expect(VALID_THEME_PRESETS).toContain('slate')
    })

    it('should generate theme.ts configured with requested preset', () => {
        const content = generateThemeFile('amber')
        expect(content).toContain("createTheme('amber')")
        expect(content).toContain('THEME_PRESETS')
        expect(content).toContain('export const THEME')
    })
})

describe('tui init command integration', () => {
    it('should initialize project with detected config and theme.ts', async () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tui-init-test-'))
        fs.mkdirSync(path.join(tmp, 'src'), { recursive: true })
        fs.writeFileSync(
            path.join(tmp, 'package.json'),
            JSON.stringify({ name: 'test-app', dependencies: { next: '14.0.0' } }),
            'utf8'
        )
        fs.writeFileSync(path.join(tmp, 'bun.lock'), '', 'utf8')
        fs.writeFileSync(
            path.join(tmp, 'tsconfig.json'),
            JSON.stringify({ compilerOptions: { paths: { '@/*': ['./src/*'] } } }),
            'utf8'
        )

        await handleInitCommand({
            yes: true,
            theme: 'emerald',
            cwd: tmp,
        })

        // Check tui.json was written
        const config = getTuiConfig(tmp)
        expect(config).not.toBeNull()
        expect(config?.framework).toBe('next')
        expect(config?.packageManager).toBe('bun')
        expect(config?.theme).toBe('emerald')
        expect(config?.aliases.ui).toBe('@/components/ui')

        // Check theme.ts was created with emerald theme
        const themePath = path.join(tmp, 'src', 'components', 'ui', 'theme.ts')
        expect(fs.existsSync(themePath)).toBe(true)
        const themeContent = fs.readFileSync(themePath, 'utf8')
        expect(themeContent).toContain("createTheme('emerald')")

        fs.rmSync(tmp, { recursive: true, force: true })
    })
})
