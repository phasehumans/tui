/**
 * Strips ANSI escape sequences from a string
 */
export function stripAnsi(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '')
}

/**
 * Returns the visible column width of a string ignoring ANSI codes
 */
export function visibleLength(str: string): number {
    return stripAnsi(str).length
}

/**
 * Truncates a string to a given visible width with an ellipsis
 */
export function truncate(str: string, maxWidth: number, ellipsis = '...'): string {
    if (visibleLength(str) <= maxWidth) return str
    const chars = Array.from(str)
    let visible = 0
    let result = ''
    for (const char of chars) {
        if (visible + visibleLength(ellipsis) >= maxWidth) break
        result += char
        visible += visibleLength(char)
    }
    return `${result}${ellipsis}`
}
