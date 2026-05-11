import { test, expect } from '@playwright/test';
 
test('checkout with allure steps', async ({ page }) => {
 
    await test.step('Navigate to login', async () => {
        await page.goto('https://www.saucedemo.com/');
    
    });
    
    await test.step('Login', async () => {
    
    await page.fill('#user-name', 'standard_user');
    
    await page.fill('#password', 'secret_sauce');
    
    await page.click('#login-button');
    
    });
    
    await test.step('Add product to cart', async () => {
    
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    });
    
    await test.step('Go to cart', async () => {
    
    await page.click('.shopping_cart_link');
    
    });
    
    await test.step('Checkout', async () => {
    
    await page.click('#checkout');
    
    await page.fill('#first-name', 'John');
    
    await page.fill('#last-name', 'Doe');
    
    await page.fill('#postal-code', '12345');
    
    await page.click('#continue');
    
    await page.click('#finish');
    
    });
    
    await test.step('Verify success', async () => {
        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    
    });
 
});
