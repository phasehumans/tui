import { describe, expect, it } from 'bun:test'
import { PassThrough } from 'node:stream'
import { render } from 'ink'
import React from 'react'

import { Button, type ButtonVariant } from './button'

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

describe('Button component', () => {
    it('should support link variant', async () => {
        const variant: ButtonVariant = 'link'
        const { getOutput, unmount } = await renderInk(
            <Button variant={variant} isFocused={false}>
                Docs Link
            </Button>
        )
        expect(getOutput()).toContain('Docs Link')
        unmount()
    })

    it('should support bracket variant (action chip style)', async () => {
        const variant: ButtonVariant = 'bracket'
        const { getOutput, unmount } = await renderInk(
            <Button variant={variant} isFocused={true}>
                Retry
            </Button>
        )
        expect(getOutput()).toContain('Retry')
        expect(getOutput()).toContain('[')
        expect(getOutput()).toContain(']')
        unmount()
    })

    it('should support disabled state with dimmed text', async () => {
        const { getOutput, unmount } = await renderInk(
            <Button disabled isFocused={false}>
                Disabled Button
            </Button>
        )
        expect(getOutput()).toContain('Disabled Button')
        unmount()
    })

    it('should support prefix slot with string', async () => {
        const { getOutput, unmount } = await renderInk(
            <Button prefix="❭" variant="bracket">
                Approve
            </Button>
        )
        expect(getOutput()).toContain('Approve')
        expect(getOutput()).toContain('❭')
        expect(getOutput()).toContain('[')
        expect(getOutput()).toContain(']')
        unmount()
    })
})
