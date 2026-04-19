const { test, expect } = require('@playwright/test');

test.describe('restaurant smoke flow', () => {
  test('creates an order and completes the main flow', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Observer Pattern - Restaurant - Vue 2' })).toBeVisible();

    const welcomeModal = page.locator('#welcome-modal');
    await expect(welcomeModal).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).first().click();
    await expect(welcomeModal).toBeHidden();

    await expect(page.getByText('Table: 1')).toBeVisible();
    await expect(page.getByText('Chef: 1')).toBeVisible();

    await page.getByRole('button', { name: 'Add Dishes' }).first().click();
    const foodsModal = page.locator('#modal-foods');
    await expect(foodsModal).toBeVisible();

    await foodsModal.getByRole('button', { name: 'Cinnamon Baked French Toast' }).click();
    await foodsModal.getByRole('button', { name: 'Order' }).click();
    await expect(foodsModal).toBeHidden();

    await expect(page.getByText('Activity log')).toBeVisible();
    await expect(page.getByText('Chef 1 picked up')).toBeVisible({ timeout: 10000 });

    const chefProgressButton = page.locator('.cook-progress .btn-complete').first();
    await expect(chefProgressButton).toBeVisible({ timeout: 10000 });
    await chefProgressButton.click();

    await expect(page.getByText('Chef 1 completed')).toBeVisible({ timeout: 10000 });

    const eatProgressButton = page.locator('.eat-progress .btn-complete').first();
    await expect(eatProgressButton).toBeVisible({ timeout: 10000 });
    await eatProgressButton.click();

    await expect(page.locator('.eat-progress .btn-complete')).toHaveCount(0, { timeout: 10000 });
    await expect(page.locator('#tb-1').getByRole('button', { name: 'Cinnamon Baked French Toast' })).toHaveCount(0, { timeout: 10000 });
  });
});
