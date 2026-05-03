import {test as base} from '@playwright/test';
import {LoginPage} from '../page-objects/saucedemo/LoginPage';

import { SauceDemoUsers } from '../utils/demo-user-data';

type AuthFixtures = {
    loggedInAsStandardUser: void;
    loggedInAsPerformanceUser: void;
    loginPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
loginPage: async ({ page }, use) =>{
        const loginPage = new LoginPage(page);
        await use(loginPage);
    
},
loggedInAsStandardUser: async ({ page }, use) =>{
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard.username, 
    SauceDemoUsers.standard.password);  
    await page.waitForURL('**/inventory.html');
    await use();
},

//Auto login as performance user
loggedInAsPerformanceUser: async ({ page}, use) =>{
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.problem.username, 
    SauceDemoUsers.problem.password);  
    await use();
},

});

export {expect} from '@playwright/test';
