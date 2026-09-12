import { Box, Text } from 'ink'
import InkSpinner from 'ink-spinner'
import React from 'react'

import { THEME } from '../theme'

export type ToolStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface ToolCallCardProps {
    /** The identifier or name of the tool (e.g. "read_file", "bash") */
    toolName: string
    /** Short summary or parameter snippet of the invocation */
    inputSummary?: string
    /** Current execution status */
    status: ToolStatus
    /** Whether the stdout/output block is expanded */
    isExpanded?: boolean
    /** Execution output or error message */
    output?: string
    /** Execution time in milliseconds */
    durationMs?: number
}

export function ToolCallCard({
    toolName,
    inputSummary,
    status,
    isExpanded = false,
    output,
    durationMs,
}: ToolCallCardProps) {
    const formattedDuration = durationMs ? ` ${(durationMs / 1000).toFixed(1)}s` : ''

    const renderStatusBadge = () => {
        switch (status) {
            case 'running': {
                return (
                    <Text color={THEME.colors.warning}>
                        <InkSpinner type="dots" />
                    </Text>
                )
            }
            case 'completed': {
                return <Text color={THEME.colors.success}>{THEME.glyphs.check}</Text>
            }
            case 'failed': {
                return <Text color={THEME.colors.error}>{THEME.glyphs.cross}</Text>
            }
            case 'pending':
            default: {
                return <Text color={THEME.colors.dim}>{THEME.glyphs.bullet}</Text>
            }
        }
    }

    const glyph = isExpanded ? THEME.glyphs.foldOpen : THEME.glyphs.foldClosed

    return (
        <Box flexDirection="column" marginY={0}>
            <Box gap={1} alignItems="center">
                {renderStatusBadge()}
                <Text color={THEME.colors.brand} bold>
                    {toolName}
                </Text>
                {inputSummary && (
                    <Text color={THEME.colors.muted} wrap="truncate-end">
                        {inputSummary}
                    </Text>
                )}
                {durationMs !== undefined && (
                    <Text color={THEME.colors.dim}>{formattedDuration}</Text>
                )}
                {output && <Text color={THEME.colors.dim}>{glyph}</Text>}
            </Box>

            {isExpanded && output && (
                <Box
                    flexDirection="column"
                    borderStyle="round"
                    borderColor={THEME.colors.border}
                    paddingX={1}
                    marginTop={0}
                >
                    <Text color={THEME.colors.text}>{output}</Text>
                </Box>
            )}
        </Box>
    )
}
