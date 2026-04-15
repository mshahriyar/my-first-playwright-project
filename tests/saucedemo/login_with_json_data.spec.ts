import {test, expect} from '@playwright/test';

import { LoginPage } from '../../page-objects/saucedemo/LoginPage';
import { ProductPage } from '../../page-objects/saucedemo/ProductPage';
import productsData from '../../test-data/saucedemo-products.json';


test.describe('SauceDemo Login Tests with JSON Data', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
    });
    for (const product of productsData){
        test(`verify product ${product.name} is displayed`, async ({ page }) => {
            const productsPage = new ProductPage(page);
            await productsPage.addProductToCartByName(product.name);
            const isInCart = await productsPage.isProductInCart(product.name);
            expect(isInCart).toBe(product.expectedInCart);
            const price = await productsPage.getProductPrice(product.name);
            expect(price).toBe(product.price);
        });
    }
})
