import { Box, Text } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export interface StreamingTextProps {
    /** The accumulated text or markdown stream */
    content: string
    /** Whether the stream is currently active */
    isStreaming?: boolean
    /** Optional text color override */
    color?: string
}

export function StreamingText({
    content,
    isStreaming = false,
    color = THEME.colors.text,
}: StreamingTextProps) {
    if (!content) return null

    return (
        <Box flexDirection="column">
            <Text color={color}>
                {content}
                {isStreaming && <Text color={THEME.colors.brand}> ▌</Text>}
            </Text>
        </Box>
    )
}
