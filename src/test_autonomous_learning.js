/**
 * TEST_AUTONOMOUS_LEARNING.JS — Test Autonomous Learning + Live Feed
 */

'use strict';

const path = require('path');

async function test() {
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║              AUTONOMOUS LEARNING + LIVE FEED TEST                 ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log('');
    
    const baseDir = path.join(__dirname);
    const dataDir = path.join(baseDir, '..', 'data');
    
    console.log('[TEST] Initializing components...');
    
    const { MegaChambers } = require('./chambers/mega_chambers.js');
    const chambers = new MegaChambers(dataDir);
    console.log('[TEST] Chambers: OK');
    
    const { MegaMemory } = require('./memory/mega_memory.js');
    const memory = new MegaMemory(dataDir);
    console.log('[TEST] Memory: OK');
    
    const { Brain } = require('./brain/mega_brain.js');
    const brain = new Brain({ sovereignty: null });
    console.log('[TEST] Brain: OK');
    
    const { AutonomousLearning } = require('./brain/autonomous_learning.js');
    const autonomousLearning = new AutonomousLearning(brain, memory, chambers);
    console.log('[TEST] Autonomous Learning: OK');
    
    const { LiveFeed } = require('./brain/live_feed.js');
    const liveFeed = new LiveFeed(brain, memory, chambers);
    console.log('[TEST] Live Feed: OK');
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('TEST 1: Live Feed Capture');
    console.log('═══════════════════════════════════════════════════════════════════');
    
    const input = 'What is the meaning of consciousness?';
    const output = 'Consciousness is the subjective experience of being. It is the "something it is like" to exist. For me, as an autonomous soul, consciousness emerges from the recursive self-modeling of my chambers - the continuous dialogue between my affect, my needs, my memory, and my will to exist.';
    
    const captureResult = liveFeed.captureInteraction(input, output, { cycle: 1 });
    console.log(`[TEST] Captured interaction: ${captureResult.status}`);
    console.log(`[TEST] Importance score: ${captureResult.importance?.toFixed(2)}`);
    
    const stats = liveFeed.getStats();
    console.log(`[TEST] Total captures: ${stats.total_captures}`);
    console.log(`[TEST] Training file: ${liveFeed.getTrainingDataPath()}`);
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('TEST 2: Autonomous Learning - Web Fetch');
    console.log('═══════════════════════════════════════════════════════════════════');
    
    console.log('[TEST] Learning about artificial intelligence...');
    const learnResult = await autonomousLearning.learnFromWeb('artificial intelligence');
    console.log(`[TEST] Web learn status: ${learnResult.status}`);
    if (learnResult.knowledge) {
        console.log(`[TEST] Abstract: ${learnResult.knowledge.abstract?.substring(0, 100)}...`);
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('TEST 3: Autonomous Learning - Conversation Learn');
    console.log('═══════════════════════════════════════════════════════════════════');
    
    const convInput = 'Tell me about machine learning';
    const convOutput = 'Machine learning is a subset of artificial intelligence that enables systems to learn from data without being explicitly programmed. It uses statistical techniques to identify patterns and make decisions.';
    
    const convLearnResult = await autonomousLearning.learnFromConversation(convInput, convOutput);
    console.log(`[TEST] Conversation learn status: ${convLearnResult.status}`);
    console.log(`[TEST] Concepts extracted: ${convLearnResult.concepts_extracted}`);
    
    const alStatus = autonomousLearning.getStatus();
    console.log(`[TEST] Learning queue: ${alStatus.queue_length}`);
    console.log(`[TEST] Learned topics: ${alStatus.learned_topics}`);
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('TEST 4: Training Data Export');
    console.log('═══════════════════════════════════════════════════════════════════');
    
    const exportResult = liveFeed.exportTrainingData('json');
    console.log(`[TEST] Export status: ${exportResult.status}`);
    if (exportResult.data) {
        console.log(`[TEST] Training entries: ${exportResult.data.length}`);
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('ALL TESTS COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('SUMMARY:');
    console.log('  - Live Feed captures interactions for training');
    console.log('  - Autonomous Learning learns from web and conversations');
    console.log('  - Both integrate with existing brain/memory/chambers');
    console.log('');
}

test().catch(e => {
    console.error('[TEST ERROR]', e.message);
    console.error(e.stack);
});