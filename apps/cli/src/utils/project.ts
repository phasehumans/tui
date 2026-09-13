import fs from 'node:fs'
import path from 'node:path'

import { detectPackageManager, type PackageManager } from './pm'

export { detectPackageManager, type PackageManager } from './pm'

export interface FrameworkInfo {
    name: string
    label: string
}

export interface TsConfigInfo {
    hasTsConfig: boolean
    configPath?: string
    aliasPrefix?: string
    aliasTarget?: string
    suggestedUiAlias: string
    hasSrc: boolean
}

export interface ProjectDetection {
    framework: FrameworkInfo
    packageManager: PackageManager
    tsConfig: TsConfigInfo
}

function parseJsonWithComments<T = unknown>(content: string): T | null {
    try {
        const clean = content
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/,\s*([}\]])/g, '$1')
        return JSON.parse(clean) as T
    } catch {
        // Intentionally swallowed: fallback to null if JSON parsing fails
        return null
    }
}

export function detectFramework(cwd: string = process.cwd()): FrameworkInfo {
    const pkgPath = path.join(cwd, 'package.json')
    if (fs.existsSync(pkgPath)) {
        try {
            const raw = fs.readFileSync(pkgPath, 'utf8')
            const pkg = JSON.parse(raw) as {
                dependencies?: Record<string, string>
                devDependencies?: Record<string, string>
            }

            const deps = { ...pkg.dependencies, ...pkg.devDependencies }

            if (deps['next']) {
                return { name: 'next', label: 'Next.js' }
            }
            if (deps['vite']) {
                return { name: 'vite', label: 'Vite' }
            }
            if (deps['@remix-run/react'] || deps['remix']) {
                return { name: 'remix', label: 'Remix' }
            }
            if (deps['astro']) {
                return { name: 'astro', label: 'Astro' }
            }
        } catch {
            // Intentionally swallowed: fallback to file inspection if package.json cannot be parsed
        }
    }

    // Fallback: check config files
    const files = ['next.config.js', 'next.config.mjs', 'next.config.ts']
    for (const f of files) {
        if (fs.existsSync(path.join(cwd, f))) {
            return { name: 'next', label: 'Next.js' }
        }
    }

    const viteFiles = ['vite.config.js', 'vite.config.mjs', 'vite.config.ts']
    for (const f of viteFiles) {
        if (fs.existsSync(path.join(cwd, f))) {
            return { name: 'vite', label: 'Vite' }
        }
    }

    return { name: 'generic', label: 'Generic / Node.js' }
}

interface RawTsConfig {
    extends?: string
    compilerOptions?: {
        baseUrl?: string
        paths?: Record<string, string[]>
    }
}

export function detectTsConfigAliases(cwd: string = process.cwd()): TsConfigInfo {
    const hasSrc = fs.existsSync(path.join(cwd, 'src'))
    const candidateFiles = ['tsconfig.json', 'jsconfig.json']

    let selectedConfigPath: string | undefined
    let rawConfig: RawTsConfig | null = null

    for (const file of candidateFiles) {
        const fullPath = path.join(cwd, file)
        if (fs.existsSync(fullPath)) {
            selectedConfigPath = fullPath
            const content = fs.readFileSync(fullPath, 'utf8')
            rawConfig = parseJsonWithComments<RawTsConfig>(content)
            break
        }
    }

    if (!selectedConfigPath || !rawConfig) {
        return {
            hasTsConfig: false,
            suggestedUiAlias: hasSrc ? '@/components/ui' : 'components/ui',
            hasSrc,
        }
    }

    // If config extends another config, attempt to read base config if paths not defined
    let paths = rawConfig.compilerOptions?.paths
    if (!paths && rawConfig.extends) {
        try {
            const extendedPath = path.resolve(cwd, rawConfig.extends)
            if (fs.existsSync(extendedPath)) {
                const extContent = fs.readFileSync(extendedPath, 'utf8')
                const extParsed = parseJsonWithComments<RawTsConfig>(extContent)
                if (extParsed?.compilerOptions?.paths) {
                    paths = extParsed.compilerOptions.paths
                }
            }
        } catch {
            // Intentionally swallowed: ignore extended config errors
        }
    }

    if (paths) {
        // Look for common alias prefixes: @/* or ~/*
        for (const [key, targets] of Object.entries(paths)) {
            const firstTarget = targets[0] ?? ''
            if (key === '@/*' || key === '@/') {
                return {
                    hasTsConfig: true,
                    configPath: selectedConfigPath,
                    aliasPrefix: '@/',
                    aliasTarget: firstTarget.replace(/\*$/, ''),
                    suggestedUiAlias: '@/components/ui',
                    hasSrc,
                }
            }
            if (key === '~/*' || key === '~/') {
                return {
                    hasTsConfig: true,
                    configPath: selectedConfigPath,
                    aliasPrefix: '~/',
                    aliasTarget: firstTarget.replace(/\*$/, ''),
                    suggestedUiAlias: '~/components/ui',
                    hasSrc,
                }
            }
        }
    }

    return {
        hasTsConfig: true,
        configPath: selectedConfigPath,
        suggestedUiAlias: hasSrc ? '@/components/ui' : 'components/ui',
        hasSrc,
    }
}

export function detectProject(cwd: string = process.cwd()): ProjectDetection {
    const framework = detectFramework(cwd)
    const packageManager = detectPackageManager(cwd)
    const tsConfig = detectTsConfigAliases(cwd)

    return {
        framework,
        packageManager,
        tsConfig,
    }
}
