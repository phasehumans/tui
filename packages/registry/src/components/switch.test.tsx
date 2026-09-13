import { describe, expect, it } from 'bun:test'
import { PassThrough } from 'node:stream'
import { render } from 'ink'
import React from 'react'

import { Switch, type SwitchProps } from './switch'

async function renderInk(element: React.ReactElement) {
    const stdout = new PassThrough() as any
    stdout.isTTY = true
    stdout.columns = 80
    stdout.rows = 24
    let output = ''
    stdout.on('data', (chunk: Buffer) => {
        output += chunk.toString()
    })
    const instance = render(element, { stdout, debug: true })
    await new Promise((resolve) => setTimeout(resolve, 50))
    return {
        getOutput: () => output,
        unmount: instance.unmount,
    }
}

describe('Switch component', () => {
    it('should render off state glyph (●─) when checked is false', async () => {
        const { getOutput, unmount } = await renderInk(
            <Switch checked={false} label="Auto-run tools" />
        )
        expect(getOutput()).toContain('(●─)')
        expect(getOutput()).toContain('Auto-run tools')
        unmount()
    })

    it('should render on state glyph (─●) when checked is true', async () => {
        const { getOutput, unmount } = await renderInk(
            <Switch checked={true} label="Auto-run tools" />
        )
        expect(getOutput()).toContain('(─●)')
        expect(getOutput()).toContain('Auto-run tools')
        unmount()
    })

    it('should render badge variant [ ON ] and [ OFF ]', async () => {
        const onInstance = await renderInk(
            <Switch checked={true} variant="badge" label="Debug stream" />
        )
        expect(onInstance.getOutput()).toContain('[ ON ]')
        expect(onInstance.getOutput()).toContain('Debug stream')
        onInstance.unmount()

        const offInstance = await renderInk(
            <Switch checked={false} variant="badge" label="Debug stream" />
        )
        expect(offInstance.getOutput()).toContain('[ OFF ]')
        offInstance.unmount()
    })

    it('should render secondary description hint if provided', async () => {
        const { getOutput, unmount } = await renderInk(
            <Switch checked={true} label="Stream reasoning" description="Live tokens" />
        )
        expect(getOutput()).toContain('Stream reasoning')
        expect(getOutput()).toContain('Live tokens')
        unmount()
    })
})
