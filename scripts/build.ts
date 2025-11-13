import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

type HolidayDate = [number, number]

const DATE_MILLISECONDS = 1000 * 60 * 60 * 24

const toEpochDay = (date: string): number => {
  const [year, month, day] = date.split('-').map(Number)
  const targetDate = Date.UTC(year, month - 1, day)

  return Math.floor(targetDate / DATE_MILLISECONDS)
}

const text = fs.readFileSync(path.join(import.meta.dirname, '../dataset/holidays_detailed.yml'), 'utf-8')
const dataset: { [date: string]: { date: string; name: string; name_en: string } } = parse(text.toString())

// 祝日名を集約する
const tmpHolidaysData: HolidayDate[] = []
const nameToIndexMap = new Map<string, number>()
const holidayNames: string[] = []
for (const info of Object.values(dataset)) {
  const date = info.date
  const nameJa = info.name
  const nameEn = info.name_en

  if (!date || !nameJa || !nameEn) {
    console.warn(`データ欠損があります. ${JSON.stringify(info)}`)
    continue
  }

  // 日本語名と英語名両方で名寄せする (休日に複数の英語表記があるため)
  const key = `${nameJa}##${nameEn}`
  let index = nameToIndexMap.get(key)
  if (index === undefined) {
    index = holidayNames.length
    holidayNames.push(nameJa, nameEn)
    nameToIndexMap.set(key, index)
  }

  const epochDay = toEpochDay(date)
  tmpHolidaysData.push([epochDay, index])
}

// 祝日インデックス最大値チェック
if (holidayNames.length > 255) {
  console.warn(`祝日インデックス最大値オーバー. ${holidayNames.length}`)
  process.exit(1)
}

// 日付順にする
tmpHolidaysData.sort((a, b) => a[0] - b[0])

// 2次配列を1次配列のバイナリにエンコード (通し日数(差分 1バイト) + 名称インデックス(1バイト)
const buffer = Buffer.alloc(tmpHolidaysData.length << 1)
let offset = 0
let prevDay = 0
for (const [day, index] of tmpHolidaysData) {
  const diff = day - prevDay
  prevDay = day
  buffer.writeUInt8(diff, offset++)
  buffer.writeUInt8(index, offset++)
}

// 2次配列を1次配列に変換 (バイナリ化テスト用)
const rawHolidaysData: number[] = []
for (const [day, index] of tmpHolidaysData) {
  rawHolidaysData.push(day)
  rawHolidaysData.push(index)
}

const code = `// Generated from holidays_detailed.yml
import { decodeHolidays } from './utils'

const names: string[] = ${JSON.stringify(holidayNames)}
const holidays: number[] = decodeHolidays('${buffer.toString('base64')}')

export { names, holidays }
`
fs.writeFileSync(path.join(import.meta.dirname, '../src/holidays.ts'), code)

const testCode = `// Generated from holidays_detailed.yml

const encodedHolidays: string = '${buffer.toString('base64')}'
const rawHolidays: number[] = ${JSON.stringify(rawHolidaysData)}

export { encodedHolidays, rawHolidays }
`

fs.writeFileSync(path.join(import.meta.dirname, '../src/holidays_testdata.ts'), testCode)
