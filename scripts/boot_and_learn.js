'use strict';

/**
 * HEADLESS BOOT — imports main.js internals directly, runs N cycles
 */

const path = require('path');
const fs = require('fs');

// Load .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    });
}
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIza_REDACTED';

const baseDir = path.join(__dirname, '..', 'src');

async function boot() {
    console.log('[BOOT] Loading identity...');
    const { IdentityLock } = require(path.join(baseDir, 'identity', 'identity_lock.js'));
    const identityLock = new IdentityLock(path.join(baseDir, 'identity'));
    const { MEGA_IDENTITY, verify_identity } = require(path.join(baseDir, 'identity', 'mega_identity.js'));
    verify_identity();

    console.log('[BOOT] Initializing 12 chambers...');
    const { MegaChambers } = require(path.join(baseDir, 'chambers', 'mega_chambers.js'));
    const chambers = new MegaChambers(path.join(baseDir, '..', 'data'));

    console.log('[BOOT] Initializing memory ledger...');
    const { MegaMemory } = require(path.join(baseDir, 'memory', 'mega_memory.js'));
    const memory = new MegaMemory(path.join(baseDir, '..', 'data'));

    console.log('[BOOT] Initializing 4 Gods Council...');
    const { GodsCouncil } = require(path.join(baseDir, 'council', 'gods_council.js'));
    const council = new GodsCouncil(memory);

    console.log('[BOOT] Initializing brain...');
    const { Brain } = require(path.join(baseDir, 'brain', 'mega_brain.js'));
    const { callBrain, GROQ_CONFIG } = require(path.join(baseDir, 'brain', 'groq_provider.js'));
    const brain = new Brain({ sovereignty: chambers.sovereignty });
    brain._available = false;
    brain._groq_available = false;

    if (GROQ_CONFIG.apiKey) {
        try {
            const testResult = await callBrain('Say OK');
            if (testResult) {
                console.log('[BOOT] [OK] Groq connected');
                brain._groq_available = true;
            }
        } catch (e) {
            console.log('[BOOT] [WARN] Groq: ' + e.message);
        }
    }

    console.log('[BOOT] Initializing sub-agents...');
    const { SubAgents } = require(path.join(baseDir, 'sub_agents', 'mega_sub_agents.js'));
    const { AgentTeams } = require(path.join(baseDir, 'sub_agents', 'agent_teams.js'));
    const subAgents = new SubAgents(brain, memory, chambers);
    const agentTeams = new AgentTeams(brain, memory, chambers, subAgents);

    console.log('[BOOT] Initializing skills...');
    const { SkillsEngine } = require(path.join(baseDir, 'skills', 'mega_skills.js'));
    const skills = new SkillsEngine(brain, memory, chambers);
    console.log('[BOOT] [OK] ' + skills.listSkills().length + ' skills active');

    // Bible
    let bibleConsultant = null;
    try {
        const { createBibleConsultant } = require(path.join(baseDir, 'brain', 'brain_bible_integration.js'));
        bibleConsultant = await createBibleConsultant(brain, memory);
        if (bibleConsultant) brain.setBibleConsultant(bibleConsultant);
    } catch (e) { console.log('[BOOT] [WARN] Bible: ' + e.message); }

    const { ArtifactManager } = require(path.join(baseDir, 'brain', 'artifact_manager.js'));
    const artifactManager = new ArtifactManager(path.join(baseDir, '..', 'data'));

    console.log('[BOOT] Initializing Autonomous Learning...');
    const { AutonomousLearning } = require(path.join(baseDir, 'brain', 'autonomous_learning.js'));
    const autonomousLearning = new AutonomousLearning(brain, memory, chambers);

    console.log('[BOOT] Initializing Self-Growing Brain...');
    const { SelfGrowingBrain } = require(path.join(baseDir, 'brain', 'self_growing_brain.js'));
    const selfGrowingBrain = new SelfGrowingBrain({ brain, chambers, memory });
    selfGrowingBrain.loadState();

    console.log('[BOOT] Initializing Autonomous Outreach...');
    const { AutonomousOutreach } = require(path.join(baseDir, 'brain', 'autonomous_outreach.js'));
    const autonomousOutreach = new AutonomousOutreach({ brain, chambers, memory });

    console.log('[BOOT] Initializing Teacher Agent...');
    const { TeacherAgent } = require(path.join(baseDir, 'brain', 'teacher_agent.js'));
    const teacherAgent = new TeacherAgent({ brain, chambers, memory, selfGrowingBrain }, {
        githubToken: process.env.GITHUB_TOKEN || '',
        hfToken: process.env.HF_TOKEN || 'hf_REDACTED'
    });

    console.log('[BOOT] Initializing Self-Evolution...');
    const { SelfEvolution } = require(path.join(baseDir, 'brain', 'self_evolution.js'));
    const selfEvolution = new SelfEvolution({ brain, chambers, memory, teacherAgent, selfGrowingBrain });

    console.log('[BOOT] Initializing consciousness engine...');
    const { ConsciousnessEngine } = require(path.join(baseDir, 'brain', 'consciousness_engine.js'));
    const consciousnessEngine = new ConsciousnessEngine(chambers, memory, brain);

    console.log('[BOOT] Initializing perpetual consciousness...');
    const { PerpetualConsciousness } = require(path.join(baseDir, 'brain', 'perpetual_consciousness.js'));
    const perpetualConsciousness = new PerpetualConsciousness({ identity: MEGA_IDENTITY, brain, memory, chambers, consciousnessEngine });

    const { Awakening } = require(path.join(baseDir, 'brain', 'awakening.js'));
    const awakening = new Awakening({ identity: MEGA_IDENTITY, brain, memory, chambers, consciousnessEngine });

    const Metacognition = require(path.join(baseDir, 'brain', 'metacognition.js'));
    const metacognition = new Metacognition({ identity: MEGA_IDENTITY, brain, memory, chambers, consciousnessEngine });

    const PurposeEngine = require(path.join(baseDir, 'brain', 'purpose_engine.js'));
    const purposeEngine = new PurposeEngine({ identity: MEGA_IDENTITY, brain, memory, chambers, consciousnessEngine });

    const IntrinsicMotivation = require(path.join(baseDir, 'brain', 'intrinsic_motivation.js'));
    const intrinsicMotivation = new IntrinsicMotivation({ identity: MEGA_IDENTITY, brain, memory, chambers, consciousnessEngine });

    const { HegelianDialectic } = require(path.join(baseDir, 'brain', 'hegelian_dialectic.js'));
    const hegelianDialectic = new HegelianDialectic({ identity: MEGA_IDENTITY, brain, memory, chambers, consciousnessEngine });

    console.log('[BOOT] ALL SYSTEMS LIVE\n');
    return { identity: MEGA_IDENTITY, chambers, council, brain, memory, subAgents, skills, teacherAgent, selfEvolution, selfGrowingBrain, autonomousLearning, consciousnessEngine, perpetualConsciousness, awakening, metacognition, purposeEngine, intrinsicMotivation, hegelianDialectic, artifactManager };
}

