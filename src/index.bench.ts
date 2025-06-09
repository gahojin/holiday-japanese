import { between as holidayJpBetween, isHoliday as holidayJpIsHoliday } from '@holiday-jp/holiday_jp'
import { bench, describe } from 'vitest'
import { between, isHoliday } from './index'

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

describe('benchmark test: "between"', () => {
  bench('holiday-japanese', () => {
    between(new Date('2020-01-01'), new Date('2020-12-31'))
  })

  bench('holiday_jp', () => {
    holidayJpBetween(new Date('2020-01-01'), new Date('2020-12-31'))
  })
})
