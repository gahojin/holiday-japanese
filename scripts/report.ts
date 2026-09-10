import fs from 'node:fs'
import path from 'node:path'

// JSON ファイルの読み込み
const jsonPath = path.resolve('bench-result.json')
if (!fs.existsSync(jsonPath)) {
  console.error('エラー: bench-result.json が見つかりません。')
  process.exit(1)
}

const rawData = fs.readFileSync(jsonPath, 'utf8')
const data = JSON.parse(rawData)

let markdownOutput = ''

// Vitest のテストファイル結果を処理
for (const testFile of data.testResults || []) {
  for (const result of testFile.assertionResults || []) {
    const benchmarks = result.benchmarks
    if (!benchmarks) {
      continue
    }

    const title = result.title.replace('benchmark test: ', '').replaceAll('"', '')

    markdownOutput += `\n**${title}**\n\n`
    markdownOutput += '| name | hz | mean (ms) | p99 (ms) | rme |\n'
    markdownOutput += '|---|---|---|---|---|\n'

    for (const bench of benchmarks) {
      const tasks = bench.tasks ?? []
      for (const task of tasks) {
        const name = task.name
        const throughput = task.throughput ?? {}
        const latency = task.latency ?? {}

        const hz = Number(throughput.mean).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        const mean = Number(latency.mean).toFixed(4)
        const p99 = Number(latency.p99).toFixed(4)
        const rme = `±${Number(latency.rme).toFixed(2)}%`

        markdownOutput += `| ${name} | ${hz} | ${mean} | ${p99} | ${rme} |\n`
      }
    }
  }
}

console.log(markdownOutput)
