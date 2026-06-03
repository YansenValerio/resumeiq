import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('memuat halaman dengan judul ResumeIQ', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ResumeIQ/)
  })

  test('punya CTA menuju halaman analyze', async ({ page }) => {
    await page.goto('/')
    // Nav/hero punya link ke /analyze — klik yang pertama terlihat.
    const cta = page.locator('a[href="/analyze"]').first()
    await expect(cta).toBeVisible()
    await cta.click()
    await expect(page).toHaveURL(/\/analyze/)
  })
})
