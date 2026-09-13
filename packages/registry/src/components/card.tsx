import { Box, Text } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export interface CardProps {
    children: React.ReactNode
    borderStyle?: 'round' | 'single' | 'double' | 'bold'
    borderColor?: string
    paddingX?: number
    paddingY?: number
    width?: number | string
}

export function Card({
    children,
    borderStyle = 'round',
    borderColor = THEME.colors.border,
    paddingX = 1,
    paddingY = 0,
    width,
}: CardProps) {
    return (
        <Box
            flexDirection="column"
            borderStyle={borderStyle}
            borderColor={borderColor}
            paddingX={paddingX}
            paddingY={paddingY}
            width={width}
        >
            {children}
        </Box>
    )
}

export function CardHeader({ children }: { children: React.ReactNode }) {
    return (
        <Box flexDirection="column" marginBottom={1}>
            {children}
        </Box>
    )
}

export function CardTitle({ children }: { children: React.ReactNode }) {
    return (
        <Text bold color={THEME.colors.text}>
            {children}
        </Text>
    )
}

export function CardDescription({ children }: { children: React.ReactNode }) {
    return (
        <Text color={THEME.colors.muted}>
            {children}
        </Text>
    )
}

export function CardContent({ children }: { children: React.ReactNode }) {
    return (
        <Box flexDirection="column" marginY={0}>
            {children}
        </Box>
    )
}

export function CardFooter({ children }: { children: React.ReactNode }) {
    return (
        <Box marginTop={1} flexDirection="row" gap={1}>
            {children}
        </Box>
    )
}
