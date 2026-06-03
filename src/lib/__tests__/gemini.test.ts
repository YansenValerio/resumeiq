import { describe, it, expect, afterEach } from 'vitest'
import { estimateTokens, truncateForAnalysis, analyzeResume } from '@/lib/gemini'

describe('estimateTokens', () => {
  it('mengembalikan 0 untuk string kosong', () => {
    expect(estimateTokens('')).toBe(0)
  })

  it('memperkirakan ~1 token per 3.5 karakter (dibulatkan ke atas)', () => {
    expect(estimateTokens('a'.repeat(35))).toBe(10)
    expect(estimateTokens('a'.repeat(1))).toBe(1)
  })
})

describe('truncateForAnalysis', () => {
  it('membiarkan teks pendek apa adanya', () => {
    const text = 'CV singkat saja.'
    expect(truncateForAnalysis(text, 8000)).toBe(text)
  })

  it('memotong teks panjang dan menambahkan penanda', () => {
    const long = 'kata '.repeat(20_000) // jauh di atas limit token
    const result = truncateForAnalysis(long, 100)
    expect(result.length).toBeLessThan(long.length)
    expect(result).toContain('[Content truncated for analysis]')
  })
})

describe('analyzeResume (mock mode)', () => {
  const original = process.env.USE_MOCK_GEMINI
  afterEach(() => {
    process.env.USE_MOCK_GEMINI = original
  })

  it('mengembalikan mock result tanpa memanggil Gemini saat USE_MOCK_GEMINI=true', async () => {
    process.env.USE_MOCK_GEMINI = 'true'

    const result = await analyzeResume('resume text', 'job description', 'id')

    expect(typeof result.overall_score).toBe('number')
    expect(result.overall_score).toBeGreaterThanOrEqual(0)
    expect(result.overall_score).toBeLessThanOrEqual(100)
    expect(result.keyword_match).toBeDefined()
    expect(Array.isArray(result.strengths)).toBe(true)
  })
})
