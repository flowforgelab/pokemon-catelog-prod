import { test, expect } from '@playwright/test'

test.describe('Pokemon Catalog - Core Functionality', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Pokemon Catalog/)
    await expect(page.locator('h1')).toContainText('Pokemon')
  })

  test('should search for cards', async ({ page }) => {
    await page.goto('http://localhost:3000/cards')
    
    // Wait for cards to load
    await page.waitForSelector('[data-testid="pokemon-grid"]', { timeout: 10000 })
    
    // Search for Pikachu
    await page.fill('input[placeholder*="Search"]', 'Pikachu')
    await page.press('input[placeholder*="Search"]', 'Enter')
    
    // Should show search results
    await expect(page.locator('text=Pikachu')).toBeVisible()
  })

  test('should require auth for collections', async ({ page }) => {
    await page.goto('http://localhost:3000/collections')
    
    // Should redirect to signin
    await expect(page).toHaveURL(/signin/)
  })

  test('should show card details', async ({ page }) => {
    await page.goto('http://localhost:3000/cards')
    
    // Wait for cards and click first one
    await page.waitForSelector('[data-testid="pokemon-card"]', { timeout: 10000 })
    await page.locator('[data-testid="pokemon-card"]').first().click()
    
    // Should show card detail page
    await expect(page.locator('text=Market Price')).toBeVisible()
  })
})