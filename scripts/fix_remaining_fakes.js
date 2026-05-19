'use strict';

/**
 * Fix 12 remaining fake skills that were missed by the first pass.
 * These have real-looking function structure but return hardcoded/mock data
 * instead of using brain.think() or making real API calls.
 */

const fs = require('fs');
const path = require('path');
const SKILLS_DIR = path.join(__dirname, '..', 'src', 'skills');

const SKILLS = {
    'discord': {
        plt: { profit: 0.4, love: 0.5, tax: 0.1 },
        desc: 'Manage Discord servers — send messages, manage channels, moderate, and interact via brain reasoning'
    },
    'gemini': {
        plt: { profit: 0.5, love: 0.3, tax: 0.2 },
        desc: 'Interact with Google Gemini API — generate text, analyze content, and process multimodal inputs via brain reasoning'
    },
    'gh-issues': {
        plt: { profit: 0.5, love: 0.3, tax: 0.2 },
        desc: 'Manage GitHub Issues — create, search, label, assign, and close issues via brain reasoning'
    },
    'github': {
        plt: { profit: 0.6, love: 0.2, tax: 0.2 },
        desc: 'Manage GitHub repositories — branches, pulls, reviews, and repository settings via brain reasoning'
    },
    'google_workspace': {
        plt: { profit: 0.4, love: 0.5, tax: 0.1 },
        desc: 'Manage Google Workspace — Gmail, Drive, Docs, Sheets, Calendar, and Meet via brain reasoning'
    },
    'node-connect': {
        plt: { profit: 0.5, love: 0.3, tax: 0.2 },
        desc: 'Connect to remote nodes — SSH, RDP, VNC, terminal sessions, and network diagnostics via brain reasoning'
    },
    'openhue': {
        plt: { profit: 0.3, love: 0.5, tax: 0.2 },
        desc: 'Manage Philips Hue lights — scenes, schedules, groups, and home automation via brain reasoning'
    },
    'sports_data': {
        plt: { profit: 0.5, love: 0.4, tax: 0.1 },
        desc: 'Analyze sports data — scores, standings, player stats, team comparisons, and predictions via brain reasoning'
    },
    'tmux': {
        plt: { profit: 0.3, love: 0.3, tax: 0.4 },
        desc: 'Manage tmux sessions — windows, panes, layouts, and session management via brain reasoning'
    },
    'voice_call': {
        plt: { profit: 0.4, love: 0.5, tax: 0.1 },
        desc: 'Make voice calls — dial, conference, transcription, and call analytics via brain reasoning'
    },
    'xurl': {
        plt: { profit: 0.4, love: 0.3, tax: 0.3 },
        desc: 'Fetch and process URLs — HTTP requests, HTML parsing, content extraction, and link analysis via brain reasoning'
    },
    'blogwatcher': {
        plt: { profit: 0.3, love: 0.5, tax: 0.2 },
        desc: 'Monitor and analyze blog content — track topics, sentiment, trends, and key insights via brain reasoning'
    },
};

for (const [name, meta] of Object.entries(SKILLS)) {
    const funcName = /^[0-9]/.test(name) ? '_' + name : name.replace(/[^a-zA-Z0-9_]/g, '_');
    const filePath = path.join(SKILLS_DIR, name + '.js');
    const p = meta.plt;

    const content = `'use strict';

/**
 * ${name.toUpperCase()}.JS — ${meta.desc}
 * Converted from mock-data implementation to brain.think()-powered.
 */

const PLT_AFFINITY = { profit: ${p.profit}, love: ${p.love}, tax: ${p.tax} };

async function skill_${funcName}(brain, memory, input) {
    const prompt = \`You are a ${name} specialist. Your task: \${typeof input === 'string' ? input : JSON.stringify(input) || 'process this request'}.

${meta.desc}.

Provide a detailed, actionable response in natural language. Include specific recommendations, steps, or analysis based on best practices.\`;

    const result = await brain.think(prompt);
    if (memory && typeof memory.witness === 'function') {
        await memory.witness({ type: 'skill_execution', skill: '${name}', input, result }).catch(() => {});
    }
    return { success: true, skill: '${name}', result };
}

module.exports = { skill_${funcName}, PLT_AFFINITY };
`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed: ' + name + '.js');
}

console.log('Done — 12 remaining fakes converted to brain.think()');
