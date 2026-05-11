import { test, expect } from '@playwright/test';
 
test('login test with allure annotations', async ({ page }) => {
 
// Add description
 
test.info().annotations.push({
 
type: 'description',
 
description: 'This test verifies the login functionality'
 
});
 
// Add severity
 
test.info().annotations.push({
 
type: 'severity',
 
description: 'critical'
});
 
// Add issue link
 
test.info().annotations.push({
 
type: 'issue',
 
description: 'JIRA-123'
 
});
 
// Add tags
 
test.info().annotations.push({
 
type: 'tag',
 
description: '@smoke @login'
 
});
 
// Test code
 
await page.goto('https://www.saucedemo.com/');
 
await page.fill('#user-name', 'standard_user');
 
await page.fill('#password', 'secret_sauce');
 
await page.click('#login-button');
 
await expect(page).toHaveURL(/inventory/);
 
});