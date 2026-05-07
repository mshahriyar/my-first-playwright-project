import {test, expect} from '@playwright/test';

test.describe('Dialog handling', () => {
    test('handle javascript alert', async ({ page}) =>{
        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
        //Setup dialog handler
        page.on('dialog', async dialog =>{
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('I am a JS Alert');
            await dialog.accept();
        })
        // Triggler alert
        await page.locator('button:has-text("Click for JS Alert")').click();
        //Verify results
        await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
    })
    test('handle javascript confirm', async ({ page}) =>{
        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
        //Setup dialog handler
        page.on('dialog', async dialog =>{
            expect(dialog.type()).toBe('confirm');
            expect(dialog.message()).toBe('I am a JS Confirm');
            await dialog.accept();
        })
        //trigger confirm
        await page.locator('button:has-text("Click for JS Confirm")').click();
        //verify results
        await expect(page.locator('#result')).toHaveText('You clicked: Ok');
    });
    test('handle javascript dialog, cancel', async ({ page}) =>{
        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
        //Setup dialog handler
        page.on('dialog', async dialog =>{
            expect(dialog.type()).toBe('confirm');
            expect(dialog.message()).toBe('I am a JS Confirm');
            await dialog.dismiss();
        })

        //trigger confirm
        await page.locator('button:has-text("Click for JS Confirm")').click();
        //verify results
        await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
    });
    test('handle javascript prompt', async ({ page}) =>{
        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
        //Setup dialog handler
        page.on('dialog', async dialog =>{
            expect(dialog.type()).toBe('prompt');
            expect(dialog.message()).toBe('I am a JS prompt');
            await dialog.accept('Playwright Test Input');
        })

        //trigger prompt
        await page.locator('button:has-text("Click for JS Prompt")').click();
        //verify results
        await expect(page.locator('#result')).toHaveText('You entered: Playwright Test Input');
    });

});