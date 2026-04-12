import { Page, Locator } from '@playwright/test';
import { BasePage } from './shared/BasePage';
export class CartPage extends BasePage{
    readonly pageTitle: Locator;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page){
        super(page);
        this.pageTitle = page.locator('.title');
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }   

    async goto(){
        await super.goto('https://www.saucedemo.com/cart.html');
    }

    async getCartItemNames(): Promise<string[]> {
        const items = await this.cartItems.all();
        const names: string[] = [];
        for (const item of items){
            const name = await item.locator('.inventory_item_name').textContent();
            if (name) {
                names.push(name);
            }
        }
        return names;
    }

    async removeItemByName(productName: string){
        const item = this.page.locator('.cart_item', { hasText: productName });
        await item.locator('button:has-text("Remove")').click();
    }

    async clickCheckout(){
        await this.checkoutButton.click();
    }

    async clickContinueShopping(){
        await this.continueShoppingButton.click();
    }

    async getItemPrice(productName: string): Promise<string> {
        const item = this.page.locator('.cart_item', { hasText: productName });
        return await item.locator('.inventory_item_price').textContent() || '';
    }

    async isItemInCart(productName: string): Promise<boolean> {
        const item = this.page.locator('.cart_item', { hasText: productName });
        return await item.isVisible();
    }
    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async getCartItemDetails(productName: string): Promise<{ name: string; quantity: number }> {
        const item = this.page.locator('.cart_item', { hasText: productName });
        const name = (await item.locator('.inventory_item_name').textContent())?.trim() || '';
        const quantityText = (await item.locator('.cart_quantity').textContent())?.trim() || '0';
        const quantity = Number.parseInt(quantityText, 10) || 0;
        return { name, quantity };
    }

    async getProductDescription(productName: string): Promise<string> {
        const item = this.page.locator('.cart_item', { hasText: productName });
        return await item.locator('.inventory_item_desc').textContent() || '';
    }

}
