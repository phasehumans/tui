import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import pc from 'picocolors'

import { getTuiConfig } from '../utils/config'
import { installPackages } from '../utils/pm'

const DEFAULT_REGISTRY_URL = 'https://tui.trydecember.com/r'

export interface RegistryFile {
    name: string
    path: string
    target: string
    content: string
    type: string
}

export interface RegistryItemPayload {
    name: string
    type: string
    title: string
    description: string
    dependencies: string[]
    devDependencies: string[]
    registryDependencies: string[]
    files: RegistryFile[]
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

export async function handleAddCommand(
    components: string[],
    options: { overwrite?: boolean; yes?: boolean; all?: boolean; cwd?: string } = {}
) {
    const cwd = options.cwd ?? process.cwd()
    const config = getTuiConfig(cwd)

    if (!config) {
        p.log.error(`No ${pc.cyan('tui.json')} found in this directory.`)
        p.log.info(`Run ${pc.bold('tui init')} first to set up your project.`)
        process.exit(1)
    }

    const registryUrl = process.env.TUI_REGISTRY_URL || DEFAULT_REGISTRY_URL

    let targets = [...components]

    if (options.all) {
        const spinner = p.spinner()
        spinner.start('Fetching all components from registry...')
        const index = await fetchRegistryIndex(registryUrl)
        spinner.stop('Registry loaded')

        if (!index || index.length === 0) {
            p.log.error('Could not reach the component registry.')
            process.exit(1)
        }

        targets = index
            .filter((item) => item.name !== 'theme')
            .map((item) => item.name)
    } else if (targets.length === 0) {
        const spinner = p.spinner()
        spinner.start('Fetching component registry...')
        const index = await fetchRegistryIndex(registryUrl)
        spinner.stop('Registry loaded')

        if (!index || index.length === 0) {
            p.log.error('Could not reach the component registry.')
            process.exit(1)
        }

        const selected = await p.multiselect({
            message: 'Select the components you want to add:',
            options: index
                .filter((item) => item.name !== 'theme') // Theme is installed via init or dependency
                .map((item) => ({
                    value: item.name,
                    label: item.title,
                    hint: item.description,
                })),
            required: true,
        })

        if (p.isCancel(selected)) {
            p.cancel('Installation cancelled.')
            process.exit(0)
        }

        targets = selected as string[]
    }

    const relativeFolder = config.aliases.ui.replace(/^@\//, '')
    const hasSrc = fs.existsSync(path.join(cwd, 'src'))
    const targetDir = hasSrc
        ? path.join(cwd, 'src', relativeFolder)
        : path.join(cwd, relativeFolder)

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    const allNpmDeps = new Set<string>()

    for (const compName of targets) {
        const spinner = p.spinner()
        spinner.start(`Installing ${pc.cyan(compName)}...`)

        const payload = await fetchRegistryItem(compName, registryUrl)
        if (!payload) {
            spinner.stop(pc.red(`Failed to download ${compName}`), 1)
            continue
        }

        // Check if theme or dependent registry components need to be installed
        for (const regDep of payload.registryDependencies) {
            if (regDep === 'theme') {
                const themeTarget = path.join(targetDir, 'theme.ts')
                if (!fs.existsSync(themeTarget)) {
                    const themePayload = await fetchRegistryItem('theme', registryUrl)
                    if (themePayload && themePayload.files[0]) {
                        fs.writeFileSync(themeTarget, themePayload.files[0].content, 'utf8')
                        p.log.step(`Created ${pc.cyan('theme.ts')}`)
                    }
                }
            } else if (!targets.includes(regDep)) {
                targets.push(regDep)
            }
        }

        for (const file of payload.files) {
            const destPath = path.join(targetDir, file.target)
            if (fs.existsSync(destPath) && !options.overwrite) {
                spinner.stop(
                    pc.yellow(`${file.target} already exists. Pass --overwrite to replace it.`)
                )
                continue
            }

            // Rewrite imports to match user's configured alias
            let rewritten = file.content
                .replace(/from\s+['"]\.\.\/theme['"]/g, `from '${config.aliases.theme}'`)
                .replace(/from\s+['"]\.\/theme['"]/g, `from '${config.aliases.theme}'`)

            fs.writeFileSync(destPath, rewritten, 'utf8')
            spinner.stop(`Installed ${pc.green(file.target)}`)
        }

        for (const dep of payload.dependencies) {
            allNpmDeps.add(dep)
        }
    }

    if (allNpmDeps.size > 0) {
        const depsArray = Array.from(allNpmDeps)
        p.log.step(`Installing npm dependencies: ${pc.cyan(depsArray.join(', '))}`)
        installPackages(depsArray, { cwd })
    }

    p.outro(pc.green('Done! Your components are ready to use.'))
}
