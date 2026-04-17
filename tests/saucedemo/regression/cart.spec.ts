import { test, expect } from '../../../fixtures/saucedemo';

import { loginAsStandardUser, addProductsToCart } from '../../../utils/helpers';

test.describe('Cart Item Display Details', () => {
    test.beforeEach(async ({page}) =>{
        await loginAsStandardUser(page)
    })
    test('should display correct quantity for each cart item', async ({ productPage, cartPage, page }) => {
        // Add multiple items
        await addProductsToCart(page, ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt']);
        await productPage.clickShoppingCart();
        // Each item should have a quantity of 1
        const backpackDetails = await cartPage.getCartItemDetails('Sauce Labs Backpack');
        const bikeLightDetails = await cartPage.getCartItemDetails('Sauce Labs Bike Light');
        const tshirtDetails = await cartPage.getCartItemDetails('Sauce Labs Bolt T-Shirt');
        // Verify quantities
        expect(backpackDetails.quantity).toBe(1);
        expect(bikeLightDetails.quantity).toBe(1);
        expect(tshirtDetails.quantity).toBe(1);
        // Verify names match expected
        expect(backpackDetails.name).toBe('Sauce Labs Backpack');
        expect(bikeLightDetails.name).toBe('Sauce Labs Bike Light'); 
        expect(tshirtDetails.name).toBe('Sauce Labs Bolt T-Shirt'); 
    });
    test('should display product descriptions in cart', async ({productPage, cartPage}) => {
 
        // Add items with known descriptions
        await productPage.addProductToCartByName('Sauce Labs Backpack');
        await productPage.addProductToCartByName('Sauce Labs Onesie');
        await productPage.clickShoppingCart();
        
        // Get descriptions from cart
        const backpackDescription = await cartPage.getProductDescription('Sauce Labs Backpack');
        
        // Verify descriptions exist and have content
        expect(backpackDescription).toBeTruthy();
        expect(backpackDescription.length).toBeGreaterThan(0);
        expect(backpackDescription).toContain('carry.allTheThings()');
    
        });

});
