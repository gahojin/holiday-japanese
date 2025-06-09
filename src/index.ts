import { holidays, names } from './holidays'

// 基準日
const EPOCH_MILLISECONDS = Date.UTC(1970, 0, 1)

const DATE_MILLISECONDS = 1000 * 60 * 60 * 24

// 祝日データは、基準日からの日数と名称インデックスの順で格納されている
const HOLIDAYS_LENGTH = holidays.length
const HOLIDAYS_HIGH = (HOLIDAYS_LENGTH >> 1) - 1

type Holiday = {
  date: Date
  nameJa: string
  nameEn: string
}

const toEpochDay = (date: Date): number => {
  return Math.floor((date.getTime() - EPOCH_MILLISECONDS) / DATE_MILLISECONDS)
}

const fromEpochDay = (day: number): Date => {
  const r = new Date(1970, 0, 1)
  r.setDate(r.getDate() + day)
  return r
}

// 2分探索により祝日を抽出する

const isHoliday = (date: Date): boolean => {
  const epochDay = toEpochDay(date)

  let low = 0
  let high = HOLIDAYS_HIGH
  let foundIndex = -1

  while (low <= high) {
    const mid = (low + high) >> 1
    const currentDay = holidays[mid << 1]
    if (currentDay === epochDay) {
      // 見つかった
      foundIndex = mid
      break
    }
    if (currentDay < epochDay) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return foundIndex !== -1
}

const between = (start: Date, end: Date): Holiday[] => {
  const epochStartDay = toEpochDay(start)
  const epochEndDay = toEpochDay(end)

  let low = 0
  let high = HOLIDAYS_HIGH
  let startIndex = 0

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
  do {
    const date = holidays[i]
    const nameIndex = holidays[i + 1]
    if (date > epochEndDay) {
      break
    }
    const name = names[nameIndex]
    result.push({
      date: fromEpochDay(date),
      nameJa: name[0],
      nameEn: name[1],
    })
    i += 2
  } while (i < HOLIDAYS_LENGTH)

  return result
}

export { between, isHoliday }
export type { Holiday }
