import { COMPONENT_VARIATIONS, type ComponentVariation } from './component-variations'

export type { ComponentVariation }

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

export interface DocSectionItem {
    title: string
    description?: string
    codeSnippet?: string
    language?: 'tsx' | 'typescript' | 'bash' | 'diff' | 'json'
}

export interface DocSection {
    id: string
    title: string
    description?: string
    codeSnippet?: string
    language?: 'tsx' | 'typescript' | 'bash' | 'diff' | 'json'
    points?: string[]
    items?: DocSectionItem[]
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
        | 'december'
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
        | 'switch'
    terminalHeight?: string
    codeSnippet?: string
    variations?: ComponentVariation[]
    props?: PropItem[]
    points?: string[]
    sections?: DocSection[]
    toc: TocItem[]
}

const BASE_DOC_ITEMS: DocItem[] = [
    {
        id: 'installation',
        category: 'getting-started',
        navLabel: 'installation',
        title: 'installation',
        badge: 'setup',
        description:
            'a ui library for terminal agents. set up your project, pick a theme, and add components.',
        installCmd: 'npx @trydecember/tui init',
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'install-cmd', label: 'quickstart' },
            { id: 'philosophy', label: 'how it works' },
            { id: 'prerequisites', label: 'prerequisites' },
            { id: 'cli-options', label: 'options' },
            { id: 'configuration', label: 'tui.json' },
            { id: 'adding-components', label: 'adding components' },
            { id: 'turn-architecture', label: 'agent turn' },
            { id: 'project-structure', label: 'project layout' },
            { id: 'verification', label: 'quick test' },
        ],
        sections: [
            {
                id: 'philosophy',
                title: 'how it works',
                description:
                    'tui is a ui library for terminal agents. you add components directly to your project so you can edit and customize the code.',
                points: [
                    'own your code: components are copied to your project. you can change styling, borders, and behavior directly.',
                    'controlled components: components are stateless. your agent controls focus, keyboard input, and state.',
                    'react and ink: works in any terminal with node or bun. no browser or native window needed.',
                    'shared theme: colors and symbols come from a theme.ts file in your project.',
                    'no lock in: no telemetry or tracking. just plain typescript and ink.',
                ],
            },
            {
                id: 'prerequisites',
                title: 'prerequisites',
                description: 'what you need before setting up:',
                points: [
                    'node 18 or later, or bun 1.0 or later.',
                    'react and ink installed in your project.',
                    'typescript with path aliases in tsconfig.json (like @/*).',
                ],
            },
            {
                id: 'cli-options',
                title: 'cli options',
                description:
                    'the init command checks your project, finds your package manager, and creates tui.json and theme.ts.',
                items: [
                    {
                        title: 'interactive setup',
                        description: 'prompts you to choose a theme and where to save components.',
                        codeSnippet: 'npx @trydecember/tui init',
                        language: 'bash',
                    },
                    {
                        title: 'pick a theme (--theme <name>)',
                        description:
                            'sets the theme directly (default, amber, emerald, cyan, monochrome, zinc, slate).',
                        codeSnippet: 'npx @trydecember/tui init --theme emerald',
                        language: 'bash',
                    },
                    {
                        title: 'skip prompts (-y, --yes)',
                        description:
                            'accepts default settings automatically without asking questions.',
                        codeSnippet: 'npx @trydecember/tui init -y',
                        language: 'bash',
                    },
                ],
            },
            {
                id: 'configuration',
                title: 'configuration (tui.json)',
                description: 'tui.json stores paths and settings for your components:',
                codeSnippet: `{
  "$schema": "https://tui.trydecember.com/schema.json",
  "tsx": true,
  "theme": "amber",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "theme": "@/components/ui/theme"
  }
}`,
                language: 'json',
                items: [
                    {
                        title: '$schema',
                        description: 'link to schema for editor hints and autocomplete.',
                    },
                    {
                        title: 'tsx',
                        description:
                            'set to true for typescript (.tsx) or false for javascript (.jsx).',
                    },
                    {
                        title: 'theme',
                        description: 'color theme name for your components.',
                    },
                    {
                        title: 'aliases.components',
                        description: 'path alias for your components folder.',
                    },
                    {
                        title: 'aliases.ui',
                        description: 'path alias where tui components are saved.',
                    },
                    {
                        title: 'aliases.theme',
                        description: 'path alias for your theme.ts file.',
                    },
                ],
            },
            {
                id: 'adding-components',
                title: 'adding components',
                description: 'use the add command to copy components into your project:',
                codeSnippet: `# add a single component
npx @trydecember/tui add diff-viewer

# add multiple components
npx @trydecember/tui add streaming-text collapsible-reasoning tool-call-card token-gauge

# add all components
npx @trydecember/tui add --all

# overwrite existing files without prompting
npx @trydecember/tui add diff-viewer --overwrite`,
                language: 'bash',
                points: [
                    'copies component source files directly into your project.',
                    'installs any needed packages (like diff or cli-spinners) automatically.',
                    'updates import paths to match your tui.json path aliases.',
                ],
            },
            {
                id: 'turn-architecture',
                title: 'agent turn',
                description:
                    'a turn is one round between a user and an agent: user prompt, agent thoughts, tool calls, diffs, and the final reply. here is how components work together in a turn:',
                codeSnippet: `import React from 'react'
import { Box } from 'ink'
import { StreamingText } from '@/components/ui/streaming-text'
import { CollapsibleReasoning } from '@/components/ui/collapsible-reasoning'
import { ToolCallCard } from '@/components/ui/tool-call-card'
import { DiffViewer } from '@/components/ui/diff-viewer'
import { TokenGauge } from '@/components/ui/token-gauge'

interface ToolCall {
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  durationMs?: number
  argsSnippet?: string
}

interface AgentTurnProps {
  thought?: string
  isThinking?: boolean
  responseText?: string
  isStreaming?: boolean
  toolCalls?: ToolCall[]
  diff?: string
  tokensUsed?: number
  tokenLimit?: number
}

export function AgentTurn({
  thought,
  isThinking = false,
  responseText,
  isStreaming = false,
  toolCalls = [],
  diff,
  tokensUsed = 4120,
  tokenLimit = 128000,
}: AgentTurnProps) {
  return (
    <Box flexDirection="column" gap={1}>
      {/* 1. agent thinking block */}
      {thought && (
        <CollapsibleReasoning
          thought={thought}
          isStreaming={isThinking}
          defaultCollapsed={!isThinking}
        />
      )}

      {/* 2. tool calls (file edits, commands, searches) */}
      {toolCalls.map((call, idx) => (
        <ToolCallCard
          key={idx}
          toolName={call.name}
          status={call.status}
          durationMs={call.durationMs}
          argsSnippet={call.argsSnippet}
        />
      ))}

      {/* 3. code diff view */}
      {diff && <DiffViewer diff={diff} />}

      {/* 4. streaming text reply */}
      {responseText && (
        <StreamingText
          text={responseText}
          isComplete={!isStreaming}
        />
      )}

      {/* 5. token gauge */}
      <TokenGauge
        used={tokensUsed}
        total={tokenLimit}
        label="Context Window"
      />
    </Box>
  )
}`,
                language: 'tsx',
            },
            {
                id: 'project-structure',
                title: 'project layout',
                description:
                    'after running init and adding components, your project looks like this:',
                codeSnippet: `my-agent/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── theme.ts                  # colors and symbols
│   │       ├── diff-viewer.tsx           # code diff view
│   │       ├── streaming-text.tsx        # streaming text with cursor
│   │       ├── tool-call-card.tsx        # tool call status card
│   │       └── collapsible-reasoning.tsx # collapsible thinking block
│   ├── agent.tsx                         # agent logic
│   └── index.tsx                         # entry point
├── package.json
├── tsconfig.json                         # path aliases: "@/*": ["./src/*"]
└── tui.json                              # local cli config`,
                language: 'bash',
            },
            {
                id: 'verification',
                title: 'quick test',
                description: 'create a small file to test that components render in your terminal:',
                codeSnippet: `import React from 'react'
import { render, Box, Text } from 'ink'
import { DiffViewer } from '@/components/ui/diff-viewer'
import { THEME } from '@/components/ui/theme'

const sampleDiff = \`--- a/agent.config.ts
+++ b/agent.config.ts
@@ -1,4 +1,4 @@
 export const agentConfig = {
-  model: 'gemini-1.5-flash',
+  model: 'gemini-2.0-flash',
   maxTokens: 8192,
 }\`

function App() {
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color={THEME.colors.brand}>
          {THEME.glyphs.status} @trydecember/tui ready
        </Text>
      </Box>
      <DiffViewer diff={sampleDiff} />
    </Box>
  )
}

render(<App />)`,
                language: 'tsx',
            },
        ],
    },
    {
        id: 'themes',
        category: 'getting-started',
        navLabel: 'themes',
        title: 'themes',
        badge: 'tokens',
        description: 'colors, symbols, and spacing for terminal components.',
        toc: [
            { id: 'overview', label: 'overview' },
            { id: 'token-contract', label: 'theme file' },
            { id: 'glyphs', label: 'symbols' },
            { id: 'customization', label: 'customizing' },
        ],
        sections: [
            {
                id: 'token-contract',
                title: 'theme file',
                description:
                    'every component imports colors, borders, and symbols from theme.ts. this keeps your agent ui consistent:',
                codeSnippet: `// components/ui/theme.ts
export type ThemePreset =
  | 'default'
  | 'amber'
  | 'emerald'
  | 'cyan'
  | 'monochrome'
  | 'zinc'
  | 'slate'

export interface ThemeColors {
  brand: string        // highlight color for borders, spinners, and accents
  text: string         // body text
  muted: string        // secondary text and labels
  dim: string          // inactive items and faint borders
  border: string       // box borders
  success: string      // completed checks and diff additions
  error: string        // errors and diff deletions
  warning: string      // warnings and active spinners
  diffAddBg: string    // background for diff additions
  diffDeleteBg: string // background for diff deletions
}

export interface ThemePadding {
  paddingX: number
  paddingLeft: number
  paddingRight: number
}

export interface ThemeGlyphs {
  prompt: string       // command prompt symbol (❭)
  selector: string     // menu selection pointer (❭)
  bullet: string       // list bullet (•)
  status: string       // status dot (●)
  branch: string       // git branch icon (⌥)
  check: string        // checkmark (✔)
  cross: string        // failure mark (✖)
  arrowRight: string   // right arrow (→)
  arrowDown: string    // down arrow (↓)
  foldClosed: string   // collapsed triangle (▸)
  foldOpen: string     // expanded triangle (▾)
}

export interface ThemeDefinition {
  colors: ThemeColors
  padding: ThemePadding
  glyphs: ThemeGlyphs
}`,
                language: 'typescript',
            },
            {
                id: 'glyphs',
                title: 'symbols',
                description:
                    'tui uses utf-8 symbols for arrows, spinners, and dots. if your terminal only supports ascii, you can set plain text fallbacks in theme.ts:',
                codeSnippet: `// check for utf-8 support or environment override
const isUtf8Supported =
  Boolean(process.env.LANG && !process.env.LANG.includes('ASCII'))

export const DEFAULT_GLYPHS: ThemeGlyphs = isUtf8Supported
  ? {
      prompt: '❭',
      selector: '❭',
      bullet: '•',
      status: '●',
      branch: '⌥',
      check: '✔',
      cross: '✖',
      arrowRight: '→',
      arrowDown: '↓',
      foldClosed: '▸',
      foldOpen: '▾',
    }
  : {
      prompt: '>',
      selector: '>',
      bullet: '*',
      status: 'o',
      branch: 'git:',
      check: '[v]',
      cross: '[x]',
      arrowRight: '->',
      arrowDown: 'v',
      foldClosed: '+',
      foldOpen: '-',
    }`,
                language: 'typescript',
            },
            {
                id: 'customization',
                title: 'customizing',
                description:
                    'because theme.ts is in your project, you can change colors directly or add new ones:',
                codeSnippet: `// Example: using theme tokens in a custom agent header
import React from 'react'
import { Box, Text } from 'ink'
import { THEME } from '@/components/ui/theme'

interface AgentHeaderProps {
  model: string
  tokensUsed: number
  totalCost: number
}

export function AgentHeader({ model, tokensUsed, totalCost }: AgentHeaderProps) {
  return (
    <Box
      borderStyle="round"
      borderColor={THEME.colors.brand}
      paddingX={THEME.padding.paddingX}
      justifyContent="space-between"
    >
      <Box gap={1}>
        <Text color={THEME.colors.brand}>{THEME.glyphs.status}</Text>
        <Text bold color={THEME.colors.text}>Agent Active</Text>
        <Text color={THEME.colors.dim}>({model})</Text>
      </Box>
      <Box gap={2}>
        <Text color={THEME.colors.muted}>{tokensUsed.toLocaleString()} tokens</Text>
        <Text bold color={THEME.colors.success}>
          \${totalCost.toFixed(4)}
        </Text>
      </Box>
    </Box>
  )
}`,
                language: 'tsx',
                points: [
                    'one place for colors: changing a color in theme.ts updates all components.',
                    'typescript checks: typescript warns you if a color name or symbol is missing.',
                    'runtime themes: you can switch themes with an option or environment variable.',
                ],
            },
        ],
    },
    {
        id: 'diff-viewer',
        category: 'components',
        navLabel: 'diff-viewer',
        title: 'DiffViewer',
        badge: 'display',
        description: 'shows git diffs with file names and expandable lines.',
        terminalMode: 'diff-viewer',
        terminalHeight: 'h-80 sm:h-96',
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
            {
                prop: 'diff',
                type: 'string',
                default: 'required',
                desc: 'unified git diff text',
            },
            {
                prop: 'filePath',
                type: 'string',
                default: 'undefined',
                desc: 'file path shown in header',
            },
            {
                prop: 'maxLines',
                type: 'number',
                default: '15',
                desc: 'maximum lines before folding',
            },
            {
                prop: 'isExpanded',
                type: 'boolean',
                default: 'true',
                desc: 'expand or collapse the diff',
            },
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
        title: 'StreamingText',
        badge: 'stream',
        description: 'streams text token by token with a terminal block cursor.',
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
            {
                prop: 'content',
                type: 'string',
                default: 'required',
                desc: 'text content to display',
            },
            {
                prop: 'isStreaming',
                type: 'boolean',
                default: 'false',
                desc: 'shows terminal cursor when true',
            },
            {
                prop: 'color',
                type: 'string',
                default: 'THEME.colors.text',
                desc: 'custom text color',
            },
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
        title: 'CollapsibleReasoning',
        badge: 'container',
        description: 'collapsible block for agent thinking, duration, and token counts.',
        terminalMode: 'collapsible-reasoning',
        terminalHeight: 'h-72 sm:h-80',
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
            {
                prop: 'content',
                type: 'string',
                default: 'required',
                desc: 'thinking text content',
            },
            {
                prop: 'isExpanded',
                type: 'boolean',
                default: 'false',
                desc: 'whether thinking block is open',
            },
            {
                prop: 'isThinking',
                type: 'boolean',
                default: 'false',
                desc: 'shows active thinking spinner',
            },
            {
                prop: 'durationMs',
                type: 'number',
                default: 'undefined',
                desc: 'duration in milliseconds',
            },
            {
                prop: 'tokenCount',
                type: 'number',
                default: 'undefined',
                desc: 'number of tokens used',
            },
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
        title: 'ToolCallCard',
        badge: 'status',
        description: 'card showing tool name, status, duration, and output.',
        terminalMode: 'tool-call-card',
        terminalHeight: 'h-72 sm:h-80',
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
            {
                prop: 'toolName',
                type: 'string',
                default: 'required',
                desc: 'tool name (like bun test or read_file)',
            },
            {
                prop: 'inputSummary',
                type: 'string',
                default: 'undefined',
                desc: 'arguments or target summary',
            },
            {
                prop: 'status',
                type: "'pending' | 'running' | 'completed' | 'failed'",
                default: 'required',
                desc: 'tool run state',
            },
            {
                prop: 'isExpanded',
                type: 'boolean',
                default: 'false',
                desc: 'whether output box is open',
            },
            {
                prop: 'output',
                type: 'string',
                default: 'undefined',
                desc: 'output or error text',
            },
            {
                prop: 'durationMs',
                type: 'number',
                default: 'undefined',
                desc: 'duration in milliseconds',
            },
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
        title: 'TokenGauge',
        badge: 'meter',
        description: 'bar showing context window usage and token limits.',
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
            {
                prop: 'usedTokens',
                type: 'number',
                default: 'required',
                desc: 'tokens used so far',
            },
            {
                prop: 'totalTokens',
                type: 'number',
                default: 'required',
                desc: 'total token limit',
            },
            { prop: 'width', type: 'number', default: '20', desc: 'bar width in characters' },
            {
                prop: 'label',
                type: 'string',
                default: "'Context'",
                desc: 'label shown before the bar',
            },
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
        title: 'Pill',
        badge: 'chip',
        description: 'small badge for tags, status, and metadata.',
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
            {
                prop: 'label',
                type: 'string',
                default: 'required',
                desc: 'badge label text',
            },
            {
                prop: 'color',
                type: 'string',
                default: 'THEME.colors.text',
                desc: 'text color',
            },
            {
                prop: 'backgroundColor',
                type: 'string',
                default: 'THEME.colors.border',
                desc: 'background color',
            },
            {
                prop: 'dimColor',
                type: 'boolean',
                default: 'false',
                desc: 'uses dim text when true',
            },
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
        title: 'Spinner',
        badge: 'feedback',
        description:
            'animated terminal loading spinner with classic braille dots, dot-matrix waves, pulses, equalizer bars, and snake variants.',
        terminalMode: 'spinner',
        installCmd: 'npx @trydecember/tui add spinner',
        codeSnippet: `import { Spinner } from '@/components/tui/spinner'
import { Box, render } from 'ink'
import React from 'react'

export function App() {
  return (
    <Box padding={1} flexDirection="column" gap={1}>
      {/* Classic Braille dots */}
      <Spinner type="dots" label="analyzing dependencies..." />

      {/* Inline dot-matrix wave */}
      <Spinner type="matrix-wave" label="indexing workspace..." />

      {/* Symmetrical matrix pulse */}
      <Spinner type="matrix-pulse" label="evaluating reasoning graph..." />

      {/* Equalizer bars */}
      <Spinner type="bars" label="streaming model tokens..." />

      {/* Slithering snake */}
      <Spinner type="snake" label="running tests..." />
    </Box>
  )
}

render(<App />)`,
        props: [
            {
                prop: 'type',
                type: "'dots' | 'matrix-wave' | 'matrix-pulse' | 'braille-matrix' | 'bars' | 'snake' | 'shuttle'",
                default: "'dots'",
                desc: 'spinner animation variant',
            },
            {
                prop: 'label',
                type: 'string',
                default: 'undefined',
                desc: 'optional status text displayed beside the spinner',
            },
            {
                prop: 'color',
                type: 'string',
                default: 'THEME.colors.brand',
                desc: 'active spinner / dot color',
            },
            {
                prop: 'labelColor',
                type: 'string',
                default: 'THEME.colors.muted',
                desc: 'label text color',
            },
            {
                prop: 'inactiveColor',
                type: 'string',
                default: 'THEME.colors.border',
                desc: 'inactive/background dot color for matrix variants',
            },
            {
                prop: 'length',
                type: 'number',
                default: '5',
                desc: 'number of dots for matrix-wave and snake variants',
            },
            {
                prop: 'speed',
                type: 'number',
                default: '1',
                desc: 'animation speed multiplier',
            },
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
        title: 'TextArea',
        badge: 'input',
        description: 'multiline text input with cursor movement and history.',
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
            {
                prop: 'value',
                type: 'string',
                default: 'required',
                desc: 'current text value',
            },
            {
                prop: 'onChange',
                type: '(value: string) => void',
                default: 'required',
                desc: 'called when text changes',
            },
            {
                prop: 'onSubmit',
                type: '(value: string) => void',
                default: 'required',
                desc: 'called when enter is pressed',
            },
            {
                prop: 'placeholder',
                type: 'string',
                default: "''",
                desc: 'text shown when empty',
            },
            {
                prop: 'focus',
                type: 'boolean',
                default: 'true',
                desc: 'whether input is focused',
            },
            {
                prop: 'onHistoryUp',
                type: '() => void',
                default: 'undefined',
                desc: 'called when up arrow is pressed at the first line',
            },
            {
                prop: 'onHistoryDown',
                type: '() => void',
                default: 'undefined',
                desc: 'called when down arrow is pressed at the last line',
            },
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
        title: 'Header',
        badge: 'layout',
        description: 'header banner showing project title, version, and tips.',
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
            { prop: 'title', type: 'string', default: "'Agent CLI'", desc: 'title text' },
            {
                prop: 'version',
                type: 'string',
                default: "'0.1.0'",
                desc: 'version number',
            },
            {
                prop: 'subtitle',
                type: 'string',
                default: 'undefined',
                desc: 'optional subtitle text',
            },
            {
                prop: 'workspaceRoot',
                type: 'string',
                default: 'process.cwd()',
                desc: 'folder to find git branch',
            },
            {
                prop: 'tips',
                type: 'string[]',
                default: 'starter tips',
                desc: 'list of tips to display',
            },
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
        title: 'Mermaid',
        badge: 'diagram',
        description: 'renders flowcharts and diagrams in unicode.',
        terminalMode: 'mermaid',
        terminalHeight: 'h-80 sm:h-96',
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
            {
                prop: 'code',
                type: 'string',
                default: 'required',
                desc: 'mermaid diagram code',
            },
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
        title: 'Markdown',
        badge: 'content',
        description: 'renders markdown with formatting, tables, lists, and code blocks.',
        terminalMode: 'markdown',
        terminalHeight: 'h-72 sm:h-80',
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
            {
                prop: 'children',
                type: 'string',
                default: 'required',
                desc: 'markdown text to render',
            },
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
        title: 'UserMessage',
        badge: 'stream',
        description: 'shows user prompt messages in the terminal.',
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
            {
                prop: 'message',
                type: 'string',
                default: 'required',
                desc: 'message text to display',
            },
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
        title: 'ErrorMessage',
        badge: 'status',
        description: 'shows error messages with optional hints and causes.',
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
            {
                prop: 'message',
                type: 'string',
                default: 'required',
                desc: 'error message text',
            },
            {
                prop: 'cause',
                type: 'string',
                default: 'undefined',
                desc: 'optional cause of the error',
            },
            {
                prop: 'hint',
                type: 'string',
                default: 'undefined',
                desc: 'optional tip or link to fix the issue',
            },
            {
                prop: 'hasTopMargin',
                type: 'boolean',
                default: 'false',
                desc: 'adds space above the error',
            },
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
        title: 'SelectMenu',
        badge: 'menu',
        description: 'list menu for selecting an item with arrow keys.',
        terminalMode: 'select-menu',
        terminalHeight: 'h-72 sm:h-80',
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
            {
                prop: 'items',
                type: 'SelectMenuItem[]',
                default: 'required',
                desc: 'list of choices to pick from',
            },
            {
                prop: 'onSelect',
                type: '(item: SelectMenuItem) => void',
                default: 'required',
                desc: 'called when an item is selected',
            },
            {
                prop: 'onCancel',
                type: '() => void',
                default: 'undefined',
                desc: 'called when escape is pressed',
            },
            {
                prop: 'title',
                type: 'string',
                default: 'undefined',
                desc: 'optional title above the menu',
            },
            {
                prop: 'windowSize',
                type: 'number',
                default: '8',
                desc: 'max rows visible at once',
            },
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
        title: 'CommandMenu',
        badge: 'palette',
        description: 'slash command menu with filtering and key navigation.',
        terminalMode: 'command-menu',
        terminalHeight: 'h-72 sm:h-80',
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
            {
                prop: 'query',
                type: 'string',
                default: "''",
                desc: 'search text to filter commands',
            },
            {
                prop: 'commands',
                type: 'CommandItem[]',
                default: 'DEFAULT_COMMANDS',
                desc: 'list of available commands',
            },
            {
                prop: 'onSelect',
                type: '(command: CommandItem) => void',
                default: 'required',
                desc: 'called when a command is chosen',
            },
            {
                prop: 'onCancel',
                type: '() => void',
                default: 'undefined',
                desc: 'called when escape is pressed',
            },
            {
                prop: 'windowSize',
                type: 'number',
                default: '5',
                desc: 'max rows visible at once',
            },
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
        title: 'ShortcutsMenu',
        badge: 'dialog',
        description: 'menu showing available keyboard shortcuts.',
        terminalMode: 'shortcuts-menu',
        terminalHeight: 'h-72 sm:h-80',
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
            {
                prop: 'shortcuts',
                type: 'ShortcutItem[]',
                default: 'DEFAULT_SHORTCUTS',
                desc: 'list of shortcut keys and descriptions',
            },
            {
                prop: 'onClose',
                type: '() => void',
                default: 'required',
                desc: 'called when closing the menu',
            },
            {
                prop: 'windowSize',
                type: 'number',
                default: '10',
                desc: 'max rows visible at once',
            },
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
        title: 'PlanApproveMenu',
        badge: 'action',
        description: 'menu for reviewing and approving agent plans.',
        terminalMode: 'plan-approve-menu',
        terminalHeight: 'h-72 sm:h-80',
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
            {
                prop: 'onSelect',
                type: "(action: 'approve' | 'refine' | 'view' | 'reject') => void",
                default: 'required',
                desc: 'called when an action is selected',
            },
            {
                prop: 'planSummary',
                type: 'string',
                default: 'undefined',
                desc: 'summary text of the plan',
            },
            {
                prop: 'options',
                type: 'PlanApproveOption[]',
                default: 'DEFAULT_PLAN_OPTIONS',
                desc: 'list of actions to choose from',
            },
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
        title: 'InputBar',
        badge: 'composite',
        description: 'prompt input bar with slash commands and status info.',
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
            {
                prop: 'onSubmit',
                type: '(text: string) => void',
                default: 'required',
                desc: 'called when enter is pressed',
            },
            {
                prop: 'placeholder',
                type: 'string',
                default: 'starter prompt',
                desc: 'text shown when input is empty',
            },
            {
                prop: 'commands',
                type: 'CommandItem[]',
                default: 'DEFAULT_COMMANDS',
                desc: 'list of slash commands',
            },
            {
                prop: 'shortcuts',
                type: 'ShortcutItem[]',
                default: 'DEFAULT_SHORTCUTS',
                desc: 'list of keyboard shortcuts',
            },
            {
                prop: 'fileSuggestions',
                type: 'string[]',
                default: '[]',
                desc: 'file list for suggestions',
            },
            {
                prop: 'statusLeft',
                type: 'React.ReactNode',
                default: "'Agent ready'",
                desc: 'left side status text or items',
            },
            {
                prop: 'statusRight',
                type: 'React.ReactNode',
                default: "'? for shortcuts'",
                desc: 'right side status text or items',
            },
            {
                prop: 'activeToast',
                type: '{ message: string; variant?: string }',
                default: 'null',
                desc: 'optional short message popup',
            },
            {
                prop: 'disabled',
                type: 'boolean',
                default: 'false',
                desc: 'disables typing when true',
            },
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
        title: 'Card',
        badge: 'primitive',
        description: 'box container with header, content, and footer.',
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
            {
                prop: 'borderStyle',
                type: "'round' | 'single' | 'double' | 'bold'",
                default: "'round'",
                desc: 'border style type',
            },
            {
                prop: 'borderColor',
                type: 'string',
                default: 'THEME.colors.border',
                desc: 'border color',
            },
            {
                prop: 'paddingX',
                type: 'number',
                default: '1',
                desc: 'left and right inner spacing',
            },
            {
                prop: 'paddingY',
                type: 'number',
                default: '0',
                desc: 'top and bottom inner spacing',
            },
            {
                prop: 'width',
                type: 'number | string',
                default: 'undefined',
                desc: 'width of the card',
            },
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
        title: 'Button',
        badge: 'primitive',
        description: 'button with focus states and different styles.',
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
      <Button variant="bracket">Retry</Button>
      <Button variant="link">Documentation</Button>
    </Box>
  )
}

