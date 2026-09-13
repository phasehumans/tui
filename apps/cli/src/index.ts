#!/usr/bin/env node

import pkg from '../package.json' with { type: 'json' }

import { parseCliArgs, getHelpText } from './args'
import { handleAddCommand } from './commands/add'
import { handleDiffCommand } from './commands/diff'
import { handleInitCommand } from './commands/init'

export { parseCliArgs, getHelpText } from './args'

async function main() {
    const parsedArgs = parseCliArgs(process.argv.slice(2))

    if (parsedArgs.isHelp) {
        console.log(getHelpText(pkg.version))
        process.exit(0)
    }

    if (parsedArgs.isVersion) {
        console.log(pkg.version)
        process.exit(0)
    }

    switch (parsedArgs.command) {
        case 'init': {
            await handleInitCommand({
                yes: parsedArgs.yes,
                cwd: parsedArgs.cwd,
            })
            break
        }
        case 'add': {
            await handleAddCommand(parsedArgs.positionals, {
                overwrite: parsedArgs.overwrite,
                yes: parsedArgs.yes,
                all: parsedArgs.all,
                cwd: parsedArgs.cwd,
            })
            break
        }
        case 'diff': {
            await handleDiffCommand(parsedArgs.positionals, {
                cwd: parsedArgs.cwd,
            })
            break
        }
        default: {
            if (!parsedArgs.command) {
                console.log(getHelpText(pkg.version))
            } else {
                console.error(`Unknown command: ${parsedArgs.command}`)
                console.log(getHelpText(pkg.version))
                process.exit(1)
            }
            break
        }
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
