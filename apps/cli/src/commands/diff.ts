import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import pc from 'picocolors'

import { getTuiConfig } from '../utils/config'

const DEFAULT_REGISTRY_URL = 'https://tui.trydecember.com/r'

interface RegistryItemPayload {
    name: string
    type: string
    title: string
    description: string
    dependencies: string[]
    devDependencies: string[]
    registryDependencies: string[]
    files: Array<{
        name: string
        path: string
        target: string
        content: string
        type: string
    }>
}

async function fetchRegistryItem(
    name: string,
    registryUrl: string
): Promise<RegistryItemPayload | null> {
    try {
        const res = await fetch(`${registryUrl}/${name}.json`)
        if (!res.ok) return null
        return (await res.json()) as RegistryItemPayload
    } catch {
        // Intentionally swallowed: network fallback
        return null
    }
}

async function fetchRegistryIndex(
    registryUrl: string
): Promise<Array<{ name: string; title: string; description: string }> | null> {
    try {
        const res = await fetch(`${registryUrl}/index.json`)
        if (!res.ok) return null
        return await res.json()
    } catch {
        // Intentionally swallowed: network fallback
        return null
    }
}

interface DiffLine {
    type: 'add' | 'remove' | 'same'
    text: string
}

function computeLcsDiff(oldLines: string[], newLines: string[]): DiffLine[] {
    const n = oldLines.length
    const m = newLines.length
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (oldLines[i] === newLines[j]) {
                dp[i + 1]![j + 1] = dp[i]![j]! + 1
            } else {
                dp[i + 1]![j + 1] = Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!)
            }
        }
    }

    const diff: DiffLine[] = []
    let i = n
    let j = m

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
            diff.unshift({ type: 'same', text: oldLines[i - 1]! })
            i--
            j--
        } else if (j > 0 && (i === 0 || dp[i]![j - 1]! >= dp[i - 1]![j]!)) {
            diff.unshift({ type: 'add', text: newLines[j - 1]! })
            j--
        } else if (i > 0 && (j === 0 || dp[i]![j - 1]! < dp[i - 1]![j]!)) {
            diff.unshift({ type: 'remove', text: oldLines[i - 1]! })
            i--
        }
    }

    return diff
}

export async function handleDiffCommand(
    components: string[],
    options: { cwd?: string } = {}
) {
    const cwd = options.cwd ?? process.cwd()
    const config = getTuiConfig(cwd)

    if (!config) {
        p.log.error(`No ${pc.cyan('tui.json')} found in this directory.`)
        p.log.info(`Run ${pc.bold('tui init')} first to set up your project.`)
        process.exit(1)
    }

    const relativeFolder = config.aliases.ui.replace(/^@\//, '')
    const hasSrc = fs.existsSync(path.join(cwd, 'src'))
    const targetDir = hasSrc
        ? path.join(cwd, 'src', relativeFolder)
        : path.join(cwd, relativeFolder)

    if (!fs.existsSync(targetDir)) {
        p.log.error(`Component directory ${pc.cyan(targetDir)} does not exist.`)
        process.exit(1)
    }

    const registryUrl = process.env.TUI_REGISTRY_URL || DEFAULT_REGISTRY_URL

    let targets = [...components]

    if (targets.length === 0) {
        // Find all installed components by checking files in targetDir
        const files = fs.readdirSync(targetDir)
        const componentNames = files
            .filter((f) => f.endsWith('.tsx') && !f.startsWith('.'))
            .map((f) => f.replace(/\.tsx$/, ''))

        if (componentNames.length === 0) {
            p.log.info('No components found in your project to diff.')
            process.exit(0)
        }

        targets = componentNames
    }

    p.intro(pc.bold('Comparing local components with registry...'))

    let totalDiffCount = 0

    for (const compName of targets) {
        const payload = await fetchRegistryItem(compName, registryUrl)
        if (!payload) {
            p.log.warn(`Component ${pc.yellow(compName)} not found in upstream registry.`)
            continue
        }

        for (const file of payload.files) {
            const localFilePath = path.join(targetDir, file.target)
            if (!fs.existsSync(localFilePath)) {
                p.log.warn(`${pc.cyan(file.target)} is not installed locally.`)
                continue
            }

            const localContent = fs.readFileSync(localFilePath, 'utf8')
            const expectedContent = file.content
                .replace(/from\s+['"]\.\.\/theme['"]/g, `from '${config.aliases.theme}'`)
                .replace(/from\s+['"]\.\/theme['"]/g, `from '${config.aliases.theme}'`)

            if (localContent === expectedContent) {
                p.log.success(`${pc.green(file.target)} is up to date.`)
                continue
            }

            totalDiffCount++
            p.log.step(`${pc.bold(file.target)} has differences:`)

            const localLines = localContent.split(/\r?\n/)
            const remoteLines = expectedContent.split(/\r?\n/)
            const diffLines = computeLcsDiff(localLines, remoteLines)

            console.log(pc.dim(`--- a/${file.target} (local)`))
            console.log(pc.dim(`+++ b/${file.target} (registry)`))

            // Print with max 3 lines of unchanged context
            for (let k = 0; k < diffLines.length; k++) {
                const line = diffLines[k]!
                if (line.type === 'add') {
                    console.log(pc.green(`+ ${line.text}`))
                } else if (line.type === 'remove') {
                    console.log(pc.red(`- ${line.text}`))
                } else {
                    // Check if adjacent to an add or remove
                    const nearDiff =
                        (k > 0 && diffLines[k - 1]?.type !== 'same') ||
                        (k < diffLines.length - 1 && diffLines[k + 1]?.type !== 'same') ||
                        (k > 1 && diffLines[k - 2]?.type !== 'same') ||
                        (k < diffLines.length - 2 && diffLines[k + 2]?.type !== 'same')

                    if (nearDiff) {
                        console.log(pc.dim(`  ${line.text}`))
                    }
                }
            }
            console.log('')
        }
    }

    if (totalDiffCount === 0) {
        p.outro(pc.green('All checked components are identical to upstream registry.'))
    } else {
        p.outro(
            pc.yellow(
                `Found differences in ${totalDiffCount} file(s). Run 'tui add <component> --overwrite' to overwrite.`
            )
        )
    }
}
