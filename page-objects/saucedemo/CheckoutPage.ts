import {Page, Locator} from '@playwright/test';
import { BasePage } from './shared/BasePage';   
import type { CheckoutInfo } from '../../types/saucedemo/checkout';

export class CheckoutPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator
    readonly finishButton: Locator;
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly backHomeButton: Locator;
    readonly errorMessage: Locator;
    readonly paymentInformation: Locator;
    readonly shippingInformation: Locator
    readonly itemSubTotal: Locator;
    readonly tax: Locator;
    readonly totalPrice: Locator;

    constructor(page: Page){
        super(page);
        this.firstNameInput = page.locator('#first-name');
        this.lastNameInput = page.locator('#last-name');
        this.postalCodeInput = page.locator('#postal-code');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('.complete-header');
        this.completeText = page.locator('.complete-text');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.paymentInformation = page.locator('[data-test="payment-info-label"]');
        this.shippingInformation = page.locator('[data-test="shipping-info-label"]');
        this.itemSubTotal = page.locator('[data-test="subtotal-label"]');
        this.tax = page.locator('[data-test="tax-label"]');
        this.totalPrice = page.locator('[data-test="total-label"]');

    }

    async fillingShippingInformation(firstName: string, lastName: string, postalCode: string){
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }
    
    async clickContinue(){
        await this.continueButton.click();
    }

    async clickFinish(){
        await this.finishButton.click();
    }
    
    async getCompleteMessage(): Promise<string>{
        return await this.completeHeader.textContent() || '';
    }
    
    async isOrderComplete(): Promise<boolean>{
        return await this.completeHeader.isVisible();
    }

    async clickBackHome(){
        await this.backHomeButton.click();
    }

    async getErrorMessage(): Promise<string>{
        return await this.errorMessage.textContent() || '';
    }

    async isPaymentInformationVisible(): Promise<boolean>{
        return await this.paymentInformation.isVisible();
    }

    async isShippingInformationVisible(): Promise<boolean>{
        return await this.shippingInformation.isVisible();
    }

    async getItemSubTotal(): Promise<string>{
        return await this.itemSubTotal.textContent() || '';
    }

    async getTax(): Promise<string>{
        return await this.tax.textContent() || '';
    }

    async getTotalPrice(): Promise<string>{
        return await this.totalPrice.textContent() || '';
    }

    async fillShippingInformation(info: CheckoutInfo){
        await this.firstNameInput.fill(info.firstName);
        await this.lastNameInput.fill(info.lastName);
        await this.postalCodeInput.fill(info.postalCode);
    }
}    
