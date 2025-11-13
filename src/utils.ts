// ブラウザ環境か判定
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

const decodeHolidays = (data: string): number[] => {
  const b = isNode ? Buffer.from(data, 'base64') : Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
  const l = b.length
  const n = l >> 1
  const r = new Array<number>(n << 1)

  let o = 0
  let d = 0
  while (o < l) {
    d += b[o]
    r[o++] = d
    r[o] = b[o++]
  }
  return r
}

export { decodeHolidays }
