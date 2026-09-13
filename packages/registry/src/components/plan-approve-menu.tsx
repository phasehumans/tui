import { Box, Text, useInput } from 'ink'
import React, { useState } from 'react'

import { THEME } from '../theme'

import { MenuFooter } from './menu-footer'

export type PlanAction = 'approve' | 'refine' | 'view' | 'reject'

export interface PlanApproveOption {
    key: string
    label: string
    value: PlanAction
    color?: string
}

export interface PlanApproveMenuProps {
    planSummary?: string
    onSelect: (action: PlanAction) => void
    options?: PlanApproveOption[]
}

export const DEFAULT_PLAN_OPTIONS: PlanApproveOption[] = [
    { key: 'y', label: '[y] Approve & Execute', value: 'approve', color: THEME.colors.success },
    { key: 'r', label: '[r] Refine Plan', value: 'refine', color: THEME.colors.brand },
    { key: 'v', label: '[v] View Full Plan', value: 'view', color: THEME.colors.brand },
    { key: 'n', label: '[n] Reject / Cancel', value: 'reject', color: THEME.colors.error },
]

export function PlanApproveMenu({
    planSummary,
    onSelect,
    options = DEFAULT_PLAN_OPTIONS,
}: PlanApproveMenuProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useInput((input, key) => {
        const lower = (input || '').toLowerCase()
        const matched = options.find((opt) => opt.key.toLowerCase() === lower)
        if (matched) {
            onSelect(matched.value)
            return
        }

        if (key.upArrow) {
            setSelectedIndex((prev) => Math.max(0, prev - 1))
            return
        }
        if (key.downArrow) {
            setSelectedIndex((prev) => Math.min(options.length - 1, prev + 1))
            return
        }
        if (key.return) {
            const chosen = options[selectedIndex]
            if (chosen) onSelect(chosen.value)
            return
        }
        if (key.escape) {
            onSelect('reject')
            return
        }
    })

    return (
        <Box flexDirection="column" paddingLeft={THEME.padding.paddingLeft ?? 2}>
            {planSummary && (
                <Box
                    marginBottom={1}
                    borderStyle="round"
                    borderColor={THEME.colors.border}
                    paddingX={1}
                >
                    <Text color={THEME.colors.brand}>{planSummary}</Text>
                </Box>
            )}

            <Box marginBottom={1}>
                <Text color={THEME.colors.brand} bold>
                    [PLAN] Plan ready. Please select an action:
                </Text>
            </Box>

            <Box flexDirection="column">
                {options.map((opt, idx) => {
                    const isSelected = idx === selectedIndex
                    return (
                        <Box key={opt.value} flexDirection="row" gap={1}>
                            <Text color={isSelected ? THEME.colors.brand : THEME.colors.dim}>
                                {isSelected ? `${THEME.glyphs.selector}` : ' '}
                            </Text>
                            <Text color={opt.color ?? (isSelected ? THEME.colors.brand : THEME.colors.text)}>
                                {opt.label}
                            </Text>
                        </Box>
                    )
                })}
            </Box>

            <MenuFooter
                items={[
                    { key: 'y', label: 'Approve' },
                    { key: 'r', label: 'Refine' },
                    { key: 'v', label: 'View' },
                    { key: 'n', label: 'Reject' },
                    { key: '↑/↓', label: 'Navigate' },
                    { key: 'enter', label: 'Select' },
                ]}
            />
        </Box>
    )
}
