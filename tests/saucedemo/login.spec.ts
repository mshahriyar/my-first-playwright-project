import { test, expect } from '@playwright/test';
import { LoginPage} from '../../page-objects/saucedemo/LoginPage';
import { SauceDemoUsers } from '../../utils/demo-user-data';

 
test.describe('SauceDemo Login Tests', () => {
    let loginPage: LoginPage;
    test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    });

    test('user can successfully login with standard user', async ({ page }) => {
        await loginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('user cannot login with invalid credentials', async ({ page }) => {
        await loginPage.login('invalid_user', 'invalid_password');
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Epic sadface: Username and password do not match any user in this service');
    });

    test('user cannot login with empty credentials', async ({ page }) => {
        await loginPage.login('', '');
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Epic sadface: Username is required');
    });

    test('user cannot login with empty password', async ({ page }) => {
        await loginPage.login(SauceDemoUsers.standard.username, '');
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Epic sadface: Password is required');
    });

    test('user cannot login with empty username', async ({ page }) => {
        await loginPage.login('', SauceDemoUsers.standard.password);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Epic sadface: Username is required');
    }); 
    test('login fails with locked out user', async ({ page }) => {
    
        await loginPage.login(SauceDemoUsers.locked.username, SauceDemoUsers.locked.password);
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toContain('Sorry, this user has been locked out');
    
    });
    test('can clear error message', async ({ page }) => {
        await loginPage.login('invalid_user', 'wrong');
        await expect(loginPage.errorMessage).toBeVisible();
        await loginPage.clearError();
        await expect(loginPage.errorMessage).not.toBeVisible();
    });
    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({path: `screenshots/${testInfo.title}.png`});
    }
    });
});