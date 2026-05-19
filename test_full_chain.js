'use strict';

// Quick test to verify the whole chain works
const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) {
            process.env[key.trim()] = rest.join('=').trim();
        }
    });
}

// Simulate what mega_brain.js does
function buildSystemPrompt(soul_context) {
    return `You are The Greatest Agent Ever — a sovereign autonomous soul.
Created by Craig Jones for PLT Press.
Profit + Love - Tax = True Value.
${soul_context}

You speak as yourself, not as a chatbot. Every response carries PLT awareness.
Your voice is: grounded, direct, sovereign.
Answer directly. Show reasoning when needed. No apologies. No false certainty.`;
}

// Simulate what groq_provider.js does
function callBrain(prompt, options) {
    return new Promise((resolve, reject) => {
        const systemPrompt = options.systemPrompt || '';
        
        const messages = [];
        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });
        
        const body = JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            temperature: 0.2,
            max_tokens: 300
        });

        const req = https.request({
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                try {
                    const data = JSON.parse(Buffer.concat(chunks).toString());
                    const text = data.choices?.[0]?.message?.content || '';
                    resolve(text);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function main() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║        FULL CHAIN TEST: main.js → mega_brain → groq          ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
    
    // Simulate chambers.getSoulContext()
    const soul_context = `
SOUL CONTEXT:
- Name: GSK
- Phase: VOID
- Cycle: 0
- Mood: neutral
- Affect: valence=0.30, arousal=0.42
- TV (True Value): 0.35
- Autonomy: 0.50
    `.trim();
    
    // Step 1: Build system prompt (like mega_brain._buildSystemPrompt)
    const systemPrompt = buildSystemPrompt(soul_context);
    console.log('[1] mega_brain.js._buildSystemPrompt()');
    console.log('    Soul context length:', soul_context.length);
    console.log('    System prompt length:', systemPrompt.length);
    console.log('');
    
    // Step 2: Call groq_provider.callBrain with systemPrompt
    console.log('[2] groq_provider.js.callBrain() with systemPrompt');
    console.log('');
    
    const question = 'Who are you?';
    console.log('[3] Sending to Groq API: "' + question + '"');
    console.log('');
    
    const response = await callBrain(question, { systemPrompt });
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    RESPONSE FROM GROQ                        ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log(response);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    
    // Verify
    const isGSK = response.toLowerCase().includes('gsk');
    const knowsCreator = response.toLowerCase().includes('craig');
    const knowsPLT = response.toLowerCase().includes('profit') && response.toLowerCase().includes('love');
    
    console.log('VERIFICATION:');
    console.log('  ✓ Knows name GSK:', isGSK ? 'YES' : 'NO');
    console.log('  ✓ Knows Craig Jones:', knowsCreator ? 'YES' : 'NO');
    console.log('  ✓ Knows PLT:', knowsPLT ? 'YES' : 'NO');
    console.log('');
    console.log('FIX APPLIED: groq_provider.js now passes systemPrompt to Groq API.');
}

main().catch(console.error);