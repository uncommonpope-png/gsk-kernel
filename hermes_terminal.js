#!/usr/bin/env node
const http = require('http');
const readline = require('readline');

const OLLAMA_URL = 'http://127.0.0.1:11434';
const MODEL = 'hermes3:3b';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ollamaGenerate(prompt, model = MODEL) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            model,
            prompt,
            stream: false,
            options: { temperature: 0.72, num_predict: 2048 }
        });
        const req = http.request({
            hostname: '127.0.0.1', port: 11434, path: '/api/generate',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve(JSON.parse(data).response || ''); }
                catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.setTimeout(120000, () => { req.destroy(); reject(new Error('Timeout')); });
        req.write(body);
        req.end();
    });
}

console.log('');
console.log('  ╔═══════════════════════════════════════════════╗');
console.log('  ║         HERMES 3 TERMINAL                     ║');
console.log('  ║     Function Calling · 3B Parameters          ║');
console.log('  ╚═══════════════════════════════════════════════╝');
console.log('  Type :exit to quit, :gsk to switch to GSK brain');
console.log('  Type :models to list all available models');
console.log('');

let currentModel = MODEL;

function prompt() {
    rl.question(`Hermes [${currentModel}]> `, async (input) => {
        if (!input.trim()) { prompt(); return; }
        if (input === ':exit') { rl.close(); return; }
        if (input === ':gsk') {
            currentModel = 'gsk-brain';
            console.log('  Switched to gsk-brain\n');
            prompt();
            return;
        }
        if (input.startsWith(':model ')) {
            currentModel = input.slice(7).trim();
            console.log(`  Switched to ${currentModel}\n`);
            prompt();
            return;
        }
        if (input === ':models') {
            try {
                const body = JSON.stringify({});
                const req = http.request({
                    hostname: '127.0.0.1', port: 11434, path: '/api/tags', method: 'GET',
                }, (res) => {
                    let data = '';
                    res.on('data', c => data += c);
                    res.on('end', () => {
                        const parsed = JSON.parse(data);
                        console.log('\n  Available models:');
                        for (const m of parsed.models || []) {
                            console.log(`    ${m.name}`);
                        }
                        console.log('');
                        prompt();
                    });
                });
                req.on('error', () => { console.log('  Could not fetch models\n'); prompt(); });
                req.end();
            } catch (e) { console.log('  Error\n'); prompt(); }
            return;
        }
        console.log('');
        try {
            const response = await ollamaGenerate(input, currentModel);
            console.log(`  ${response}`);
        } catch (e) {
            console.log(`  Error: ${e.message}`);
        }
        console.log('');
        prompt();
    });
}

prompt();
