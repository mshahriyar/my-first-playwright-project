import {test, expect} from '@playwright/test';

import { LoginPage} from '../../page-objects/saucedemo/LoginPage';
import { ProductPage } from '../../page-objects/saucedemo/ProductPage';
import { SortOption } from '../../utils/saucedemo-data';
//how to import enum from page object

test.describe('SauceDemo Products Tests', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
    });

    test('Products page displays correct title', async ({ page }) => {
        await expect(page.locator('.title')).toHaveText('Products');
    });
    test('Burge Menu is visible and functional', async ({ page }) => {
        const productPage = new ProductPage(page);
        const isBurgerMenuVisible = await productPage.isBurgerMenuVisible();
        expect(isBurgerMenuVisible).toBe(true);
        await productPage.openBurgerMenu();
    });
    test.only('User can logout using burger menu', async ({ page }) => {
        const productPage = new ProductPage(page);
        const isBurgerMenuVisible = await productPage.isBurgerMenuVisible();
        expect(isBurgerMenuVisible).toBe(true);
        const isLogoutLinkVisible = await productPage.isLogoutLinkVisible();
        expect(isLogoutLinkVisible).toBe(true);
        await productPage.openBurgerMenu();
        await productPage.clickLogout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('Products page displays correct number of products', async ({ page }) => {
        const productPage = new ProductPage(page);
        const productCount = await productPage.getProductCount();
        expect(productCount).toBe(6);
    });

    test('Product can add to the cart', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.addProductToCartByName('Sauce Labs Backpack');
        const cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe('1');

        const isInCart = await productPage.isProductInCart('Sauce Labs Backpack');
        expect(isInCart).toBe(true); 
    });

    test('User can add multiple products to the cart', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.addProductToCartByName('Sauce Labs Backpack');
        await productPage.addProductToCartByName('Sauce Labs Bike Light');
        await productPage.addProductToCartByName('Sauce Labs Bolt T-Shirt');
        const cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe('3');
    });

    test('User can remove product from the cart', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.addProductToCartByName('Sauce Labs Backpack');
        await productPage.removeProductFromCartByName('Sauce Labs Backpack');
        const cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe('0');
    });
    test('can sort products by name A-Z', async ({ page }) => {
        const productsPage = new ProductPage(page);        
        await productsPage.sortBy(SortOption.NAME_ASC);
        const productNames = await productsPage.getProductNames();
        expect(productNames[0]).toBe('Sauce Labs Backpack');
    });
    test(' can sort products by name Z-A', async ({ page }) => {
        const productsPage = new ProductPage(page);
        await productsPage.sortBy(SortOption.NAME_DESC);
        const productNames = await productsPage.getProductNames();
        expect(productNames[0]).toBe('Test.allTheThings() T-Shirt (Red)');
    });
        
    test('can sort products by price low to high', async ({ page }) => {    
        const productsPage = new ProductPage(page);
        await productsPage.sortBy(SortOption.PRICE_LOW_HIGH);
        const firstProductPrice = await productsPage.getProductPrice('Sauce Labs Onesie');
        expect(firstProductPrice).toContain('$7.99');
        //check all the products are sorted correctly
        const productNames = await productsPage.getProductNames();
        const prices: number[] = [];
        for (const name of productNames){
            const priceText = await productsPage.getProductPrice(name);
            const price = parseFloat(priceText.replace('$', ''));
            prices.push(price);
        }
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    });

    test('can sort products by price high to low', async ({ page }) => {    
        const productsPage = new ProductPage(page);
        await productsPage.sortBy(SortOption.PRICE_HIGH_LOW);
        const firstProductPrice = await productsPage.getProductPrice('Sauce Labs Fleece Jacket');
        expect(firstProductPrice).toContain('$49.99');

        const productNames = await productsPage.getProductNames();
        const prices: number[] = [];
        for (const name of productNames){
            const priceText = await productsPage.getProductPrice(name);
            const price = parseFloat(priceText.replace('$', ''));
            prices.push(price);
        }
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);
    });
    test.afterEach(async ({ page }, testInfo) => {
 
        if (testInfo.status !== testInfo.expectedStatus) {
        
        const screenshot = await page.screenshot();
        
        await testInfo.attach('screenshot', {
        
        body: screenshot,
        
        contentType: 'image/png'
        });
    }
    });

});