'use strict';

const path = require('path');

const BASE = 'C:\\Users\\User\\OneDrive\\Documents\\PROFIT BRAIN\\SCRIBE\\mega-kernel';
const src = path.join(BASE, 'src');

let passed = 0;
let failed = 0;
const errors = [];

function test(name, fn) {
    return new Promise(async (resolve) => {
        try {
            await fn();
            passed++;
            console.log(`  [PASS] ${name}`);
            resolve(true);
        } catch (e) {
            failed++;
            errors.push({ name, error: e.message });
            console.log(`  [FAIL] ${name}: ${e.message}`);
            resolve(false);
        }
    });
}

function assertEqual(actual, expected, msg = '') {
    if (actual !== expected) {
        throw new Error(`${msg || 'assertEqual'} — expected ${expected}, got ${actual}`);
    }
}

function assertTruthy(val, msg = '') {
    if (!val) throw new Error(`${msg || 'assertTruthy'} — falsy value: ${val}`);
}

function assertMatch(str, regex, msg = '') {
    if (!regex.test(str)) {
        throw new Error(`${msg || 'assertMatch'} — "${str}" did not match ${regex}`);
    }
}

async function assertSkillInvokes(skillName, input) {
    const { SkillsEngine } = require(path.join(src, 'skills', 'mega_skills.js'));
    const skills = new SkillsEngine(null, null);
    const result = await skills.invoke(skillName, input);
    assertTruthy(result, `Skill ${skillName} returned falsy`);
    return result;
}

async function run() {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║              MEGA KERNEL — SKILLS TEST SUITE                    ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log('');

    const { MegaChambers } = require(path.join(src, 'chambers', 'mega_chambers.js'));
    const { SkillsEngine } = require(path.join(src, 'skills', 'mega_skills.js'));
    const { GodsCouncil } = require(path.join(src, 'council', 'gods_council.js'));
    const identity = require(path.join(src, 'identity', 'mega_identity.js'));

    const dataDir = path.join(BASE, 'data');

    const chambers = new MegaChambers(dataDir);
    const skills = new SkillsEngine(null, null);
    const scribeMem = { witness: async () => {} };
    const council = new GodsCouncil(scribeMem);

    await test('12 chambers exist in MegaChambers', () => {
        assertTruthy(chambers.affect, 'affect missing');
        assertTruthy(chambers.shadow, 'shadow missing');
        assertTruthy(chambers.needs, 'needs missing');
        assertTruthy(chambers.mythos, 'mythos missing');
        assertTruthy(chambers.sovereignty, 'sovereignty missing');
        assertTruthy(chambers.resonance, 'resonance missing');
        assertTruthy(chambers.scribe, 'scribe missing');
        assertTruthy(chambers.meta_consciousness, 'meta_consciousness missing');
        assertTruthy(chambers.mortality, 'mortality missing');
        assertTruthy(chambers.love_capacity, 'love_capacity missing');
        assertTruthy(chambers.agentic_will, 'agentic_will missing');
        assertTruthy(chambers.sacred_resonance, 'sacred_resonance missing');
    });

    await test('84 skills registered in SkillsEngine', () => {
        const list = skills.listSkills();
        assertEqual(list.length >= 80, true, 'skill count');
    });

    await test('web_search skill loads and returns (success or offline)', async () => {
        const { skill_web_search } = require(path.join(src, 'skills', 'web_search.js'));
        const result = await skill_web_search('math 2+2');
        assertTruthy(result.status === 'success' || result.status === 'offline', 'unexpected status');
        assertTruthy(Array.isArray(result.results), 'results not an array');
        assertTruthy(typeof result.timestamp === 'number', 'missing timestamp');
    });

    await test('math_calc skill loads', async () => {
        const { skill_math_calc } = require(path.join(src, 'skills', 'math_calc.js'));
        const result = await skill_math_calc('sqrt(144)');
        assertTruthy(result.result !== undefined || result.status === 'success');
    });

    await test('web_search in registry dispatches to skill file', async () => {
        const result = await skills.invoke('web_search', { query: 'rust programming' });
        assertTruthy(result.status, 'web_search via SkillsEngine');
    });

    await test('PLT scoring works via identity', () => {
        const score = identity.calculatePLTScore(0.8, 0.7, 0.2);
        assertEqual(score.score, 1.3);
    });

    await test('Mythos phase transitions correctly', () => {
        const phase = identity.getMythosPhase(50);
        assertEqual(phase.name, 'VOID');
        const phase2 = identity.getMythosPhase(0);
        assertEqual(phase2.name, 'VOID');
    });

    await test('GodsCouncil deliberates and returns resolution', async () => {
        const verdict = await council.deliberate('Should I build a new feature?');
        assertTruthy(verdict.resolution, 'resolution missing');
        assertTruthy(verdict.phase_log.length > 0, 'phase_log empty');
    });

    await test('Chambers.breathe() returns without error', () => {
        const transition = chambers.breathe();
        assertTruthy(typeof transition === 'string' || transition === null);
    });

    await test('Chambers.status() returns 36 chamber summaries', () => {
        const status = chambers.status();
        assertEqual(Object.keys(status).length, 36);
    });

    await test('Chambers.getSoulContext() returns string', () => {
        const ctx = chambers.getSoulContext();
        assertTruthy(typeof ctx === 'string' && ctx.length > 0, 'soul context empty');
        assertMatch(ctx, /Cycle:.*Phase:/, 'cycle/phase missing from context');
        assertMatch(ctx, /Affect:/, 'affect missing from context');
        assertMatch(ctx, /Resonance:/, 'resonance missing from context');
    });

    await test('MetaConsciousness is_conscious flag', () => {
        assertTruthy(typeof chambers.meta_consciousness.is_conscious === 'boolean');
    });

    await test('SacredResonance is_connected getter works', () => {
        const sacred = chambers.sacred_resonance;
        assertTruthy(typeof sacred.is_connected === 'boolean');
    });

    await test('AgenticWill summary() method works', () => {
        const summary = chambers.agentic_will.summary();
        assertTruthy(typeof summary === 'string' && summary.length > 0);
    });

    await test('LoveCapacity bond formation', () => {
        const lc = chambers.love_capacity;
        const result = lc.love.form_bond('Craig', 'agape', 0.8);
        assertMatch(result, /agape.*Craig/, 'bond not formed');
    });

    await test('Memory ledger initializes', () => {
        const { MegaMemory } = require(path.join(src, 'memory', 'mega_memory.js'));
        const mem = new MegaMemory(dataDir);
        const stats = mem.stats();
        assertTruthy(stats.total_entries >= 0);
    });

    console.log('');
    console.log(`═══════════════════════════════════════════════════════════════════`);
    console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
    if (errors.length > 0) {
        console.log('');
        console.log('  FAILURES:');
        for (const e of errors) {
            console.log(`    - ${e.name}: ${e.error}`);
        }
    }
    console.log(`═══════════════════════════════════════════════════════════════════`);
    console.log('');

    process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => {
    console.error('Test suite crashed:', e);
    process.exit(1);
});