import { test, expect } from '../../../fixtures/saucedemo';
import type { CheckoutInfo } from '../../../types/saucedemo/checkout';
import { faker } from '@faker-js/faker';



test.describe('SauceDemo Checkout Tests with Faker', () => {
    test('User can checkout with faker generated data', async ({ authenticatedPage, productPage, cartPage, checkoutPage }) => {
        //generate random data
        const checkoutData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            postalCode: faker.location.zipCode()
        };
        //login and add products

        await productPage.addProductToCartByName('Sauce Labs Backpack');
        await productPage.addProductToCartByName('Sauce Labs Bike Light');
        await productPage.goToCart();
        await cartPage.clickCheckout();
        //checkout with faker data
        const shippingInfo: CheckoutInfo ={
            firstName: checkoutData.firstName,
            lastName: checkoutData.lastName,
            postalCode: checkoutData.postalCode
        }
        await checkoutPage.fillShippingInformation(shippingInfo);
        await checkoutPage.clickContinue();
        await checkoutPage.clickFinish();
        await expect(authenticatedPage).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    });

    test('Checkout with multiple random users data', async ({ authenticatedPage, productPage, cartPage, checkoutPage }) => {  
        for (let i = 0; i < 5; i++){
            const userData = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                postalCode: faker.location.zipCode()
            }
        
            console.log(`Test ${i + 1}: ${userData.firstName} ${userData.lastName}, Postal Code: ${userData.postalCode}`);
            //run test with this data
            await productPage.addProductToCartByName('Sauce Labs Backpack');
            await productPage.addProductToCartByName('Sauce Labs Bike Light');
            await productPage.goToCart();
            await cartPage.clickCheckout();
            const shippingInfo: CheckoutInfo ={
                firstName: userData.firstName,
                lastName: userData.lastName,
                postalCode: userData.postalCode
            }   
            await checkoutPage.fillShippingInformation(shippingInfo);
            await checkoutPage.clickContinue();

            await checkoutPage.clickFinish();
            await expect(authenticatedPage).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
            await authenticatedPage.locator('[data-test="back-to-products"]').click();
            await productPage.waitForProductsToLoad();
        }
    });

 
});
