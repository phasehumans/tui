import { Box, Text } from 'ink'
import InkSpinner from 'ink-spinner'
import React from 'react'

import { THEME } from '../theme'

export interface CollapsibleReasoningProps {
    /** The raw reasoning / thinking text content */
    content: string
    /** Whether the reasoning block is currently expanded to show details */
    isExpanded?: boolean
    /** Whether the agent is actively thinking/streaming thoughts */
    isThinking?: boolean
    /** Optional duration in milliseconds */
    durationMs?: number
    /** Optional token count consumed by reasoning */
    tokenCount?: number
}

export function formatThought(raw: string): string {
    if (!raw) return ''

    const lines = raw.split(/\r?\n/)
    const cleanedLines: string[] = []

    for (const line of lines) {
        let trimmed = line.trim()
        if (!trimmed) continue

        // Strip section scaffolding labels like Goal Understanding, Analysis, etc.
        trimmed = trimmed
            .replace(/^[*•\-]*\s*\*\*([^*]+)\*\*:?\s*/i, '')
            .replace(/^#{1,4}\s*([^:\n]+):?\s*/i, '')
            .replace(
                /^[*•\-]*\s*(?:goal understanding|analysis|next steps|approach|plan|execution plan|thoughts?|reasoning):\s*/i,
                ''
            )

        if (!trimmed) continue

        // Strip leading list bullet markers and numbered list markers
        trimmed = trimmed.replace(/^[*•\-]+\s*/, '')
        trimmed = trimmed.replace(/^\d+[\.\)]\s*/, '')

        // Strip unparsed bold / italic markdown tags
        trimmed = trimmed.replace(/\*\*([^*]+)\*\*/g, '$1')
        trimmed = trimmed.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')

        trimmed = trimmed.trim()
        if (trimmed) {
            cleanedLines.push(trimmed)
        }
    }

    return cleanedLines.join('\n')
}

export function CollapsibleReasoning({
    content,
    isExpanded = false,
    isThinking = false,
    durationMs,
    tokenCount,
}: CollapsibleReasoningProps) {
    const formatted = formatThought(content)
    if (!formatted && !isThinking) return null

    const glyph = isExpanded ? THEME.glyphs.foldOpen : THEME.glyphs.foldClosed
    const formattedDuration = durationMs ? ` (${(durationMs / 1000).toFixed(1)}s)` : ''
    const formattedTokens = tokenCount ? ` [${tokenCount} tokens]` : ''

    return (
        <Box flexDirection="column" marginY={0}>
            <Box gap={1} alignItems="center">
                {isThinking ? (
                    <Text color={THEME.colors.brand}>
                        <InkSpinner type="dots" />
                    </Text>
                ) : (
                    <Text color={THEME.colors.muted}>{glyph}</Text>
                )}
                <Text color={THEME.colors.muted} bold>
                    {isThinking ? 'Thinking...' : 'Reasoning'}
                </Text>
                <Text color={THEME.colors.dim}>
                    {formattedDuration}
                    {formattedTokens}
                </Text>
            </Box>

            {isExpanded && formatted && (
                <Box flexDirection="column" paddingLeft={2} marginTop={0}>
                    <Text color={THEME.colors.dim} italic>
                        {formatted}
                    </Text>
                </Box>
            )}
        </Box>
    )
}
