import fs from 'node:fs'
import path from 'node:path'

export interface TuiConfig {
    $schema?: string
    tsx: boolean
    aliases: {
        components: string
        ui: string
        theme: string
    }
}

export const DEFAULT_CONFIG: TuiConfig = {
    $schema: 'https://tui.trydecember.com/schema.json',
    tsx: true,
    aliases: {
        components: '@/components',
        ui: '@/components/ui',
        theme: '@/components/ui/theme',
    },
}

export function getConfigPath(cwd: string = process.cwd()): string {
    return path.join(cwd, 'tui.json')
}

export function getTuiConfig(cwd: string = process.cwd()): TuiConfig | null {
    const configPath = getConfigPath(cwd)
    if (!fs.existsSync(configPath)) {
        return null
    }

    try {
        const content = fs.readFileSync(configPath, 'utf8')
        return JSON.parse(content) as TuiConfig
    } catch {
        // Intentionally swallowed: fallback to null if corrupt
        return null
    }
}

export function writeTuiConfig(config: TuiConfig, cwd: string = process.cwd()): void {
    const configPath = getConfigPath(cwd)
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8')
}
