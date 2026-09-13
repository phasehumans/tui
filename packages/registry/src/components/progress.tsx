import { Box, Text } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export interface ProgressProps {
    value: number
    max?: number
    width?: number
    label?: string
    showPercentage?: boolean
    fillChar?: string
    emptyChar?: string
    color?: string
}

export function Progress({
    value,
    max = 100,
    width = 24,
    label,
    showPercentage = true,
    fillChar = '█',
    emptyChar = '░',
    color,
}: ProgressProps) {
    const clamped = Math.max(0, Math.min(value, max))
    const ratio = max > 0 ? clamped / max : 0
    const percent = Math.round(ratio * 100)
    const filledCount = Math.round(ratio * width)
    const emptyCount = Math.max(0, width - filledCount)

    const barColor =
        color ??
        (percent >= 90
            ? THEME.colors.error
            : percent >= 75
              ? THEME.colors.warning
              : THEME.colors.brand)

    const filledBar = fillChar.repeat(filledCount)
    const emptyBar = emptyChar.repeat(emptyCount)

    return (
        <Box flexDirection="row" alignItems="center" gap={1}>
            {label && (
                <Box marginRight={1}>
                    <Text color={THEME.colors.muted}>{label}</Text>
                </Box>
            )}
            <Text color={barColor}>{filledBar}</Text>
            <Text color={THEME.colors.dim}>{emptyBar}</Text>
            {showPercentage && (
                <Box marginLeft={1}>
                    <Text bold color={barColor}>
                        {percent}%
                    </Text>
                </Box>
            )}
        </Box>
    )
}
