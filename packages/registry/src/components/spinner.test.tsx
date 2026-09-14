import { describe, expect, it } from 'bun:test'
import { PassThrough } from 'node:stream'
import { render } from 'ink'
import React from 'react'

import { Spinner, type SpinnerType } from './spinner'

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

describe('Spinner component', () => {
    it('should render default braille dots spinner with label', async () => {
        const { getOutput, unmount } = await renderInk(
            <Spinner frame={0} label="analyzing dependencies..." />
        )
        const out = getOutput()
        expect(out).toContain('analyzing dependencies...')
        expect(out).toContain('⠋')
        unmount()
    })

    it('should render braille-matrix variant', async () => {
        const { getOutput, unmount } = await renderInk(
            <Spinner type="braille-matrix" frame={0} label="evaluating graph..." />
        )
        const out = getOutput()
        expect(out).toContain('evaluating graph...')
        expect(out).toContain('⣾')
        unmount()
    })

    it('should render equalizer bars variant', async () => {
        const { getOutput, unmount } = await renderInk(
            <Spinner type="bars" frame={0} label="streaming tokens..." />
        )
        const out = getOutput()
        expect(out).toContain('streaming tokens...')
        expect(out).toContain(' ▂▃')
        unmount()
    })

    it('should render compact inline matrix-wave variant', async () => {
        const { getOutput, unmount } = await renderInk(
            <Spinner type="matrix-wave" frame={0} label="indexing workspace..." />
        )
        const out = getOutput()
        expect(out).toContain('indexing workspace...')
        expect(out).toContain('●')
        expect(out).toContain('·')
        unmount()
    })

    it('should render matrix-pulse variant', async () => {
        const { getOutput, unmount } = await renderInk(
            <Spinner type="matrix-pulse" frame={0} label="pulsing..." />
        )
        const out = getOutput()
        expect(out).toContain('pulsing...')
        expect(out).toContain('●')
        unmount()
    })

    it('should render snake variant', async () => {
        const { getOutput, unmount } = await renderInk(
            <Spinner type="snake" frame={0} label="slithering..." />
        )
        const out = getOutput()
        expect(out).toContain('slithering...')
        expect(out).toContain('●')
        unmount()
    })

    it('should render shuttle bracket variant', async () => {
        const { getOutput, unmount } = await renderInk(
            <Spinner type="shuttle" frame={0} label="ping pong..." />
        )
        const out = getOutput()
        expect(out).toContain('ping pong...')
        expect(out).toContain('[')
        expect(out).toContain(']')
        expect(out).toContain('●')
        unmount()
    })

    const types: SpinnerType[] = [
        'dots',
        'braille-matrix',
        'bars',
        'matrix-wave',
        'matrix-pulse',
        'snake',
        'shuttle',
    ]

    for (const t of types) {
        it(`should advance frames cleanly for type "${t}"`, async () => {
            const { getOutput, unmount } = await renderInk(
                <Spinner type={t} frame={3} label="stepping..." />
            )
            expect(getOutput()).toContain('stepping...')
            unmount()
        })
    }
})
