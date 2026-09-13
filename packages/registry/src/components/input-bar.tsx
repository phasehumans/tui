import { Box, Text, useInput } from 'ink'
import React, { useState, useCallback, useRef } from 'react'

import { THEME } from '../theme'

import { CommandMenu, type CommandItem, DEFAULT_COMMANDS } from './command-menu'
import { ShortcutsMenu, type ShortcutItem } from './shortcuts-menu'
import { TextArea } from './text-area'

export interface InputBarProps {
    onSubmit: (text: string) => void
    placeholder?: string
    disabled?: boolean
    commands?: CommandItem[]
    shortcuts?: ShortcutItem[]
    fileSuggestions?: string[]
    statusLeft?: React.ReactNode
    statusRight?: React.ReactNode
    activeToast?: { message: string; variant?: 'info' | 'success' | 'error' } | null
    separatorWidth?: number
    focus?: boolean
}

export const InputBar = React.memo(function InputBar({
    onSubmit,
    placeholder = 'Ask agent to build, refactor, or test...',
    disabled = false,
    commands = DEFAULT_COMMANDS,
    shortcuts,
    fileSuggestions = [],
    statusLeft = 'Agent ready',
    statusRight = '? for shortcuts',
    activeToast,
    separatorWidth = 64,
    focus = true,
}: InputBarProps) {
    const [value, setValue] = useState('')
    const [showShortcuts, setShowShortcuts] = useState(false)
    const [selectedFileIdx, setSelectedFileIdx] = useState(0)

    // Detect if slash command popup should be open
    const isCommandQuery = value.startsWith('/') && !value.includes(' ')

    // Detect if @file mention popup should be open
    const fileMatch = value.match(/@(\S*)$/)
    const showFileMenu = Boolean(fileMatch) && !isCommandQuery && fileSuggestions.length > 0
    const fileQuery = fileMatch ? (fileMatch[1] ?? '').toLowerCase() : ''
    const matchingFiles = fileSuggestions
        .filter((f) => f.toLowerCase().includes(fileQuery))
        .slice(0, 5)

    useInput((input, key) => {
        if (disabled) return

        if (showFileMenu && matchingFiles.length > 0) {
            if (key.upArrow) {
                setSelectedFileIdx((prev) => Math.max(0, prev - 1))
                return
            }
            if (key.downArrow) {
                setSelectedFileIdx((prev) => Math.min(matchingFiles.length - 1, prev + 1))
                return
            }
            if (key.tab || key.return) {
                const selected = matchingFiles[selectedFileIdx]
                if (selected) {
                    setValue((curr) => curr.replace(/@\S*$/, `@${selected} `))
                    setSelectedFileIdx(0)
                }
                return
            }
            if (key.escape) {
                setValue((curr) => curr.replace(/@\S*$/, ''))
                return
            }
        }

        if (input === '?' && value.length === 0) {
            setShowShortcuts((prev) => !prev)
            return
        }

        if (key.escape && showShortcuts) {
            setShowShortcuts(false)
            return
        }
    })

    const handleChange = useCallback(
        (newValue: string) => {
            if (disabled) return
            if (newValue === '?' && value.length === 0) {
                setShowShortcuts(true)
                return
            }
            if (showShortcuts) {
                setShowShortcuts(false)
            }
            setValue(newValue)
            setSelectedFileIdx(0)
        },
        [disabled, showShortcuts, value.length]
    )

    const handleSubmit = useCallback(
        (text: string) => {
            if (disabled) return
            const trimmed = text.trim()
            if (!trimmed) return

            setValue('')
            onSubmit(trimmed)
        },
        [disabled, onSubmit]
    )

    const handleCommandSelect = useCallback(
        (cmd: CommandItem) => {
            setValue('')
            onSubmit(cmd.value)
        },
        [onSubmit]
    )

    const sep = '─'.repeat(Math.max(10, separatorWidth))

    return (
        <Box
            flexDirection="column"
            paddingLeft={THEME.padding.paddingLeft ?? THEME.padding.paddingX}
            paddingRight={THEME.padding.paddingRight ?? 4}
            marginTop={1}
        >
            {/* File mention completion dropdown */}
            {showFileMenu && matchingFiles.length > 0 && (
                <Box flexDirection="column" paddingLeft={2} marginBottom={1}>
                    {matchingFiles.map((file, idx) => {
                        const isSelected = idx === selectedFileIdx
                        return (
                            <Box key={file} flexDirection="row" gap={1}>
                                <Text color={isSelected ? THEME.colors.brand : THEME.colors.dim}>
                                    {isSelected ? `${THEME.glyphs.selector}` : ' '}
                                </Text>
                                <Text color={isSelected ? THEME.colors.brand : THEME.colors.text}>
                                    {file}
                                </Text>
                            </Box>
                        )
                    })}
                </Box>
            )}

            {/* Top border separator */}
            <Box overflow="hidden" height={1} width="100%">
                <Text color={THEME.colors.border}>{sep}</Text>
            </Box>

            {/* Input prompt line */}
            <Box width="100%" flexDirection="row" alignItems="center">
                <Box flexShrink={0} marginRight={1}>
                    <Text color={disabled ? THEME.colors.dim : THEME.colors.brand}>
                        {THEME.glyphs.prompt}
                    </Text>
                </Box>
                <Box flexGrow={1} flexShrink={1}>
                    <TextArea
                        value={value}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        placeholder={placeholder}
                        focus={focus && !disabled && !showShortcuts}
                        disableHistoryNav={isCommandQuery || showFileMenu || showShortcuts}
                    />
                </Box>
            </Box>

            {/* Bottom border separator */}
            <Box overflow="hidden" height={1} width="100%">
                <Text color={THEME.colors.border}>{sep}</Text>
            </Box>

            {/* Status bar */}
            {!isCommandQuery && !showShortcuts && (
                <Box width="100%" justifyContent="space-between">
                    <Box gap={2} alignItems="center" flexShrink={1}>
                        <Text color={THEME.colors.muted}>
                            {typeof statusLeft === 'string' ? statusLeft : statusLeft}
                        </Text>
                        {activeToast && (
                            <Text
                                color={
                                    activeToast.variant === 'success'
                                        ? THEME.colors.success
                                        : activeToast.variant === 'error'
                                          ? THEME.colors.error
                                          : THEME.colors.brand
                                }
                            >
                                · {activeToast.message}
                            </Text>
                        )}
                    </Box>
                    <Box flexShrink={0} marginLeft={2}>
                        <Text color={THEME.colors.dim}>
                            {typeof statusRight === 'string' ? statusRight : statusRight}
                        </Text>
                    </Box>
                </Box>
            )}

            {/* Slash commands dropdown */}
            {isCommandQuery && (
                <CommandMenu
                    query={value}
                    commands={commands}
                    onSelect={handleCommandSelect}
                    onCancel={() => setValue('')}
                />
            )}

            {/* Shortcuts help menu */}
            {showShortcuts && (
                <ShortcutsMenu
                    shortcuts={shortcuts}
                    onClose={() => setShowShortcuts(false)}
                />
            )}
        </Box>
    )
})
