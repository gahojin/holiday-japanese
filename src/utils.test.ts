import { encodedHolidays, rawHolidays } from '~/holidays_testdata.js'
import { decodeHolidays } from '~/utils.js'

describe('decodeHolidays', () => {
  it('バイナリ化データと生データが同一か', () => {
    expect(decodeHolidays(encodedHolidays)).toEqual(rawHolidays)
  })
})
