import { Text, Box } from 'ink'
import InkSpinner from 'ink-spinner'
import React from 'react'

import { THEME } from '../theme'

export type SpinnerProps = {
    label?: string
}

export function Spinner({ label }: SpinnerProps) {
    return (
        <Box gap={1} alignItems="center">
            <Text color={THEME.colors.muted}>
                <InkSpinner type="dots" />
            </Text>
            {label && <Text color={THEME.colors.muted}>{label}</Text>}
        </Box>
    )
}
