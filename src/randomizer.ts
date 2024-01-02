type Seed = {
  seedA: number
  seedB: number
  seedC: number
  seedD: number
}

export function rand(seed?: string) {
  if (seed === undefined) return () => Math.random()
  return sfc32(cyrb128(seed))
}

export function randRange(min: number, max: number, seed?: string) {
  const random = rand(seed)
  return () => random() * (max - min) + min
}

export function randRangeInt(min: number, max: number, seed?: string) {
  const random = rand(seed)
  return () => Math.floor(random() * (max - min + 1)) + min
}

export function cyrb128(str: string) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i)
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067)
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233)
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213)
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179)
  ;(h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1)
  return { seedA: h1 >>> 0, seedB: h2 >>> 0, seedC: h3 >>> 0, seedD: h4 >>> 0 }
}

export function sfc32(seed: Seed) {
  let { seedA, seedB, seedC, seedD } = seed
  return () => {
    seedA |= 0
    seedB |= 0
    seedC |= 0
    seedD |= 0
    const t = (((seedA + seedB) | 0) + seedD) | 0
    seedD = (seedD + 1) | 0
    seedA = seedB ^ (seedB >>> 9)
    seedB = (seedC + (seedC << 3)) | 0
    seedC = (seedC << 21) | (seedC >>> 11)
    seedC = (seedC + t) | 0
    return (t >>> 0) / 4294967296
  }
}
