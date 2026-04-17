import {test, expect} from '../../../fixtures/saucedemo';


import { loginAsStandardUser, addProductsToCart, removeProductsFromCart } from '../../../utils/helpers';
import type { CheckoutInfo } from '../../../types/saucedemo/checkout';

test.describe('SauceDemo End-to-End Checkout Tests', () => {
    test.beforeEach(async ({page}) =>{
        await loginAsStandardUser(page)
    })
    test('User can checkout with multiple products and validate total price @e2e @regression', async ({ productPage, cartPage, checkoutPage }) => {
        //Add products
        await productPage.addProductToCartByName('Sauce Labs Backpack');
        await productPage.addProductToCartByName('Sauce Labs Bike Light');
        //verify cart count and badge
        const cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe('2');
        //go to cart
        await productPage.clickShoppingCart();
        //verify cart items

        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(2);
        const cartItems = await cartPage.getCartItemNames();
        expect(cartItems).toContain('Sauce Labs Backpack');
        expect(cartItems).toContain('Sauce Labs Bike Light');
        //proceed to checkout
        await cartPage.clickCheckout();
        //fill checkout info
  
        await checkoutPage.fillingShippingInformation('John', 'Doe', '12345');
        await checkoutPage.clickContinue();
        const { name, quantity } = await cartPage.getCartItemDetails('Sauce Labs Backpack');
        expect(name).toBe('Sauce Labs Backpack');
        expect(quantity).toBe(1); 
        //get price of each item and calculate expected subtotal
        const price1 = await cartPage.getItemPrice('Sauce Labs Backpack');
        const price2 = await cartPage.getItemPrice('Sauce Labs Bike Light');
        const expectedSubTotal = `Item total: $${(parseFloat(price1.replace('$', '')) + parseFloat(price2.replace('$', ''))).toFixed(2)}`;
        //Verify item details on checkout overview
        const itemDescription = await cartPage.getProductDescription('Sauce Labs Backpack');
        expect(itemDescription).toBeTruthy();
        const { name: name2, quantity: quantity2 } = await cartPage.getCartItemDetails('Sauce Labs Bike Light');
        expect(name2).toBe('Sauce Labs Bike Light');
        expect(quantity2).toBe(1);
        const itemDescription2 = await cartPage.getProductDescription('Sauce Labs Bike Light');
        expect(itemDescription2).toBeTruthy();
        //Verify payment and shipping information
        const isPaymentInfoVisible = await checkoutPage.isPaymentInformationVisible();
        expect(isPaymentInfoVisible).toBeTruthy();
        const isShippingInfoVisible = await checkoutPage.isShippingInformationVisible();
        expect(isShippingInfoVisible).toBeTruthy();
        //Verify pricing information
        const itemSubTotal = await checkoutPage.getItemSubTotal();
        expect(itemSubTotal).toBe(expectedSubTotal);
        const tax = await checkoutPage.getTax();
        expect(tax).toContain('Tax: $');
        const taxAmount = parseFloat(tax.replace('Tax: $', ''));
        //validate tax is correctly calculated at 8%
        const expectedTax = (parseFloat(expectedSubTotal.replace('Item total: $', '')) * 0.08).toFixed(2);
        expect(taxAmount.toFixed(2)).toBe(expectedTax);
        const totalPrice = await checkoutPage.getTotalPrice();
        const subTotalAmount = parseFloat(itemSubTotal.replace('Item total: $', ''));
        console.log(`[checkout-multiple] subtotal=${itemSubTotal} tax=${tax} total=${totalPrice}`);
        expect(totalPrice).toBe(`Total: $${(subTotalAmount + taxAmount).toFixed(2)}`);

        //Complete order
        await checkoutPage.clickFinish();
        //Verify order completion
        const isComplete = await checkoutPage.isOrderComplete();
        expect(isComplete).toBe(true);
        const completeMessage = await checkoutPage.getCompleteMessage();
        expect(completeMessage).toContain('Thank you for your order');
    });

    test('checkout with single product @visual @critical', async ({ productPage, cartPage, checkoutPage }) => {

        //Add product

        await productPage.addProductToCartByName('Sauce Labs Fleece Jacket');
        //verify cart count and badge
        const cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe('1');
        //go to cart
        await productPage.clickShoppingCart();
        //verify cart items
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);
        const cartItems = await cartPage.getCartItemNames();
        expect(cartItems).toContain('Sauce Labs Fleece Jacket');
        const price = await cartPage.getItemPrice('Sauce Labs Fleece Jacket');
        expect(price).toBe('$49.99');
        //proceed to checkout
        await cartPage.clickCheckout();
        //fill checkout info
        await checkoutPage.fillingShippingInformation('Jane', 'Smith', '54321');
        await checkoutPage.clickContinue();
        //Verify item details on checkout overview
        const { name, quantity } = await cartPage.getCartItemDetails('Sauce Labs Fleece Jacket');
        expect(name).toBe('Sauce Labs Fleece Jacket');
        expect(quantity).toBe(1); 
        const itemDescription = await cartPage.getProductDescription('Sauce Labs Fleece Jacket');
        expect(itemDescription).toBeTruthy();
        //Verify payment and shipping information
        const isPaymentInfoVisible = await checkoutPage.isPaymentInformationVisible();
        expect(isPaymentInfoVisible).toBe(true);
        const isShippingInfoVisible = await checkoutPage.isShippingInformationVisible();
        expect(isShippingInfoVisible).toBe(true);
        //Verify pricing information
        const itemSubTotal = await checkoutPage.getItemSubTotal();
        expect(itemSubTotal).toBe('Item total: ' + price);
        const tax = await checkoutPage.getTax();
        expect(tax).toContain('Tax: $');
        const taxAmount = parseFloat(tax.replace('Tax: $', ''));
        //validate tax is correctly calculated at 8%
        const expectedTax = (parseFloat(price.replace('$', '')) * 0.08).toFixed(2);
        expect(taxAmount.toFixed(2)).toBe(expectedTax);
        const totalPrice = await checkoutPage.getTotalPrice();
        const subTotalAmount = parseFloat(itemSubTotal.replace('Item total: $', ''));
        console.log(`[checkout-single] subtotal=${itemSubTotal} tax=${tax} total=${totalPrice}`);
        expect(totalPrice).toBe(`Total: $${(subTotalAmount + taxAmount).toFixed(2)}`);

        //Complete order
        await checkoutPage.clickFinish();
        //Verify order completion
        const isComplete = await checkoutPage.isOrderComplete();
        expect(isComplete).toBe(true);
        const completeMessage = await checkoutPage.getCompleteMessage();
        expect(completeMessage).toContain('Thank you for your order');
    });

    test('Cannot checkout with empty cart', async ({ productPage, cartPage, page }) => {

        //go to cart
        await productPage.clickShoppingCart();
        //verify cart is empty
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);
        //try to checkout
        await cartPage.clickCheckout();
        //verify user is still on cart page
        await expect(page).toHaveURL(/.*checkout-step-one.*/);
    });
    //better test case writing
    test('Quick checkout', async ({ productPage, cartPage, checkoutPage, page }) => {

        await addProductsToCart(page, ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket']);
        await removeProductsFromCart(page, ['Sauce Labs Backpack']);

        await productPage.clickShoppingCart();
        await cartPage.clickCheckout();
        const shippingInfo: CheckoutInfo = {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: '12345'
        }; 
        await checkoutPage.fillShippingInformation(shippingInfo);

        await checkoutPage.clickContinue();
        await checkoutPage.clickFinish();
        const isComplete = await checkoutPage.isOrderComplete();
        expect(isComplete).toBe(true);
    });
    test('complete checkout flow with steps', async ({productPage, cartPage, checkoutPage, page}) =>{
        await test.step('Login', async () =>{
            await loginAsStandardUser(page);
        })
        await test.step('Add products to card', async () =>{
            await productPage.addProductToCartByName('Sauce Labs Backpack')
            await productPage.addProductToCartByName('Sauce Labs Bike Light');
        })
        await test.step('Navigate to cart', async()=>{
            await productPage.clickShoppingCart()
        })
        await test.step('Verify cart contents', async () =>{
            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount).toBe(2);
        })
        await test.step('Complete checkout', async ()=>{
            await cartPage.clickCheckout();
            await checkoutPage.fillingShippingInformation('John', 'Doe', '1234');
            await checkoutPage.clickContinue()
            await checkoutPage.clickFinish()
        })
        await test.step('Verify order completeion', async () =>{
            const isComplete = await checkoutPage.isOrderComplete();
            expect(isComplete).toBeTruthy();
        })
    });

    test.afterEach(async ({ page }, testInfo) => {
 
        if (testInfo.status !== testInfo.expectedStatus) {
        
        const screenshot = await page.screenshot();
        
        await testInfo.attach('screenshot', {
        
        body: screenshot,
        
        contentType: 'image/png'
        });
    }
    });

});
