import { holidays } from '@/holidays'

const dateToNumber = (date: Date): number => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return year * 10000 + month * 100 + day
}

const isHoliday = (date: Date): boolean => {
  const index = dateToNumber(date)
  return holidays.has(index)
}

export { isHoliday }
