import { test as setup } from '@playwright/test';
 
import { LoginPage } from '../page-objects/saucedemo/LoginPage';

import { SauceDemoUsers } from '../utils/demo-user-data';
//standard user auth
setup('authenticate as standard user', async ({ page}) =>{
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
        SauceDemoUsers.standard.username,
        SauceDemoUsers.standard.password
    );
    await page.waitForURL('**/inventory.html');
    //save authenticate state
    await page.context().storageState({ path: 'playwright/.auth/standard_user.json'});
    
})
//problem user auth
setup('authenticate as problem user', async ({ page}) =>{
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
        SauceDemoUsers.problem.username,
        SauceDemoUsers.problem.password
    );
    await page.waitForURL('**/inventory.html');
    //save authenticate state
    await page.context().storageState({ path: 'playwright/.auth/problem_user.json'});
    
})

