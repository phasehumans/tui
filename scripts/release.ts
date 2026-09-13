import { $ } from 'bun'

const version = process.argv[2]
const force = process.argv.includes('--force')

if (!version || version.startsWith('--')) {
    console.error('Usage: bun run release <version> [--force]')
    console.error('Example: bun run release 0.1.1')
    process.exit(1)
}

// Ensure version format is valid semver (with optional pre-release)
const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/
if (!semverRegex.test(version)) {
    console.error(`Invalid semver version: "${version}". Expected format: X.Y.Z (e.g. 0.1.1)`)
    process.exit(1)
}

console.log(`\n🚀 Preparing release v${version}...\n`)

// 1. Check git working directory status
const status = await $`git status --porcelain`.text()
if (status.trim() && !force) {
    console.error('Git working tree has uncommitted changes. Commit or stash them first, or pass --force.')
    process.exit(1)
}

// 2. Update version in all package.json files
const glob = new Bun.Glob('**/package.json')
for await (const file of glob.scan('.')) {
    if (file.includes('node_modules') || file.includes('.turbo') || file.includes('dist')) continue

    const fileRef = Bun.file(file)
    const pkg = await fileRef.json()

    pkg.version = version
    await Bun.write(file, JSON.stringify(pkg, null, 4) + '\n')
    console.log(`✓ Updated ${file} to v${version}`)
}

// 3. Format package.json files
console.log('\nFormatting codebase...')
await $`bun run format`

// 4. Update bun.lock
console.log('\nUpdating dependencies and lockfile...')
await $`bun install`

// 5. Generate CHANGELOG.md via git-cliff if available
try {
    console.log('\nGenerating CHANGELOG.md...')
    await $`git-cliff --tag ${`v${version}`} -o CHANGELOG.md`
    await $`bun run format`
    console.log('✓ CHANGELOG.md updated')
} catch {
    console.log('⚠ git-cliff not available or encountered an issue, skipping changelog generation.')
}

// 6. Verification: Typecheck, test, and build
console.log('\nRunning typecheck & test suite...')
await $`bun run typecheck`
await $`bun run test`

console.log('\nBuilding monorepo artifacts...')
await $`bun run build`

// 7. Stage, commit, and tag (strictly lowercase commit message)
console.log('\nStaging git changes...')
await $`git add .`
await $`git commit -m ${`chore(release): v${version}`}`

console.log(`Tagging v${version}...`)
await $`git tag -a ${`v${version}`} -m ${`release v${version}`}`

// 8. Push commit and tag to GitHub
console.log('\nPushing commit and tag to origin...')
if (force) {
    await $`git push --force-with-lease origin main`
    await $`git push --force-with-lease origin ${`v${version}`}`
} else {
    await $`git push origin main`
    await $`git push origin ${`v${version}`}`
}

console.log(`\n🎉 Successfully released and pushed v${version}!`)
console.log(`GitHub Actions will now build and publish @trydecember/tui@${version} to npm.`)
