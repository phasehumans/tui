import { Box, Text, useInput } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export interface DialogProps {
    isOpen: boolean
    title: string
    description?: string
    children?: React.ReactNode
    onConfirm?: () => void
    onCancel?: () => void
    confirmLabel?: string
    cancelLabel?: string
    width?: number
}

export function Dialog({
    isOpen,
    title,
    description,
    children,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    width = 54,
}: DialogProps) {
    useInput((_input, key) => {
        if (!isOpen) return
        if (key.return && onConfirm) {
            onConfirm()
        } else if (key.escape && onCancel) {
            onCancel()
        }
    })

    if (!isOpen) return null

    return (
        <Box
            flexDirection="column"
            borderStyle="round"
            borderColor={THEME.colors.brand}
            paddingX={2}
            paddingY={1}
            width={width}
        >
            <Box marginBottom={description || children ? 1 : 0}>
                <Text bold color={THEME.colors.text}>
                    {title}
                </Text>
            </Box>

            {description && (
                <Box marginBottom={children ? 1 : 0}>
                    <Text color={THEME.colors.muted}>{description}</Text>
                </Box>
            )}

            {children && <Box marginY={1}>{children}</Box>}

            <Box marginTop={1} justifyContent="flex-end" gap={2}>
                {onCancel && <Text color={THEME.colors.dim}>[esc] {cancelLabel}</Text>}
                {onConfirm && (
                    <Text bold color={THEME.colors.brand}>
                        [enter] {confirmLabel}
                    </Text>
                )}
            </Box>
        </Box>
    )
}
