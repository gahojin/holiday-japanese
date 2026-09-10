import { EPOCH_DAY_MAX, holidays, names } from './holidays.js'

const MINUTES_MS = 1000 * 60

// 基準日
const DATE_MS = MINUTES_MS * 60 * 24

// 祝日データは、基準日からの日数と名称インデックスの順で格納されている
const HOLIDAYS_LENGTH = holidays.length
const HOLIDAYS_HIGH = (HOLIDAYS_LENGTH >> 1) - 1

type Holiday = {
  date: Date
  nameJa: string
  nameEn: string
}

const fromEpochDay = (day: number, offset: number) => new Date(day * DATE_MS + offset)

const toEpochDay = (date: Date) => {
  const offsetMillis = date.getTimezoneOffset() * MINUTES_MS
  return Math.floor((date.getTime() - offsetMillis) / DATE_MS)
}

const decodeBits = () => {
  const result = new Uint8Array((EPOCH_DAY_MAX >> 3) + 1)
  for (let i = 0; i < holidays.length; i += 2) {
    const day = holidays[i]
    result[day >> 3] |= 1 << (day & 7)
  }
  return result
}

// ビット演算により祝日かの判定を行う
const holidayBits = decodeBits()

const isHoliday = (date: Date): boolean => {
  const day = toEpochDay(date)
  return (holidayBits[day >> 3] & (1 << (day & 7))) !== 0
}

// 2分探索により祝日/休日を抽出する
const between = (start: Date, end: Date): Holiday[] => {
  const startDay = toEpochDay(start)
  const endDay = toEpochDay(end)
  const offset = start.getTimezoneOffset() * MINUTES_MS
  const result: Holiday[] = []

  let low = 0
  let high = HOLIDAYS_HIGH
  let startIndex = high + 1

  // 開始日以降のデータ位置抽出
  while (low <= high) {
    const mid = (low + high) >> 1
    const currentDay = holidays[mid << 1]
    if (currentDay < startDay) {
      low = mid + 1
    } else {
      startIndex = mid
      high = mid - 1
    }
  }

  for (let i = startIndex << 1; i < HOLIDAYS_LENGTH; i += 2) {
    const date = holidays[i]
    if (date > endDay) {
      break
    }
    const n = holidays[i + 1]
    result.push({
      date: fromEpochDay(date, offset),
      nameJa: names[n],
      nameEn: names[n + 1],
    })
  }

  return result
}

export type { Holiday }
export { between, isHoliday }
