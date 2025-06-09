import { parse } from 'yaml'
import { between, isHoliday } from './index'

const HOLIDAYS_URL = 'https://raw.githubusercontent.com/holiday-jp/holiday_jp/master/holidays.yml'

describe('isHoliday', () => {
  it('特定の日が祝日か', () => {
    // スポーツの日
    expect(isHoliday(new Date('2024-10-14'))).toBeTrue()
    expect(isHoliday(new Date('2024-10-15'))).toBeFalse()
    expect(isHoliday(new Date('2024-10-13'))).toBeFalse()

    // 山の日
    expect(isHoliday(new Date('2015-08-11'))).toBeFalse()
    for (let year = 2016; year <= 2050; year++) {
      switch (year) {
        case 2020: {
          expect(isHoliday(new Date(`${year}-08-10`))).toBeTrue()
          expect(isHoliday(new Date(`${year}-08-11`))).toBeFalse()
          break
        }
        case 2021: {
          expect(isHoliday(new Date(`${year}-08-08`))).toBeTrue()
          expect(isHoliday(new Date(`${year}-08-11`))).toBeFalse()
          break
        }
        default: {
          expect(isHoliday(new Date(`${year}-08-11`))).toBeTrue()
          break
        }
      }
    }
    // 山の日 (振替休日)
    expect(isHoliday(new Date('2021-08-09'))).toBeTrue()
  })

  it('holidays.yml から取得した祝日が取得日として扱われるか', async () => {
    const res = await fetch(HOLIDAYS_URL)
    const body = await res.text()
    const dataset: Record<string, string> = parse(body)
    for (const date of Object.keys(dataset)) {
      expect(isHoliday(new Date(date))).toBeTrue()
    }
  })
})

describe('between', () => {
  it('特定の日チェック', () => {
    expect(between(new Date(2025, 0, 1), new Date(2025, 0, 31))).toEqual([
      { date: new Date(2025, 0, 1), nameJa: '元日', nameEn: `New Year's Day` },
      { date: new Date(2025, 0, 13), nameJa: '成人の日', nameEn: 'Coming of Age Day' },
    ])
  })

  it('境界チェック', () => {
    expect(between(new Date(2025, 0, 2), new Date(2025, 0, 12))).toBeEmpty()
    expect(between(new Date(2025, 0, 1), new Date(2025, 0, 12))).toEqual([{ date: new Date(2025, 0, 1), nameJa: '元日', nameEn: `New Year's Day` }])
    expect(between(new Date(2025, 0, 13), new Date(2025, 0, 31))).toEqual([
      { date: new Date(2025, 0, 13), nameJa: '成人の日', nameEn: 'Coming of Age Day' },
    ])
    expect(between(new Date(2025, 0, 11), new Date(2025, 0, 31))).toEqual([
      { date: new Date(2025, 0, 13), nameJa: '成人の日', nameEn: 'Coming of Age Day' },
    ])
    expect(between(new Date(2025, 0, 1), new Date(2025, 0, 1))).toEqual([{ date: new Date(2025, 0, 1), nameJa: '元日', nameEn: `New Year's Day` }])

    expect(between(new Date(1970, 0, 1), new Date(1970, 0, 15))).toEqual([
      { date: new Date(1970, 0, 1), nameJa: '元日', nameEn: `New Year's Day` },
      { date: new Date(1970, 0, 15), nameJa: '成人の日', nameEn: 'Coming of Age Day' },
    ])

    expect(between(new Date(2024, 1, 30), new Date(2024, 2, 1))).toBeEmpty()
  })
})
