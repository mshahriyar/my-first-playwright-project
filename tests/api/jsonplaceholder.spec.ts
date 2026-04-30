import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder API Tests', () => {
    test('GET /posts - should return a list of posts', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/posts`);
        expect(response.status()).toBe(200);
        const posts = await response.json();
        expect(posts).toBeInstanceOf(Array);
        expect(posts.length).toBeGreaterThan(0);
        expect(posts[0]).toHaveProperty('id');
        expect(posts[0]).toHaveProperty('title');
        expect(posts[0]).toHaveProperty('body');
    });

    test('GET /posts/1 - should return a single post', async ({ request }) => {
        const postId = 1;
        const response = await request.get(`${BASE_URL}/posts/${postId}`);
        expect(response.status()).toBe(200);
        const post = await response.json();
        expect(post).toHaveProperty('id', postId);
        expect(post).toHaveProperty('userId', 1);
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('body');
        expect(post.title).toBeTruthy();
        expect(post.body).toBeTruthy();
    });

    test('POST /posts - should create a new post', async ({ request }) => {
        const newPost = {
            title: 'Test Post Shery',
            body: 'This is a test post created by Playwright API testing.',
            userId: 1
        };
        const response = await request.post(`${BASE_URL}/posts`, { data: newPost });
        expect(response.status()).toBe(201);
        const createdPost = await response.json();
        expect(createdPost).toHaveProperty('id');
        expect(createdPost.title).toBe(newPost.title);
        expect(createdPost.body).toBe(newPost.body);
        expect(createdPost.userId).toBe(newPost.userId);
    });

    test('PUT /posts/1 - should update an existing post', async ({ request }) => {
        const updatedPost = {
            id: 1,
            title: 'This is an updated test post.',
            body: 'This is an updated test post.',
            userId: 1
        };
        const response = await request.put(`${BASE_URL}/posts/1`, { data: updatedPost });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('id', 1);
        expect(responseBody.title).toBe(updatedPost.title);
        expect(responseBody.body).toBe(updatedPost.body);
        expect(responseBody.userId).toBe(updatedPost.userId);
    });

    test('DELETE /posts/1 - should delete a post', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/posts/1`);
        expect(response.status()).toBe(200);
        const deleteResponseBody = await response.json();
        expect(deleteResponseBody).toEqual({});
    });

    test('GET /posts?userId=1 - should return posts for a specific user', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/posts?userId=1`);
        expect(response.status()).toBe(200);
        const posts = await response.json();
        expect(posts).toBeInstanceOf(Array);
        expect(posts.length).toBeGreaterThan(0);
        for (const post of posts) {
            expect(post.userId).toBe(1);
            expect(post).toHaveProperty('id');
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('body');
        }
    });
});
