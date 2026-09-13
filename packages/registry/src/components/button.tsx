import { Box, Text, useInput } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'default' | 'lg'

export interface ButtonProps {
    children: React.ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    isFocused?: boolean
    disabled?: boolean
    onSelect?: () => void
    prefix?: React.ReactNode
}

export function Button({
    children,
    variant = 'default',
    size = 'default',
    isFocused = false,
    disabled = false,
    onSelect,
    prefix,
}: ButtonProps) {
    useInput((_input, key) => {
        if (!isFocused || disabled) return
        if (key.return && onSelect) {
            onSelect()
        }
    })

    const paddingX = size === 'sm' ? 1 : size === 'lg' ? 3 : 2

    let bgColor: string | undefined = undefined
    let textColor: string = THEME.colors.text
    let hasBorder = false

    if (disabled) {
        textColor = THEME.colors.dim
        bgColor = THEME.colors.border
    } else if (variant === 'default') {
        bgColor = isFocused ? THEME.colors.brand : THEME.colors.border
        textColor = isFocused ? '#141414' : THEME.colors.text
    } else if (variant === 'secondary') {
        bgColor = isFocused ? THEME.colors.muted : THEME.colors.border
        textColor = isFocused ? '#141414' : THEME.colors.text
    } else if (variant === 'destructive') {
        bgColor = isFocused ? THEME.colors.error : THEME.colors.diffDeleteBg
        textColor = isFocused ? '#141414' : THEME.colors.error
    } else if (variant === 'outline') {
        hasBorder = true
        textColor = isFocused ? THEME.colors.brand : THEME.colors.muted
    } else if (variant === 'ghost') {
        textColor = isFocused ? THEME.colors.brand : THEME.colors.muted
    }

    if (hasBorder) {
        return (
            <Box
                borderStyle="round"
                borderColor={isFocused ? THEME.colors.brand : THEME.colors.border}
                paddingX={paddingX - 1}
            >
                {prefix && <Box marginRight={1}>{prefix}</Box>}
                <Text bold={isFocused} color={textColor}>
                    {children}
                </Text>
            </Box>
        )
    }

    return (
        <Box
            backgroundColor={bgColor}
            paddingX={paddingX}
            flexDirection="row"
            alignItems="center"
        >
            {prefix && <Box marginRight={1}>{prefix}</Box>}
            <Text bold={isFocused} color={textColor}>
                {children}
            </Text>
        </Box>
    )
}