render(<App />)`,
        props: [
            {
                prop: 'variant',
                type: "'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'bracket'",
                default: "'default'",
                desc: 'button style type',
            },
            {
                prop: 'size',
                type: "'sm' | 'default' | 'lg'",
                default: "'default'",
                desc: 'button size',
            },
            {
                prop: 'isFocused',
                type: 'boolean',
                default: 'false',
                desc: 'whether the button is focused',
            },
            {
                prop: 'disabled',
                type: 'boolean',
                default: 'false',
                desc: 'disables clicking and dims the button',
            },
            {
                prop: 'onSelect',
                type: '() => void',
                default: 'undefined',
                desc: 'called when enter is pressed',
            },
            {
                prop: 'prefix',
                type: 'React.ReactNode',
                default: 'undefined',
                desc: 'symbol or text before the label',
            },
            {
                prop: 'suffix',
                type: 'React.ReactNode',
                default: 'undefined',
                desc: 'symbol or text after the label',
            },
            {
                prop: 'shortcut',
                type: 'string',
                default: 'undefined',
                desc: 'single key shortcut to trigger the button',
            },
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
        title: 'Tabs',
        badge: 'primitive',
        description: 'tab navigation for switching between views.',
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
            {
                prop: 'defaultValue',
                type: 'string',
                default: 'undefined',
                desc: 'starting active tab',
            },
            {
                prop: 'value',
                type: 'string',
                default: 'undefined',
                desc: 'current active tab',
            },
            {
                prop: 'onValueChange',
                type: '(value: string) => void',
                default: 'undefined',
                desc: 'called when active tab changes',
            },
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
        title: 'Dialog',
        badge: 'primitive',
        description: 'dialog box asking for confirmation.',
        terminalMode: 'dialog',
        terminalHeight: 'h-72 sm:h-80',
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
            {
                prop: 'isOpen',
                type: 'boolean',
                default: 'false',
                desc: 'whether the dialog is open',
            },
            { prop: 'title', type: 'string', default: 'undefined', desc: 'dialog title text' },
            {
                prop: 'description',
                type: 'string',
                default: 'undefined',
                desc: 'explanation text',
            },
            {
                prop: 'confirmText',
                type: 'string',
                default: "'Confirm'",
                desc: 'confirm button text',
            },
            {
                prop: 'cancelText',
                type: 'string',
                default: "'Cancel'",
                desc: 'cancel button text',
            },
            {
                prop: 'onConfirm',
                type: '() => void',
                default: 'undefined',
                desc: 'called when confirmed',
            },
            {
                prop: 'onCancel',
                type: '() => void',
                default: 'undefined',
                desc: 'called when cancelled',
            },
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
        title: 'Progress',
        badge: 'primitive',
        description: 'progress bar showing task completion percentage.',
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
            {
                prop: 'value',
                type: 'number',
                default: '0',
                desc: 'progress value from 0 to 100',
            },
            {
                prop: 'width',
                type: 'number',
                default: '20',
                desc: 'bar width in characters',
            },
            {
                prop: 'showPercentage',
                type: 'boolean',
                default: 'true',
                desc: 'shows percentage number when true',
            },
            {
                prop: 'color',
                type: 'string',
                default: 'THEME.colors.brand',
                desc: 'color for completed part',
            },
            {
                prop: 'emptyColor',
                type: 'string',
                default: 'THEME.colors.muted',
                desc: 'color for remaining part',
            },
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
        title: 'Checkbox',
        badge: 'primitive',
        description: 'checkbox for toggling options on or off.',
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
            {
                prop: 'checked',
                type: 'boolean',
                default: 'false',
                desc: 'whether checked',
            },
            {
                prop: 'label',
                type: 'string',
                default: 'undefined',
                desc: 'label text',
            },
            {
                prop: 'isFocused',
                type: 'boolean',
                default: 'false',
                desc: 'whether focused',
            },
            {
                prop: 'disabled',
                type: 'boolean',
                default: 'false',
                desc: 'disables toggling when true',
            },
            {
                prop: 'onChange',
                type: '(checked: boolean) => void',
                default: 'undefined',
                desc: 'called when toggled',
            },
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
        title: 'RadioGroup',
        badge: 'primitive',
        description: 'radio list where only one option can be selected.',
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
            {
                prop: 'value',
                type: 'string',
                default: 'required',
                desc: 'current selected value',
            },
            {
                prop: 'options',
                type: 'RadioGroupOption[]',
                default: 'required',
                desc: 'list of options to choose from',
            },
            {
                prop: 'onChange',
                type: '(value: string) => void',
                default: 'required',
                desc: 'called when an option is chosen',
            },
            {
                prop: 'isFocused',
                type: 'boolean',
                default: 'true',
                desc: 'whether focused',
            },
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
        title: 'Skeleton',
        badge: 'primitive',
        description: 'placeholder blocks shown while content loads.',
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
            {
                prop: 'width',
                type: 'number | string',
                default: '16',
                desc: 'width in characters',
            },
            { prop: 'height', type: 'number', default: '1', desc: 'height in lines' },
            { prop: 'char', type: 'string', default: "'░'", desc: 'character to display' },
            {
                prop: 'color',
                type: 'string',
                default: 'THEME.colors.muted',
                desc: 'block color',
            },
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
        title: 'Toast',
        badge: 'primitive',
        description: 'short notification message for quick feedback.',
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
            {
                prop: 'message',
                type: 'string',
                default: 'required',
                desc: 'message text',
            },
            {
                prop: 'title',
                type: 'string',
                default: 'undefined',
                desc: 'optional title text',
            },
            {
                prop: 'variant',
                type: "'info' | 'success' | 'warning' | 'error'",
                default: "'info'",
                desc: 'style variant',
            },
            {
                prop: 'duration',
                type: 'number',
                default: 'undefined',
                desc: 'time in ms before hiding',
            },
            {
                prop: 'onDismiss',
                type: '() => void',
                default: 'undefined',
                desc: 'called when dismissed',
            },
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
        title: 'Table',
        badge: 'primitive',
        description: 'table with columns and rows for tabular data.',
        terminalMode: 'table',
        terminalHeight: 'h-72 sm:h-80',
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
            {
                prop: 'children',
                type: 'React.ReactNode',
                default: 'required',
                desc: 'table header and body content',
            },
            {
                prop: 'width',
                type: 'number',
                default: 'undefined',
                desc: 'column or cell width',
            },
            {
                prop: 'align',
                type: "'left' | 'center' | 'right'",
                default: "'left'",
                desc: 'text alignment',
            },
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
        id: 'switch',
        category: 'components',
        navLabel: 'switch',
        title: 'Switch',
        badge: 'primitive',
        description: 'toggle switch for turning a setting on or off.',
        terminalMode: 'switch',
        installCmd: 'npx @trydecember/tui add switch',
        codeSnippet: `import { Switch } from '@/components/tui/switch'
