import { expect, test, type Page } from '@playwright/test'

const WATER = 'Bottled Water 500ml'
const WATER_BARCODE = '4801000007919'

async function waterStock(page: Page): Promise<number> {
  const label = await page.getByRole('button', { name: new RegExp(WATER) }).textContent()
  return Number(/(\d+) left/.exec(label ?? '')?.[1])
}

async function sellOneWater(page: Page) {
  await page.getByLabel('Barcode').fill(WATER_BARCODE)
  await page.getByLabel('Barcode').press('Enter')
  await page.keyboard.press('F9')
  await page.getByRole('button', { name: 'Exact' }).click()
  await page.getByRole('button', { name: 'Complete payment' }).click()
  await expect(page.getByRole('heading', { name: 'Payment complete' })).toBeVisible()
  await page.getByRole('button', { name: 'New sale' }).click()
}

test('checkout reduces stock and writes a SALE entry to the ledger', async ({ page }) => {
  await page.goto('/demo/pos/register')
  const before = await waterStock(page)
  await sellOneWater(page)
  expect(await waterStock(page)).toBe(before - 1)

  await page.getByRole('link', { name: 'Stock ledger' }).click()
  const firstRow = page.locator('tbody tr').first()
  await expect(firstRow).toContainText(WATER)
  await expect(firstRow).toContainText('SALE')
  await expect(firstRow).toContainText(`${before} → ${before - 1}`)
})

test('a cashier can void with the manager PIN and stock comes back', async ({ page }) => {
  await page.goto('/demo/pos/register')
  const before = await waterStock(page)
  await sellOneWater(page)

  await page.getByRole('link', { name: 'Sales history' }).click()
  await page.locator('tbody tr').first().getByRole('link').click()
  await page.getByRole('button', { name: 'Void' }).click()
  await page.getByPlaceholder('e.g. Wrong item rung up').fill('Test void')
  await page.getByLabel('Manager PIN').fill('0000')
  await page.getByRole('button', { name: 'Void sale' }).click()
  await expect(page.getByText('Incorrect manager PIN.')).toBeVisible()
  await page.getByLabel('Manager PIN').fill('1234')
  await page.getByRole('button', { name: 'Void sale' }).click()
  await expect(page.getByText('Sale voided. Stock restored.')).toBeVisible()

  await page.getByRole('link', { name: 'Register' }).click()
  expect(await waterStock(page)).toBe(before)
})

test('cashiers are blocked from manager pages until they switch role', async ({ page }) => {
  await page.goto('/demo/pos/reports')
  await expect(page.getByRole('heading', { name: 'Managers only' })).toBeVisible()
  await page.getByRole('button', { name: 'Switch to Manager' }).click()
  await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible()
  await expect(page.getByRole('img', { name: /Daily sales chart/ })).toBeVisible()
})
