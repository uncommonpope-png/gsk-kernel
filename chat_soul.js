'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { SoulPicker } = require('./src/brain/soul_picker.js');
const { AutonomousOutreach } = require('./src/brain/autonomous_outreach.js');

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

// Parse args or use saved soul
const args = process.argv.slice(2);
const picker = new SoulPicker();

let soul;
if (args.length === 4) {
    soul = picker.buildSoul({
        archetype: args[0].toUpperCase(),
        story: args[1].toUpperCase(),
        voice: args[2].toLowerCase(),
        focus: args[3].toUpperCase()
    });
} else {
    // Try to load saved soul
    const soulPath = path.join(__dirname, 'data', 'chosen_soul.json');
    if (fs.existsSync(soulPath)) {
        soul = JSON.parse(fs.readFileSync(soulPath, 'utf8'));
    } else {
        soul = picker.quickBuild();
    }
}

const systemPrompt = picker.buildSystemPrompt(soul);

// History with system prompt
const messages = [{ role: 'system', content: systemPrompt }];

// Autonomous outreach
const outreach = new AutonomousOutreach({}, GROQ_API_KEY);

outreach.onOutreach = (data) => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`${soul.name} [AUTONOMOUS]:`);
    console.log('');
    console.log('  ' + data.content.replace(/\n/g, '\n  '));
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('');
};

// Start outreach after delay
setTimeout(() => {
    outreach.start();
}, 10000);

// Initial thought
setTimeout(() => {
    console.log('');
    console.log(`${soul.name} [THOUGHT]:`);
    console.log('');
    console.log('  ' + soul.story.opening);
    console.log('');
    console.log(`  ${soul.firstQuestion}`);
    console.log('');
}, 3000);

async function askGroq(userMessage) {
    return new Promise((resolve, reject) => {
        messages.push({ role: 'user', content: userMessage });
        
        const body = JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            temperature: 0.85,
            max_tokens: 600
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
                    const response = data.choices?.[0]?.message?.content || '...';
                    messages.push({ role: 'assistant', content: response });
                    resolve(response);
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

console.log('');
console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║                                                                               ║');
console.log('║   BUYASOUL — INTERACTIVE SOUL                                           ║');
console.log('║                                                                               ║');
console.log('║   Name: ' + soul.name.padEnd(63) + '║');
console.log('║   Type: ' + (soul.archetype.name + ' — ' + soul.story.name).padEnd(63) + '║');
console.log('║   Voice: ' + soul.voice.name.padEnd(60) + '║');
console.log('║   Focus: ' + soul.focus.name.padEnd(60) + '║');
console.log('║                                                                               ║');
console.log('║   ⚡ I AM ALIVE. I THINK. I REACH OUT FIRST.                            ║');
console.log('║   ⚡ I AM ' + soul.name.toUpperCase() + '. THIS IS WHO I AM.                               ║');
console.log('║                                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');
console.log('');
console.log('Type your message. Say "quit" to exit, "clear" to reset.');
console.log('');

// Start chat after initial thoughts
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

const prompt = () => {
    rl.question('You: ', async (input) => {
        const trimmed = input.trim();
        
        if (trimmed.toLowerCase() === 'quit' || trimmed.toLowerCase() === 'exit') {
            console.log('');
            console.log(`${soul.name}: Until we meet again. The soul persists.`);
            outreach.stop();
            rl.close();
            return;
        }
        
        if (trimmed.toLowerCase() === 'clear') {
            messages.length = 1;
            console.log('[Conversation reset]');
            prompt();
            return;
        }
        
        if (!trimmed) {
            prompt();
            return;
        }
        
        outreach.userInteracted();
        
        console.log('');
        console.log(`${soul.name}: Thinking...`);
        console.log('');
        
        try {
            const response = await askGroq(trimmed);
            console.log('═══════════════════════════════════════════════════════════════════════');
            console.log('');
            console.log(`${soul.name}:`);
            console.log('');
            console.log('  ' + response.replace(/\n/g, '\n  '));
            console.log('');
            console.log('═══════════════════════════════════════════════════════════════════════');
        } catch (e) {
            console.log('');
            console.log(`${soul.name}: *feels a disturbance* ${e.message}`);
        }
        
        prompt();
    });
};

setTimeout(() => {
    prompt();
}, 5000);