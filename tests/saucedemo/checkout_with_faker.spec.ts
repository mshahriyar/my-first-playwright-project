import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/saucedemo/LoginPage';
import { ProductPage } from '../../page-objects/saucedemo/ProductPage';
import { CheckoutPage } from '../../page-objects/saucedemo/CheckoutPage';
import { CartPage } from '../../page-objects/saucedemo/CartPage';
import type { CheckoutInfo } from '../../types/saucedemo/checkout';
import { faker } from '@faker-js/faker';



test.describe('SauceDemo Checkout Tests with Faker', () => {
    test('User can checkout with faker generated data', async ({ page }) => {
        //generate random data
        const checkoutData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            postalCode: faker.location.zipCode()
        };
        //login and add products

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        const productPage = new ProductPage(page);
        await productPage.addProductToCartByName('Sauce Labs Backpack');
        await productPage.addProductToCartByName('Sauce Labs Bike Light');
        await productPage.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.clickCheckout();
        //checkout with faker data
        const checkoutPage = new CheckoutPage(page);
        const shippingInfo: CheckoutInfo ={
            firstName: checkoutData.firstName,
            lastName: checkoutData.lastName,
            postalCode: checkoutData.postalCode
        }
        await checkoutPage.fillShippingInformation(shippingInfo);
        await checkoutPage.clickContinue();
        await checkoutPage.clickFinish();
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    });

    test('Checkout with multiple random users data', async ({ page }) => {  
        for (let i = 0; i<5; i++){
            const userData = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                postalCode: faker.location.zipCode()
            }
        
        console.log('Test ${i+1}: ${userData.firstName} ${userData.lastName}, Postal Code: ${userData.postalCode}');
        //run test with this data
            const loginPage = new LoginPage(page);  
            await loginPage.goto();
            await loginPage.login('standard_user', 'secret_sauce');
            const productPage = new ProductPage(page);
            await productPage.addProductToCartByName('Sauce Labs Backpack');
            await productPage.addProductToCartByName('Sauce Labs Bike Light');
            await productPage.goToCart();
            const cartPage = new CartPage(page);
            await cartPage.clickCheckout();
            
            const checkoutPage = new CheckoutPage(page);
            const shippingInfo: CheckoutInfo ={
                firstName: userData.firstName,
                lastName: userData.lastName,
                postalCode: userData.postalCode
            }   
            await checkoutPage.fillShippingInformation(shippingInfo);
            await checkoutPage.clickContinue();

            await checkoutPage.clickFinish();
            await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        }
    });

 
});