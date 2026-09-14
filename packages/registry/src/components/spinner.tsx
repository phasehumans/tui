import { Box, Text } from 'ink'
import React, { useEffect, useState } from 'react'

import { THEME } from '../theme'

export type SpinnerType =
    'dots' | 'matrix-wave' | 'matrix-pulse' | 'braille-matrix' | 'bars' | 'snake' | 'shuttle'

export interface SpinnerProps {
    /** Spinner animation variant. Defaults to 'dots' */
    type?: SpinnerType
    /** Optional label displayed beside the spinner */
    label?: string
    /** Active spinner color. Defaults to THEME.colors.brand */
    color?: string
    /** Label text color. Defaults to THEME.colors.muted */
    labelColor?: string
    /** Inactive/background dot color for matrix variants. Defaults to THEME.colors.border */
    inactiveColor?: string
    /** Number of dots for matrix-wave and snake variants. Defaults to 5 */
    length?: number
    /** Speed multiplier. Defaults to 1 */
    speed?: number
    /** Optional controlled frame for deterministic testing / snapshots */
    frame?: number
    /** Pauses animation */
    isPaused?: boolean
}

const BRAILLE_DOTS = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const BRAILLE_MATRIX = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']
const EQUALIZER_BARS = [' ▂▃', '▂▃▄', '▃▄▅', '▄▅▆', '▅▆▇', '▆▇▆', '▇▆▅', '▆▅▄', '▅▄▃', '▄▃▂']

export function Spinner({
    type = 'dots',
    label,
    color,
    labelColor,
    inactiveColor,
    length = 5,
    speed = 1,
    frame: controlledFrame,
    isPaused = false,
}: SpinnerProps) {
    const [internalFrame, setInternalFrame] = useState(0)

    useEffect(() => {
        if (controlledFrame !== undefined || isPaused) return

        const intervalMs = Math.max(25, Math.round(80 / Math.max(0.1, speed)))
        const timer = setInterval(() => {
            setInternalFrame((prev) => (prev + 1) % 100000)
        }, intervalMs)

        return () => clearInterval(timer)
    }, [controlledFrame, isPaused, speed])

    const currentFrame = controlledFrame !== undefined ? controlledFrame : internalFrame

    const activeColor = color ?? THEME.colors.brand
    const trailColor = THEME.colors.muted
    const dimColor = inactiveColor ?? THEME.colors.border
    const textLabelColor = labelColor ?? THEME.colors.muted

    // Render helper for each spinner type
    const renderGlyphs = () => {
        switch (type) {
            case 'dots': {
                const glyph = BRAILLE_DOTS[currentFrame % BRAILLE_DOTS.length]
                return <Text color={activeColor}>{glyph}</Text>
            }

            case 'braille-matrix': {
                const glyph = BRAILLE_MATRIX[currentFrame % BRAILLE_MATRIX.length]
                return <Text color={activeColor}>{glyph}</Text>
            }

            case 'bars': {
                const glyph = EQUALIZER_BARS[currentFrame % EQUALIZER_BARS.length]
                return <Text color={activeColor}>{glyph}</Text>
            }

            case 'matrix-wave': {
                const dotCount = Math.max(3, length)
                const totalCycle = dotCount + 2
                const head = currentFrame % totalCycle

                return (
                    <Box flexDirection="row">
                        {Array.from({ length: dotCount }, (_, i) => {
                            const d = (head - i + totalCycle) % totalCycle
                            const isHead = d === 0
                            const isTrail = d === 1

                            const char = isHead || isTrail ? '●' : '·'
                            const dotColor = isHead ? activeColor : isTrail ? trailColor : dimColor

                            return (
                                <Text key={i} color={dotColor}>
                                    {char}
                                    {i < dotCount - 1 ? ' ' : ''}
                                </Text>
                            )
                        })}
                    </Box>
                )
            }

            case 'matrix-pulse': {
                // Symmetrical pulse radiating from center dot outward
                const dotCount = 5
                const center = 2
                const phase = currentFrame % 3 // 0 = center, 1 = middle pair, 2 = outer pair

                return (
                    <Box flexDirection="row">
                        {Array.from({ length: dotCount }, (_, i) => {
                            const dist = Math.abs(i - center)
                            const isActive = dist === phase
                            const char = isActive ? '●' : '·'
                            const dotColor = isActive ? activeColor : dimColor

                            return (
                                <Text key={i} color={dotColor}>
                                    {char}
                                    {i < dotCount - 1 ? ' ' : ''}
                                </Text>
                            )
                        })}
                    </Box>
                )
            }

            case 'snake': {
                // 2-dot snake sliding along the track
                const dotCount = Math.max(3, length)
                const cycle = (dotCount - 1) * 2
                const pos = currentFrame % cycle
                const head = pos < dotCount ? pos : cycle - pos
                const prev = head > 0 ? head - 1 : head + 1

                return (
                    <Box flexDirection="row">
                        {Array.from({ length: dotCount }, (_, i) => {
                            const isHead = i === head
                            const isTail = i === prev
                            const char = isHead || isTail ? '●' : '·'
                            const dotColor = isHead ? activeColor : isTail ? trailColor : dimColor

                            return (
                                <Text key={i} color={dotColor}>
                                    {char}
                                    {i < dotCount - 1 ? ' ' : ''}
                                </Text>
                            )
                        })}
                    </Box>
                )
            }

            case 'shuttle': {
                // Bouncing dot between brackets [ · · ● · · ]
                const dotCount = Math.max(3, length)
                const cycle = (dotCount - 1) * 2
                const pos = currentFrame % cycle
                const head = pos < dotCount ? pos : cycle - pos

                return (
                    <Box flexDirection="row">
                        <Text color={dimColor}>[ </Text>
                        {Array.from({ length: dotCount }, (_, i) => {
                            const isHead = i === head
                            const char = isHead ? '●' : '·'
                            const dotColor = isHead ? activeColor : dimColor

                            return (
                                <Text key={i} color={dotColor}>
                                    {char}
                                    {i < dotCount - 1 ? ' ' : ''}
                                </Text>
                            )
                        })}
                        <Text color={dimColor}> ]</Text>
                    </Box>
                )
            }

            default: {
                const glyph = BRAILLE_DOTS[currentFrame % BRAILLE_DOTS.length]
                return <Text color={activeColor}>{glyph}</Text>
            }
        }
    }

    return (
        <Box flexDirection="row" alignItems="center" gap={1}>
            {renderGlyphs()}
            {label && <Text color={textLabelColor}>{label}</Text>}
        </Box>
    )
}
