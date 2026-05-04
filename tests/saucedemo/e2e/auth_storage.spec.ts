import {test, expect} from '@playwright/test';

import { ProductPage } from '../../../page-objects/saucedemo/ProductPage';

test('test with saved auth state', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const productPage = new ProductPage(page);
    await expect(productPage.pageTitle).toHaveText('Products');
})