import { Box, Text, useInput } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export type SwitchVariant = 'glyph' | 'badge'

export interface SwitchProps {
    checked: boolean
    onChange?: (checked: boolean) => void
    label?: string
    description?: string
    isFocused?: boolean
    disabled?: boolean
    variant?: SwitchVariant
}

export function Switch({
    checked,
    onChange,
    label,
    description,
    isFocused = false,
    disabled = false,
    variant = 'glyph',
}: SwitchProps) {
    useInput((input, key) => {
        if (!isFocused || disabled) return

        if (input === ' ' || key.return) {
            if (onChange) {
                onChange(!checked)
            }
            return
        }

        if (key.leftArrow) {
            if (checked && onChange) {
                onChange(false)
            }
            return
        }

        if (key.rightArrow) {
            if (!checked && onChange) {
                onChange(true)
            }
            return
        }
    })

    const glyphStr = checked ? '(─●)' : '(●─)'
    const badgeStr = checked ? '[ ON ]' : '[ OFF ]'
    const indicatorText = variant === 'badge' ? badgeStr : glyphStr

    const indicatorColor = disabled
        ? THEME.colors.dim
        : checked
          ? THEME.colors.success
          : isFocused
            ? THEME.colors.brand
            : THEME.colors.dim

    return (
        <Box flexDirection="row" alignItems="center" gap={1}>
            <Text bold color={indicatorColor}>
                {indicatorText}
            </Text>
            {label && (
                <Text
                    color={
                        disabled
                            ? THEME.colors.dim
                            : isFocused
                              ? THEME.colors.text
                              : THEME.colors.muted
                    }
                    bold={isFocused}
                >
                    {label}
                </Text>
            )}
            {description && <Text color={THEME.colors.dim}>({description})</Text>}
        </Box>
    )
}
