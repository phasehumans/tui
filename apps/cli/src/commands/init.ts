import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import pc from 'picocolors'

import { DEFAULT_CONFIG, getTuiConfig, writeTuiConfig, type TuiConfig } from '../utils/config'
import { detectProject } from '../utils/project'
import { generateThemeFile, VALID_THEME_PRESETS, type ThemePreset } from '../utils/theme-generator'

export interface InitOptions {
    yes?: boolean
    theme?: string
    cwd?: string
}

export async function handleInitCommand(options: InitOptions = {}) {
    const cwd = options.cwd ?? process.cwd()

    p.intro(pc.bgCyan(pc.black(' @trydecember/tui init ')))

    const existingConfig = getTuiConfig(cwd)
    if (existingConfig && !options.yes) {
        const overwrite = await p.confirm({
            message: 'tui.json already exists. Do you want to overwrite it?',
            initialValue: false,
        })
        if (!overwrite || p.isCancel(overwrite)) {
            p.cancel('Initialization cancelled.')
            process.exit(0)
        }
    }

    // Auto-detect project environment: Framework, Package Manager, and tsconfig path aliases
    const detection = detectProject(cwd)

    p.log.info(`Detected ${pc.bold(pc.cyan(detection.framework.label))} project`)
    p.log.info(`Detected ${pc.bold(pc.cyan(detection.packageManager))} package manager`)
    if (detection.tsConfig.aliasPrefix) {
        p.log.info(
            `Detected TypeScript path alias: ${pc.bold(pc.cyan(detection.tsConfig.aliasPrefix + '*'))}`
        )
    }

    // Theme color palette selection
    let selectedTheme: ThemePreset = 'default'
    if (options.theme) {
        if (VALID_THEME_PRESETS.includes(options.theme as ThemePreset)) {
            selectedTheme = options.theme as ThemePreset
            p.log.step(`Using theme preset: ${pc.bold(pc.green(selectedTheme))}`)
        } else {
            p.log.warn(
                `Invalid theme preset "${options.theme}". Available presets: ${VALID_THEME_PRESETS.join(', ')}`
            )
        }
    }

    if (!options.yes && !options.theme) {
        const themeChoice = await p.select({
            message: 'Select a theme color palette:',
            options: [
                { value: 'default', label: 'Default', hint: 'Spacetime Blue (#89B4F8)' },
                { value: 'amber', label: 'Amber', hint: 'Terminal Warm Glow (#FB923C)' },
                { value: 'emerald', label: 'Emerald', hint: 'Matrix Green (#10B981)' },
                { value: 'cyan', label: 'Cyan', hint: 'Electric Cyan (#06B6D4)' },
                {
                    value: 'monochrome',
                    label: 'Monochrome',
                    hint: 'High-contrast White/Gray (#FFFFFF)',
                },
                { value: 'zinc', label: 'Zinc', hint: 'Modern Industrial Zinc (#A1A1AA)' },
                { value: 'slate', label: 'Slate', hint: 'Cool Slate (#94A3B8)' },
            ],
            initialValue: 'default',
        })

        if (p.isCancel(themeChoice)) {
            p.cancel('Initialization cancelled.')
            process.exit(0)
        }

        selectedTheme = themeChoice as ThemePreset
    }

    // Component import alias configuration
    let uiAlias = detection.tsConfig.suggestedUiAlias
    if (!options.yes) {
        const response = await p.text({
            message: 'Configure the import alias for components:',
            initialValue: detection.tsConfig.suggestedUiAlias,
            placeholder: detection.tsConfig.suggestedUiAlias,
        })
        if (p.isCancel(response)) {
            p.cancel('Initialization cancelled.')
            process.exit(0)
        }
        uiAlias = response
    }

    const componentsAlias = uiAlias.endsWith('/ui') ? uiAlias.slice(0, -3) : uiAlias

    const config: TuiConfig = {
        ...DEFAULT_CONFIG,
        framework: detection.framework.name,
        packageManager: detection.packageManager,
        theme: selectedTheme,
        aliases: {
            components: componentsAlias,
            ui: uiAlias,
            theme: `${uiAlias}/theme`,
        },
    }

    writeTuiConfig(config, cwd)
    p.log.step(`Created ${pc.cyan('tui.json')}`)

    // Determine target directory on disk
    let relativeFolder = uiAlias
    if (relativeFolder.startsWith('@/')) {
        relativeFolder = relativeFolder.slice(2)
    } else if (relativeFolder.startsWith('~/')) {
        relativeFolder = relativeFolder.slice(2)
    }

    const hasSrc = detection.tsConfig.hasSrc
    const targetDir =
        hasSrc && !relativeFolder.startsWith('src/')
            ? path.join(cwd, 'src', relativeFolder)
            : path.join(cwd, relativeFolder)

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    // Generate and write theme.ts with the selected theme preset
    const themeTarget = path.join(targetDir, 'theme.ts')
    const themeContent = generateThemeFile(selectedTheme)
    fs.writeFileSync(themeTarget, themeContent, 'utf8')
    p.log.step(`Created ${pc.cyan('theme.ts')} (palette: ${pc.bold(pc.green(selectedTheme))})`)

    p.outro(pc.green('Project initialized! You can now run: ') + pc.bold('tui add <component>'))
}
