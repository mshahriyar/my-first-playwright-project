import {test, expect}   from '@playwright/test';   
import { request } from 'node:http';

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

    test('GET - Fetch single post', async ({ request }) => {
        const postId = 1;
        const response = await request.get(`${BASE_URL}/posts/${postId}`);
        expect(response.status()).toBe(200);
        const posts = await response.json();
        expect(posts.id).toBe(postId);
        expect(posts.userId).toBe(1);
        expect(posts.title).toBeTruthy();
        expect(posts.body).toBeTruthy();
    });
    test('POST - Create a new post', async ({ request }) => {
        const newPost ={
            title: 'Test Post',
            body: 'This is a test post created during API testing.',
            userId: 1
        }
        const response = await request.post(`${BASE_URL}/posts`, {data: newPost});
        expect(response.status()).toBe(201);
        const createdPost = await response.json();
        expect(createdPost).toHaveProperty('id');
        expect(createdPost.title).toBe(newPost.title);
        expect(createdPost.body).toBe(newPost.body);
        expect(createdPost.userId).toBe(newPost.userId);
        expect(createdPost.id).toBeTruthy();
    });
    test('PUT - Update an existing post', async ({ request }) => {
        const postId = 1;
        const updatedPost = {
            id: postId,
            title: 'Updated Test Post',
            body: 'This post has been updated during API testing.',
            userId: 1
        }
        const response = await request.put(`${BASE_URL}/posts/${postId}`, {data: updatedPost});
        expect(response.status()).toBe(200);
        const updatedPostResponse = await response.json();
        expect(updatedPostResponse.id).toBe(postId);
        expect(updatedPostResponse.title).toBe(updatedPost.title);
        expect(updatedPostResponse.body).toBe(updatedPost.body);
        expect(updatedPostResponse.userId).toBe(updatedPost.userId);
    });
    test('DELETE - Delete a post', async ({ request }) => {
        const postId = 1;
        const response = await request.delete(`${BASE_URL}/posts/${postId}`);
        expect(response.status()).toBe(200);
    });

    test('GET - Fetch post for specific user', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/posts?userId=1`);
        expect(response.status()).toBe(200);
        const posts = await response.json();
        expect(posts).toBeInstanceOf(Array);
        expect(posts.length).toBeGreaterThan(0);
        for (const post of posts){
            expect(post.userId).toBe(1);
            expect(post).toHaveProperty('id');
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('body');
        }

    });
});