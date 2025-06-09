import { parse } from 'yaml'
import { between, isHoliday } from './index'

const HOLIDAYS_URL = 'https://raw.githubusercontent.com/holiday-jp/holiday_jp/master/holidays.yml'

type Scenario = {
  name: string
  timezone: string
  systemTimeUtc: string
}

const scenarios: Scenario[] = [
  {
    name: 'JST (UTC+9) 0:00',
    timezone: 'Asia/Tokyo',
    systemTimeUtc: '2025-06-10T15:00:00.000Z', // JST 2025/06/11 00:00:00
  },
  {
    name: 'JST (UTC+9) 9:00',
    timezone: 'Asia/Tokyo',
    systemTimeUtc: '2025-06-10T00:00:00.000Z', // UTC 00:00 = JST 09:00
  },
  {
    name: 'JST (UTC+9) 21:00',
    timezone: 'Asia/Tokyo',
    systemTimeUtc: '2025-06-10T12:00:00.000Z', // UTC 12:00 = JST 21:00
  },
  {
    name: 'UTC (UTC+0) 12:00',
    timezone: 'UTC',
    systemTimeUtc: '2025-06-10T12:00:00.000Z', // UTC 12:00
  },
  {
    name: 'EST (UTC-5) 7:00',
    timezone: 'America/New_York', // 東部標準時 (UTC-5)
    systemTimeUtc: '2025-06-10T12:00:00.000Z', // UTC 12:00 = EST 07:00
  },
  {
    name: 'PST (UTC-8) 4:00',
    timezone: 'America/Los_Angeles', // 太平洋標準時 (UTC-8)
    systemTimeUtc: '2025-06-10T12:00:00.000Z', // UTC 12:00 = PST 04:00
  },
]

describe.each(scenarios)('isHoliday', ({ name, timezone, systemTimeUtc }) => {
  beforeAll(() => {
    // biome-ignore lint/nursery/noProcessEnv: テスト
    process.env.TZ = timezone
    vi.setSystemTime(new Date(systemTimeUtc))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it(`${name}: 特定の日が祝日か`, () => {
    // スポーツの日
    expect(isHoliday(new Date(2024, 9, 14))).toBeTrue()
    expect(isHoliday(new Date(2024, 9, 15))).toBeFalse()
    expect(isHoliday(new Date(2024, 9, 13))).toBeFalse()

    // 山の日
    expect(isHoliday(new Date(2015, 7, 11))).toBeFalse()
    for (let year = 2016; year <= 2050; year++) {
      switch (year) {
        case 2020: {
          expect(isHoliday(new Date(year, 7, 10))).toBeTrue()
          expect(isHoliday(new Date(year, 7, 11))).toBeFalse()
          break
        }
        case 2021: {
          expect(isHoliday(new Date(year, 7, 8))).toBeTrue()
          expect(isHoliday(new Date(year, 7, 11))).toBeFalse()
          break
        }
        default: {
          expect(isHoliday(new Date(year, 7, 11))).toBeTrue()
          break
        }
      }
    }
    // 山の日 (振替休日)
    expect(isHoliday(new Date(2021, 7, 9))).toBeTrue()
  })

  it('holidays.yml から取得した祝日が取得日として扱われるか', async () => {
    const res = await fetch(HOLIDAYS_URL)
    const body = await res.text()
    const dataset: Record<string, string> = parse(body)
    for (const date of Object.keys(dataset)) {
      expect(isHoliday(new Date(`${date}T00:00:00.000`))).toBeTrue()
    }
  })
})

describe.each(scenarios)('between', ({ name, timezone, systemTimeUtc }) => {
  beforeAll(() => {
    // biome-ignore lint/nursery/noProcessEnv: テスト
    process.env.TZ = timezone
    vi.setSystemTime(new Date(systemTimeUtc))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it(`${name}: 特定の日チェック`, () => {
    expect(between(new Date(2025, 0, 1), new Date(2025, 0, 31))).toEqual([
      { date: new Date(2025, 0, 1), nameJa: '元日', nameEn: `New Year's Day` },
      { date: new Date(2025, 0, 13), nameJa: '成人の日', nameEn: 'Coming of Age Day' },
    ])
  })

  it(`${name}: 境界チェック`, () => {
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
