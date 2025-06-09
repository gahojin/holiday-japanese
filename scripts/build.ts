import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

// 基準日
const EPOCH_MILLISECONDS = Date.UTC(1970, 0, 1)

const DATE_MILLISECONDS = 1000 * 60 * 60 * 24

const toEpochDay = (date: string): number => {
  const [year, month, day] = date.split('-').map(Number)
  const targetDate = Date.UTC(year, month - 1, day)

  const diffTime = targetDate - EPOCH_MILLISECONDS
  const diffDays = Math.floor(diffTime / DATE_MILLISECONDS)
  return diffDays
}

const text = fs.readFileSync(path.join(import.meta.dirname, '../dataset/holidays_detailed.yml'), 'utf-8')
const dataset: { [date: string]: { date: string; name: string; name_en: string } } = parse(text.toString())

// 祝日名を集約する
const uniqueNames = new Map<string, string>()
for (const info of Object.values(dataset)) {
  const nameJa = info.name
  const nameEn = info.name_en
  if (nameJa && nameEn) {
    uniqueNames.set(nameJa, nameEn)
  }
}
// 祝日名の並び順を一定にする
const holidayNames = Array.from(uniqueNames.entries()).sort((a, b) => {
  return a[0].localeCompare(b[0], 'ja', { sensitivity: 'base' })
})

const nameToIndexMap = new Map<string, number>()
holidayNames.forEach(([nameJa], index) => {
  nameToIndexMap.set(nameJa, index)
})

const tmpHolidaysData: [number, number][] = []
for (const info of Object.values(dataset)) {
  const date = info.date
  const nameJa = info.name
  if (!date || !nameJa) {
    console.warn(`データ欠損があります. ${JSON.stringify(info)}`)
    continue
  }
  const epochDay = toEpochDay(date)
  const index = nameToIndexMap.get(nameJa)
  if (index === undefined) {
    console.warn(`名前とインデックスの紐付けが不完全 ${JSON.stringify(info)}`)
    continue
  }

  tmpHolidaysData.push([epochDay, index])
}
// 日付順にする
tmpHolidaysData.sort((a, b) => a[0] - b[0])
// 2次配列を1次配列に変換
const holidaysData: number[] = []
for (const [day, index] of tmpHolidaysData) {
  holidaysData.push(day)
  holidaysData.push(index)
}

const code = ['// Generated from holidays_detailed.yml']
code.push(`type HolidayName = [string, string]

const names: HolidayName[] = ${JSON.stringify(holidayNames)}

const holidays: number[] = ${JSON.stringify(holidaysData)}

export { names, holidays }
`)

fs.writeFileSync(path.join(import.meta.dirname, '../src/holidays.ts'), code.join('\n'))
