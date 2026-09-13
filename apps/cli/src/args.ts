export interface CliArgs {
    command?: string
    positionals: string[]
    isHelp: boolean
    isVersion: boolean
    yes: boolean
    overwrite: boolean
    all: boolean
    cwd: string
}

export function parseCliArgs(args: string[]): CliArgs {
    let command: string | undefined = undefined
    const positionals: string[] = []
    let isHelp = false
    let isVersion = false
    let yes = false
    let overwrite = false
    let all = false
    let cwd = process.cwd()

    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (!arg) continue

        if (arg === '--help' || arg === '-h') {
            isHelp = true
        } else if (arg === '--version' || arg === '-v') {
            isVersion = true
        } else if (arg === '--yes' || arg === '-y') {
            yes = true
        } else if (arg === '--overwrite') {
            overwrite = true
        } else if (arg === '--all' || arg === '-a') {
            all = true
        } else if (arg === '--cwd' && i + 1 < args.length) {
            cwd = args[++i]!
        } else if (!arg.startsWith('-')) {
            if (!command) {
                command = arg
            } else {
                positionals.push(arg)
            }
        }
    }

    return {
        command,
        positionals,
        isHelp,
        isVersion,
        yes,
        overwrite,
        all,
        cwd,
    }
}

export function getHelpText(version = '0.1.0'): string {
    return `
@trydecember/tui v${version}
An unbundled, copy-paste UI component library for terminal agents.

USAGE:
  $ tui <command> [options]

COMMANDS:
  init                  Initialize tui.json and set up theme tokens
  add [components...]   Add components to your project
  diff [components...]  Check for differences against the component registry

OPTIONS:
  -y, --yes             Skip confirmation prompts and accept defaults
  -a, --all             Add all components from registry (with add)
  --overwrite           Overwrite existing component files
  --cwd <path>          The working directory (default: current directory)
  -h, --help            Show this help message
  -v, --version         Show version number

EXAMPLES:
  $ tui init
  $ tui add diff-viewer
  $ tui add --all
  $ tui diff button
  $ tui diff
`
}
