export type DocCategory = 'getting-started' | 'components'

export interface PropItem {
    prop: string
    type: string
    default?: string
    desc: string
}

export interface TocItem {
    id: string
    label: string
}

export interface DocItem {
    id: string
    category: DocCategory
    navLabel: string
    title: string
    badge?: string
    description: string
    installCmd?: string
    terminalMode?:
        | 'all'
        | 'diff-viewer'
        | 'streaming-text'
        | 'collapsible-reasoning'
        | 'tool-call-card'
        | 'token-gauge'
        | 'pill'
        | 'spinner'
        | 'text-area'
        | 'header'
        | 'mermaid'
        | 'markdown'
        | 'user-message'
        | 'error-message'
        | 'select-menu'
        | 'command-menu'
        | 'shortcuts-menu'
        | 'plan-approve-menu'
        | 'input-bar'
        | 'card'
        | 'button'
        | 'tabs'
        | 'dialog'
        | 'progress'
        | 'checkbox'
        | 'radio-group'
        | 'skeleton'
        | 'toast'
        | 'table'
    codeSnippet?: string
    props?: PropItem[]
    points?: string[]
    toc: TocItem[]
}

export const DOC_ITEMS: DocItem[] = [
    {
        id: 'introduction',
        category: 'getting-started',
        navLabel: 'introduction',
        title: 'introduction',
        badge: 'overview',
        description: 'terminal ui primitives for react and ink. unbundled and copy-pasteable.',
        terminalMode: 'all',
        installCmd: 'npx @trydecember/tui init',
        points: [
            'unbundled source code — you own the components in your repo.',
            'stateless primitives — no background stdin hooks or hidden state.',
            'central theme tokens contract for borders, glyphs, and colors.',
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'quickstart' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'points', label: 'principles' },
        ],
    },
    {
        id: 'installation',
        category: 'getting-started',
        navLabel: 'installation',
        title: 'installation',
        badge: 'setup',
        description: 'initialize project configuration and add components via cli.',
        installCmd: 'npx @trydecember/tui init',
        codeSnippet: `# 1. initialize theme.ts and config
npx @trydecember/tui init

# 2. add component source file
npx @trydecember/tui add diff-viewer

# 3. use in your ink component
import { DiffViewer } from './components/tui/diff-viewer'`,
        points: [
            'writes theme.ts into your components/tui directory.',
            'requires peer dependencies: react (>=18) and ink (>=4).',
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'cli setup' },
            { id: 'usage', label: 'workflow' },
            { id: 'points', label: 'prerequisites' },
        ],
    },
    {
        id: 'theming',
        category: 'getting-started',
        navLabel: 'theming',
        title: 'theming',
        badge: 'tokens',
        description: 'typed token dictionary for colors, unicode glyphs, and borders.',
        codeSnippet: `// components/tui/theme.ts
export const THEME = {
  colors: {
    brand: '#fb923c',        // accent orange
    text: '#e2e2e2',         // base text
    muted: '#8c8c8c',        // secondary
    dim: '#5c5c5c',          // borders / inactive
    border: '#2a2a2a',       // box border
    success: '#4ade80',      // additions / checkmarks
    error: '#f87171',        // deletions / errors
    warning: '#fbbf24',      // spinners / alerts
    diffAddBg: '#122f1e',    // diff green background
    diffDeleteBg: '#3f1316', // diff red background
  },
  glyphs: {
    prompt: '❭',
    bullet: '•',
    status: '●',
    branch: '⌥',
    check: '✔',
    cross: '✖',
    foldClosed: '▸',
    foldOpen: '▾',
  },
} as const`,
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'usage', label: 'tokens contract' },
        ],
    },
    {
        id: 'diff-viewer',
        category: 'components',
        navLabel: 'diff-viewer',
        title: '<DiffViewer />',
        badge: 'display',
        description: 'unified git diff renderer with file headers and fold truncation.',
        terminalMode: 'diff-viewer',
        installCmd: 'npx @trydecember/tui add diff-viewer',
        codeSnippet: `import { DiffViewer } from '@/components/tui/diff-viewer'
import { Box, render } from 'ink'
import React from 'react'

const patch = \`@@ -14,6 +14,8 @@ export function verifyToken(token)
- const decoded = jwt.decode(token)
+ const decoded = jwt.verify(token, process.env.SECRET)
+ if (!decoded.exp || decoded.exp < Date.now()) return\`

export function App() {
  return (
    <Box padding={1}>
      <DiffViewer
        filePath="packages/auth/src/jwt.ts"
        diff={patch}
        maxLines={10}
        isExpanded={true}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'diff', type: 'string', default: 'required', desc: 'raw unified git diff string' },
            { prop: 'filePath', type: 'string', default: 'undefined', desc: 'file path label in header' },
            { prop: 'maxLines', type: 'number', default: '15', desc: 'max visible lines before fold truncation' },
            { prop: 'isExpanded', type: 'boolean', default: 'true', desc: 'expand or collapse full diff' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'streaming-text',
        category: 'components',
        navLabel: 'streaming-text',
        title: '<StreamingText />',
        badge: 'stream',
        description: 'progressive token stream renderer with terminal block cursor.',
        terminalMode: 'streaming-text',
        installCmd: 'npx @trydecember/tui add streaming-text',
        codeSnippet: `import { StreamingText } from '@/components/tui/streaming-text'
import { Box, render } from 'ink'
import React from 'react'

export function App({ stream, isGenerating }: { stream: string; isGenerating: boolean }) {
  return (
    <Box padding={1}>
      <StreamingText content={stream} isStreaming={isGenerating} />
    </Box>
  )
}

render(<App stream="review complete." isGenerating={false} />)`,
        props: [
            { prop: 'content', type: 'string', default: 'required', desc: 'accumulated text content' },
            { prop: 'isStreaming', type: 'boolean', default: 'false', desc: 'renders terminal block cursor when true' },
            { prop: 'color', type: 'string', default: 'THEME.colors.text', desc: 'text color override' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'collapsible-reasoning',
        category: 'components',
        navLabel: 'collapsible-reasoning',
        title: '<CollapsibleReasoning />',
        badge: 'container',
        description: 'foldable thought container with execution time and token counter.',
        terminalMode: 'collapsible-reasoning',
        installCmd: 'npx @trydecember/tui add collapsible-reasoning',
        codeSnippet: `import { CollapsibleReasoning } from '@/components/tui/collapsible-reasoning'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <CollapsibleReasoning
        content="checking jwt signature verification..."
        durationMs={1200}
        tokenCount={142}
        isExpanded={false}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'content', type: 'string', default: 'required', desc: 'raw reasoning text content' },
            { prop: 'isExpanded', type: 'boolean', default: 'false', desc: 'whether thought details are unfolded' },
            { prop: 'isThinking', type: 'boolean', default: 'false', desc: 'shows active thinking spinner' },
            { prop: 'durationMs', type: 'number', default: 'undefined', desc: 'execution time in ms' },
            { prop: 'tokenCount', type: 'number', default: 'undefined', desc: 'tokens consumed' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'tool-call-card',
        category: 'components',
        navLabel: 'tool-call-card',
        title: '<ToolCallCard />',
        badge: 'status',
        description: 'tool execution card with status indicator and expandable output.',
        terminalMode: 'tool-call-card',
        installCmd: 'npx @trydecember/tui add tool-call-card',
        codeSnippet: `import { ToolCallCard } from '@/components/tui/tool-call-card'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box flexDirection="column" gap={1} padding={1}>
      <ToolCallCard
        toolName="bun test"
        inputSummary="auth.test.ts"
        status="completed"
        durationMs={800}
        isExpanded={true}
        output="✓ 4 tests passed [28ms]"
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'toolName', type: 'string', default: 'required', desc: 'tool identifier (e.g. bun test, read_file)' },
            { prop: 'inputSummary', type: 'string', default: 'undefined', desc: 'argument or target summary' },
            { prop: 'status', type: "'pending' | 'running' | 'completed' | 'failed'", default: 'required', desc: 'execution state' },
            { prop: 'isExpanded', type: 'boolean', default: 'false', desc: 'whether output box is unfolded' },
            { prop: 'output', type: 'string', default: 'undefined', desc: 'stdout or error content' },
            { prop: 'durationMs', type: 'number', default: 'undefined', desc: 'runtime in milliseconds' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'token-gauge',
        category: 'components',
        navLabel: 'token-gauge',
        title: '<TokenGauge />',
        badge: 'meter',
        description: 'context window capacity meter with threshold color transitions.',
        terminalMode: 'token-gauge',
        installCmd: 'npx @trydecember/tui add token-gauge',
        codeSnippet: `import { TokenGauge } from '@/components/tui/token-gauge'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <TokenGauge usedTokens={36400} totalTokens={128000} label="context" />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'usedTokens', type: 'number', default: 'required', desc: 'tokens currently used' },
            { prop: 'totalTokens', type: 'number', default: 'required', desc: 'context window capacity' },
            { prop: 'width', type: 'number', default: '20', desc: 'visual meter width in columns' },
            { prop: 'label', type: 'string', default: "'Context'", desc: 'label displayed before meter' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'pill',
        category: 'components',
        navLabel: 'pill',
        title: '<Pill />',
        badge: 'chip',
        description: 'compact badge chip for metadata, tags, and status labels.',
        terminalMode: 'pill',
        installCmd: 'npx @trydecember/tui add pill',
        codeSnippet: `import { Pill } from '@/components/tui/pill'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Pill label="PR #42" color="#fb923c" />
      <Pill label="approved" color="#4ade80" />
      <Pill label="v0.3.0" dimColor />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'label', type: 'string', default: 'required', desc: 'text content of the badge pill' },
            { prop: 'color', type: 'string', default: 'THEME.colors.text', desc: 'foreground label color' },
            { prop: 'backgroundColor', type: 'string', default: 'THEME.colors.border', desc: 'background pill color' },
            { prop: 'dimColor', type: 'boolean', default: 'false', desc: 'renders muted dim text if true' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'spinner',
        category: 'components',
        navLabel: 'spinner',
        title: '<Spinner />',
        badge: 'feedback',
        description: 'animated terminal dot spinner with an optional status label.',
        terminalMode: 'spinner',
        installCmd: 'npx @trydecember/tui add spinner',
        codeSnippet: `import { Spinner } from '@/components/tui/spinner'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Spinner label="analyzing dependencies..." />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'label', type: 'string', default: 'undefined', desc: 'optional status label displayed beside dots' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'text-area',
        category: 'components',
        navLabel: 'text-area',
        title: '<TextArea />',
        badge: 'input',
        description: 'multiline terminal input with cursor navigation, command highlighting, and history.',
        terminalMode: 'text-area',
        installCmd: 'npx @trydecember/tui add text-area',
        codeSnippet: `import { TextArea } from '@/components/tui/text-area'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [val, setVal] = useState('')

  return (
    <Box padding={1}>
      <TextArea
        value={val}
        onChange={setVal}
        onSubmit={(text) => console.log('submitted:', text)}
        placeholder="Ask anything or type / for commands..."
        focus={true}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'value', type: 'string', default: 'required', desc: 'current controlled text value' },
            { prop: 'onChange', type: '(value: string) => void', default: 'required', desc: 'text change callback' },
            { prop: 'onSubmit', type: '(value: string) => void', default: 'required', desc: 'enter key submission callback' },
            { prop: 'placeholder', type: 'string', default: "''", desc: 'placeholder string when empty' },
            { prop: 'focus', type: 'boolean', default: 'true', desc: 'whether keyboard input is active' },
            { prop: 'onHistoryUp', type: '() => void', default: 'undefined', desc: 'up arrow at first line callback' },
            { prop: 'onHistoryDown', type: '() => void', default: 'undefined', desc: 'down arrow at last line callback' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'header',
        category: 'components',
        navLabel: 'header',
        title: '<Header />',
        badge: 'layout',
        description: 'session status banner with git branch detection and starter hints.',
        terminalMode: 'header',
        installCmd: 'npx @trydecember/tui add header',
        codeSnippet: `import { Header } from '@/components/tui/header'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Header
        title="Agent CLI"
        version="0.3.0"
        tips={[
          'Run /init to scaffold workspace config',
          'Type / to explore available commands',
        ]}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'title', type: 'string', default: "'Agent CLI'", desc: 'cli app brand title' },
            { prop: 'version', type: 'string', default: "'0.1.0'", desc: 'semantic version string' },
            { prop: 'subtitle', type: 'string', default: 'undefined', desc: 'optional secondary header label' },
            { prop: 'workspaceRoot', type: 'string', default: 'process.cwd()', desc: 'directory root to detect .git branch' },
            { prop: 'tips', type: 'string[]', default: 'starter tips', desc: 'array of helpful hint lines' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'mermaid',
        category: 'components',
        navLabel: 'mermaid',
        title: '<Mermaid />',
        badge: 'diagram',
        description: 'pure unicode flowchart, sequence, and pie diagram renderer for the terminal.',
        terminalMode: 'mermaid',
        installCmd: 'npx @trydecember/tui add mermaid',
        codeSnippet: `import { Mermaid } from '@/components/tui/mermaid'
import { Box, render } from 'ink'
import React from 'react'

const chart = \`flowchart LR
    Client -->|HTTP| Gateway
    Gateway --> LLM\`

export function App() {
  return (
    <Box padding={1}>
      <Mermaid code={chart} />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'code', type: 'string', default: 'required', desc: 'raw mermaid diagram markdown text' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'markdown',
        category: 'components',
        navLabel: 'markdown',
        title: '<Markdown />',
        badge: 'content',
        description: 'terminal markdown parser supporting tables, lists, syntax-highlighted codeblocks, and diagrams.',
        terminalMode: 'markdown',
        installCmd: 'npx @trydecember/tui add markdown',
        codeSnippet: `import { Markdown } from '@/components/tui/markdown'
import { Box, render } from 'ink'
import React from 'react'

const md = \`# System Status
| Service | Status | Latency |
|:---|:---|:---|
| Cache | Active | 1.2ms |
| LLM Gateway | Ready | 42ms |\`

export function App() {
  return (
    <Box padding={1}>
      <Markdown>{md}</Markdown>
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'children', type: 'string', default: 'required', desc: 'markdown formatted string to render' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'user-message',
        category: 'components',
        navLabel: 'user-message',
        title: '<UserMessage />',
        badge: 'stream',
        description: 'terminal user prompt message bubble with brand chevron glyph.',
        terminalMode: 'user-message',
        installCmd: 'npx @trydecember/tui add user-message',
        codeSnippet: `import { UserMessage } from '@/components/tui/user-message'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <UserMessage message="check security and token expiration in jwt.ts" />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'message', type: 'string', default: 'required', desc: 'user input message string' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'error-message',
        category: 'components',
        navLabel: 'error-message',
        title: '<ErrorMessage />',
        badge: 'status',
        description: 'formatted terminal error display with automatic hint extraction and link styling.',
        terminalMode: 'error-message',
        installCmd: 'npx @trydecember/tui add error-message',
        codeSnippet: `import { ErrorMessage } from '@/components/tui/error-message'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <ErrorMessage
        message="Rate limit or quota exhausted from LLM provider."
        hint="Please upgrade your API key tier at https://platform.openai.com/limits"
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'message', type: 'string', default: 'required', desc: 'primary error message string' },
            { prop: 'cause', type: 'string', default: 'undefined', desc: 'optional underlying error reason' },
            { prop: 'hint', type: 'string', default: 'undefined', desc: 'actionable fix advice or web link' },
            { prop: 'hasTopMargin', type: 'boolean', default: 'false', desc: 'adds top blank line if true' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'select-menu',
        category: 'components',
        navLabel: 'select-menu',
        title: '<SelectMenu />',
        badge: 'menu',
        description: 'keyboard-navigable terminal selection list with active state and hints.',
        terminalMode: 'select-menu',
        installCmd: 'npx @trydecember/tui add select-menu',
        codeSnippet: `import { SelectMenu } from '@/components/tui/select-menu'
import { Box, render } from 'ink'
import React from 'react'

const models = [
  { label: 'claude-3-7-sonnet', value: 'anthropic/claude-3.7-sonnet', hint: 'Anthropic' },
  { label: 'gpt-4o', value: 'openai/gpt-4o', hint: 'OpenAI', active: true },
  { label: 'deepseek-r1', value: 'deepseek/deepseek-r1', hint: 'DeepSeek' },
]

export function App() {
  return (
    <Box padding={1}>
      <SelectMenu
        title="Select active model engine:"
        items={models}
        onSelect={(item) => console.log('selected:', item.value)}
        onCancel={() => console.log('cancelled')}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'items', type: 'SelectMenuItem[]', default: 'required', desc: 'array of items with label, value, hint, and active status' },
            { prop: 'onSelect', type: '(item: SelectMenuItem) => void', default: 'required', desc: 'callback executed when enter is pressed' },
            { prop: 'onCancel', type: '() => void', default: 'undefined', desc: 'callback executed when escape is pressed' },
            { prop: 'title', type: 'string', default: 'undefined', desc: 'optional section header title above menu' },
            { prop: 'windowSize', type: 'number', default: '8', desc: 'maximum visible rows before windowed paging' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'command-menu',
        category: 'components',
        navLabel: 'command-menu',
        title: '<CommandMenu />',
        badge: 'palette',
        description: 'slash command palette with real-time fuzzy filtering, pagination, and tab completion.',
        terminalMode: 'command-menu',
        installCmd: 'npx @trydecember/tui add command-menu',
        codeSnippet: `import { CommandMenu } from '@/components/tui/command-menu'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <CommandMenu
        query="/m"
        onSelect={(cmd) => console.log('run command:', cmd.value)}
        onCancel={() => console.log('dismissed')}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'query', type: 'string', default: "''", desc: 'active slash command query string to filter commands' },
            { prop: 'commands', type: 'CommandItem[]', default: 'DEFAULT_COMMANDS', desc: 'array of command items with name, description, and value' },
            { prop: 'onSelect', type: '(command: CommandItem) => void', default: 'required', desc: 'callback executed on enter or tab' },
            { prop: 'onCancel', type: '() => void', default: 'undefined', desc: 'callback executed on escape' },
            { prop: 'windowSize', type: 'number', default: '5', desc: 'number of command rows visible at once' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'shortcuts-menu',
        category: 'components',
        navLabel: 'shortcuts-menu',
        title: '<ShortcutsMenu />',
        badge: 'dialog',
        description: 'interactive keyboard shortcuts overlay menu with navigation and pagination.',
        terminalMode: 'shortcuts-menu',
        installCmd: 'npx @trydecember/tui add shortcuts-menu',
        codeSnippet: `import { ShortcutsMenu } from '@/components/tui/shortcuts-menu'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <ShortcutsMenu onClose={() => console.log('closed shortcuts')} />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'shortcuts', type: 'ShortcutItem[]', default: 'DEFAULT_SHORTCUTS', desc: 'array of shortcut items with key and desc' },
            { prop: 'onClose', type: '() => void', default: 'required', desc: 'callback triggered by escape or ctrl+c' },
            { prop: 'windowSize', type: 'number', default: '10', desc: 'visible rows in the window' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'plan-approve-menu',
        category: 'components',
        navLabel: 'plan-approve-menu',
        title: '<PlanApproveMenu />',
        badge: 'action',
        description: 'agent workflow action menu for reviewing, refining, approving, or rejecting execution plans.',
        terminalMode: 'plan-approve-menu',
        installCmd: 'npx @trydecember/tui add plan-approve-menu',
        codeSnippet: `import { PlanApproveMenu } from '@/components/tui/plan-approve-menu'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <PlanApproveMenu
        planSummary="Migrate auth session token verification to ed25519"
        onSelect={(action) => console.log('user chose:', action)}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'onSelect', type: "(action: 'approve' | 'refine' | 'view' | 'reject') => void", default: 'required', desc: 'selection callback' },
            { prop: 'planSummary', type: 'string', default: 'undefined', desc: 'brief summary of plan displayed in top card' },
            { prop: 'options', type: 'PlanApproveOption[]', default: 'DEFAULT_PLAN_OPTIONS', desc: 'customizable action items and hotkeys' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'input-bar',
        category: 'components',
        navLabel: 'input-bar',
        title: '<InputBar />',
        badge: 'composite',
        description: 'complete terminal agent input bar with multiline prompt, slash commands, and status display.',
        terminalMode: 'input-bar',
        installCmd: 'npx @trydecember/tui add input-bar',
        codeSnippet: `import { InputBar } from '@/components/tui/input-bar'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} flexDirection="column">
      <InputBar
        onSubmit={(prompt) => console.log('sending prompt:', prompt)}
        placeholder="Ask agent to inspect, refactor, or build..."
        statusLeft="gpt-4o (OpenAI) · 28k tokens"
        statusRight="? for shortcuts"
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'onSubmit', type: '(text: string) => void', default: 'required', desc: 'callback executed when enter is pressed' },
            { prop: 'placeholder', type: 'string', default: 'starter prompt', desc: 'placeholder displayed when input is empty' },
            { prop: 'commands', type: 'CommandItem[]', default: 'DEFAULT_COMMANDS', desc: 'custom slash commands array' },
            { prop: 'shortcuts', type: 'ShortcutItem[]', default: 'DEFAULT_SHORTCUTS', desc: 'custom keyboard shortcuts array' },
            { prop: 'fileSuggestions', type: 'string[]', default: '[]', desc: 'workspace files array for @ mention completions' },
            { prop: 'statusLeft', type: 'React.ReactNode', default: "'Agent ready'", desc: 'left status bar content (engine, tokens, etc.)' },
            { prop: 'statusRight', type: 'React.ReactNode', default: "'? for shortcuts'", desc: 'right status bar content' },
            { prop: 'activeToast', type: '{ message: string; variant?: string }', default: 'null', desc: 'optional transient status toast' },
            { prop: 'disabled', type: 'boolean', default: 'false', desc: 'disables input during active model streaming' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'card',
        category: 'components',
        navLabel: 'card',
        title: '<Card />',
        badge: 'primitive',
        description: 'displays a boxed card container with optional header, title, description, content, and footer.',
        terminalMode: 'card',
        installCmd: 'npx @trydecember/tui add card',
        codeSnippet: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/tui/card'
import { Box, Text, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Card width={48} borderStyle="round">
        <CardHeader>
          <CardTitle>Security Advisory</CardTitle>
          <CardDescription>Vulnerability CVE-2026-1184 found in dependency tree</CardDescription>
        </CardHeader>
        <CardContent>
          <Text color="red">Severity: Critical · cvss 9.8</Text>
        </CardContent>
        <CardFooter>
          <Text color="gray">Run 'tui audit fix' to apply patches</Text>
        </CardFooter>
      </Card>
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'borderStyle', type: "'round' | 'single' | 'double' | 'bold'", default: "'round'", desc: 'terminal box border style' },
            { prop: 'borderColor', type: 'string', default: 'THEME.colors.border', desc: 'custom color for the border frame' },
            { prop: 'paddingX', type: 'number', default: '1', desc: 'horizontal padding inside card' },
            { prop: 'paddingY', type: 'number', default: '0', desc: 'vertical padding inside card' },
            { prop: 'width', type: 'number | string', default: 'undefined', desc: 'fixed width or percentage of container' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'button',
        category: 'components',
        navLabel: 'button',
        title: '<Button />',
        badge: 'primitive',
        description: 'interactive terminal button with variants (default, secondary, destructive, outline, ghost) and keyboard focus.',
        terminalMode: 'button',
        installCmd: 'npx @trydecember/tui add button',
        codeSnippet: `import { Button } from '@/components/tui/button'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} gap={2}>
      <Button isFocused variant="default" onSelect={() => console.log('deployed')}>Deploy</Button>
      <Button variant="secondary">Review</Button>
      <Button variant="destructive">Rollback</Button>
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'", default: "'default'", desc: 'visual styling preset' },
            { prop: 'isFocused', type: 'boolean', default: 'false', desc: 'whether the button currently holds keyboard focus' },
            { prop: 'disabled', type: 'boolean', default: 'false', desc: 'disables keyboard triggers and dims text' },
            { prop: 'onSelect', type: '() => void', default: 'undefined', desc: 'callback triggered on return/enter when focused' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'tabs',
        category: 'components',
        navLabel: 'tabs',
        title: '<Tabs />',
        badge: 'primitive',
        description: 'layered sections of content displayed one at a time via keyboard arrow navigation.',
        terminalMode: 'tabs',
        installCmd: 'npx @trydecember/tui add tabs',
        codeSnippet: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/tui/tabs'
import { Box, Text, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="commits">Commits</TabsTrigger>
          <TabsTrigger value="checks">CI Checks</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Text>Branch main is 2 commits ahead of origin.</Text>
        </TabsContent>
        <TabsContent value="commits">
          <Text>e91a0c4 feat: add unified diff viewer</Text>
        </TabsContent>
        <TabsContent value="checks">
          <Text color="green">✔ 14 checks passed in 42s</Text>
        </TabsContent>
      </Tabs>
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'defaultValue', type: 'string', default: 'undefined', desc: 'initial active tab key' },
            { prop: 'value', type: 'string', default: 'undefined', desc: 'controlled active tab key' },
            { prop: 'onValueChange', type: '(value: string) => void', default: 'undefined', desc: 'callback invoked when active tab changes' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'dialog',
        category: 'components',
        navLabel: 'dialog',
        title: '<Dialog />',
        badge: 'primitive',
        description: 'modal dialog overlay that interrupts the user with important content and expects a response.',
        terminalMode: 'dialog',
        installCmd: 'npx @trydecember/tui add dialog',
        codeSnippet: `import { Dialog } from '@/components/tui/dialog'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [open, setOpen] = useState(true)

  return (
    <Box padding={1}>
      <Dialog
        isOpen={open}
        title="Confirm Overwrite"
        description="packages/database/schema.prisma has unstaged local edits. Overwrite with upstream?"
        confirmText="Overwrite"
        cancelText="Keep local"
        onConfirm={() => { console.log('confirmed'); setOpen(false); }}
        onCancel={() => { console.log('cancelled'); setOpen(false); }}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'isOpen', type: 'boolean', default: 'false', desc: 'whether the modal overlay is visible' },
            { prop: 'title', type: 'string', default: 'undefined', desc: 'modal title heading' },
            { prop: 'description', type: 'string', default: 'undefined', desc: 'explanatory message text' },
            { prop: 'confirmText', type: 'string', default: "'Confirm'", desc: 'label for the primary affirmative action' },
            { prop: 'cancelText', type: 'string', default: "'Cancel'", desc: 'label for dismissal' },
            { prop: 'onConfirm', type: '() => void', default: 'undefined', desc: 'callback on enter / confirmation' },
            { prop: 'onCancel', type: '() => void', default: 'undefined', desc: 'callback on escape / cancel' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'progress',
        category: 'components',
        navLabel: 'progress',
        title: '<Progress />',
        badge: 'primitive',
        description: 'displays an indicator showing the completion progress of a task with terminal block glyphs.',
        terminalMode: 'progress',
        installCmd: 'npx @trydecember/tui add progress',
        codeSnippet: `import { Progress } from '@/components/tui/progress'
import { Box, Text, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} flexDirection="column" gap={1}>
      <Text>Indexing codebase symbols...</Text>
      <Progress value={68} width={30} showPercentage color="brand" />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'value', type: 'number', default: '0', desc: 'completion percentage between 0 and 100' },
            { prop: 'width', type: 'number', default: '20', desc: 'character width of the progress track' },
            { prop: 'showPercentage', type: 'boolean', default: 'true', desc: 'renders trailing percentage string' },
            { prop: 'color', type: 'string', default: 'THEME.colors.brand', desc: 'fill color for completed blocks' },
            { prop: 'emptyColor', type: 'string', default: 'THEME.colors.muted', desc: 'color for empty track blocks' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'checkbox',
        category: 'components',
        navLabel: 'checkbox',
        title: '<Checkbox />',
        badge: 'primitive',
        description: 'toggle control that allows the user to switch between checked and unchecked states via space or enter.',
        terminalMode: 'checkbox',
        installCmd: 'npx @trydecember/tui add checkbox',
        codeSnippet: `import { Checkbox } from '@/components/tui/checkbox'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [checked, setChecked] = useState(true)

  return (
    <Box padding={1}>
      <Checkbox
        label="Run database migrations before tests"
        checked={checked}
        isFocused
        onChange={setChecked}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'checked', type: 'boolean', default: 'false', desc: 'whether the checkbox is checked' },
            { prop: 'label', type: 'string', default: 'undefined', desc: 'text label displayed alongside checkbox' },
            { prop: 'isFocused', type: 'boolean', default: 'false', desc: 'keyboard focus state (space/enter to toggle)' },
            { prop: 'disabled', type: 'boolean', default: 'false', desc: 'disables interaction and dims label' },
            { prop: 'onChange', type: '(checked: boolean) => void', default: 'undefined', desc: 'callback triggered when state changes' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'radio-group',
        category: 'components',
        navLabel: 'radio-group',
        title: '<RadioGroup />',
        badge: 'primitive',
        description: 'a set of checkable radio buttons where no more than one option can be selected at a time.',
        terminalMode: 'radio-group',
        installCmd: 'npx @trydecember/tui add radio-group',
        codeSnippet: `import { RadioGroup } from '@/components/tui/radio-group'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [model, setModel] = useState('claude-3-7')

  return (
    <Box padding={1}>
      <RadioGroup
        value={model}
        onChange={setModel}
        options={[
          { value: 'claude-3-7', label: 'Claude 3.7 Sonnet', hint: 'recommended · reasoning' },
          { value: 'gpt-4o', label: 'GPT-4o', hint: 'fast tool calling' },
          { value: 'gemini-2-flash', label: 'Gemini 2.0 Flash', hint: 'ultra-low latency' },
        ]}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'value', type: 'string', default: 'required', desc: 'currently selected option value' },
            { prop: 'options', type: 'RadioGroupOption[]', default: 'required', desc: 'array of option items with label and optional hint' },
            { prop: 'onChange', type: '(value: string) => void', default: 'required', desc: 'callback invoked when an option is selected' },
            { prop: 'isFocused', type: 'boolean', default: 'true', desc: 'enables arrow key navigation' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'skeleton',
        category: 'components',
        navLabel: 'skeleton',
        title: '<Skeleton />',
        badge: 'primitive',
        description: 'shows a placeholder pattern while asynchronous terminal content is loading.',
        terminalMode: 'skeleton',
        installCmd: 'npx @trydecember/tui add skeleton',
        codeSnippet: `import { Skeleton } from '@/components/tui/skeleton'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} flexDirection="column" gap={1}>
      <Skeleton width={24} height={1} />
      <Skeleton width={48} height={2} />
      <Skeleton width={16} height={1} />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'width', type: 'number | string', default: '16', desc: 'width in character count or container size' },
            { prop: 'height', type: 'number', default: '1', desc: 'number of lines to fill' },
            { prop: 'char', type: 'string', default: "'░'", desc: 'placeholder glyph character' },
            { prop: 'color', type: 'string', default: 'THEME.colors.muted', desc: 'color tone for shimmer blocks' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'toast',
        category: 'components',
        navLabel: 'toast',
        title: '<Toast />',
        badge: 'primitive',
        description: 'a succinct floating notification message providing transient operational feedback.',
        terminalMode: 'toast',
        installCmd: 'npx @trydecember/tui add toast',
        codeSnippet: `import { Toast } from '@/components/tui/toast'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} flexDirection="column" gap={1}>
      <Toast variant="success" message="Branch merged successfully to origin/main" />
      <Toast variant="error" message="Failed to authenticate with registry" />
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'message', type: 'string', default: 'required', desc: 'notification message string' },
            { prop: 'title', type: 'string', default: 'undefined', desc: 'optional heading for the toast' },
            { prop: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", desc: 'visual icon and color theme' },
            { prop: 'duration', type: 'number', default: 'undefined', desc: 'auto-dismiss delay in ms' },
            { prop: 'onDismiss', type: '() => void', default: 'undefined', desc: 'callback executed when dismissed' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
    {
        id: 'table',
        category: 'components',
        navLabel: 'table',
        title: '<Table />',
        badge: 'primitive',
        description: 'structured terminal data grid component supporting aligned column headers, rows, and cells.',
        terminalMode: 'table',
        installCmd: 'npx @trydecember/tui add table',
        codeSnippet: `import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/tui/table'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead width={18}>Model</TableHead>
            <TableHead width={12} align="center">Context</TableHead>
            <TableHead width={12} align="right">Pricing</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell width={18}>claude-3-7-sonnet</TableCell>
            <TableCell width={12} align="center">200k</TableCell>
            <TableCell width={12} align="right">$3.00 / M</TableCell>
          </TableRow>
          <TableRow>
            <TableCell width={18}>gpt-4o</TableCell>
            <TableCell width={12} align="center">128k</TableCell>
            <TableCell width={12} align="right">$2.50 / M</TableCell>
          </TableRow>
          <TableRow>
            <TableCell width={18}>gemini-2.0-flash</TableCell>
            <TableCell width={12} align="center">1M</TableCell>
            <TableCell width={12} align="right">$0.10 / M</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}

render(<App />)`,
        props: [
            { prop: 'children', type: 'React.ReactNode', default: 'required', desc: 'TableHeader and TableBody elements' },
            { prop: 'width', type: 'number', default: 'undefined', desc: 'width on TableHead and TableCell' },
            { prop: 'align', type: "'left' | 'center' | 'right'", default: "'left'", desc: 'text alignment inside column cell' },
        ],
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'installation' },
            { id: 'preview', label: 'terminal preview' },
            { id: 'usage', label: 'usage' },
            { id: 'props', label: 'api reference' },
        ],
    },
]
