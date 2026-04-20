import {test as base} from '@playwright/test';

import { LoginPage } from '../page-objects/saucedemo/LoginPage';
import { ProductPage } from '../page-objects/saucedemo/ProductPage';
import { CartPage} from '../page-objects/saucedemo/CartPage';
import { SauceDemoUsers } from '../utils/demo-user-data';
import { log } from 'node:console';

type CartFixtures = {
    cartWithProducts: CartPage;
};

export const test = base.extend<CartFixtures>({
    cartWithProducts: async ({page}, use) =>{
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(
            SauceDemoUsers.standard.username,
            SauceDemoUsers.standard.password
        )
        const productPage = new ProductPage(page);
        await productPage.addProductToCartByName('Sauce Labs Backpack')
        await productPage.addProductToCartByName('Sauce Labs Bike Light')
        await productPage.goToCart();
        const cartPage = new CartPage(page)
        
    }
})