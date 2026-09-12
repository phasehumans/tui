import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { REGISTRY_ITEMS } from '../src/registry'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')
const OUT_DIR = path.resolve(ROOT_DIR, '../../apps/docs/public/r')

function buildRegistry() {
    if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true })
    }

    const indexItems = []

    for (const item of REGISTRY_ITEMS) {
        const enrichedFiles = item.files.map((file) => {
            const filePath = path.join(SRC_DIR, file.path)
            const content = fs.readFileSync(filePath, 'utf8')
            return {
                name: path.basename(file.path),
                path: file.path,
                target: file.target,
                content,
                type: file.type,
            }
        })

        const payload = {
            $schema: 'https://tui.trydecember.com/schema.json',
            name: item.name,
            type: item.type,
            title: item.title,
            description: item.description,
            dependencies: item.dependencies ?? [],
            devDependencies: item.devDependencies ?? [],
            registryDependencies: item.registryDependencies ?? [],
            files: enrichedFiles,
        }

        const outFile = path.join(OUT_DIR, `${item.name}.json`)
        fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8')
        console.log(`✓ Built registry item: ${item.name} -> ${outFile}`)

        indexItems.push({
            name: item.name,
            type: item.type,
            title: item.title,
            description: item.description,
            dependencies: item.dependencies ?? [],
            registryDependencies: item.registryDependencies ?? [],
        })
    }

    const indexFile = path.join(OUT_DIR, 'index.json')
    fs.writeFileSync(indexFile, JSON.stringify(indexItems, null, 2), 'utf8')
    console.log(`✓ Built registry index: ${indexItems.length} items -> ${indexFile}`)
}

buildRegistry()
