import { test, expect } from '@playwright/test';

test.describe('Smoke tests — US Holding site', () => {
  test('homepage loads and contains "US Holding"', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/US Holding/i);
    await expect(page.getByText(/US Holding/i).first()).toBeVisible();
  });

  test('navigation links are visible', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    // At least one anchor inside the nav
    await expect(nav.locator('a').first()).toBeVisible();
  });

  test('companies section has 17 cards', async ({ page }) => {
    await page.goto('/');
    // Cards are rendered by Companies / CompanyCard components.
    // The section carries id="companies".
    const section = page.locator('#companies');
    await expect(section).toBeVisible();
    // Each card has an article or a dedicated selector — count them.
    const cards = section.locator('[data-testid="company-card"], article, .company-card');
    const count = await cards.count();
    expect(count).toBe(17);
  });

  test('contact form is visible', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form');
    await expect(form.first()).toBeVisible();
    // Name and email inputs must be present
    await expect(page.locator('input[name="name"], input[id="name"]').first()).toBeVisible();
    await expect(page.locator('input[name="email"], input[id="email"], input[type="email"]').first()).toBeVisible();
  });
});
