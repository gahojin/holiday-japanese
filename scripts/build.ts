import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

const text = fs.readFileSync(path.join(import.meta.dirname, '../dataset/holidays.yml'), 'utf-8')
const dataset: Record<string, string> = parse(text.toString())

const code = ['// Generated from holidays.yml']
code.push(
  `const d: Set<number> = new Set([${Object.keys(dataset)
    .map((d) => d.replaceAll('-', ''))
    .join(',')}])`,
)
code.push('export { d as holidays }')

fs.writeFileSync(path.join(import.meta.dirname, '../src/holidays.ts'), code.join('\n'))
