import { test as base, type Page } from '@playwright/test';
import {LoginPage} from '../page-objects/saucedemo/LoginPage';
import {ProductPage} from '../page-objects/saucedemo/ProductPage'
import { CheckoutPage } from '../page-objects/saucedemo/CheckoutPage';
import { CartPage } from '../page-objects/saucedemo/CartPage';

type SauceDemoFixtures = {
    loginPage: LoginPage;
    productPage: ProductPage;
    authenticatedPage: Page;
    cartPage: CartPage;
    checkoutPage: CheckoutPage

};    
export const test = base.extend<SauceDemoFixtures>({
    loginPage: async ({page}, use) =>{
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    authenticatedPage:async ({page, loginPage}, use) =>{
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await use(page);  
    },
    productPage: async ({ authenticatedPage }, use) =>{
        const productPage = new ProductPage(authenticatedPage);
        await use(productPage)
    },
    cartPage: async ({ authenticatedPage }, use) =>{
        const cartPage = new CartPage(authenticatedPage);
        await use(cartPage)
    },
    checkoutPage: async ({ authenticatedPage }, use) =>{
        const checkoutPage = new CheckoutPage(authenticatedPage)
        await use(checkoutPage)
    }

});

export {expect} from '@playwright/test'
