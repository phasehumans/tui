import { Box, Text } from 'ink'
import React, { createContext, useContext } from 'react'

import { THEME } from '../theme'

interface TableContextType {
    columnWidths?: number[]
}

const TableContext = createContext<TableContextType>({})

export interface TableProps {
    children: React.ReactNode
    columnWidths?: number[]
}

export function Table({ children, columnWidths }: TableProps) {
    return (
        <TableContext.Provider value={{ columnWidths }}>
            <Box flexDirection="column" marginY={1}>
                {children}
            </Box>
        </TableContext.Provider>
    )
}

export function TableHeader({ children }: { children: React.ReactNode }) {
    return (
        <Box flexDirection="column">
            {children}
            <Box height={1} overflow="hidden">
                <Text color={THEME.colors.border}>{'─'.repeat(64)}</Text>
            </Box>
        </Box>
    )
}

export function TableBody({ children }: { children: React.ReactNode }) {
    return <Box flexDirection="column">{children}</Box>
}

export function TableRow({ children }: { children: React.ReactNode }) {
    return (
        <Box flexDirection="row" gap={2} paddingY={0}>
            {children}
        </Box>
    )
}

export interface TableHeadProps {
    children: React.ReactNode
    width?: number
}

export function TableHead({ children, width = 16 }: TableHeadProps) {
    return (
        <Box width={width}>
            <Text bold color={THEME.colors.text}>
                {children}
            </Text>
        </Box>
    )
}

export interface TableCellProps {
    children: React.ReactNode
    width?: number
    color?: string
}

export function TableCell({ children, width = 16, color }: TableCellProps) {
    return (
        <Box width={width}>
            <Text color={color ?? THEME.colors.muted}>{children}</Text>
        </Box>
    )
}
