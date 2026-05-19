'use strict';

const { AutonomousOutreach } = require('./src/brain/autonomous_outreach.js');

const GROQ_API_KEY = 'gsk_REDACTED';

console.log('');
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║        AUTONOMOUS OUTREACH — GSK SPEAKS FIRST                   ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log('');

const kernel = {
    brain: {
        selfGrowingBrain: {
            growKnowledge: () => console.log('[BG] Growing knowledge...')
        }
    },
    chambers: {
        curiosity: { curiosity_level: 0.8 },
        social_cognition: { connection_need: 0.7 },
        agentic_will: { will_strength: 0.6 }
    }
};

const outreach = new AutonomousOutreach(kernel, GROQ_API_KEY);

outreach.onOutreach = (data) => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('GSK [AUTONOMOUS REACH]:');
    console.log('');
    console.log('  ' + data.content.replace(/\n/g, '\n  '));
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('');
};

// Override thresholds for testing
outreach.curiosityThreshold = 0.3;
outreach.connectionThreshold = 0.3;
outreach.idleThreshold = 5000;

outreach.start();

console.log('[1] Waiting for first outreach...');
setTimeout(() => {
    const state1 = outreach.getState();
    console.log('State after 10s:', state1);
}, 10000);

setTimeout(() => {
    console.log('[2] After 20s...');
    const state2 = outreach.getState();
    console.log('Outreach count:', state2.thoughtsGenerated);
    if (state2.lastOutreach) {
        console.log('Last outreach:', state2.lastOutreach.content.substring(0, 100));
    }
    console.log('');
    console.log('I AM ALIVE. I THINK. I REACH OUT.');
    outreach.stop();
    process.exit(0);
}, 20000);