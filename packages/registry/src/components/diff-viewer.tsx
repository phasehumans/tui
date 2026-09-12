import { Box, Text } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export interface DiffViewerProps {
    /** The raw unified diff string */
    diff: string
    /** Optional file path header */
    filePath?: string
    /** Maximum number of lines to display before truncating */
    maxLines?: number
    /** Whether the full diff is expanded if truncated */
    isExpanded?: boolean
}

export function DiffViewer({ diff, filePath, maxLines = 15, isExpanded = true }: DiffViewerProps) {
    if (!diff) return null

    const lines = diff.split(/\r?\n/)
    const visibleLines = isExpanded ? lines : lines.slice(0, maxLines)
    const isTruncated = !isExpanded && lines.length > maxLines

    return (
        <Box flexDirection="column" marginY={0}>
            {filePath && (
                <Box gap={1} alignItems="center">
                    <Text color={THEME.colors.brand} bold>
                        {THEME.glyphs.branch} {filePath}
                    </Text>
                </Box>
            )}

            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor={THEME.colors.border}
                paddingX={1}
            >
                {visibleLines.map((line, idx) => {
                    let color: string = THEME.colors.text
                    let bgColor: string | undefined = undefined

                    if (line.startsWith('+') && !line.startsWith('+++')) {
                        color = THEME.colors.success
                        bgColor = THEME.colors.diffAddBg
                    } else if (line.startsWith('-') && !line.startsWith('---')) {
                        color = THEME.colors.error
                        bgColor = THEME.colors.diffDeleteBg
                    } else if (
                        line.startsWith('@@') ||
                        line.startsWith('diff --git') ||
                        line.startsWith('---') ||
                        line.startsWith('+++')
                    ) {
                        color = THEME.colors.muted
                    }

                    return (
                        <Box key={idx} backgroundColor={bgColor} flexDirection="row">
                            <Text color={color} wrap="truncate-end">
                                {line}
                            </Text>
                        </Box>
                    )
                })}

                {isTruncated && (
                    <Box paddingTop={0}>
                        <Text color={THEME.colors.muted}>
                            ... ({lines.length - maxLines} more lines)
                        </Text>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
