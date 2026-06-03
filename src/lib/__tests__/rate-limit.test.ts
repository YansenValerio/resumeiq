import { describe, it, expect, afterEach } from 'vitest'
import { checkRateLimit } from '@/lib/rate-limit'

describe('checkRateLimit (Supabase tidak dikonfigurasi)', () => {
  const original = {
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  }
  afterEach(() => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = original.key
    process.env.NEXT_PUBLIC_SUPABASE_URL = original.url
  })

  it('mengizinkan semua request saat env Supabase kosong', async () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = ''
    process.env.NEXT_PUBLIC_SUPABASE_URL = ''

    const result = await checkRateLimit(null, '127.0.0.1')

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(999)
    expect(result.limit).toBe(999)
    expect(() => new Date(result.resetAt).toISOString()).not.toThrow()
  })

  it('mengizinkan saat URL masih placeholder', async () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'some-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co'

    const result = await checkRateLimit('user-123', '127.0.0.1')

    expect(result.allowed).toBe(true)
    expect(result.limit).toBe(999)
  })

  it('resetAt adalah tengah malam UTC berikutnya', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = ''

    const { resetAt } = await checkRateLimit(null, '10.0.0.1')
    const d = new Date(resetAt)

    expect(d.getUTCHours()).toBe(0)
    expect(d.getUTCMinutes()).toBe(0)
    expect(d.getTime()).toBeGreaterThan(Date.now())
  })
})
