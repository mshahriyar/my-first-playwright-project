import {test, expect} from '../../../fixtures/saucedemo';

import productsData from '../../../test-data/saucedemo-products.json';
import { loginAsStandardUser } from '../../../utils/helpers';

test.describe('SauceDemo Login Tests with JSON Data', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsStandardUser(page)
    });
    for (const product of productsData){
        test(`verify product ${product.name} is displayed`, async ({ productPage, page }) => {
            await productPage.addProductToCartByName(product.name);
            const isInCart = await productPage.isProductInCart(product.name);
            expect(isInCart).toBe(product.expectedInCart);
            const price = await productPage.getProductPrice(product.name);
            expect(price).toBe(product.price);
        });
    }
})
