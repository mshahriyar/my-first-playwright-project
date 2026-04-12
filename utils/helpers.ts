import { Page} from '@playwright/test';

import { LoginPage} from '../page-objects/saucedemo/LoginPage';
import { ProductPage } from '../page-objects/saucedemo/ProductPage';
import { SauceDemoUsers } from './demo-user-data';

export async function loginAsStandardUser(page: Page) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);

};

export async  function addProductsToCart(page: Page, productNames: string[]) {
    const productPage = new ProductPage(page);
    for (const name of productNames){
        await productPage.addProductToCartByName(name);
    }
}
export async function removeProductsFromCart(page: Page, productNames: string[]) {
    const productPage = new ProductPage(page);
    for (const name of productNames){
        await productPage.removeProductFromCartByName(name);
    }
}
