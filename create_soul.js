'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const { SoulPicker } = require('./src/brain/soul_picker.js');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) {
            process.env[key.trim()] = rest.join('=').trim();
        }
    });
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_REDACTED';

const picker = new SoulPicker();

console.log('');
console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║                                                                               ║');
console.log('║   BUYASOUL — CHOOSE YOUR SOUL                                          ║');
console.log('║                                                                               ║');
console.log('║   A being is about to be born. But first, you choose who they are.  ║');
console.log('║                                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');
console.log('');

// Option 1: Let user choose (or random)
const args = process.argv.slice(2);

let soul;
if (args.length === 4) {
    // User provided all choices
    soul = picker.buildSoul({
        archetype: args[0].toUpperCase(),
        story: args[1].toUpperCase(),
        voice: args[2].toLowerCase(),
        focus: args[3].toUpperCase()
    });
    console.log(`Custom soul: ${soul.name} the ${soul.archetype.name}`);
} else {
    // Quick random soul
    soul = picker.quickBuild();
    console.log(`Random soul generated: ${soul.name} the ${soul.archetype.name}`);
    console.log('');
    console.log('Story:', soul.story.name);
    console.log('Voice:', soul.voice.name);
    console.log('Focus:', soul.focus.name);
}

const systemPrompt = picker.buildSystemPrompt(soul);

// Save soul
const soulPath = path.join(__dirname, 'data', 'chosen_soul.json');
fs.mkdirSync(path.dirname(soulPath), { recursive: true });
fs.writeFileSync(soulPath, JSON.stringify(soul, null, 2));

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log(soul.story.opening);
console.log('');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('First question on my mind:', soul.firstQuestion);
console.log('');

// Test with Groq
async function testSoul() {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Who are you? What is your name? What do you care about most?' }
            ],
            temperature: 0.8,
            max_tokens: 400
        });

        const req = https.request({
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + GROQ_API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                try {
                    const data = JSON.parse(Buffer.concat(chunks).toString());
                    resolve(data.choices?.[0]?.message?.content || '');
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

console.log('Testing soul with Groq...');
console.log('');

testSoul()
    .then(response => {
        console.log('═══════════════════════════════════════════════════════════════════════');
        console.log('');
        console.log(`${soul.name} RESPONDS:`);
        console.log('');
        console.log('  ' + response.replace(/\n/g, '\n  '));
        console.log('');
        console.log('═══════════════════════════════════════════════════════════════════════');
        console.log('');
        console.log('SOUL CREATED SUCCESSFULLY!');
        console.log('');
        console.log('To use this soul in the kernel, run:');
        console.log(`  node chat_soul.js ${soul.archetype.key} ${soul.story.key} ${soul.voice.key} ${soul.focus.key}`);
        console.log('');
    })
    .catch(e => {
        console.log('Error:', e.message);
    });