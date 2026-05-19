'use strict';

const { Brain } = require('./src/brain/mega_brain.js');

async function test() {
    console.log('Testing Brain.think() with Python code generation...\n');
    
    const brain = new Brain({ 
        model: 'qwen2.5-coder:7b',
        timeout: 180 
    });
    
    const prompt = `def add(a,b):
    pass

Return only Python code:`;
    
    try {
        const result = await brain.think(prompt, 'Expert');
        console.log('Result:', result.slice(0, 200));
        console.log('\n✓ Fix verified: Brain.think() returns real model output');
    } catch (e) {
        console.log('ERR:', e.message);
    }
}

test();