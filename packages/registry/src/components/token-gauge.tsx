import { Box, Text } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export interface TokenGaugeProps {
    /** Number of tokens currently used */
    usedTokens: number
    /** Total context window capacity in tokens */
    totalTokens: number
    /** Visual width of the gauge in terminal columns */
    width?: number
    /** Label to show alongside the gauge */
    label?: string
}

export function TokenGauge({
    usedTokens,
    totalTokens,
    width = 20,
    label = 'Context',
}: TokenGaugeProps) {
    const percentage = Math.min(Math.max(usedTokens / totalTokens, 0), 1)
    const filledChars = Math.round(percentage * width)
    const emptyChars = width - filledChars

    const filledBar = '━'.repeat(filledChars)
    const emptyBar = '─'.repeat(emptyChars)

    let barColor: string = THEME.colors.brand
    if (percentage > 0.85) {
        barColor = THEME.colors.error
    } else if (percentage > 0.65) {
        barColor = THEME.colors.warning
    }

    const percentText = `${Math.round(percentage * 100)}%`
    const countText = `${(usedTokens / 1000).toFixed(1)}k / ${(totalTokens / 1000).toFixed(0)}k`

    return (
        <Box gap={1} alignItems="center">
            <Text color={THEME.colors.muted}>{label}:</Text>
            <Text color={barColor}>{filledBar}</Text>
            <Text color={THEME.colors.dim}>{emptyBar}</Text>
            <Text color={barColor} bold>
                {percentText}
            </Text>
            <Text color={THEME.colors.dim}>({countText})</Text>
        </Box>
    )
}
