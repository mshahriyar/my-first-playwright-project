import { test, expect } from '@playwright/test';

test.describe('iframes', () => {
    test('interact with iframe content', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/iframe');
        //wait for iframe to load
        const iframe = page.frameLocator('#mce_0_ifr');
        //Interact iwth content inside iframe
        const editor = iframe.locator('#tinymce');
        await editor.evaluate((el) => {
            el.setAttribute('contenteditable', 'true');
        });
        await editor.fill('Hello from playwright');

        //Verify content
        await expect(editor).toHaveText('Hello from playwright');

    });

    test('work with nested iframes', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/nested_frames');
        // Access top frame
        const topFrame = page.frameLocator('frame[name="frame-top"]');
        // Access left frame inside top frame
        const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
        const leftBody = leftFrame.locator('body');
        await expect(leftBody).toHaveText('LEFT');

        //Access middle frame
        const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
        const middleContent = middleFrame.locator('#content');
        await expect(middleContent).toHaveText('MIDDLE');

        //Access right frame
        const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
        const rightBody = rightFrame.locator('body');
        await expect(rightBody).toHaveText('RIGHT');

    });
    test('Switch between main page and iframe', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/iframe');
        // Interact with main page content
        const header = page.locator('h3');
        await expect(header).toHaveText('An iFrame containing the TinyMCE WYSIWYG Editor');

        // Switch to iframe and interact with content
        const iframe = page.frameLocator('#mce_0_ifr');
        const editor = iframe.locator('#tinymce');
        await editor.evaluate((el) => {
            el.setAttribute('contenteditable', 'true');
        });
        await editor.fill('Testing iframe interaction');

        // Verify content inside iframe
        await expect(editor).toHaveText('Testing iframe interaction');

        //back to main page
        await expect(header).toBeVisible();
    });

});