import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export type PackageManager = 'bun' | 'pnpm' | 'yarn' | 'npm'

export function detectPackageManager(targetDir: string = process.cwd()): PackageManager {
    if (
        fs.existsSync(path.join(targetDir, 'bun.lock')) ||
        fs.existsSync(path.join(targetDir, 'bun.lockb'))
    ) {
        return 'bun'
    }
    if (fs.existsSync(path.join(targetDir, 'pnpm-lock.yaml'))) {
        return 'pnpm'
    }
    if (fs.existsSync(path.join(targetDir, 'yarn.lock'))) {
        return 'yarn'
    }
    return 'npm'
}

export function installPackages(
    packages: string[],
    options: { dev?: boolean; cwd?: string } = {}
): boolean {
    if (packages.length === 0) return true

    const cwd = options.cwd ?? process.cwd()
    const pm = detectPackageManager(cwd)

    const args: string[] = []

    switch (pm) {
        case 'bun': {
            args.push('add')
            if (options.dev) args.push('-d')
            break
        }
        case 'pnpm': {
            args.push('add')
            if (options.dev) args.push('-D')
            break
        }
        case 'yarn': {
            args.push('add')
            if (options.dev) args.push('-D')
            break
        }
        case 'npm':
        default: {
            args.push('install')
            if (options.dev) args.push('--save-dev')
            break
        }
    }

    args.push(...packages)

    const result = spawnSync(pm, args, {
        cwd,
        stdio: 'inherit',
    })

    return result.status === 0
}
