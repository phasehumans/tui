export type ThemePreset = 'default' | 'amber' | 'emerald' | 'cyan' | 'monochrome' | 'zinc' | 'slate'

export const VALID_THEME_PRESETS: ThemePreset[] = [
    'default',
    'amber',
    'emerald',
    'cyan',
    'monochrome',
    'zinc',
    'slate',
]

export function generateThemeFile(preset: string = 'default'): string {
    const validPreset: ThemePreset = VALID_THEME_PRESETS.includes(preset as ThemePreset)
        ? (preset as ThemePreset)
        : 'default'

    return `// Centralized theme tokens for terminal agent components.
// All components consume these tokens instead of hardcoded hex or named color strings.

export type ThemePreset =
    | 'default'
    | 'amber'
    | 'emerald'
    | 'cyan'
    | 'monochrome'
    | 'zinc'
    | 'slate'

export interface ThemeColors {
    brand: string
    text: string
    muted: string
    dim: string
    border: string
    success: string
    error: string
    warning: string
    diffAddBg: string
    diffDeleteBg: string
}

export interface ThemePadding {
    paddingX: number
    paddingLeft: number
    paddingRight: number
}

export interface ThemeGlyphs {
    prompt: string
    selector: string
    bullet: string
    status: string
    branch: string
    check: string
    cross: string
    arrowRight: string
    arrowDown: string
    foldClosed: string
    foldOpen: string
}

export interface ThemeDefinition {
    colors: ThemeColors
    padding: ThemePadding
    glyphs: ThemeGlyphs
}

export const THEME_PRESETS: Record<ThemePreset, ThemeColors> = {
    default: {
        brand: '#89B4F8',
        text: 'white',
        muted: '#AAAAAA',
        dim: '#666666',
        border: '#333333',
        success: '#6EE7B7',
        error: '#FCA5A5',
        warning: '#FDD663',
        diffAddBg: '#122f1e',
        diffDeleteBg: '#3f1316',
    },
    amber: {
        brand: '#FB923C',
        text: 'white',
        muted: '#FDBA74',
        dim: '#7C2D12',
        border: '#431407',
        success: '#4ADE80',
        error: '#F87171',
        warning: '#FBBF24',
        diffAddBg: '#271d0e',
        diffDeleteBg: '#351214',
    },
    emerald: {
        brand: '#10B981',
        text: 'white',
        muted: '#6EE7B7',
        dim: '#065F46',
        border: '#064E3B',
        success: '#34D399',
        error: '#F87171',
        warning: '#FCD34D',
        diffAddBg: '#052e16',
        diffDeleteBg: '#351114',
    },
    cyan: {
        brand: '#06B6D4',
        text: 'white',
        muted: '#67E8F9',
        dim: '#155E75',
        border: '#164E63',
        success: '#4ADE80',
        error: '#FB7185',
        warning: '#FDE047',
        diffAddBg: '#082f49',
        diffDeleteBg: '#381119',
    },
    monochrome: {
        brand: '#FFFFFF',
        text: '#FFFFFF',
        muted: '#A3A3A3',
        dim: '#525252',
        border: '#404040',
        success: '#FFFFFF',
        error: '#D4D4D4',
        warning: '#E5E5E5',
        diffAddBg: '#262626',
        diffDeleteBg: '#171717',
    },
    zinc: {
        brand: '#A1A1AA',
        text: '#FAFAFA',
        muted: '#71717A',
        dim: '#3F3F46',
        border: '#27272A',
        success: '#4ADE80',
        error: '#F87171',
        warning: '#FBBF24',
        diffAddBg: '#18241b',
        diffDeleteBg: '#2b1517',
    },
    slate: {
        brand: '#94A3B8',
        text: '#F8FAFC',
        muted: '#64748B',
        dim: '#334155',
        border: '#1E293B',
        success: '#38BDF8',
        error: '#FB7185',
        warning: '#FACC15',
        diffAddBg: '#0f2430',
        diffDeleteBg: '#2a1420',
    },
}

export const DEFAULT_PADDING: ThemePadding = {
    paddingX: 2,
    paddingLeft: 2,
    paddingRight: 4,
}

export const DEFAULT_GLYPHS: ThemeGlyphs = {
    prompt: '❭',
    selector: '❭',
    bullet: '•',
    status: '●',
    branch: '⌥',
    check: '✔',
    cross: '✖',
    arrowRight: '→',
    arrowDown: '↓',
    foldClosed: '▸',
    foldOpen: '▾',
}

export function createTheme(
    presetName: ThemePreset = '${validPreset}',
    customColors?: Partial<ThemeColors>
): ThemeDefinition {
    const baseColors = THEME_PRESETS[presetName] || THEME_PRESETS.default
    return {
        colors: {
            ...baseColors,
            ...customColors,
        },
        padding: { ...DEFAULT_PADDING },
        glyphs: { ...DEFAULT_GLYPHS },
    }
}

export const THEME = createTheme('${validPreset}')

export const COLORS = {
    ...THEME.colors,
    primary: THEME.colors.text,
    info: THEME.colors.muted,
}

export type Theme = typeof THEME
export type Colors = typeof COLORS
`
}