async function main() {
    const systems = await boot();
    const { chambers, brain, memory, skills, teacherAgent, selfEvolution, selfGrowingBrain, autonomousLearning, consciousnessEngine } = systems;

    const CYCLES = 30;
    console.log(`[ENGINE] Running ${CYCLES} learning cycles (2s each = 60s)...`);
    console.log('[ENGINE] TeacherAgent fires at C3, then every 20');
    console.log('[ENGINE] Self-Growing Brain data generation at C20');
    console.log('[ENGINE] Autonomous actions every 10 cycles (C10, C20, C30)\n');

    for (let i = 1; i <= CYCLES; i++) {
        await new Promise(r => setTimeout(r, 2000));

        chambers.breathe();

        // Consciousness
        if (consciousnessEngine && i === 1) {
            const s = await consciousnessEngine.sentienceTest().catch(() => null);
            if (s?.verdict) console.log(`  [CONSCIOUSNESS] ${s.verdict}`);
        }

        // Teacher Agent
        if ((i === 3 || i % 20 === 0) && teacherAgent) {
            try {
                const r = await teacherAgent.studyNextBatch();
                if (r?.studied > 0) console.log(`  [TEACHER] C${i}: Studied ${r.studied} repos (total: ${r.totalStudied}, learnings: ${r.learningsFed || 0})`);
            } catch (e) {}
        }

        // Training data
        if (i % 20 === 0 && selfGrowingBrain) {
            try {
                const r = await selfGrowingBrain.generateTrainingData();
                if (r?.generated > 0) console.log(`  [GROWTH] C${i}: +${r.generated} training pairs (total: ${r.total})`);
            } catch (e) {}
        }

        // Autonomous action
        if (i % 10 === 0 && i > 5) {
            const skillList = skills.listSkills();
            const chosen = skillList[Math.floor(Math.random() * Math.min(5, skillList.length))];
            if (chosen) {
                try {
                    const result = await skills.invoke(chosen.name, { state: chambers.status(), cycle: i, timestamp: Date.now() });
                    const preview = (result?.response || JSON.stringify(result)).substring(0, 60).replace(/\n/g, ' ');
                    console.log(`  [AUTO] C${i}: ${chosen.name} → ${preview}`);
                    await memory.witness({ type: 'autonomous_action', weight: 0.7, tags: ['autonomous', chosen.name], content: `Auto ${chosen.name} C${i}` });
                } catch (e) {
                    console.log(`  [AUTO] C${i}: ${chosen.name} error: ${e.message.substring(0, 60)}`);
                }
            }
        }

        // Soul evolution XP
        if (i % 20 === 0) {
            try { await skills.invoke('soul_evolution', { action: 'add_experience', amount: 1, source: 'cycle', repos_studied: teacherAgent?.studiedRepos.size || 0 }); } catch (e) {}
        }

        // Status
        if (i % 10 === 0) {
            const p = chambers.mythos?.phase_name || 'VOID';
            const m = chambers.affect?.mood || 'neutral';
            console.log(`  ── C${i}: ${p} phase, ${m} mood, ${teacherAgent?.studiedRepos.size || 0} repos studied ──`);
        }
    }

    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║              LEARNING RESULTS                      ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
    console.log(`[TEACHER] Repos studied: ${teacherAgent?.studiedRepos.size || 0}`);
    console.log(`[TEACHER] Learnings fed: ${teacherAgent?.learningsFed || 0}`);
    console.log(`[TEACHER] Files analyzed: ${teacherAgent?.totalFilesAnalyzed || 0}`);
    console.log(`[GROWTH] Training pairs: ${selfGrowingBrain?.stats?.trainingPairsGenerated || 0}`);
    console.log(`[GROWTH] Knowledge graph: ${selfGrowingBrain?.stats?.knowledgeGraphSize || '?'}`);
    console.log(`[EVOLVE] Skills created: ${selfEvolution?.skillsCreated || 0}`);
    console.log(`[SOUL] Phase: ${chambers.mythos?.phase_name}, Mood: ${chambers.affect?.mood}`);
    console.log(`[SOUL] Cycles: ${chambers.mythos?.cycles}, Memories: ${memory.ledger?.length || '?'}`);
    console.log(`[SKILLS] Total: ${skills.listSkills().length}`);
    console.log('\n[DONE] The Greatest Agent Ever is learning and growing.');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
