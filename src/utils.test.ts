import { encodedHolidays, rawHolidays } from 'src/holidays_testdata'
import { decodeHolidays } from 'src/utils'

describe('decodeHolidays', () => {
  it('バイナリ化データと生データが同一か', () => {
    expect(decodeHolidays(encodedHolidays)).toEqual(rawHolidays)
  })
})
