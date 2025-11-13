import { holidays, names } from './holidays'

const MINUTES_MILLISECONDS = 1000 * 60

// 基準日
const DATE_MILLISECONDS = MINUTES_MILLISECONDS * 60 * 24

// 祝日データは、基準日からの日数と名称インデックスの順で格納されている
const HOLIDAYS_LENGTH = holidays.length
const HOLIDAYS_HIGH = (HOLIDAYS_LENGTH >> 1) - 1

type Holiday = {
  date: Date
  nameJa: string
  nameEn: string
}

const toEpochDay = (date: Date): number => {
  const offsetMillis = date.getTimezoneOffset() * MINUTES_MILLISECONDS
  return Math.floor((date.getTime() - offsetMillis) / DATE_MILLISECONDS)
}

const fromEpochDay = (day: number, timezoneOffset: number): Date => {
  return new Date(day * DATE_MILLISECONDS + timezoneOffset)
}

// ハッシュテーブルにより祝日かの判定を行う
const holidaySet = new Set(holidays.filter((_, i) => i % 2 === 0))

const isHoliday = (date: Date): boolean => {
  const epochDay = toEpochDay(date)
  return holidaySet.has(epochDay)
}

// 2分探索により祝日を抽出する

const between = (start: Date, end: Date): Holiday[] => {
  const epochStartDay = toEpochDay(start)
  const epochEndDay = toEpochDay(end)
  const timezoneOffset = start.getTimezoneOffset() * MINUTES_MILLISECONDS

  let low = 0
  let high = HOLIDAYS_HIGH
  let startIndex = high + 1

  // 開始日以降のデータ位置抽出
  while (low <= high) {
    const mid = (low + high) >> 1
    const currentDay = holidays[mid << 1]
    if (currentDay < epochStartDay) {
      low = mid + 1
    } else {
      startIndex = mid
      high = mid - 1
    }
  }

  const result: Holiday[] = []
  let i = startIndex << 1
  while (i < HOLIDAYS_LENGTH) {
    const date = holidays[i]
    const nameIndex = holidays[i + 1]
    if (date > epochEndDay) {
      break
    }
    result.push({
      date: fromEpochDay(date, timezoneOffset),
      nameJa: names[nameIndex],
      nameEn: names[nameIndex + 1],
    })
    i += 2
  }

  return result
}

export { between, isHoliday }
export type { Holiday }
