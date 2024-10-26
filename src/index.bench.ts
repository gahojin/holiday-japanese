import { isHoliday } from '@/index'
import { isHoliday as holidayJpIsHoliday } from '@holiday-jp/holiday_jp'
import { bench, describe } from 'vitest'

describe('benchmark test: "isHoliday"', () => {
  bench('holiday-japanese', () => {
    isHoliday(new Date('2024-10-14'))
    isHoliday(new Date('2024-10-15'))
  })

  bench('holiday_jp', () => {
    holidayJpIsHoliday(new Date('2024-10-14'))
    holidayJpIsHoliday(new Date('2024-10-15'))
  })
})
