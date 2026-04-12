import { Page, Locator } from '@playwright/test';
import { BasePage } from './shared/BasePage';
//how to get enum from utils
import { SortOption } from '../../utils/saucedemo-data';
export class ProductPage extends BasePage {
    readonly pageTitle: Locator;
    readonly inventoryItems: Locator;
    readonly shoppingCartBadge: Locator;
    readonly shoppingCartLink: Locator;
    readonly sortDropdown: Locator;
    readonly burgerMenuButton: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page){
        super(page);
        this.pageTitle = page.locator('.title');
        this.inventoryItems = page.locator('.inventory_item');
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
        this.shoppingCartLink = page.locator('.shopping_cart_link');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.burgerMenuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    }


    async getProductCount(): Promise<number>{
        return await this.inventoryItems.count();
    }

    async getProductNames(): Promise<string[]> {
        const items = await this.inventoryItems.all()
        const names: string[] = [];
        for (const item of items){
            const name  = await item.locator('.inventory_item_name').textContent();
            if (name) {
                names.push(name);
            }
        }
        return names;
    }
    
    async addProductToCartByName(productName: string){
        const product = this.inventoryItems.filter({ hasText: productName });
        await product.locator('button:has-text("Add to cart")').click();
    }

    async removeProductFromCartByName(productName: string){
        const product = this.page.locator('.inventory_item', { hasText: productName });
        await product.locator('button:has-text("Remove")').click();
    }

    async getCartItemCount(): Promise<string> {
        if (await this.shoppingCartBadge.isVisible()){
            return await this. shoppingCartBadge.textContent() || '0';
        }
        else {
            return '0';
        }
    }
    async clickShoppingCart(){
        await this.shoppingCartLink.click();
    }

    async sortBy(option: SortOption){
        await this.sortDropdown.selectOption(option);
    }

    async getProductPrice(productName: string): Promise<string> {
        const product = this.inventoryItems.filter({ hasText: productName });
        return await product.locator('.inventory_item_price').textContent() || '';
    }

    async isProductInCart(productName: string): Promise<boolean> {
        const product = this.inventoryItems.filter({ hasText: productName });
        const remove = await product.locator('button:has-text("Remove")')
        const price = await product.locator('.inventory_item_price').textContent();
        const description = await product.locator('.inventory_item_desc').textContent();
        return await remove.isVisible() && price !== null && description !== null;
    }

    async goToCart(){
        await this.shoppingCartLink.click();
    }

    async isBurgerMenuVisible(): Promise<boolean> {
        return await this.burgerMenuButton.isVisible();
    }

    async openBurgerMenu(){
        await this.burgerMenuButton.click();
    }
    async isLogoutLinkVisible(): Promise<boolean> {
        return await this.logoutLink.isVisible();
    }

    async clickLogout(){
        await this.logoutLink.click();
    }
    async waitForProductsToLoad() {
        await this.page.waitForSelector('.inventory_item', {
        state: 'visible',
        timeout: 10000        
        });
    }
    async waitForCartBadgeUpdate(expectedCount: string) {
        await this.page.waitForFunction((count) => {
        const badge = document.querySelector('.shopping_cart_badge');        
        return badge?.textContent === count;        
        }, expectedCount);
    }


}
