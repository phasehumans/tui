import { Box, Text, useInput } from 'ink'
import React, { createContext, useContext, useState } from 'react'

import { THEME } from '../theme'

interface TabsContextType {
    value: string
    onValueChange: (val: string) => void
    isFocused?: boolean
}

const TabsContext = createContext<TabsContextType | null>(null)

export interface TabsProps {
    defaultValue: string
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    isFocused?: boolean
}

export function Tabs({
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
    isFocused = false,
}: TabsProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
    const activeValue = controlledValue !== undefined ? controlledValue : uncontrolledValue

    const handleValueChange = (val: string) => {
        if (controlledValue === undefined) {
            setUncontrolledValue(val)
        }
        if (onValueChange) {
            onValueChange(val)
        }
    }

    return (
        <TabsContext.Provider
            value={{
                value: activeValue,
                onValueChange: handleValueChange,
                isFocused,
            }}
        >
            <Box flexDirection="column">{children}</Box>
        </TabsContext.Provider>
    )
}

export interface TabsListProps {
    children: React.ReactNode
}

export function TabsList({ children }: TabsListProps) {
    const ctx = useContext(TabsContext)
    const childArray = React.Children.toArray(children) as React.ReactElement<TabsTriggerProps>[]

    useInput((_input, key) => {
        if (!ctx?.isFocused) return

        const currentIdx = childArray.findIndex((c) => c.props.value === ctx.value)
        if (key.leftArrow) {
            const nextIdx = currentIdx > 0 ? currentIdx - 1 : childArray.length - 1
            const nextVal = childArray[nextIdx]?.props.value
            if (nextVal) ctx.onValueChange(nextVal)
        } else if (key.rightArrow || key.tab) {
            const nextIdx = currentIdx < childArray.length - 1 ? currentIdx + 1 : 0
            const nextVal = childArray[nextIdx]?.props.value
            if (nextVal) ctx.onValueChange(nextVal)
        }
    })

    return (
        <Box flexDirection="row" gap={1} marginBottom={1}>
            {children}
        </Box>
    )
}

export interface TabsTriggerProps {
    value: string
    children: React.ReactNode
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
    const ctx = useContext(TabsContext)
    const isSelected = ctx?.value === value

    return (
        <Box backgroundColor={isSelected ? THEME.colors.border : undefined} paddingX={1}>
            <Text bold={isSelected} color={isSelected ? THEME.colors.brand : THEME.colors.muted}>
                {children}
            </Text>
        </Box>
    )
}

export interface TabsContentProps {
    value: string
    children: React.ReactNode
}

export function TabsContent({ value, children }: TabsContentProps) {
    const ctx = useContext(TabsContext)
    if (ctx?.value !== value) return null

    return <Box flexDirection="column">{children}</Box>
}
