// ブラウザ環境か判定
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

const decodeHolidays = (data: string): number[] => {
  const t = isNode ? Buffer.from(data, 'base64') : Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
  const view = new DataView(t.buffer, t.byteOffset, t.byteLength)
  const len = view.byteLength
  const n = len >> 1
  const holidays = new Array<number>(n << 1)

  let offset = 0
  let day = 0
  while (offset < len) {
    day += view.getUint8(offset)
    holidays[offset++] = day
    holidays[offset] = view.getUint8(offset++)
  }
  return holidays
}

export { decodeHolidays }
