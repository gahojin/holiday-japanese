import { isHoliday } from '@/index'
import { parse } from 'yaml'

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
