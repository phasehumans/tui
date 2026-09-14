import { describe, expect, it } from 'bun:test'
import { DOC_ITEMS } from './docs-data'

describe('docs-data component variations', () => {
    it('every component doc item should have stacked variations', () => {
        const componentItems = DOC_ITEMS.filter((item) => item.category === 'components')

        expect(componentItems.length).toBeGreaterThan(0)

        for (const item of componentItems) {
            expect(item.variations).toBeDefined()
            expect(Array.isArray(item.variations)).toBe(true)
            expect(item.variations!.length).toBeGreaterThanOrEqual(2)

            // Check each variation
            for (const v of item.variations!) {
                expect(v.id).toBeTruthy()
                expect(v.title).toBeTruthy()
                expect(v.codeSnippet).toBeTruthy()
                expect(v.codeSnippet.length).toBeGreaterThan(10)
                expect(v.terminalLines || v.terminalMode).toBeTruthy()
            }
        }
    })

    it('every component doc item should include examples in toc', () => {
        const componentItems = DOC_ITEMS.filter((item) => item.category === 'components')

        for (const item of componentItems) {
            const hasExamplesInToc = item.toc.some(
                (t) => t.id === 'examples' || t.id.startsWith('example-')
            )
            expect(hasExamplesInToc).toBe(true)

            // Verify each individual variation is in toc
            for (const v of item.variations!) {
                const hasVariationInToc = item.toc.some((t) => t.id === `example-${v.id}`)
                expect(hasVariationInToc).toBe(true)
            }
        }
    })
})
