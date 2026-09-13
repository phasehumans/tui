import { Box, Text, useInput } from 'ink'
import React, { useState, useMemo } from 'react'

import { THEME } from '../theme'

import { MenuFooter } from './menu-footer'

export interface CommandItem {
    name: string
    description: string
    value: string
    aliases?: string[]
}

export interface CommandMenuProps {
    query?: string
    commands?: CommandItem[]
    onSelect: (command: CommandItem) => void
    onCancel?: () => void
    windowSize?: number
}

export const DEFAULT_COMMANDS: CommandItem[] = [
    { name: 'model', description: 'Switch active LLM model engine', value: '/model' },
    { name: 'plan', description: 'Create an execution plan before running', value: '/plan' },
    { name: 'init', description: 'Scaffold project configuration and rules', value: '/init' },
    { name: 'review', description: 'Review changes and git working diff', value: '/review' },
    { name: 'skills', description: 'List available agent skills and tools', value: '/skills' },
    { name: 'context', description: 'Inspect context tokens and attachments', value: '/context' },
    { name: 'clear', description: 'Reset chat history and terminal context', value: '/clear' },
    { name: 'exit', description: 'Exit the terminal agent session', value: '/exit' },
]

export function CommandMenu({
    query = '',
    commands = DEFAULT_COMMANDS,
    onSelect,
    onCancel,
    windowSize = 5,
}: CommandMenuProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [windowStart, setWindowStart] = useState(0)

    const cleanQuery = query.startsWith('/')
        ? query.slice(1).toLowerCase().trim()
        : query.toLowerCase().trim()

    const filtered = useMemo(() => {
        if (!cleanQuery) return commands
        return commands.filter((cmd) => {
            const nameMatch = cmd.name.toLowerCase().includes(cleanQuery)
            const descMatch = cmd.description.toLowerCase().includes(cleanQuery)
            const aliasMatch = cmd.aliases?.some((a) => a.toLowerCase().includes(cleanQuery))
            return nameMatch || descMatch || aliasMatch
        })
    }, [commands, cleanQuery])

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
                const next = Math.min(filtered.length - 1, prev + 1)
                if (next >= windowStart + windowSize) {
                    setWindowStart(next - windowSize + 1)
                }
                return next
            })
            return
        }
        if (key.return || key.tab) {
            const chosen = filtered[selectedIndex]
            if (chosen) onSelect(chosen)
            return
        }
        if (key.escape) {
            if (onCancel) onCancel()
            return
        }
    })

    if (filtered.length === 0) {
        return (
            <Box paddingLeft={THEME.padding.paddingLeft ?? 2} paddingY={1}>
                <Text color={THEME.colors.muted}>No matching commands</Text>
            </Box>
        )
    }

    const windowEnd = Math.min(windowStart + windowSize, filtered.length)
    const visible = filtered.slice(windowStart, windowEnd)
    const itemsAbove = windowStart
    const itemsBelow = filtered.length - windowEnd

    return (
        <Box flexDirection="column" paddingLeft={THEME.padding.paddingLeft ?? 2}>
            {itemsAbove > 0 && (
                <Box paddingLeft={2}>
                    <Text color={THEME.colors.dim}>↑ {itemsAbove} more</Text>
                </Box>
            )}

            <Box flexDirection="column">
                {visible.map((cmd, relIdx) => {
                    const absIdx = windowStart + relIdx
                    const isSelected = absIdx === selectedIndex

                    return (
                        <Box key={cmd.value} flexDirection="row">
                            <Box width={2}>
                                <Text color={isSelected ? THEME.colors.brand : THEME.colors.dim}>
                                    {isSelected ? `${THEME.glyphs.selector}` : ' '}
                                </Text>
                            </Box>
                            <Box width={20} marginRight={2} flexShrink={0}>
                                <Text
                                    color={isSelected ? THEME.colors.brand : THEME.colors.text}
                                    bold={isSelected}
                                    wrap="truncate-end"
                                >
                                    /{cmd.name}
                                </Text>
                            </Box>
                            <Box flexShrink={1}>
                                <Text color={THEME.colors.muted} wrap="truncate-end">
                                    {cmd.description}
                                </Text>
                            </Box>
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
                    { key: 'enter', label: 'Select' },
                    { key: 'tab', label: 'Complete' },
                    { key: 'esc', label: 'Cancel' },
                ]}
            />
        </Box>
    )
}
