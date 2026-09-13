import { Box, Text } from 'ink'
import React from 'react'

import { THEME } from '../theme'

export type UserMessageProps = {
    message: string
}

export const UserMessage = React.memo(function UserMessage({ message }: UserMessageProps) {
    let displayMessage = message
    if (displayMessage.startsWith('[Skill Invocation: /')) {
        const match = displayMessage.match(/^\[Skill Invocation: (\/[^\]]+)\]/)
        if (match && match[1]) {
            displayMessage = match[1]
        }
    }

    return (
        <Box
            paddingLeft={THEME.padding.paddingLeft ?? THEME.padding.paddingX}
            paddingRight={THEME.padding.paddingRight ?? 4}
            paddingY={0}
            marginTop={1}
            marginBottom={1}
            flexDirection="row"
        >
            <Box marginRight={1} flexShrink={0}>
                <Text color={THEME.colors.brand}>{THEME.glyphs.prompt}</Text>
            </Box>
            <Box flexGrow={1} flexShrink={1}>
                <Text color={THEME.colors.brand} wrap="wrap">
                    {displayMessage}
                </Text>
            </Box>
        </Box>
    )
})
