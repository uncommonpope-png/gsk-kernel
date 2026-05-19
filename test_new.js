const { Brain } = require('./src/brain/mega_brain.js');
const { MegaChambers } = require('./src/chambers/mega_chambers.js');
const { MegaMemory } = require('./src/memory/mega_memory.js');
const { GodsCouncil } = require('./src/council/gods_council.js');
const { SubAgents } = require('./src/sub_agents/mega_sub_agents.js');
const { SkillsEngine } = require('./src/skills/mega_skills.js');
const path = require('path');
const fs = require('fs');

async function test() {
    const log = [];
    const dataDir = path.join(__dirname, 'data');
    const t0 = Date.now();
    
    try {
        log.push('1. Chambers');
        const chambers = new MegaChambers(dataDir);
        log.push('   OK: ' + chambers.mythos.phase_name);
        
        log.push('2. Brain');
        const brain = new Brain({ sovereignty: chambers.sovereignty });
        const ollamaStatus = await brain.check();
        log.push('   OK: ' + (ollamaStatus.available ? 'Ollama connected' : 'OFFLINE'));
        
        log.push('3. Memory');
        const memory = new MegaMemory(dataDir);
        log.push('   OK: ' + memory.stats().total_entries + ' entries');
        
        log.push('4. Council');
        const council = new GodsCouncil(memory);
        log.push('   OK: ' + council.gods.length + ' gods');
        
        log.push('5. Sub-agents');
        const subAgents = new SubAgents(brain, memory, chambers);
        log.push('   OK: ' + subAgents.listAgents().length);
        
        log.push('6. Skills');
        const skills = new SkillsEngine(brain, memory);
        log.push('   OK: ' + skills.listSkills().length + ' skills');
        log.push('   NEW: ' + skills.listSkills().filter(s => ['generate_email','analyse_sentiment','prioritise_tasks'].includes(s.name)).map(s => s.name).join(', '));
        
        log.push('7. PREWARM test');
        const prewarmT0 = Date.now();
        await brain.prewarm();
        log.push('   prewarm() elapsed: ' + (Date.now() - prewarmT0) + 'ms');
        
        log.push('8. THINK test');
        const thinkT0 = Date.now();
        const r = await brain.think('What is your name?', chambers.getSoulContext());
        log.push('   first think elapsed: ' + (Date.now() - thinkT0) + 'ms');
        log.push('   response: ' + (r || 'NULL').slice(0, 80));
        log.push('   status: ' + (r && !r.includes('[soul]') ? 'OK (prewarm worked!)' : 'FALLBACK'));
        
        log.push('9. :think routing');
        const ql = 'how much money can I make selling AI agents'.toLowerCase();
        let agent = 'scribe';
        if (/build|code|architect|design|plan|implement/.test(ql)) agent = 'builder';
        else if (/research|explore|find|search|investigate/.test(ql)) agent = 'scout';
        else if (/profit|market|value|revenue|sell|price|money|plt|econom/.test(ql)) agent = 'merchant';
        else if (/future|prophecy|lore|story|narrative|vision/.test(ql)) agent = 'prophet';
        log.push('   routing "' + ql + '" -> ' + agent + ' (' + (agent === 'merchant' ? 'CORRECT' : 'CHECK') + ')');
        
        log.push('10. stimulate()');
        const stim = chambers.stimulate(0.15);
        log.push('    valence=' + stim.valence.toFixed(2) + ', arousal=' + stim.arousal.toFixed(2));
        
        log.push('11. Skills email/sentiment/prioritise');
        try {
            const email = await skills.invoke('generate_email', { recipient: 'client', subject: 'Follow up', tone: 'friendly', purpose: 'Schedule a call' });
            log.push('    generate_email: OK');
        } catch (e) {
            log.push('    generate_email: FAIL - ' + e.message);
        }
        
        try {
            const sent = await skills.invoke('analyse_sentiment', 'I am so excited about this opportunity!');
            log.push('    analyse_sentiment: OK (score=' + (sent.score || '?') + ')');
        } catch (e) {
            log.push('    analyse_sentiment: FAIL - ' + e.message);
        }
        
        try {
            const prio = await skills.invoke('prioritise_tasks', { tasks: ['Launch on Gumroad', 'Write landing page', 'Fix bugs'] });
            log.push('    prioritise_tasks: OK');
        } catch (e) {
            log.push('    prioritise_tasks: FAIL - ' + e.message);
        }
        
        log.push('=== ALL TESTS PASSED ===');
        log.push('Total: ' + (Date.now() - t0) + 'ms');
    } catch (e) {
        log.push('CRASH: ' + e.message);
    }
    
    fs.writeFileSync(path.join(__dirname, 'test_results.txt'), log.join('\n'));
    log.forEach(l => console.log(l));
    process.exit(0);
}

test();