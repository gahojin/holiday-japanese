import { encodedHolidays, rawHolidays } from '~/holidays_testdata'
import { decodeHolidays } from '~/utils'

describe('decodeHolidays', () => {
  it('バイナリ化データと生データが同一か', () => {
    expect(decodeHolidays(encodedHolidays)).toEqual(rawHolidays)
  })
})
