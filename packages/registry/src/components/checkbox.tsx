import { Box, Text, useInput } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export interface CheckboxProps {
    label: string
    checked: boolean
    onChange?: (checked: boolean) => void
    isFocused?: boolean
    disabled?: boolean
}

export function Checkbox({
    label,
    checked,
    onChange,
    isFocused = false,
    disabled = false,
}: CheckboxProps) {
    useInput((input, key) => {
        if (!isFocused || disabled) return
        if (input === ' ' || key.return) {
            if (onChange) {
                onChange(!checked)
            }
        }
    })

    const boxGlyph = checked ? '[✔]' : '[ ]'
    const color = disabled
        ? THEME.colors.dim
        : checked
          ? THEME.colors.success
          : isFocused
            ? THEME.colors.brand
            : THEME.colors.muted

    return (
        <Box flexDirection="row" alignItems="center" gap={1}>
            <Text bold color={color}>
                {boxGlyph}
            </Text>
            <Text
                color={
                    disabled ? THEME.colors.dim : isFocused ? THEME.colors.text : THEME.colors.muted
                }
                bold={isFocused}
            >
                {label}
            </Text>
        </Box>
    )
}
