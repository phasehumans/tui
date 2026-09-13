import { Box, Text, useInput } from 'ink'
import React, { useState } from 'react'

import { THEME } from '../theme'

import { MenuFooter, type MenuFooterItem } from './menu-footer'

export interface SelectMenuItem<T = string> {
    label: string
    value: T
    hint?: string
    active?: boolean
}

export interface SelectMenuProps<T = string> {
    title?: string
    items: SelectMenuItem<T>[]
    onSelect: (item: SelectMenuItem<T>) => void
    onCancel?: () => void
    footerItems?: MenuFooterItem[]
    windowSize?: number
}

export function SelectMenu<T = string>({
    title,
    items,
    onSelect,
    onCancel,
    footerItems = [
        { key: '↑/↓', label: 'Navigate' },
        { key: 'enter', label: 'Select' },
        { key: 'esc', label: 'Cancel' },
    ],
    windowSize = 8,
}: SelectMenuProps<T>) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [windowStart, setWindowStart] = useState(0)

    useInput((_input, key) => {
        if (key.upArrow) {
            setSelectedIndex((prev) => {
                const next = Math.max(0, prev - 1)
                if (next < windowStart) setWindowStart(next)
                return next
            })
            return
        }
        if (key.downArrow) {
            setSelectedIndex((prev) => {
                const next = Math.min(items.length - 1, prev + 1)
                if (next >= windowStart + windowSize) {
                    setWindowStart(next - windowSize + 1)
                }
                return next
            })
            return
        }
        if (key.return) {
            const chosen = items[selectedIndex]
            if (chosen) onSelect(chosen)
            return
        }
        if (key.escape) {
            if (onCancel) onCancel()
            return
        }
    })

    if (items.length === 0) {
        return (
            <Box flexDirection="column" paddingY={1}>
                {title && (
                    <Text color={THEME.colors.brand} bold>
                        {title}
                    </Text>
                )}
                <Text color={THEME.colors.muted}>No options available</Text>
            </Box>
        )
    }

    const windowEnd = Math.min(windowStart + windowSize, items.length)
    const visible = items.slice(windowStart, windowEnd)
    const itemsAbove = windowStart
    const itemsBelow = items.length - windowEnd

    return (
        <Box flexDirection="column" paddingX={THEME.padding.paddingX}>
            {title && (
                <Box marginBottom={1}>
                    <Text color={THEME.colors.text} bold>
                        {title}
                    </Text>
                </Box>
            )}

            {itemsAbove > 0 && (
                <Box paddingLeft={2}>
                    <Text color={THEME.colors.dim}>↑ {itemsAbove} more</Text>
                </Box>
            )}

            <Box flexDirection="column">
                {visible.map((item, relIdx) => {
                    const absIdx = windowStart + relIdx
                    const isSelected = absIdx === selectedIndex

                    return (
                        <Box key={String(item.value)} flexDirection="row" gap={1}>
                            <Text color={isSelected ? THEME.colors.brand : THEME.colors.dim}>
                                {isSelected ? `${THEME.glyphs.selector}` : ' '}
                            </Text>
                            <Text color={isSelected ? THEME.colors.brand : THEME.colors.text}>
                                {item.label}
                            </Text>
                            {item.active && <Text color={THEME.colors.success}>(Active)</Text>}
                            {item.hint && <Text color={THEME.colors.muted}>— {item.hint}</Text>}
                        </Box>
                    )
                })}
            </Box>

            {itemsBelow > 0 && (
                <Box paddingLeft={2}>
                    <Text color={THEME.colors.dim}>↓ {itemsBelow} more</Text>
                </Box>
            )}

            <MenuFooter items={footerItems} />
        </Box>
    )
}
