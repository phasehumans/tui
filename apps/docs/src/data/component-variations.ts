export interface ComponentVariation {
    id: string
    title: string
    description?: string
    terminalMode?: string
    terminalLines?: string[]
    codeSnippet: string
}

export const COMPONENT_VARIATIONS: Record<string, ComponentVariation[]> = {
    'diff-viewer': [
        {
            id: 'single-hunk',
            title: 'Single Hunk with Context',
            description:
                'Standard inline unified diff displaying added and removed lines with line numbers.',
            terminalLines: [
                '\x1b[38;2;251;146;60m⌥\x1b[0m \x1b[1;38;2;226;226;226mpackages/auth/src/jwt.ts\x1b[0m',
                '\x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m',
                '\x1b[38;2;140;140;140m│ @@ -14,6 +14,8 @@ export function verifyToken(token)      │\x1b[0m',
                '\x1b[48;2;63;19;22m\x1b[38;2;248;113;113m│ - const decoded = jwt.decode(token)                    │\x1b[0m',
                '\x1b[48;2;18;47;30m\x1b[38;2;74;222;128m│ + const decoded = jwt.verify(token, process.env.SECRET)│\x1b[0m',
                '\x1b[48;2;18;47;30m\x1b[38;2;74;222;128m│ + if (!decoded.exp || decoded.exp < Date.now()) return │\x1b[0m',
                '\x1b[38;2;140;140;140m│   return decoded                                       │\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { DiffViewer } from '@/components/tui/diff-viewer'
import { Box, render } from 'ink'
import React from 'react'

const patch = \`@@ -14,6 +14,8 @@ export function verifyToken(token)
- const decoded = jwt.decode(token)
+ const decoded = jwt.verify(token, process.env.SECRET)
+ if (!decoded.exp || decoded.exp < Date.now()) return
  return decoded\`

export function App() {
  return (
    <Box padding={1}>
      <DiffViewer
        filePath="packages/auth/src/jwt.ts"
        diff={patch}
        isExpanded={true}
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'collapsed-summary',
            title: 'Folded / Collapsed Summary',
            description:
                'Folded diff showing only the file header and summary line count until toggled.',
            terminalLines: [
                '\x1b[38;2;251;146;60m⌥\x1b[0m \x1b[1;38;2;226;226;226mpackages/auth/src/jwt.ts\x1b[0m \x1b[38;2;74;222;128m+2\x1b[0m \x1b[38;2;248;113;113m-1\x1b[0m \x1b[38;2;140;140;140m[folded, press enter to expand]\x1b[0m',
            ],
            codeSnippet: `import { DiffViewer } from '@/components/tui/diff-viewer'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <DiffViewer
        filePath="packages/auth/src/jwt.ts"
        diff="@@ -1,3 +1,4 @@\\n-old\\n+new"
        isExpanded={false}
      />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'streaming-text': [
        {
            id: 'streaming-active',
            title: 'Active Streaming with Cursor',
            description: 'Displays incoming LLM tokens with an animated terminal block cursor.',
            terminalLines: [
                '\x1b[38;2;226;226;226mgenerating response from model...\x1b[0m',
                '\x1b[38;2;226;226;226manalyzing workspace dependencies and inspecting package.json\x1b[0m\x1b[7m \x1b[0m',
            ],
            codeSnippet: `import { StreamingText } from '@/components/tui/streaming-text'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <StreamingText
        content="analyzing workspace dependencies and inspecting package.json"
        isStreaming={true}
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'stream-complete',
            title: 'Stream Completed State',
            description:
                'Final text output once generation is complete, removing the block cursor.',
            terminalLines: [
                '\x1b[38;2;74;222;128m✔\x1b[0m \x1b[38;2;226;226;226mworkspace analysis complete. 4 dependencies verified.\x1b[0m',
            ],
            codeSnippet: `import { StreamingText } from '@/components/tui/streaming-text'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <StreamingText
        content="workspace analysis complete. 4 dependencies verified."
        isStreaming={false}
      />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'collapsible-reasoning': [
        {
            id: 'thinking-active',
            title: 'Active Thinking State',
            description:
                'Thought process actively evaluating with spinner and elapsed millisecond timer.',
            terminalLines: [
                '\x1b[38;2;251;146;60m⠋ thinking...\x1b[0m \x1b[38;2;140;140;140m(inspecting token signature and expiration)\x1b[0m \x1b[38;2;92;92;92m840ms\x1b[0m',
            ],
            codeSnippet: `import { CollapsibleReasoning } from '@/components/tui/collapsible-reasoning'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <CollapsibleReasoning
        content="evaluating token claims..."
        isThinking={true}
        durationMs={840}
        isExpanded={false}
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'collapsed-summary',
            title: 'Collapsed Summary with Token Count',
            description:
                'Compact thought badge displaying total duration and consumed token count.',
            terminalLines: [
                '  \x1b[38;2;140;140;140m▶ Thought for 1.2s\x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;140;140;140m 142 tokens \x1b[0m',
            ],
            codeSnippet: `import { CollapsibleReasoning } from '@/components/tui/collapsible-reasoning'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <CollapsibleReasoning
        content="checking jwt signature verification and expiry..."
        durationMs={1200}
        tokenCount={142}
        isExpanded={false}
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'expanded-trace',
            title: 'Expanded Thought Details',
            description: 'Unfolded reasoning box showing full chain-of-thought steps.',
            terminalLines: [
                '  \x1b[38;2;251;146;60m▼ Thought for 1.2s\x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;140;140;140m 142 tokens \x1b[0m',
                '\x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m',
                '\x1b[38;2;140;140;140m│ checking jwt signature verification...                 │\x1b[0m',
                '\x1b[38;2;140;140;140m│ token payload contains exp: 1714500000                 │\x1b[0m',
                '\x1b[38;2;140;140;140m│ signature matches public key. authentication granted.  │\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { CollapsibleReasoning } from '@/components/tui/collapsible-reasoning'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <CollapsibleReasoning
        content="checking jwt signature verification...\\ntoken payload contains exp: 1714500000\\nsignature matches public key. authentication granted."
        durationMs={1200}
        tokenCount={142}
        isExpanded={true}
      />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'tool-call-card': [
        {
            id: 'running-state',
            title: 'Running Execution State',
            description: 'Active tool invocation displaying spinner and target argument.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌─ \x1b[38;2;251;146;60m⚙ bun test\x1b[0m \x1b[38;2;92;92;92m(auth.test.ts)\x1b[0m \x1b[38;2;251;191;36m[running]\x1b[0m\x1b[38;2;42;42;42m ───────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;251;146;60m⠋\x1b[0m \x1b[38;2;140;140;140mexecuting test suite...\x1b[0m                                 \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { ToolCallCard } from '@/components/tui/tool-call-card'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <ToolCallCard
        toolName="bun test"
        inputSummary="auth.test.ts"
        status="running"
        isExpanded={true}
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'completed-state',
            title: 'Completed State with Output',
            description:
                'Successful execution badge with runtime in milliseconds and output result.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌─ \x1b[38;2;74;222;128m✔ bun test\x1b[0m \x1b[38;2;92;92;92m(auth.test.ts)\x1b[0m \x1b[38;2;140;140;140m28ms\x1b[0m\x1b[38;2;42;42;42m ─────────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;74;222;128m✓ 4 tests passed [28ms]\x1b[0m                                \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { ToolCallCard } from '@/components/tui/tool-call-card'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <ToolCallCard
        toolName="bun test"
        inputSummary="auth.test.ts"
        status="completed"
        durationMs={28}
        isExpanded={true}
        output="✓ 4 tests passed [28ms]"
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'failed-state',
            title: 'Failed State with Stderr Trace',
            description: 'Failed execution banner with error highlights and stderr message.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌─ \x1b[38;2;248;113;113m✖ bun test\x1b[0m \x1b[38;2;92;92;92m(jwt.test.ts)\x1b[0m \x1b[38;2;248;113;113m[failed]\x1b[0m\x1b[38;2;42;42;42m ────────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;248;113;113merror: expected 200 OK, received 401 Unauthorized\x1b[0m    \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;92;92;92m  at verifyToken (packages/auth/jwt.ts:18:11)\x1b[0m            \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { ToolCallCard } from '@/components/tui/tool-call-card'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <ToolCallCard
        toolName="bun test"
        inputSummary="jwt.test.ts"
        status="failed"
        durationMs={120}
        isExpanded={true}
        output="error: expected 200 OK, received 401 Unauthorized\\n  at verifyToken (packages/auth/jwt.ts:18:11)"
      />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'token-gauge': [
        {
            id: 'nominal-load',
            title: 'Nominal Load (< 65%)',
            description: 'Healthy context window load using default brand accent styling.',
            terminalLines: [
                '\x1b[38;2;140;140;140mContext:\x1b[0m \x1b[38;2;251;146;60m━━━━━━\x1b[0m\x1b[38;2;92;92;92m──────────────\x1b[0m \x1b[1;38;2;251;146;60m28%\x1b[0m \x1b[38;2;92;92;92m(36.4k / 128k)\x1b[0m',
            ],
            codeSnippet: `import { TokenGauge } from '@/components/tui/token-gauge'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <TokenGauge usedTokens={36400} totalTokens={128000} label="Context" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'warning-threshold',
            title: 'Warning Threshold (65%–85%)',
            description:
                'Bar automatically transitions to warning amber when exceeding 65% utilization.',
            terminalLines: [
                '\x1b[38;2;140;140;140mContext:\x1b[0m \x1b[38;2;251;191;36m━━━━━━━━━━━━━━──────\x1b[0m \x1b[1;38;2;251;191;36m72%\x1b[0m \x1b[38;2;92;92;92m(92.1k / 128k)\x1b[0m',
            ],
            codeSnippet: `import { TokenGauge } from '@/components/tui/token-gauge'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <TokenGauge usedTokens={92160} totalTokens={128000} label="Context" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'critical-threshold',
            title: 'Critical Capacity (> 85%)',
            description:
                'Bar shifts to error red alerting developers that context eviction or compaction is needed.',
            terminalLines: [
                '\x1b[38;2;140;140;140mContext:\x1b[0m \x1b[38;2;248;113;113m━━━━━━━━━━━━━━━━━━━─\x1b[0m \x1b[1;38;2;248;113;113m96%\x1b[0m \x1b[38;2;92;92;92m(122.8k / 128k)\x1b[0m \x1b[48;2;63;19;22m\x1b[38;2;248;113;113m[flush needed]\x1b[0m',
            ],
            codeSnippet: `import { TokenGauge } from '@/components/tui/token-gauge'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <TokenGauge usedTokens={122880} totalTokens={128000} label="Context" />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    pill: [
        {
            id: 'status-variants',
            title: 'Semantic Status Badges',
            description: 'Approved, blocked, and review states using semantic theme colors.',
            terminalLines: [
                '  \x1b[48;2;18;47;30m\x1b[38;2;74;222;128m approved \x1b[0m  \x1b[48;2;63;19;22m\x1b[38;2;248;113;113m blocked \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;251;191;36m needs-review \x1b[0m',
            ],
            codeSnippet: `import { Pill } from '@/components/tui/pill'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} gap={1}>
      <Pill label="approved" color="#4ade80" backgroundColor="#122f1e" />
      <Pill label="blocked" color="#f87171" backgroundColor="#3f1316" />
      <Pill label="needs-review" color="#fbbf24" backgroundColor="#2a2a2a" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'dimmed-tags',
            title: 'Dimmed & Minimal Tags',
            description: 'Subtle badges for metadata such as versions, formats, and languages.',
            terminalLines: [
                '  \x1b[48;2;30;30;30m\x1b[38;2;140;140;140m v0.3.0 \x1b[0m  \x1b[48;2;30;30;30m\x1b[38;2;140;140;140m typescript \x1b[0m  \x1b[48;2;30;30;30m\x1b[38;2;140;140;140m react-19 \x1b[0m',
            ],
            codeSnippet: `import { Pill } from '@/components/tui/pill'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} gap={1}>
      <Pill label="v0.3.0" dimColor />
      <Pill label="typescript" dimColor />
      <Pill label="react-19" dimColor />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'brand-highlight',
            title: 'Brand Highlight Pill',
            description: 'Pills highlighted with the primary brand orange accent color.',
            terminalLines: [
                '  \x1b[48;2;42;42;42m\x1b[38;2;251;146;60m PR #42 \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;192;132;252m feature \x1b[0m',
            ],
            codeSnippet: `import { Pill } from '@/components/tui/pill'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} gap={1}>
      <Pill label="PR #42" color="#fb923c" />
      <Pill label="feature" color="#c084fc" />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    spinner: [
        {
            id: 'active-spinner',
            title: 'Active Spinner with Progress Text',
            description: 'Braille spinner displaying active workspace resolution.',
            terminalLines: [
                '  \x1b[38;2;251;146;60m⠸\x1b[0m \x1b[38;2;140;140;140manalyzing workspace dependencies...\x1b[0m',
            ],
            codeSnippet: `import { Spinner } from '@/components/tui/spinner'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Spinner label="analyzing workspace dependencies..." />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'resolved-check',
            title: 'Completed Resolution',
            description: 'Spinner resolves to a terminal checkmark when task completes.',
            terminalLines: [
                '  \x1b[38;2;74;222;128m✔\x1b[0m \x1b[38;2;226;226;226mdependencies verified (0 vulnerabilities found)\x1b[0m',
            ],
            codeSnippet: `import { Spinner } from '@/components/tui/spinner'
import { Box, Text, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} gap={1}>
      <Text color="#4ade80">✔</Text>
      <Text>dependencies verified (0 vulnerabilities found)</Text>
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'text-area': [
        {
            id: 'empty-prompt',
            title: 'Empty State with Placeholder',
            description: 'Multi-line text area waiting for user prompt input.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌─ \x1b[38;2;251;146;60mdescribe your edit\x1b[0m \x1b[38;2;42;42;42m────────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m \x1b[38;2;92;92;92mType prompt here... (Press Esc to submit)\x1b[0m      \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m \x1b[7m \x1b[0m                                                      \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { TextArea } from '@/components/tui/text-area'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [value, setValue] = useState('')
  return (
    <Box padding={1}>
      <TextArea
        value={value}
        onChange={setValue}
        placeholder="Type prompt here... (Press Esc to submit)"
        title="describe your edit"
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'filled-text',
            title: 'Populated Multi-line Value',
            description: 'Text area with multiple lines of prompt instructions and active cursor.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌─ \x1b[38;2;251;146;60medit instructions\x1b[0m \x1b[38;2;42;42;42m─────────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m refactor the auth middleware to support Bearer tokens   \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m and add test coverage for expired tokens\x1b[7m \x1b[0m              \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { TextArea } from '@/components/tui/text-area'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [value, setValue] = useState(
    'refactor the auth middleware to support Bearer tokens\\nand add test coverage for expired tokens'
  )
  return (
    <Box padding={1}>
      <TextArea
        value={value}
        onChange={setValue}
        title="edit instructions"
      />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    header: [
        {
            id: 'simple-header',
            title: 'Simple Header with Subtitle',
            description: 'Minimal terminal application title bar.',
            terminalLines: [
                '\x1b[1;38;2;251;146;60mtui\x1b[0m \x1b[38;2;92;92;92m·\x1b[0m \x1b[38;2;140;140;140mterminal ui primitives for react\x1b[0m',
                '\x1b[38;2;42;42;42m──────────────────────────────────────────────────────────\x1b[0m',
            ],
            codeSnippet: `import { Header } from '@/components/tui/header'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} flexDirection="column">
      <Header
        title="tui"
        subtitle="terminal ui primitives for react"
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'header-with-badge',
            title: 'Header with Breadcrumb & Status Pill',
            description: 'Header displaying breadcrumb path and release version badge.',
            terminalLines: [
                '\x1b[1;38;2;251;146;60mtui\x1b[0m \x1b[38;2;92;92;92m/\x1b[0m \x1b[38;2;226;226;226mregistry\x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;140;140;140m v0.3.0 \x1b[0m  \x1b[48;2;18;47;30m\x1b[38;2;74;222;128m ready \x1b[0m',
                '\x1b[38;2;42;42;42m──────────────────────────────────────────────────────────\x1b[0m',
            ],
            codeSnippet: `import { Header } from '@/components/tui/header'
import { Pill } from '@/components/tui/pill'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} flexDirection="column">
      <Header
        title="tui / registry"
        badge={<Pill label="v0.3.0" dimColor />}
      />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    mermaid: [
        {
            id: 'flowchart-diagram',
            title: 'Flowchart Diagram',
            description: 'ASCII flow sequence displaying decision nodes and branches.',
            terminalLines: [
                '\x1b[38;2;251;146;60m[User Request]\x1b[0m ──> \x1b[38;2;74;222;128m[Parser]\x1b[0m ──> \x1b[38;2;56;189;248m[Agent Loop]\x1b[0m',
                '                          │',
                '                          └──> \x1b[38;2;248;113;113m[Error Fallback]\x1b[0m',
            ],
            codeSnippet: `import { Mermaid } from '@/components/tui/mermaid'
import { Box, render } from 'ink'
import React from 'react'

const chart = \`graph TD
    A[User Request] --> B[Parser]
    B --> C[Agent Loop]
    B --> D[Error Fallback]\`

export function App() {
  return (
    <Box padding={1}>
      <Mermaid chart={chart} />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'sequence-diagram',
            title: 'Sequence Diagram',
            description: 'Multi-party communication flow rendered as terminal ASCII.',
            terminalLines: [
                '\x1b[38;2;140;140;140mClient                Server                DB\x1b[0m',
                '\x1b[38;2;42;42;42m  │                     │                   │  \x1b[0m',
                '\x1b[38;2;74;222;128m  │──── POST /login ───>│                   │  \x1b[0m',
                '\x1b[38;2;56;189;248m  │                     │──── SELECT ──────>│  \x1b[0m',
                '\x1b[38;2;251;146;60m  │<─── 200 OK + JWT ───│                   │  \x1b[0m',
            ],
            codeSnippet: `import { Mermaid } from '@/components/tui/mermaid'
import { Box, render } from 'ink'
import React from 'react'

const sequence = \`sequenceDiagram
    Client->>Server: POST /login
    Server->>DB: SELECT user
    Server-->>Client: 200 OK + JWT\`

export function App() {
  return (
    <Box padding={1}>
      <Mermaid chart={sequence} />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    markdown: [
        {
            id: 'formatted-headings',
            title: 'Headings & Bullet Lists',
            description: 'Rich terminal formatting for markdown headers, inline code, and lists.',
            terminalLines: [
                '\x1b[1;38;2;251;146;60m# Project Setup\x1b[0m',
                '',
                '\x1b[38;2;226;226;226mFollow these steps to initialize the project:\x1b[0m',
                '  \x1b[38;2;251;146;60m•\x1b[0m Run \x1b[48;2;42;42;42m\x1b[38;2;251;146;60m bun init \x1b[0m to scaffold the repo',
                '  \x1b[38;2;251;146;60m•\x1b[0m Install \x1b[48;2;42;42;42m\x1b[38;2;226;226;226m react \x1b[0m and \x1b[48;2;42;42;42m\x1b[38;2;226;226;226m ink \x1b[0m peer dependencies',
            ],
            codeSnippet: `import { Markdown } from '@/components/tui/markdown'
import { Box, render } from 'ink'
import React from 'react'

const content = \`# Project Setup

Follow these steps to initialize the project:
• Run \`bun init\` to scaffold the repo
• Install \`react\` and \`ink\` peer dependencies\`

export function App() {
  return (
    <Box padding={1}>
      <Markdown content={content} />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'code-fences',
            title: 'Fenced Code Block Rendering',
            description: 'Markdown code fence rendered inside a terminal border box.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌─ \x1b[38;2;140;140;140mtypescript\x1b[0m \x1b[38;2;42;42;42m────────────────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m \x1b[38;2;192;132;252mconst\x1b[0m server = Bun.serve({ port: \x1b[38;2;251;146;60m3000\x1b[0m })         \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m console.log(\x1b[38;2;74;222;128m\`listening on \${server.port}\`\x1b[0m)            \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { Markdown } from '@/components/tui/markdown'
import { Box, render } from 'ink'
import React from 'react'

const md = \`\`\`\`typescript
const server = Bun.serve({ port: 3000 })
console.log(\`listening on \${server.port}\`)
\`\`\`\`

export function App() {
  return (
    <Box padding={1}>
      <Markdown content={md} />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'user-message': [
        {
            id: 'standard-user-bubble',
            title: 'Standard User Message',
            description: 'Clean user query bubble with prominent prompt glyph.',
            terminalLines: [
                '\x1b[38;2;251;146;60m❯\x1b[0m \x1b[1;38;2;255;255;255mHow do I write an ink component with input focus?\x1b[0m',
            ],
            codeSnippet: `import { UserMessage } from '@/components/tui/user-message'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <UserMessage content="How do I write an ink component with input focus?" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'user-with-timestamp',
            title: 'User Message with Timestamp & Metadata',
            description: 'User message showing submission timestamp and sender badge.',
            terminalLines: [
                '\x1b[38;2;251;146;60m❯\x1b[0m \x1b[1;38;2;255;255;255mdeploy staging database migrations\x1b[0m \x1b[38;2;92;92;92m(14:32:05)\x1b[0m',
            ],
            codeSnippet: `import { UserMessage } from '@/components/tui/user-message'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <UserMessage
        content="deploy staging database migrations"
        timestamp="14:32:05"
      />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'error-message': [
        {
            id: 'simple-error',
            title: 'Simple Inline Error Banner',
            description: 'Clean red error message with failure icon.',
            terminalLines: [
                '\x1b[38;2;248;113;113m✖ Error:\x1b[0m \x1b[38;2;226;226;226mfailed to connect to postgresql at localhost:5432\x1b[0m',
            ],
            codeSnippet: `import { ErrorMessage } from '@/components/tui/error-message'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <ErrorMessage error="failed to connect to postgresql at localhost:5432" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'error-with-stack',
            title: 'Detailed Error with Stack Trace',
            description: 'Expanded error box showing stack trace and error code.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌─ \x1b[38;2;248;113;113m✖ Error [ECONNREFUSED]\x1b[0m \x1b[38;2;42;42;42m────────────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m connect ECONNREFUSED 127.0.0.1:5432                     \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m \x1b[38;2;92;92;92mat TCPConnectWrap.afterConnect (net.js:1146:16)\x1b[0m          \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { ErrorMessage } from '@/components/tui/error-message'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <ErrorMessage
        error="connect ECONNREFUSED 127.0.0.1:5432"
        stack="at TCPConnectWrap.afterConnect (net.js:1146:16)"
        code="ECONNREFUSED"
      />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'select-menu': [
        {
            id: 'default-selection',
            title: 'Active Option Highlighting',
            description:
                'Interactive selection list with current item highlighted and indicator arrow.',
            terminalLines: [
                '  \x1b[38;2;251;146;60m› [1] diff-viewer\x1b[0m     \x1b[38;2;140;140;140mgit diff with syntax colors\x1b[0m',
                '    [2] token-gauge     \x1b[38;2;92;92;92mcontext window capacity meter\x1b[0m',
                '    [3] tool-call-card  \x1b[38;2;92;92;92mtool execution card\x1b[0m',
            ],
            codeSnippet: `import { SelectMenu } from '@/components/tui/select-menu'
import { Box, render } from 'ink'
import React, { useState } from 'react'

const items = [
  { label: 'diff-viewer', value: 'diff-viewer', desc: 'git diff with syntax colors' },
  { label: 'token-gauge', value: 'token-gauge', desc: 'context window capacity meter' },
  { label: 'tool-call-card', value: 'tool-call-card', desc: 'tool execution card' },
]

export function App() {
  const [selected, setSelected] = useState('diff-viewer')
  return (
    <Box padding={1}>
      <SelectMenu items={items} value={selected} onSelect={setSelected} />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'disabled-items',
            title: 'Menu with Disabled Option',
            description:
                'Items can be disabled to prevent selection while still remaining visible.',
            terminalLines: [
                '    [1] deploy to staging',
                '  \x1b[38;2;251;146;60m› [2] run smoke tests\x1b[0m',
                '    \x1b[38;2;92;92;92m[3] deploy to production (disabled: pending approval)\x1b[0m',
            ],
            codeSnippet: `import { SelectMenu } from '@/components/tui/select-menu'
import { Box, render } from 'ink'
import React from 'react'

const items = [
  { label: 'deploy to staging', value: 'staging' },
  { label: 'run smoke tests', value: 'smoke' },
  { label: 'deploy to production', value: 'prod', disabled: true },
]

export function App() {
  return (
    <Box padding={1}>
      <SelectMenu items={items} onSelect={console.log} />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'command-menu': [
        {
            id: 'filtered-search',
            title: 'Filtered Search Query',
            description: 'Interactive palette filtering commands as user types.',
            terminalLines: [
                '\x1b[38;2;251;146;60m🔍 test\x1b[0m',
                '\x1b[38;2;42;42;42m──────────────────────────────────────────────────────────\x1b[0m',
                '  \x1b[38;2;251;146;60m› Run Unit Tests\x1b[0m          \x1b[38;2;140;140;140mbun test\x1b[0m',
                '    Run Integration Tests    \x1b[38;2;92;92;92mbun test:integration\x1b[0m',
            ],
            codeSnippet: `import { CommandMenu } from '@/components/tui/command-menu'
import { Box, render } from 'ink'
import React from 'react'

const commands = [
  { id: '1', title: 'Run Unit Tests', shortcut: 'bun test' },
  { id: '2', title: 'Run Integration Tests', shortcut: 'bun test:integration' },
  { id: '3', title: 'Build Project', shortcut: 'bun run build' },
]

export function App() {
  return (
    <Box padding={1}>
      <CommandMenu commands={commands} defaultQuery="test" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'categorized-groups',
            title: 'Grouped Commands',
            description: 'Commands organized under distinct category headers.',
            terminalLines: [
                '\x1b[38;2;92;92;92m-- Testing -----------------------------------------------\x1b[0m',
                '  \x1b[38;2;251;146;60m› Run Tests\x1b[0m               \x1b[38;2;140;140;140mbun test\x1b[0m',
                '\x1b[38;2;92;92;92m-- Deployment --------------------------------------------\x1b[0m',
                '    Deploy Staging          \x1b[38;2;92;92;92mfly deploy\x1b[0m',
            ],
            codeSnippet: `import { CommandMenu } from '@/components/tui/command-menu'
import { Box, render } from 'ink'
import React from 'react'

const commands = [
  { id: '1', group: 'Testing', title: 'Run Tests', shortcut: 'bun test' },
  { id: '2', group: 'Deployment', title: 'Deploy Staging', shortcut: 'fly deploy' },
]

export function App() {
  return (
    <Box padding={1}>
      <CommandMenu commands={commands} />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'shortcuts-menu': [
        {
            id: 'compact-bar',
            title: 'Compact Footer Keybinds',
            description: 'Single-line keyboard hints for navigation and quick actions.',
            terminalLines: [
                '\x1b[48;2;42;42;42m\x1b[38;2;251;146;60m Tab \x1b[0m Next  \x1b[48;2;42;42;42m\x1b[38;2;251;146;60m Enter \x1b[0m Select  \x1b[48;2;42;42;42m\x1b[38;2;251;146;60m Esc \x1b[0m Back  \x1b[48;2;42;42;42m\x1b[38;2;251;146;60m ? \x1b[0m Help',
            ],
            codeSnippet: `import { ShortcutsMenu } from '@/components/tui/shortcuts-menu'
import { Box, render } from 'ink'
import React from 'react'

const shortcuts = [
  { key: 'Tab', label: 'Next' },
  { key: 'Enter', label: 'Select' },
  { key: 'Esc', label: 'Back' },
  { key: '?', label: 'Help' },
]

export function App() {
  return (
    <Box padding={1}>
      <ShortcutsMenu shortcuts={shortcuts} layout="horizontal" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'table-grid',
            title: 'Two-Column Cheatsheet',
            description: 'Comprehensive table layout for detailed keybindings modal.',
            terminalLines: [
                '  \x1b[1;38;2;251;146;60m⌘ + K\x1b[0m     Open command palette',
                '  \x1b[1;38;2;251;146;60mCtrl + C\x1b[0m  Cancel current process',
                '  \x1b[1;38;2;251;146;60mR\x1b[0m         Replay terminal output',
            ],
            codeSnippet: `import { ShortcutsMenu } from '@/components/tui/shortcuts-menu'
import { Box, render } from 'ink'
import React from 'react'

const shortcuts = [
  { key: '⌘ + K', label: 'Open command palette' },
  { key: 'Ctrl + C', label: 'Cancel current process' },
  { key: 'R', label: 'Replay terminal output' },
]

export function App() {
  return (
    <Box padding={1}>
      <ShortcutsMenu shortcuts={shortcuts} layout="grid" />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'plan-approve-menu': [
        {
            id: 'pending-approval',
            title: 'Pending Plan Approval',
            description: 'Review prompt showing proposed changes and interactive choices.',
            terminalLines: [
                '\x1b[1;38;2;251;146;60mPlan Proposed:\x1b[0m 3 files modified, 1 dependency added',
                '  \x1b[38;2;251;146;60m› [y] Approve and execute plan\x1b[0m',
                '    [n] Reject plan',
                '    [e] Edit instructions',
            ],
            codeSnippet: `import { PlanApproveMenu } from '@/components/tui/plan-approve-menu'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <PlanApproveMenu
        summary="3 files modified, 1 dependency added"
        onApprove={() => console.log('approved')}
        onReject={() => console.log('rejected')}
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'approved-status',
            title: 'Plan Accepted State',
            description: 'Confirmed plan execution banner.',
            terminalLines: [
                '\x1b[38;2;74;222;128m✔ Plan approved\x1b[0m \x1b[38;2;140;140;140m— applying changes to 3 files...\x1b[0m',
            ],
            codeSnippet: `import { PlanApproveMenu } from '@/components/tui/plan-approve-menu'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <PlanApproveMenu status="approved" summary="applying changes to 3 files..." />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'input-bar': [
        {
            id: 'placeholder-state',
            title: 'Empty Input with Placeholder',
            description: 'Input prompt waiting for user input.',
            terminalLines: [
                '\x1b[38;2;251;146;60m❯\x1b[0m \x1b[38;2;92;92;92mEnter package name (e.g. diff-viewer)...\x1b[0m\x1b[7m \x1b[0m',
            ],
            codeSnippet: `import { InputBar } from '@/components/tui/input-bar'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [val, setVal] = useState('')
  return (
    <Box padding={1}>
      <InputBar
        value={val}
        onChange={setVal}
        placeholder="Enter package name (e.g. diff-viewer)..."
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'active-value',
            title: 'Filled Input with Value',
            description: 'Input bar displaying user text with trailing block cursor.',
            terminalLines: [
                '\x1b[38;2;251;146;60m❯\x1b[0m npx @trydecember/tui add token-gauge\x1b[7m \x1b[0m',
            ],
            codeSnippet: `import { InputBar } from '@/components/tui/input-bar'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [val, setVal] = useState('npx @trydecember/tui add token-gauge')
  return (
    <Box padding={1}>
      <InputBar value={val} onChange={setVal} />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    card: [
        {
            id: 'standard-card',
            title: 'Standard Bordered Card',
            description: 'Clean rounded border container for grouping terminal widgets.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m  \x1b[1;38;2;226;226;226mSystem Health\x1b[0m                                         \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m  \x1b[38;2;140;140;140mAll 12 microservices operational. 0 errors.            \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { Card } from '@/components/tui/card'
import { Box, Text, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Card title="System Health">
        <Text color="#8c8c8c">All 12 microservices operational. 0 errors.</Text>
      </Card>
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'accent-card',
            title: 'Accent Border Card',
            description: 'High-contrast card highlighted with brand orange border.',
            terminalLines: [
                '\x1b[38;2;251;146;60m┌─ \x1b[1;38;2;251;146;60mAttention Required\x1b[0m \x1b[38;2;251;146;60m──────────────────────────────┐\x1b[0m',
                '\x1b[38;2;251;146;60m│\x1b[0m  Your session will expire in 5 minutes.                \x1b[38;2;251;146;60m│\x1b[0m',
                '\x1b[38;2;251;146;60m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { Card } from '@/components/tui/card'
import { Box, Text, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Card title="Attention Required" borderColor="#fb923c">
        <Text>Your session will expire in 5 minutes.</Text>
      </Card>
    </Box>
  )
}

render(<App />)`,
        },
    ],

    button: [
        {
            id: 'button-variants',
            title: 'Button Variants (Default, Secondary, Destructive)',
            description: 'Semantic button style variants for actions.',
            terminalLines: [
                '  \x1b[48;2;42;42;42m\x1b[38;2;226;226;226m Confirm \x1b[0m  \x1b[48;2;30;30;30m\x1b[38;2;140;140;140m Cancel \x1b[0m  \x1b[48;2;63;19;22m\x1b[38;2;248;113;113m Delete \x1b[0m',
            ],
            codeSnippet: `import { Button } from '@/components/tui/button'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} gap={1}>
      <Button variant="default">Confirm</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'focused-button',
            title: 'Keyboard Focused State',
            description: 'Active keyboard focus state displaying brand highlight.',
            terminalLines: [
                '  \x1b[48;2;251;146;60m\x1b[38;2;20;20;20m\x1b[1m Submit PR \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;226;226;226m Save Draft \x1b[0m',
            ],
            codeSnippet: `import { Button } from '@/components/tui/button'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} gap={1}>
      <Button variant="default" isFocused={true}>Submit PR</Button>
      <Button variant="secondary" isFocused={false}>Save Draft</Button>
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'disabled-button',
            title: 'Disabled State',
            description: 'Disabled button with dimmed text that ignores keypress inputs.',
            terminalLines: ['  \x1b[48;2;35;35;35m\x1b[38;2;92;92;92m Deploy (Locked) \x1b[0m'],
            codeSnippet: `import { Button } from '@/components/tui/button'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Button disabled={true}>Deploy (Locked)</Button>
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'action-chips-and-links',
            title: 'Action Chips & Terminal Links',
            description: 'Bracketed action chip format [ Retry ] and underlined terminal links.',
            terminalLines: [
                '  \x1b[38;2;251;146;60m\x1b[1m[ Approve ]\x1b[0m   \x1b[38;2;102;102;102m[ Retry ]\x1b[0m   \x1b[4m\x1b[38;2;137;180;248mDocs Link\x1b[0m',
            ],
            codeSnippet: `import { Button } from '@/components/tui/button'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} gap={2}>
      <Button variant="bracket" isFocused={true}>Approve</Button>
      <Button variant="bracket">Retry</Button>
      <Button variant="link">Docs Link</Button>
    </Box>
  )
}

render(<App />)`,
        },
    ],

    tabs: [
        {
            id: 'first-tab-active',
            title: 'First Tab Active',
            description: 'Tab bar with the primary view selected.',
            terminalLines: [
                '\x1b[48;2;251;146;60m\x1b[38;2;20;20;20m\x1b[1m Code \x1b[0m  \x1b[38;2;140;140;140m Issues \x1b[0m  \x1b[38;2;140;140;140m Pull Requests \x1b[0m  \x1b[38;2;140;140;140m Actions \x1b[0m',
                '\x1b[38;2;42;42;42m──────────────────────────────────────────────────────────\x1b[0m',
            ],
            codeSnippet: `import { Tabs } from '@/components/tui/tabs'
import { Box, render } from 'ink'
import React, { useState } from 'react'

const tabItems = [
  { id: 'code', label: 'Code' },
  { id: 'issues', label: 'Issues' },
  { id: 'prs', label: 'Pull Requests' },
  { id: 'actions', label: 'Actions' },
]

export function App() {
  const [active, setActive] = useState('code')
  return (
    <Box padding={1} flexDirection="column">
      <Tabs items={tabItems} activeId={active} onSelect={setActive} />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'second-tab-active',
            title: 'Second Tab Active with Badge',
            description: 'Tab bar navigated to Issues tab displaying notification count.',
            terminalLines: [
                '\x1b[38;2;140;140;140m Code \x1b[0m  \x1b[48;2;251;146;60m\x1b[38;2;20;20;20m\x1b[1m Issues (3) \x1b[0m  \x1b[38;2;140;140;140m Pull Requests \x1b[0m',
                '\x1b[38;2;42;42;42m──────────────────────────────────────────────────────────\x1b[0m',
            ],
            codeSnippet: `import { Tabs } from '@/components/tui/tabs'
import { Box, render } from 'ink'
import React, { useState } from 'react'

const tabItems = [
  { id: 'code', label: 'Code' },
  { id: 'issues', label: 'Issues (3)' },
  { id: 'prs', label: 'Pull Requests' },
]

export function App() {
  const [active, setActive] = useState('issues')
  return (
    <Box padding={1} flexDirection="column">
      <Tabs items={tabItems} activeId={active} onSelect={setActive} />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    dialog: [
        {
            id: 'confirm-dialog',
            title: 'Action Confirmation Dialog',
            description: 'Modal prompt asking user to confirm an impending action.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌─ \x1b[1;38;2;226;226;226mConfirm Deployment\x1b[0m \x1b[38;2;42;42;42m───────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m  Deploy commit \x1b[38;2;251;146;60m8f3a12\x1b[0m to production?              \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m                                                         \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m  \x1b[48;2;251;146;60m\x1b[38;2;20;20;20m\x1b[1m Yes, Deploy \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;226;226;226m Cancel \x1b[0m                   \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { Dialog } from '@/components/tui/dialog'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Dialog
        title="Confirm Deployment"
        message="Deploy commit 8f3a12 to production?"
        confirmLabel="Yes, Deploy"
        cancelLabel="Cancel"
      />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'destructive-alert',
            title: 'Destructive Warning Dialog',
            description: 'Red highlighted confirmation modal for irreversible operations.',
            terminalLines: [
                '\x1b[38;2;248;113;113m┌─ \x1b[1;38;2;248;113;113mDelete Environment\x1b[0m \x1b[38;2;248;113;113m───────────────────────────┐\x1b[0m',
                '\x1b[38;2;248;113;113m│\x1b[0m  This will destroy all test databases and volumes.      \x1b[38;2;248;113;113m│\x1b[0m',
                '\x1b[38;2;248;113;113m│\x1b[0m                                                         \x1b[38;2;248;113;113m│\x1b[0m',
                '\x1b[38;2;248;113;113m│\x1b[0m  \x1b[48;2;63;19;22m\x1b[38;2;248;113;113m\x1b[1m Confirm Delete \x1b[0m  \x1b[48;2;42;42;42m\x1b[38;2;226;226;226m Keep \x1b[0m                     \x1b[38;2;248;113;113m│\x1b[0m',
                '\x1b[38;2;248;113;113m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { Dialog } from '@/components/tui/dialog'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Dialog
        title="Delete Environment"
        message="This will destroy all test databases and volumes."
        confirmLabel="Confirm Delete"
        variant="destructive"
      />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    progress: [
        {
            id: 'determinate-half',
            title: 'Mid-Way Progress (50%)',
            description: 'Determinate progress bar indicating steady completion.',
            terminalLines: [
                '\x1b[38;2;140;140;140mDownloading:\x1b[0m \x1b[38;2;251;146;60m████████████\x1b[0m\x1b[38;2;92;92;92m░░░░░░░░░░░░\x1b[0m \x1b[1;38;2;251;146;60m50%\x1b[0m',
            ],
            codeSnippet: `import { Progress } from '@/components/tui/progress'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Progress value={50} max={100} label="Downloading" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'determinate-complete',
            title: 'Completed Progress (100%)',
            description: 'Full progress bar indicating completed download or sync.',
            terminalLines: [
                '\x1b[38;2;140;140;140mDownload:\x1b[0m    \x1b[38;2;74;222;128m████████████████████████\x1b[0m \x1b[1;38;2;74;222;128m100%\x1b[0m',
            ],
            codeSnippet: `import { Progress } from '@/components/tui/progress'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Progress value={100} max={100} label="Download" color="#4ade80" />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    checkbox: [
        {
            id: 'checked-unchecked',
            title: 'Checked vs Unchecked States',
            description: 'Interactive checklist displaying enabled and disabled toggles.',
            terminalLines: [
                '  \x1b[38;2;74;222;128m[✔] Enable TypeScript strict mode\x1b[0m',
                '  \x1b[38;2;140;140;140m[ ] Include sample test specs\x1b[0m',
                '  \x1b[38;2;74;222;128m[✔] Generate README.md file\x1b[0m',
            ],
            codeSnippet: `import { Checkbox } from '@/components/tui/checkbox'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [checked, setChecked] = useState(true)
  return (
    <Box padding={1} flexDirection="column" gap={1}>
      <Checkbox isChecked={checked} onChange={setChecked} label="Enable TypeScript strict mode" />
      <Checkbox isChecked={false} label="Include sample test specs" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'disabled-checkbox',
            title: 'Disabled Checkbox State',
            description: 'Checkbox locked by system policy or dependency.',
            terminalLines: [
                '  \x1b[38;2;92;92;92m[✔] Core Runtime (required, cannot uncheck)\x1b[0m',
            ],
            codeSnippet: `import { Checkbox } from '@/components/tui/checkbox'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Checkbox isChecked={true} disabled={true} label="Core Runtime (required, cannot uncheck)" />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    'radio-group': [
        {
            id: 'standard-selection',
            title: 'Selected Option',
            description: 'Single selection radio list with active choice highlighted.',
            terminalLines: [
                '  \x1b[38;2;251;146;60m(●) Bun (Recommended)\x1b[0m',
                '  \x1b[38;2;140;140;140m(○) pnpm\x1b[0m',
                '  \x1b[38;2;140;140;140m(○) npm\x1b[0m',
            ],
            codeSnippet: `import { RadioGroup } from '@/components/tui/radio-group'
import { Box, render } from 'ink'
import React, { useState } from 'react'

const options = [
  { value: 'bun', label: 'Bun (Recommended)' },
  { value: 'pnpm', label: 'pnpm' },
  { value: 'npm', label: 'npm' },
]

export function App() {
  const [val, setVal] = useState('bun')
  return (
    <Box padding={1}>
      <RadioGroup options={options} value={val} onChange={setVal} />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'disabled-radio',
            title: 'Option with Disabled State',
            description: 'Radio list with unavailable option greyed out.',
            terminalLines: [
                '  \x1b[38;2;251;146;60m(●) SQLite (Local file)\x1b[0m',
                '  \x1b[38;2;92;92;92m(○) PostgreSQL (Disabled: no credentials set)\x1b[0m',
            ],
            codeSnippet: `import { RadioGroup } from '@/components/tui/radio-group'
import { Box, render } from 'ink'
import React from 'react'

const options = [
  { value: 'sqlite', label: 'SQLite (Local file)' },
  { value: 'postgres', label: 'PostgreSQL (Disabled: no credentials set)', disabled: true },
]

export function App() {
  return (
    <Box padding={1}>
      <RadioGroup options={options} value="sqlite" />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    skeleton: [
        {
            id: 'text-line-shimmer',
            title: 'Text Line Placeholder',
            description: 'Pulsing placeholder bars simulating incoming text lines.',
            terminalLines: [
                '  \x1b[38;2;42;42;42m████████████████████████████████\x1b[0m',
                '  \x1b[38;2;42;42;42m████████████████████\x1b[0m',
            ],
            codeSnippet: `import { Skeleton } from '@/components/tui/skeleton'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} flexDirection="column" gap={1}>
      <Skeleton width={32} />
      <Skeleton width={20} />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'card-skeleton',
            title: 'Card Block Skeleton',
            description: 'Pulsing box simulating a component card during data fetch.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌────────────────────────────────────────────────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│ ████████████                                           │\x1b[0m',
                '\x1b[38;2;42;42;42m│ ████████████████████████████████████                   │\x1b[0m',
                '\x1b[38;2;42;42;42m└────────────────────────────────────────────────────────┘\x1b[0m',
            ],
            codeSnippet: `import { Skeleton } from '@/components/tui/skeleton'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} borderStyle="round" borderColor="#2a2a2a" flexDirection="column" gap={1}>
      <Skeleton width={12} />
      <Skeleton width={36} />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    toast: [
        {
            id: 'success-toast',
            title: 'Success Notification Toast',
            description: 'Positive confirmation toast with checkmark.',
            terminalLines: [
                '  \x1b[48;2;18;47;30m\x1b[38;2;74;222;128m ✔ Configuration saved to .tuirc.json \x1b[0m',
            ],
            codeSnippet: `import { Toast } from '@/components/tui/toast'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Toast message="Configuration saved to .tuirc.json" type="success" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'error-toast',
            title: 'Error Notification Toast',
            description: 'Warning/error alert toast with failure glyph.',
            terminalLines: [
                '  \x1b[48;2;63;19;22m\x1b[38;2;248;113;113m ✖ Registry endpoint unreachable (HTTP 503) \x1b[0m',
            ],
            codeSnippet: `import { Toast } from '@/components/tui/toast'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Toast message="Registry endpoint unreachable (HTTP 503)" type="error" />
    </Box>
  )
}

render(<App />)`,
        },
    ],

    table: [
        {
            id: 'bordered-table',
            title: 'Standard Bordered Table',
            description: 'Multi-column tabular layout with borders and aligned cells.',
            terminalLines: [
                '\x1b[38;2;42;42;42m┌──────────────┬──────────────┬──────────────┐\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m \x1b[1;38;2;251;146;60mPackage      \x1b[0m\x1b[38;2;42;42;42m│\x1b[0m \x1b[1;38;2;251;146;60mVersion      \x1b[0m\x1b[38;2;42;42;42m│\x1b[0m \x1b[1;38;2;251;146;60mLicense      \x1b[0m\x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m├──────────────┼──────────────┼──────────────┤\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m react        \x1b[38;2;42;42;42m│\x1b[0m 19.0.0        \x1b[38;2;42;42;42m│\x1b[0m MIT          \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m│\x1b[0m ink          \x1b[38;2;42;42;42m│\x1b[0m 5.0.1         \x1b[38;2;42;42;42m│\x1b[0m MIT          \x1b[38;2;42;42;42m│\x1b[0m',
                '\x1b[38;2;42;42;42m└──────────────┴──────────────┴──────────────┘\x1b[0m',
            ],
            codeSnippet: `import { Table } from '@/components/tui/table'
import { Box, render } from 'ink'
import React from 'react'

const data = [
  { package: 'react', version: '19.0.0', license: 'MIT' },
  { package: 'ink', version: '5.0.1', license: 'MIT' },
]

export function App() {
  return (
    <Box padding={1}>
      <Table data={data} />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'compact-matrix',
            title: 'Compact Data Matrix',
            description: 'Minimal borderless table for logs and dense metrics.',
            terminalLines: [
                '  \x1b[38;2;92;92;92mTIMESTAMP\x1b[0m     \x1b[38;2;92;92;92mLEVEL\x1b[0m    \x1b[38;2;92;92;92mMESSAGE\x1b[0m',
                '  14:30:01      \x1b[38;2;74;222;128mINFO\x1b[0m     server listening on :3000',
                '  14:30:05      \x1b[38;2;251;191;36mWARN\x1b[0m     high memory usage detected',
            ],
            codeSnippet: `import { Table } from '@/components/tui/table'
import { Box, render } from 'ink'
import React from 'react'

const logs = [
  { timestamp: '14:30:01', level: 'INFO', message: 'server listening on :3000' },
  { timestamp: '14:30:05', level: 'WARN', message: 'high memory usage detected' },
]

export function App() {
  return (
    <Box padding={1}>
      <Table data={logs} borderStyle="none" />
    </Box>
  )
}

render(<App />)`,
        },
    ],
    switch: [
        {
            id: 'glyph-toggle',
            title: 'Glyph Toggle (On vs Off)',
            description: 'Compact terminal toggle using arrow glyph indicators (─●) and (●─).',
            terminalLines: [
                '  \x1b[1;38;2;74;222;128m(─●)\x1b[0m Auto-run tools',
                '  \x1b[38;2;92;92;92m(●─) Debug mode\x1b[0m',
            ],
            codeSnippet: `import { Switch } from '@/components/tui/switch'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [enabled, setEnabled] = useState(true)
  return (
    <Box padding={1} flexDirection="column" gap={1}>
      <Switch checked={enabled} onChange={setEnabled} label="Auto-run tools" />
      <Switch checked={false} label="Debug mode" />
    </Box>
  )
}

render(<App />)`,
        },
        {
            id: 'badge-variant',
            title: 'Badge Variant [ ON ] and [ OFF ]',
            description: 'Boxed badge style switch for prominent state toggles.',
            terminalLines: [
                '  \x1b[1;38;2;74;222;128m[ ON ]\x1b[0m  Stream reasoning \x1b[38;2;92;92;92m(Live tokens)\x1b[0m',
                '  \x1b[38;2;92;92;92m[ OFF ]\x1b[0m Verbose logs',
            ],
            codeSnippet: `import { Switch } from '@/components/tui/switch'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [stream, setStream] = useState(true)
  return (
    <Box padding={1} flexDirection="column" gap={1}>
      <Switch
        checked={stream}
        onChange={setStream}
        variant="badge"
        label="Stream reasoning"
        description="Live tokens"
      />
      <Switch checked={false} variant="badge" label="Verbose logs" />
    </Box>
  )
}

render(<App />)`,
        },
    ],
}
