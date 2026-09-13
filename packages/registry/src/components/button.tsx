import { Box, Text, useInput } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export type ButtonVariant =
    'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'bracket'

export type ButtonSize = 'sm' | 'default' | 'lg'

export interface ButtonProps {
    children: React.ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    isFocused?: boolean
    disabled?: boolean
    onSelect?: () => void
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    shortcut?: string
}

export function Button({
    children,
    variant = 'default',
    size = 'default',
    isFocused = false,
    disabled = false,
    onSelect,
    prefix,
    suffix,
    shortcut,
}: ButtonProps) {
    useInput((input, key) => {
        if (disabled) return
        if (shortcut && input && input.toLowerCase() === shortcut.toLowerCase() && onSelect) {
            onSelect()
            return
        }
        if (!isFocused) return
        if (key.return && onSelect) {
            onSelect()
        }
    })

    const paddingX = size === 'sm' ? 1 : size === 'lg' ? 3 : 2

    const renderPrefix = () => {
        if (!prefix) return null
        return (
            <Box marginRight={1}>{typeof prefix === 'string' ? <Text>{prefix}</Text> : prefix}</Box>
        )
    }

    const renderSuffix = () => {
        if (!suffix) return null
        return (
            <Box marginLeft={1}>{typeof suffix === 'string' ? <Text>{suffix}</Text> : suffix}</Box>
        )
    }

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
    } else if (variant === 'link') {
        textColor = isFocused ? THEME.colors.brand : THEME.colors.muted
    } else if (variant === 'bracket') {
        textColor = isFocused ? THEME.colors.brand : THEME.colors.text
    }

    if (variant === 'link') {
        return (
            <Box flexDirection="row" alignItems="center">
                {renderPrefix()}
                <Text underline bold={isFocused} color={textColor}>
                    {children}
                </Text>
                {renderSuffix()}
            </Box>
        )
    }

    if (variant === 'bracket') {
        const bracketColor = disabled
            ? THEME.colors.dim
            : isFocused
              ? THEME.colors.brand
              : THEME.colors.dim
        return (
            <Box flexDirection="row" alignItems="center">
                <Text color={bracketColor} bold={isFocused}>
                    [{' '}
                </Text>
                {renderPrefix()}
                <Text bold={isFocused} color={textColor}>
                    {children}
                </Text>
                {renderSuffix()}
                <Text color={bracketColor} bold={isFocused}>
                    {' '}
                    ]
                </Text>
            </Box>
        )
    }

    if (hasBorder) {
        return (
            <Box
                borderStyle="round"
                borderColor={isFocused ? THEME.colors.brand : THEME.colors.border}
                paddingX={paddingX - 1}
            >
                {renderPrefix()}
                <Text bold={isFocused} color={textColor}>
                    {children}
                </Text>
                {renderSuffix()}
            </Box>
        )
    }

    return (
        <Box backgroundColor={bgColor} paddingX={paddingX} flexDirection="row" alignItems="center">
            {renderPrefix()}
            <Text bold={isFocused} color={textColor}>
                {children}
            </Text>
            {renderSuffix()}
        </Box>
    )
}
