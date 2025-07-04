// ブラウザ環境か判定
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

const decodeHolidays = (data: string): number[] => {
  let decodedBytes: Uint8Array
  if (isNode) {
    decodedBytes = Buffer.from(data, 'base64')
  } else {
    decodedBytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
  }
  const len = decodedBytes.byteLength
  const n = Math.floor(len / 3)

  const view = new DataView(decodedBytes.buffer, 0, len)
  const holidays = new Array<number>(n << 1)

  let offset = 0
  let i = 0
  while (offset < len) {
    holidays[i++] = view.getUint16(offset, true)
    offset += 2
    holidays[i++] = view.getUint8(offset)
    offset += 1
  }
  return holidays
}

export { decodeHolidays }
