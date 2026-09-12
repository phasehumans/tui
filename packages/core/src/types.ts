/**
 * Canonical configuration schema for tui.json
 */
export interface TuiConfig {
    $schema?: string
    tsx: boolean
    aliases: {
        components: string
        ui: string
        theme: string
    }
}

/**
 * Execution status for tool calls
 */
export type ToolStatus = 'pending' | 'running' | 'completed' | 'failed'

/**
 * Single file in a registry item
 */
export interface RegistryFile {
    name: string
    path: string
    target: string
    content: string
    type: 'ui' | 'lib' | 'theme'
}

/**
 * Registry component metadata payload
 */
export interface RegistryItem {
    name: string
    type: 'ui' | 'lib' | 'theme'
    title: string
    description: string
    dependencies?: string[]
    devDependencies?: string[]
    registryDependencies?: string[]
    files: Array<{
        path: string
        target: string
        type: 'ui' | 'lib' | 'theme'
    }>
}

/**
 * Registry index item
 */
export interface RegistryIndexItem {
    name: string
    type: 'ui' | 'lib' | 'theme'
    title: string
    description: string
    dependencies: string[]
    registryDependencies: string[]
}
