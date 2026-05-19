'use strict';

const { Brain } = require('./src/brain/mega_brain.js');

async function test() {
    const brain = new Brain({ 
        model: 'qwen2.5-coder:7b', 
        timeout: 180,
        max_tokens: 50
    });
    
    console.log('Testing Brain.check()...');
    const check = await brain.check();
    console.log('check():', JSON.stringify(check));
    
    console.log('\nTesting Brain.think() with short prompt...');
    try {
        const result = await brain.think('Hi', '');
        console.log('think() result:', result ? result.slice(0, 100) : 'NULL');
    } catch (e) {
        console.log('ERROR:', e.message);
    }
}

test();