import { Box, render } from 'ink'
import React, { useState } from 'react'

export function App() {
  const [autoRun, setAutoRun] = useState(true)
  const [verbose, setVerbose] = useState(false)

  return (
    <Box flexDirection="column" padding={1} gap={1}>
      <Switch
        label="Auto-run tool calls"
        description="immediate execution"
        checked={autoRun}
        isFocused
        onChange={setAutoRun}
      />
      <Switch
        label="Verbose telemetry"
        variant="badge"
        checked={verbose}
        onChange={setVerbose}
      />
    </Box>
  )
}

render(<App />)`,
        props: [
            {
                prop: 'checked',
                type: 'boolean',
                default: 'false',
                desc: 'whether switched on',
            },
            {
                prop: 'onChange',
                type: '(checked: boolean) => void',
                default: 'undefined',
                desc: 'called when state changes',
            },
            {
                prop: 'label',
                type: 'string',
                default: 'undefined',
                desc: 'label text',
            },
            {
                prop: 'description',
                type: 'string',
                default: 'undefined',
                desc: 'secondary hint text',
            },
            {
                prop: 'variant',
                type: "'glyph' | 'badge'",
                default: "'glyph'",
                desc: "style type ('glyph' or 'badge')",
            },
            {
                prop: 'isFocused',
                type: 'boolean',
                default: 'false',
                desc: 'whether focused',
            },
            {
                prop: 'disabled',
                type: 'boolean',
                default: 'false',
                desc: 'disables toggling and dims text',
            },
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

export const DOC_ITEMS: DocItem[] = BASE_DOC_ITEMS.map((item) => {
    if (item.category === 'components') {
        const variations = item.variations || COMPONENT_VARIATIONS[item.id]
        if (variations && variations.length > 0) {
            const baseWithoutVariations = item.toc.filter(
                (t) =>
                    t.id !== 'examples' &&
                    !t.id.startsWith('example-') &&
                    t.id !== 'variations' &&
                    !t.id.startsWith('variation-')
            )
            const usageIdx = baseWithoutVariations.findIndex((t) => t.id === 'usage')
            const variationEntries = [
                { id: 'variations', label: 'variations' },
                ...variations.map((v) => ({
                    id: `variation-${v.id}`,
                    label: v.title.toLowerCase(),
                })),
            ]
            let toc = baseWithoutVariations
            if (usageIdx !== -1) {
                toc = [
                    ...baseWithoutVariations.slice(0, usageIdx + 1),
                    ...variationEntries,
                    ...baseWithoutVariations.slice(usageIdx + 1),
                ]
            } else {
                toc = [...baseWithoutVariations, ...variationEntries]
            }
            return {
                ...item,
                variations,
                toc,
            }
        }
    }
    return item
})
