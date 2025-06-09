import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

type HolidayName = [string, string]
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
const holidayNames: HolidayName[] = []
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
    holidayNames.push([nameJa, nameEn])
    nameToIndexMap.set(key, index)
  }

  const epochDay = toEpochDay(date)
  tmpHolidaysData.push([epochDay, index])
}

// 日付順にする
tmpHolidaysData.sort((a, b) => a[0] - b[0])

// 2次配列を1次配列のバイナリにエンコード (通し日数(2バイト) + 名称インデックス(1バイト)
const buffer = Buffer.alloc(tmpHolidaysData.length * 3)
let offset = 0
for (const [day, index] of tmpHolidaysData) {
  buffer.writeUInt16LE(day, offset)
  offset += 2
  buffer.writeUInt8(index, offset)
  offset++
}

// 2次配列を1次配列に変換 (バイナリ化テスト用)
const rawHolidaysData: number[] = []
for (const [day, index] of tmpHolidaysData) {
  rawHolidaysData.push(day)
  rawHolidaysData.push(index)
}

const code = `// Generated from holidays_detailed.yml
import { decodeHolidays } from './utils'

type HolidayName = [string, string]

const names: HolidayName[] = ${JSON.stringify(holidayNames)}
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
