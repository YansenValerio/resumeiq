import { describe, it, expect } from 'vitest'
import { ANALYSIS_PROMPT, REWRITE_PROMPT_ID } from '@/lib/prompts'

describe('ANALYSIS_PROMPT', () => {
  it('punya varian id dan en', () => {
    expect(ANALYSIS_PROMPT).toHaveProperty('id')
    expect(ANALYSIS_PROMPT).toHaveProperty('en')
  })

  it.each(['id', 'en'] as const)(
    'varian %s menyediakan placeholder RESUME & JOB_DESCRIPTION',
    (lang) => {
      expect(ANALYSIS_PROMPT[lang]).toContain('{{RESUME}}')
      expect(ANALYSIS_PROMPT[lang]).toContain('{{JOB_DESCRIPTION}}')
    }
  )

  it('menginstruksikan output JSON & menyebut ATS', () => {
    expect(ANALYSIS_PROMPT.id).toMatch(/JSON/i)
    expect(ANALYSIS_PROMPT.id).toMatch(/ATS/)
  })

  it('substitusi placeholder menghasilkan prompt tanpa template tersisa', () => {
    const filled = ANALYSIS_PROMPT.en
      .replace('{{RESUME}}', 'My resume text')
      .replace('{{JOB_DESCRIPTION}}', 'The job description')

    expect(filled).toContain('My resume text')
    expect(filled).toContain('The job description')
    expect(filled).not.toContain('{{RESUME}}')
    expect(filled).not.toContain('{{JOB_DESCRIPTION}}')
  })
})

describe('REWRITE_PROMPT_ID', () => {
  it('punya placeholder bullet & role context', () => {
    expect(REWRITE_PROMPT_ID).toContain('{{BULLET}}')
    expect(REWRITE_PROMPT_ID).toContain('{{ROLE_CONTEXT}}')
  })
})
