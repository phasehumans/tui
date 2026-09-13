import { Box, Text, useInput } from 'ink'
import React, { useState } from 'react'

import { THEME } from '../theme'

import { MenuFooter } from './menu-footer'

export interface ShortcutItem {
    key: string
    desc: string
}

export interface ShortcutsMenuProps {
    shortcuts?: ShortcutItem[]
    onClose: () => void
    windowSize?: number
}

export const DEFAULT_SHORTCUTS: ShortcutItem[] = [
    { key: '/', desc: 'Open slash commands palette' },
    { key: '! <cmd>', desc: 'Execute direct shell command (e.g. !git status)' },
    { key: '@<file>', desc: 'Mention file path from workspace' },
    { key: 'ctrl+a', desc: 'Jump to beginning of prompt' },
    { key: 'ctrl+e', desc: 'Jump to end of prompt' },
    { key: 'ctrl+k', desc: 'Delete from cursor to end of line' },
    { key: 'ctrl+u', desc: 'Delete from cursor to start of line' },
    { key: 'ctrl+w', desc: 'Delete previous word' },
    { key: 'ctrl+c', desc: 'Cancel current generation / exit' },
    { key: 'alt+enter', desc: 'Insert multiline newline' },
    { key: 'esc', desc: 'Dismiss popup menu or dialog' },
]

export function ShortcutsMenu({
    shortcuts = DEFAULT_SHORTCUTS,
    onClose,
    windowSize = 10,
}: ShortcutsMenuProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [windowStart, setWindowStart] = useState(0)

    useInput((input, key) => {
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
                const next = Math.min(shortcuts.length - 1, prev + 1)
                if (next >= windowStart + windowSize) {
                    setWindowStart(next - windowSize + 1)
                }
                return next
            })
            return
        }
        if (key.escape || (key.ctrl && input === 'c')) {
            onClose()
            return
        }
    })

    const windowEnd = Math.min(windowStart + windowSize, shortcuts.length)
    const visible = shortcuts.slice(windowStart, windowEnd)
    const itemsAbove = windowStart
    const itemsBelow = shortcuts.length - windowEnd

    return (
        <Box flexDirection="column" paddingLeft={THEME.padding.paddingLeft ?? 2}>
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
                        <Box key={item.key} flexDirection="row">
                            <Box width={2}>
                                <Text color={isSelected ? THEME.colors.brand : THEME.colors.dim}>
                                    {isSelected ? `${THEME.glyphs.selector}` : ' '}
                                </Text>
                            </Box>
                            <Box width={16} marginRight={2}>
                                <Text
                                    color={isSelected ? THEME.colors.brand : THEME.colors.text}
                                    bold={isSelected}
                                >
                                    {item.key}
                                </Text>
                            </Box>
                            <Text color={THEME.colors.muted}>{item.desc}</Text>
                        </Box>
                    )
                })}
            </Box>

            {itemsBelow > 0 && (
                <Box paddingLeft={2}>
                    <Text color={THEME.colors.dim}>↓ {itemsBelow} more</Text>
                </Box>
            )}

            <MenuFooter
                items={[
                    { key: '↑/↓', label: 'Navigate' },
                    { key: 'esc', label: 'Close' },
                ]}
            />
        </Box>
    )
}
