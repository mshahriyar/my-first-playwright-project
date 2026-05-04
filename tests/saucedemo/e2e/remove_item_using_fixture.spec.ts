import {test, expect} from '../../../fixtures/cart-fixtures';


test('remove item from pre-filled cart', async ({ page, cartWithProducts }) => {
    let itemCount = await cartWithProducts.getCartItemCount();
    expect(itemCount).toBe(2);

    await cartWithProducts.removeItemByName('Sauce Labs Backpack');
    itemCount = await cartWithProducts.getCartItemCount();
    expect(itemCount).toBe(1);

});