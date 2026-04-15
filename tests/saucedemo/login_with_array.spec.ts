import { test, expect } from '@playwright/test';

const testUsers = [
 
    { username: 'standard_user', password: 'secret_sauce', shouldSucceed: true },
     
    { username: 'locked_out_user', password: 'secret_sauce', shouldSucceed: false },
     
    { username: 'problem_user', password: 'secret_sauce', shouldSucceed: true },
     
    { username: 'invalid_user', password: 'wrong_password', shouldSucceed: false }
     
];

test.describe('SauceDemo Login Tests with Multiple Users', () => {
    for (const user of testUsers){
        test(`login test for ${user.username}`, async ({ page }) => {
            await page.goto('https://www.saucedemo.com/');
            await page.fill('#user-name', user.username);
            await page.fill('#password', user.password);
            await page.click('#login-button');
            
            if (user.shouldSucceed){
                await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
                await expect(page.locator('.title')).toHaveText('Products');
            } else {
                const errorMessage = await page.locator('[data-test="error"]').textContent();
                expect(errorMessage).toBeTruthy();
            }
        });
    }
}); 