import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import pc from 'picocolors'

import { DEFAULT_CONFIG, getTuiConfig, writeTuiConfig } from '../utils/config'

export async function handleInitCommand(options: { yes?: boolean; cwd?: string } = {}) {
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

    let uiAlias = DEFAULT_CONFIG.aliases.ui
    if (!options.yes) {
        const response = await p.text({
            message: 'Configure the import alias for components:',
            initialValue: DEFAULT_CONFIG.aliases.ui,
            placeholder: '@/components/ui',
        })
        if (p.isCancel(response)) {
            p.cancel('Initialization cancelled.')
            process.exit(0)
        }
        uiAlias = response
    }

    const config = {
        ...DEFAULT_CONFIG,
        aliases: {
            ...DEFAULT_CONFIG.aliases,
            ui: uiAlias,
            theme: `${uiAlias}/theme`,
        },
    }

    writeTuiConfig(config, cwd)
    p.log.step(`Created ${pc.cyan('tui.json')}`)

    // Create the target UI directory if needed
    // Map alias to local folder (e.g. "@/components/ui" -> "src/components/ui" or "components/ui")
    const relativeFolder = uiAlias.replace(/^@\//, '')
    const hasSrc = fs.existsSync(path.join(cwd, 'src'))
    const targetDir = hasSrc
        ? path.join(cwd, 'src', relativeFolder)
        : path.join(cwd, relativeFolder)

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    p.outro(pc.green('Project initialized! You can now run: ') + pc.bold('tui add <component>'))
}
