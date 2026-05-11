import { test, expect } from '@playwright/test';
 
test('manual trace recording', async ({ page, context }) => {
 
// Start tracing
 
await context.tracing.start({
 
screenshots: true,
 
snapshots: true
 
});
 
await page.goto('https://www.saucedemo.com/');
 
await page.fill('#user-name', 'standard_user');
 
await page.fill('#password', 'secret_sauce');
 
await page.click('#login-button');
 
// Stop and save trace
 
await context.tracing.stop({
 
path: 'traces/login-trace.zip'
 
});
 
});
