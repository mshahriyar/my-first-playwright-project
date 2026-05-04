import { test, expect} from '@playwright/test';

import path from 'path';

test.describe('File upload tests', () => {
    test(' upload single file', async ({ page}) =>{
        await page.goto('https://the-internet.herokuapp.com/upload');
        const filePath = path.join(__dirname, '../../test-data/sample.txt');
        // Upload file
        const fileInput = page.locator('#file-upload');
        await fileInput.setInputFiles(filePath);
        //click upload button
        await page.locator('#file-submit').click();
        // Verify upoad success
        await expect(page.locator('#uploaded-files')).toHaveText('sample.txt');
    });
    test.skip('upload multiple files', async ({ page}) =>{
        await page.goto('https://the-internet.herokuapp.com/upload');
        const files = [
            path.join(__dirname, '../../test-data/sample.txt'),
            path.join(__dirname, '../../test-data/another-sample.txt')
        ];
        // Upload files
        const fileInput = page.locator('#file-upload');
        await fileInput.setInputFiles(files);
        //click upload button
        await page.locator('#file-submit').click();
        // Verify upoad success
        await expect(page.locator('#uploaded-files')).toHaveText('sample.txt');
        await expect(page.locator('#uploaded-files')).toHaveText('another-sample.txt');
    });

    test(' Create and upload file on the fly', async ({ page}) =>{
        await page.goto('https://the-internet.herokuapp.com/upload');
        //create file buffer
        const fileContent = 'This is a test file created on the fly.';
        const buffer = Buffer.from(fileContent, 'utf-8');
        const fileInput = page.locator('#file-upload');
        await fileInput.setInputFiles({
            name: 'dynamic-file.txt',
            mimeType: 'text/plain',
            buffer: buffer,
        });
        await page.locator('#file-submit').click();
        // Verify upload success
        await expect(page.locator('#uploaded-files')).toHaveText('dynamic-file.txt');
    });
    test('Remove uploaded file', async ({ page}) =>{
        await page.goto('https://the-internet.herokuapp.com/upload');
        const filePath = path.join(__dirname, '../../test-data/sample.txt');
        // Upload file
        const fileInput = page.locator('#file-upload');
        await fileInput.setInputFiles(filePath);
        //clear input
        await fileInput.setInputFiles([]);
        //verify input is empty
        const files = await fileInput.inputValue();
        expect(files).toBe('');
    });

})