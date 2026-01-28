
const fs = require('fs');

const token = 'ec62b5d57b781b20e5dc9074c2d6256ae87dab0e8e158f837c4c9e1d55f461928f535ed2e03569968cee650678e1067c6bdca92a0f6584ca5b8e835d09384a0b8d50d457cb9da84dcc69c8eed2545948f03fb4417d8f103acb66c82ecc40dd8ed277d03584875aca37771dd3ad424a585b25f1ee9d4e9f8c8545137f38f037a8';
let urlBase = 'https://motivated-nature-ea4be5c747.strapiapp.com/api';

function log(msg) {
    console.log(msg);
    fs.appendFileSync('debug.log', msg + '\n');
}

async function test(path, method) {
    const fullUrl = urlBase + path;
    log(`Testing ${method} ${fullUrl}...`);
    try {
        const res = await fetch(fullUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: method === 'POST' ? JSON.stringify({
                data: {
                    title: 'Test',
                    slug: 'test-' + Date.now(),
                    publishedAt: new Date().toISOString(),
                }
            }) : undefined
        });
        log(`Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        log('Body: ' + text.substring(0, 500)); // Limit length
    } catch (e) {
        log('Fetch error: ' + e.message);
    }
    log('---');
}

async function run() {
    try {
        fs.writeFileSync('debug.log', ''); // Clear file
    } catch (e) { }

    await test('/blogs', 'GET');
    await test('/blogs', 'POST');

    await test('/blog', 'GET');
    await test('/blog', 'POST');

    await test('/users', 'GET');
}

run();
