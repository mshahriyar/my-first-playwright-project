import {test , expect} from '@playwright/test';

import fs from 'fs';
import path from 'path';

test.describe('File Download Tests', () => {
    test('download file and verify', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/download');
        // Start waiting for download before clicking
        const downloadpromise = page.waitForEvent('download');
        // Click the first download link
        await page.locator('a[href*= ".txt"]').first().click();
        // Wait for the download to complete
        const download = await downloadpromise;
        // Get donwnload filename
        const fileName = download.suggestedFilename();
        console.log(`Downloaded file: ${fileName}`);
        //Save to specific path
        const downloadPath = path.join(__dirname, '../downloads', fileName);
        await download.saveAs(downloadPath);
        //verify file size
        const stats = fs.statSync(downloadPath);
        expect(stats.size).toBeGreaterThan(0);
        //clean up
        fs.unlinkSync(downloadPath);
    });
})