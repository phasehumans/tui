'use client'

import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-json'
import React, { useMemo } from 'react'

export interface CodeBlockProps {
    code: string
    language?: 'tsx' | 'typescript' | 'bash' | 'diff' | 'json'
}

export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
    const highlightedHtml = useMemo(() => {
        const lang =
            language === 'diff'
                ? 'diff'
                : language === 'bash'
                  ? 'bash'
                  : language === 'json'
                    ? 'json'
                    : 'tsx'
        const grammar = Prism.languages[lang] || Prism.languages.javascript || {}
        return Prism.highlight(code, grammar, lang)
    }, [code, language])

    return (
        <pre className="text-[#e2e2e2] leading-[1.65] font-mono text-[0.84rem] sm:text-[0.88rem] overflow-x-auto code-scroll touch-scroll">
            <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        </pre>
    )
}
