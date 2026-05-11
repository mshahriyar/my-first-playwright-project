import { test, expect } from "@playwright/test";     

test.describe('Network Interception', () =>{
    test('should intercept and log API calls', async ({ page}) =>{
        const apiCalls: any[] = [];
        //listen to all requests
        page.on('request', request =>{
            if(request.url().includes('/api/') || request.url().includes('json')){
                apiCalls.push('${request.method()} ${request.url()}');
                console.log('Request: ', request.method(), request.url());  
            }
        });
        //listen to all responses
        page.on('response', response =>{
            if(response.url().includes('/api/') || response.url().includes('json')){
                console.log('Response: ', response.status(), response.url());
            }
        });
        await page.goto('https://jsonplaceholder.typicode.com/');
        console.log('Total API calls made during test: ', apiCalls.length, apiCalls); 
    });
});