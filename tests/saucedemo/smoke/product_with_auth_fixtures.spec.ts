import {test, expect} from '../../../fixtures/auth_fixtures';
import { ProductPage } from '../../../page-objects/saucedemo/ProductPage';

test('add product with auto login', async ({  page, loggedInAsStandardUser}) => {
    const productPage = new ProductPage(page);
    await productPage.addProductToCartByName('Sauce Labs Backpack');
    const cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe('1');

    const isInCart = await productPage.isProductInCart('Sauce Labs Backpack');
    expect(isInCart).toBe(true);

});

test('add problem user experience', async ({ page, loggedInAsPerformanceUser }) => {
    const productPage = new ProductPage(page);
    const startTime = Date.now();
    await productPage.addProductToCartByName('Sauce Labs Backpack');
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Time taken to add product to cart: ${duration} ms`);

    const cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe('1');

     const isInCart = await productPage.isProductInCart('Sauce Labs Backpack');
    expect(isInCart).toBe(true);
});