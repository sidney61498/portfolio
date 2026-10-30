import { expect, test } from '@playwright/test'

test('homepage shows the profile, filters work and case studies open', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Sidney Medrano' })).toBeVisible()

  await page.getByRole('tab', { name: /Earlier systems/ }).click()
  await expect(page.locator('#work article')).toHaveCount(9)
  await page.getByRole('tab', { name: /Cloudstaff/ }).click()
  await expect(page.locator('#work article')).toHaveCount(6)

  await page.getByRole('link', { name: /StaffCentral: time, leave/ }).click()
  await expect(page).toHaveURL(/\/work\/staffcentral$/)
  await expect(page.getByRole('heading', { level: 2, name: 'Approach' })).toBeVisible()
})

test('unknown pages show a 404', async ({ page }) => {
  await page.goto('/nope')
  await expect(page.getByText('This page doesn’t exist')).toBeVisible()
})

test('the AI harness has its own page, and its old case-study URL redirects there', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'See the AI harness' }).click()
  await expect(page).toHaveURL(/\/ai-harness$/)
  await expect(page.getByRole('heading', { level: 1, name: /development harness/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /humans at the gates/ })).toBeVisible()

  await page.goto('/work/ai-dev-harness')
  await expect(page).toHaveURL(/\/ai-harness$/)
})

test('the POS platform page shows the API explorer, including a 422 example', async ({ page }) => {
  await page.goto('/projects/pos-platform')
  await expect(page.getByText('not part of my work experience')).toBeVisible()
  await page.getByRole('button', { name: /transfers\/318\/receive/ }).click()
  await expect(page.getByText('Only the destination branch can receive this transfer.').first()).toBeVisible()
})

test('case studies show redacted screenshots in a lightbox', async ({ page }) => {
  await page.goto('/work/phoenix')
  await page.getByRole('button', { name: /Enlarge: Phoenix Admin dashboard/ }).click()
  await expect(page.getByRole('dialog', { name: 'Screenshot viewer' })).toBeVisible()
})
