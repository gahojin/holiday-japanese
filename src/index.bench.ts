import { between as holidayJpBetween, isHoliday as holidayJpIsHoliday } from '@holiday-jp/holiday_jp'
import { getHolidaysOf, isHoliday as japaneseHolidaysIsHoliday } from 'japanese-holidays'
import { test } from 'vitest'
import { rawHolidays } from '~/holidays_testdata.js'
import * as mod from '../dist/index.js'

const { between, isHoliday } = mod

// 祝日かの判定しかできないSet (旧実装と同等コード)
const dateToNumber = (date: Date): number => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return year * 10000 + month * 100 + day
}
const holidaySet = new Set(
  rawHolidays.map((day) => {
    const r = new Date(1970, 0, 1)
    r.setDate(r.getDate() + day)
    return dateToNumber(r)
  }),
)
const setVersionIsHoliday = (date: Date): boolean => {
  return holidaySet.has(dateToNumber(date))
}

test('benchmark test: "isHoliday"', async ({ bench }) => {
  await bench('holiday-japanese', () => {
    isHoliday(new Date('2024-10-14'))
    isHoliday(new Date('2024-10-15'))
  }).run({ time: 2000, warmupTime: 500 })

  await bench('holiday_jp', () => {
    holidayJpIsHoliday(new Date('2024-10-14'))
    holidayJpIsHoliday(new Date('2024-10-15'))
  }).run({ time: 2000, warmupTime: 500 })

  await bench('japanese-holidays', () => {
    japaneseHolidaysIsHoliday(new Date('2024-10-14'))
    japaneseHolidaysIsHoliday(new Date('2024-10-15'))
  }).run({ time: 2000, warmupTime: 500 })

  await bench('set', () => {
    setVersionIsHoliday(new Date('2024-10-14'))
    setVersionIsHoliday(new Date('2024-10-15'))
  }).run({ time: 2000, warmupTime: 500 })
})

test('benchmark test: "between" (1 year)', async ({ bench }) => {
  await bench('holiday-japanese', () => {
    between(new Date('2020-01-01'), new Date('2020-12-31'))
  }).run({ time: 2000, warmupTime: 500 })

  await bench('holiday_jp', () => {
    holidayJpBetween(new Date('2020-01-01'), new Date('2020-12-31'))
  }).run({ time: 2000, warmupTime: 500 })

  await bench('japanese-holidays', () => {
    getHolidaysOf(2020, true)
  }).run({ time: 2000, warmupTime: 500 })
})

test('benchmark test: "between" (10 years)', async ({ bench }) => {
  await bench('holiday-japanese', () => {
    between(new Date('2011-01-01'), new Date('2020-12-31'))
  }).run({ time: 2000, warmupTime: 500 })

  await bench('holiday_jp', () => {
    holidayJpBetween(new Date('2011-01-01'), new Date('2020-12-31'))
  }).run({ time: 2000, warmupTime: 500 })

  await bench('japanese-holidays', () => {
    for (let year = 2011; year <= 2020; year++) {
      getHolidaysOf(year, true)
    }
  }).run({ time: 2000, warmupTime: 500 })
})
