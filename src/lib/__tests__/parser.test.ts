import { describe, it, expect } from 'vitest'
import { detectLanguage, extractSections, parseResume } from '@/lib/parser'

describe('detectLanguage', () => {
  it('mendeteksi bahasa Indonesia saat marker ID dominan', () => {
    const text =
      'Saya memiliki pengalaman dan keahlian dengan pendidikan yang relevan untuk perusahaan ini.'
    expect(detectLanguage(text)).toBe('id')
  })

  it('mendeteksi bahasa Inggris saat marker EN dominan', () => {
    const text =
      'I have experience and education with the skills required for the company and managed the team.'
    expect(detectLanguage(text)).toBe('en')
  })

  it('default ke EN saat tidak ada marker sama sekali', () => {
    // Tidak ada kata yang cocok di kedua daftar → idCount == enCount == 0 → 'en'
    expect(detectLanguage('xyz 123 foo bar baz')).toBe('en')
  })

  it('tidak terpengaruh kapitalisasi (case-insensitive)', () => {
    expect(detectLanguage('PENGALAMAN DAN PENDIDIKAN YANG RELEVAN')).toBe('id')
  })
})

describe('extractSections', () => {
  it('memecah resume menjadi section berdasarkan heading', () => {
    const resume = [
      'John Doe',
      'Software Engineer',
      'Pengalaman Kerja',
      'Membangun aplikasi web di PT Contoh.',
      'Pendidikan',
      'S1 Ilmu Komputer.',
      'Skills',
      'TypeScript, React, Node.js',
    ].join('\n')

    const sections = extractSections(resume)

    expect(Object.keys(sections)).toContain('experience')
    expect(Object.keys(sections)).toContain('education')
    expect(Object.keys(sections)).toContain('skills')
    expect(sections.skills).toContain('TypeScript')
  })

  it('menaruh konten sebelum heading pertama di section "header"', () => {
    const sections = extractSections('Jane\nProduct Manager\nRingkasan\nKandidat berpengalaman.')
    expect(sections.header).toContain('Jane')
    expect(sections.summary).toContain('Kandidat berpengalaman.')
  })
})

describe('parseResume (validasi)', () => {
  it('menolak file yang lebih besar dari 5 MB', async () => {
    const big = new File([new Uint8Array(6 * 1024 * 1024)], 'big.pdf', {
      type: 'application/pdf',
    })
    await expect(parseResume(big)).rejects.toMatchObject({ code: 'FILE_TOO_LARGE' })
  })

  it('menolak format file yang tidak didukung', async () => {
    const txt = new File([new Uint8Array(10)], 'resume.txt', { type: 'text/plain' })
    await expect(parseResume(txt)).rejects.toMatchObject({ code: 'INVALID_FORMAT' })
  })
})
