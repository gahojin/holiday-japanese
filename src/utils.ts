const decodeBase64 = (data: string) => {
  if (typeof Buffer === 'undefined') {
    const binary = atob(data)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }
  return Buffer.from(data, 'base64')
}

const decodeHolidays = (data: string): number[] => {
  const bytes = decodeBase64(data)
  const len = bytes.length
  const result = new Array<number>(len)

  let day = 0 // epochDay
  for (let i = 0; i < len; i += 2) {
    day += bytes[i]
    result[i] = day
    result[i + 1] = bytes[i + 1]
  }
  return result
}

export { decodeHolidays }
