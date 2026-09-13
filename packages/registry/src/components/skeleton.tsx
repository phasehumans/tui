import { Box, Text } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export interface SkeletonProps {
    width?: number
    height?: number
    char?: string
}

export function Skeleton({
    width = 24,
    height = 1,
    char = '░',
}: SkeletonProps) {
    const row = char.repeat(width)
    const rows = Array.from({ length: height }, (_, i) => i)

    return (
        <Box flexDirection="column">
            {rows.map((r) => (
                <Text key={r} color={THEME.colors.dim}>
                    {row}
                </Text>
            ))}
        </Box>
    )
}
