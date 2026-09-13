import { Box, Text } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export type ToastVariant = 'info' | 'success' | 'error' | 'warning'

export interface ToastProps {
    title: string
    description?: string
    variant?: ToastVariant
}

export function Toast({ title, description, variant = 'info' }: ToastProps) {
    const icon =
        variant === 'success'
            ? THEME.glyphs.check
            : variant === 'error'
              ? THEME.glyphs.cross
              : variant === 'warning'
                ? '▲'
                : THEME.glyphs.bullet

    const color =
        variant === 'success'
            ? THEME.colors.success
            : variant === 'error'
              ? THEME.colors.error
              : variant === 'warning'
                ? THEME.colors.warning
                : THEME.colors.brand

    return (
        <Box
            borderStyle="round"
            borderColor={color}
            paddingX={1}
            flexDirection="row"
            alignItems="center"
            gap={1}
        >
            <Text bold color={color}>
                {icon}
            </Text>
            <Box flexDirection="column">
                <Text bold color={THEME.colors.text}>
                    {title}
                </Text>
                {description && <Text color={THEME.colors.muted}>{description}</Text>}
            </Box>
        </Box>
    )
}
