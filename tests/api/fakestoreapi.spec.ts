import {test, expect} from '@playwright/test';

const BASE_URL = process.env.FAKESTORE_BASE_URL ?? 'https://fakestoreapi.com';
const shouldSkipExternalTestsInCi =
  !!process.env.CI && !['1', 'true', 'yes'].includes((process.env.FAKESTORE_ALLOW_EXTERNAL ?? '').toLowerCase());
const shouldSkipWriteTestsInCi =
  !!process.env.CI && !['1', 'true', 'yes'].includes((process.env.FAKESTORE_ALLOW_WRITES ?? '').toLowerCase());

async function expectStatus(response: import('@playwright/test').APIResponse, expected: number) {
  const actual = response.status();
  if (actual !== expected) {
    const body = await response.text();
    throw new Error(
      `Unexpected status ${actual} (expected ${expected}). ` +
        `This often happens in CI when the public API blocks runner IPs.\n` +
        `URL: ${response.url()}\n` +
        `Body: ${body.slice(0, 2000)}`
    );
  }
}

test.describe('FakeStoreAPI Tests', () => {
    test.skip(
      shouldSkipExternalTestsInCi,
      'External API tests disabled in CI unless FAKESTORE_ALLOW_EXTERNAL=true (public APIs often block CI runner IPs).'
    );

    test('GET /products - should return a list of products', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products`);
        await expectStatus(response, 200);
        const products = await response.json();
        expect(products).toBeInstanceOf(Array);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0]).toHaveProperty('id');
        expect(products[0]).toHaveProperty('title');
        expect(products[0]).toHaveProperty('price');
    });
    test('GET - Fetch single product ', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products/1`);
        await expectStatus(response, 200);
        const products = await response.json();
        expect(products.id).toBe(1);
        expect(products.title).toBeTruthy();
        expect(products.price).toBeTruthy();
        expect(products.category).toBeTruthy();
    });
    test('GET - Fetch All Categories ', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products/categories`);
        await expectStatus(response, 200);
        const categories = await response.json();
        expect(categories).toBeInstanceOf(Array);
        expect(categories.length).toBeGreaterThan(0);
        expect(categories).toContain('electronics');
    });
    test('GET - Fetch Products by Category', async ({ request }) => {
        const category = 'electronics';
        const response = await request.get(`${BASE_URL}/products/category/${category}`);
        await expectStatus(response, 200);
        const products = await response.json();
        expect(products).toBeInstanceOf(Array);
        expect(products.length).toBeGreaterThan(0);
        for (const product of products){
            expect(product.category).toBe(category);
        }
    });
    test('POST - Create a new product', async ({ request }) => {
        test.skip(
          shouldSkipWriteTestsInCi,
          'Skipped in CI unless FAKESTORE_ALLOW_WRITES=true (public API often returns 403 from CI runners).'
        );
        const newProduct = {
            title: 'Test Product',
            price: 19.99,
            description: 'This is a test product created during API testing.',
            image: 'https://i.pravatar.cc',
            category: 'electronics'
        }
        const response = await request.post(`${BASE_URL}/products`, {data: newProduct});
        await expectStatus(response, 201);
        const createdProduct = await response.json();
        expect(createdProduct).toHaveProperty('id');
        expect(createdProduct.title).toBe(newProduct.title);
        expect(createdProduct.price).toBe(newProduct.price);
        expect(createdProduct.description).toBe(newProduct.description);
        expect(createdProduct.image).toBe(newProduct.image);
        expect(createdProduct.category).toBe(newProduct.category);
    });
    test('Get - Fetch user cart', async ({ request }) => {
        const userId = 1;
        const response = await request.get(`${BASE_URL}/carts/${userId}`);
        await expectStatus(response, 200);
        const cart = await response.json();
        expect(cart).toHaveProperty('id');
        expect(cart.userId).toBeTruthy();
        expect(cart.products).toBeInstanceOf(Array);
    });
    test('POST - User login', async ({ request }) => {
        test.skip(
          shouldSkipWriteTestsInCi,
          'Skipped in CI unless FAKESTORE_ALLOW_WRITES=true (public API often returns 403 from CI runners).'
        );
        const credentials ={
            username: 'mor_2314',
            password: '83r5^_'
        }
        const response = await request.post(`${BASE_URL}/auth/login`, {data: credentials});
        await expectStatus(response, 201);
        const loginResponse = await response.json();
        expect(loginResponse).toHaveProperty('token');
        expect(loginResponse.token).toBeTruthy();
    });

});
