import { Box, Text, useInput } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export interface RadioItem<T = string> {
    label: string
    value: T
    hint?: string
}

export interface RadioGroupProps<T = string> {
    items: RadioItem<T>[]
    value: T
    onChange: (value: T) => void
    isFocused?: boolean
    orientation?: 'horizontal' | 'vertical'
}

export function RadioGroup<T = string>({
    items,
    value,
    onChange,
    isFocused = false,
    orientation = 'vertical',
}: RadioGroupProps<T>) {
    const currentIdx = items.findIndex((item) => item.value === value)

    useInput((_input, key) => {
        if (!isFocused) return

        if (key.upArrow || (orientation === 'horizontal' && key.leftArrow)) {
            const nextIdx = currentIdx > 0 ? currentIdx - 1 : items.length - 1
            const next = items[nextIdx]
            if (next) onChange(next.value)
            return
        }

        if (key.downArrow || (orientation === 'horizontal' && key.rightArrow)) {
            const nextIdx = currentIdx < items.length - 1 ? currentIdx + 1 : 0
            const next = items[nextIdx]
            if (next) onChange(next.value)
            return
        }
    })

    return (
        <Box
            flexDirection={orientation === 'horizontal' ? 'row' : 'column'}
            gap={orientation === 'horizontal' ? 2 : 0}
        >
            {items.map((item) => {
                const isSelected = item.value === value
                const glyph = isSelected ? '(•)' : '( )'
                const color = isSelected ? THEME.colors.brand : THEME.colors.muted

                return (
                    <Box key={String(item.value)} flexDirection="row" gap={1}>
                        <Text bold={isSelected} color={color}>
                            {glyph}
                        </Text>
                        <Text color={isSelected ? THEME.colors.text : THEME.colors.muted}>
                            {item.label}
                        </Text>
                        {item.hint && (
                            <Text color={THEME.colors.dim}>({item.hint})</Text>
                        )}
                    </Box>
                )
            })}
        </Box>
    )
}
