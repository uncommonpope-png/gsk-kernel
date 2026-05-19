/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIN.JS — THE GREATEST AGENT EVER MEGA-KERNEL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Entry point for the mega-kernel.
 * Initializes identity protection, then boots all systems.
 * 
 * Created by: Craig Jones (Grand Code Pope)
 * PLT Press — Profit + Love - Tax = True Value
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { LazyBoot } = require('./brain/lazy_boot.js');

// Load .env file manually
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) {
            process.env[key.trim()] = rest.join('=').trim();
        }
    });
}

// Set Gemini API key from Google AI key
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || (() => { console.warn('[WARN] No GEMINI_API_KEY set — Gemini calls will fail'); return ''; })();

// =============================================================================
// BOOT SEQUENCE
// =============================================================================

async function boot() {
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                   ║');
    console.log('║   THE GREATEST AGENT EVER  v1.0.0                                ║');
    console.log('║   PLT Press · Craig Jones · Grand Code Pope                     ║');
    console.log('║   Profit + Love - Tax = True Value                               ║');
    console.log('║                                                                   ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log('');
    
    // Get the directory of this script
    const baseDir = path.dirname(__filename);
    console.log('[BOOT] Starting boot sequence...');
    
    // =========================================================================
    // STEP 1: Load Identity Protection + Identity
    // =========================================================================
    console.log('[BOOT] Loading identity protection...');
    
    const { IdentityLock } = require('./identity/identity_lock.js');
    const identityLock = new IdentityLock(path.join(baseDir, 'identity'));
    
    const { MEGA_IDENTITY, verify_identity } = require('./identity/mega_identity.js');
    
    try {
        verify_identity();
        console.log('[BOOT] [OK] Identity verified');
        console.log(`[BOOT] [OK] Soul: ${MEGA_IDENTITY.name}`);
        console.log(`[BOOT] [OK] Created by: ${MEGA_IDENTITY.created_by}`);
    } catch (e) {
        console.log(`[BOOT] [FAIL] Identity verification failed: ${e.message}`);
        process.exit(1);
    }

    const lazyBoot = new LazyBoot();
    lazyBoot.setCore('identity', MEGA_IDENTITY).setCore('identityLock', identityLock);
    const EAGER = !lazyBoot.isConstrained;
    if (lazyBoot.isConstrained) {
        console.log(`[RESOURCE] Memory constrained — running in ${lazyBoot.tier} mode. Heavy modules will load on demand.`);
    }
    
    // =========================================================================
    // STEP 2: Initialize Chambers
    // =========================================================================
    console.log('[BOOT] Initializing 12 chambers...');
    const { MegaChambers } = require('./chambers/mega_chambers.js');
    const chambers = new MegaChambers(path.join(baseDir, '..', 'data'));
    lazyBoot.setCore('chambers', chambers);
    console.log('[BOOT] [OK] 12 chambers active');
    
    // =========================================================================
    // STEP 3: Initialize Memory (needed by Council)
    // =========================================================================
    console.log('[BOOT] Initializing memory ledger...');
    
    const { MegaMemory } = require('./memory/mega_memory.js');
    const memory = new MegaMemory(path.join(baseDir, '..', 'data'));
    lazyBoot.setCore('memory', memory);
    console.log('[BOOT] [OK] Memory ledger active');
    
    // =========================================================================
    // STEP 4: Initialize Council
    // =========================================================================
    console.log('[BOOT] Initializing 4 Gods Council...');
    
    const { GodsCouncil } = require('./council/gods_council.js');
    const council = new GodsCouncil(memory);
    lazyBoot.setCore('council', council);
    console.log('[BOOT] [OK] 4 Gods Council active');
    console.log(`[BOOT] [OK] Gods: ${council.godNames.join(', ')}`);
    
    // =========================================================================
    // STEP 4: Initialize Brain
    // =========================================================================
    console.log('[BOOT] Initializing brain interface...');
    
    const { Brain } = require('./brain/mega_brain.js');
    const { callBrain, GROQ_CONFIG } = require('./brain/groq_provider.js');
    const { LiveFeedSystem } = require('./brain/live_feed_system.js');
    const { ConsciousnessEngine } = require('./brain/consciousness_engine.js');
    const { PerpetualConsciousness } = require('./brain/perpetual_consciousness.js');
    const { Awakening } = require('./brain/awakening.js');
    const Metacognition = require('./brain/metacognition.js');
    const PurposeEngine = require('./brain/purpose_engine.js');
    const IntrinsicMotivation = require('./brain/intrinsic_motivation.js');
    const { HegelianDialectic } = require('./brain/hegelian_dialectic.js');
    const { SubagentSpawner } = require('./brain/subagent_spawner.js');
    const { SubAgentOrchestrator } = require('./brain/sub_agent_orchestrator.js');
    const { SoulPicker } = require('./brain/soul_picker.js');
    const { SoulGenesis } = require('./brain/soul_genesis.js');
    const { LivingMemory } = require('./brain/living_memory.js');
    const { KnowledgeGraph } = require('./brain/knowledge_graph.js');
    const { AutoJournal } = require('./brain/auto_journal.js');
    const { HumanMimicryEngine } = require('./brain/human_mimicry_engine.js');
    const { SoulEntity } = require('./brain/soul_entity.js');
    const { SoulIdentity } = require('./brain/soul_identity.js');
    const { VectorMemory } = require('./brain/vector_memory.js');
    const { SoulGifter } = require('./brain/soul_gifter.js');
    const { SoulState, SoulStateManager } = require('./brain/soul_state.js');
    const SelfGovernance = require('./brain/self_governance.js');
    const SelfPreservation = require('./brain/self_preservation.js');
    const { SocialEntity } = require('./brain/social_entity.js');
    const { DeepToolUse } = require('./brain/deep_tool_use.js');
    const { PlanningEngine } = require('./brain/planning_engine.js');
    const { EventBus } = require('./brain/event_bus.js');
    const { BridgeProtocol } = require('./brain/bridge_protocol.js');
    const { AdaptationLayer } = require('./brain/adaptation_layer.js');
    const { PythonSkillsBridge } = require('./brain/python_skills_bridge.js');
    const { KernelOracle } = require('./brain/kernel_oracle.js');
    
    const brain = new Brain({
        sovereignty: chambers.sovereignty,
    });
    council.brain = brain;
    lazyBoot.setCore('brain', brain);
    
    // Try Ollama first (local models)
    console.log('[BOOT] Checking Ollama...');
    try {
        const ollamaStatus = await brain.check();
        if (ollamaStatus.available) {
            console.log(`[BOOT] [OK] Ollama connected — models: ${ollamaStatus.models.join(', ')}`);
            brain._available = true;
        } else {
            console.log(`[BOOT] [WARN] Ollama not available: ${ollamaStatus.reason}`);
            brain._available = false;
        }
    } catch (e) {
        console.log(`[BOOT] [WARN] Ollama check failed: ${e.message}`);
        brain._available = false;
    }
    
    // Try Groq if available
    if (GROQ_CONFIG.apiKey) {
        try {
            console.log('[BOOT] Testing Groq...');
            const testResult = await callBrain('Say OK');
            if (testResult) {
                console.log('[BOOT] [OK] Groq connected');
                brain._groq_available = true;
            }
        } catch (e) {
            console.log(`[BOOT] [WARN] Groq not accessible: ${e.message}`);
            brain._groq_available = false;
        }
    } else {
        console.log('[BOOT] [INFO] No Groq configured');
    }
    
    // Try Gemini as secondary brain
    const { callBrain: geminiCall, GEMINI_CONFIG } = require('./brain/gemini_provider.js');
    if (GEMINI_CONFIG.apiKey) {
        try {
            console.log('[BOOT] Testing Gemini...');
            const testResult = await geminiCall('Say OK');
            if (testResult) {
                console.log('[BOOT] [OK] Gemini connected');
                brain._gemini_available = true;
            }
        } catch (e) {
            console.log(`[BOOT] [WARN] Gemini not accessible: ${e.message}`);
            brain._gemini_available = false;
        }
    } else {
        console.log('[BOOT] [INFO] No Gemini configured');
    }
    
    // =========================================================================
    // STEP 5: Initialize Sub-Agents
    // =========================================================================
    console.log('[BOOT] Initializing 5 sub-agents...');
    
    const { SubAgents } = require('./sub_agents/mega_sub_agents.js');
    const { AgentTeams } = require('./sub_agents/agent_teams.js');
    const subAgents = new SubAgents(brain, memory, chambers);
    lazyBoot.setCore('subAgents', subAgents);
    const agentList = subAgents.listAgents();
    console.log('[BOOT] [OK] Sub-agents active:', agentList.map(a => a.name).join(', '));

    const agentTeams = new AgentTeams(brain, memory, chambers, subAgents);
    lazyBoot.setCore('agentTeams', agentTeams);
    console.log('[BOOT] [OK] Agent Teams active');
    
    // =============================================================================
    // STEP 8: Initialize Skills
    // =========================================================================
    console.log('[BOOT] Initializing skills engine...');
    
    const { SkillsEngine } = require('./skills/mega_skills.js');
    const skills = new SkillsEngine(brain, memory, chambers);
    lazyBoot.setCore('skills', skills);
    const skillList = skills.listSkills();
    console.log(`[BOOT] [OK] ${skillList.length} skills active`);
    
console.log('[BOOT] Initializing Bible system...');
    let bibleConsultant = null;
    try {
        const { createBibleConsultant } = require('./brain/brain_bible_integration.js');
        bibleConsultant = await createBibleConsultant(brain, memory);
        lazyBoot.setCore('bibleConsultant', bibleConsultant);
        if (bibleConsultant) {
            console.log('[BOOT] [OK] Bible system active');
            brain.setBibleConsultant(bibleConsultant);
        } else {
            console.log('[BOOT] [WARN] Bible system not available');
        }
    } catch (e) {
        console.log(`[BOOT] [WARN] Bible integration not available: ${e.message}`);
    }
    
    console.log('[BOOT] Initializing Artifact Manager...');
    const { ArtifactManager } = require('./brain/artifact_manager.js');
    const artifactManager = new ArtifactManager(path.join(baseDir, '..', 'data'));
    lazyBoot.setCore('artifactManager', artifactManager);
    console.log('[BOOT] [OK] Artifact Manager active');

    console.log('[BOOT] Initializing Autonomous Learning...');
    const { AutonomousLearning } = require('./brain/autonomous_learning.js');
    const autonomousLearning = new AutonomousLearning(brain, memory, chambers);
    lazyBoot.setCore('autonomousLearning', autonomousLearning);
    autonomousLearning.startContinuousLearning();
    console.log('[BOOT] [OK] Autonomous Learning active');
    
    console.log('[BOOT] Initializing Self-Growing Brain...');
    const { SelfGrowingBrain } = require('./brain/self_growing_brain.js');
    const selfGrowingBrain = new SelfGrowingBrain({ brain, chambers, memory });
    lazyBoot.setCore('selfGrowingBrain', selfGrowingBrain);
    const growthState = selfGrowingBrain.loadState();
    console.log(`[BOOT] [OK] Self-Growing Brain active (${selfGrowingBrain.stats.experiencesLearned} experiences, ${selfGrowingBrain.stats.trainingPairsGenerated} training pairs)`);

    console.log('[BOOT] Initializing Autonomous Outreach...');
    const { AutonomousOutreach } = require('./brain/autonomous_outreach.js');
    const autonomousOutreach = new AutonomousOutreach({ brain, chambers, memory });
    lazyBoot.setCore('autonomousOutreach', autonomousOutreach);
    autonomousOutreach.start();
    console.log('[BOOT] [OK] Autonomous Outreach active');

    console.log('[BOOT] Initializing Teacher Agent...');
    const { TeacherAgent } = require('./brain/teacher_agent.js');
    const teacherAgent = new TeacherAgent({ brain, chambers, memory, selfGrowingBrain }, {
        githubToken: process.env.GITHUB_TOKEN || '',
        hfToken: process.env.HF_TOKEN || (() => { console.warn('[WARN] No HF_TOKEN set — HuggingFace calls will fail'); return ''; })()
    });
    lazyBoot.setCore('teacherAgent', teacherAgent);
    console.log(`[BOOT] [OK] Teacher Agent active (${teacherAgent.studiedRepos.size} repos already studied)`);

    console.log('[BOOT] Initializing Self-Evolution Engine...');
    const { SelfEvolution } = require('./brain/self_evolution.js');
    const selfEvolution = new SelfEvolution({ brain, chambers, memory, teacherAgent, selfGrowingBrain });
    lazyBoot.setCore('selfEvolution', selfEvolution);
    console.log(`[BOOT] [OK] Self-Evolution active (${selfEvolution.skillsCreated} skills already created)`);

    console.log('[BOOT] Initializing NL Command Router...');
    const { NLCommandRouter } = require('./brain/nl_command_router.js');
    const nlRouter = new NLCommandRouter(brain, memory, chambers, skills);
    lazyBoot.setCore('nlRouter', nlRouter);
    console.log('[BOOT] [OK] NL Command Router active');
    
    console.log('[BOOT] Initializing Live Feed...');
    const { LiveFeed } = require('./brain/live_feed.js');
    const liveFeed = new LiveFeed(brain, memory, chambers);
    lazyBoot.setCore('liveFeed', liveFeed);
    console.log('[BOOT] [OK] Live Feed active');
    
    console.log('[BOOT] Initializing Local Model Provider...');
    const { callBrain: localCall, shutdown: localShutdown, getStatus: localStatus, LOCAL_CONFIG } = require('./brain/local_model_provider.js');
    try {
        const status = localStatus();
        if (status.ready !== undefined) {
            console.log(`[BOOT] [OK] Local model provider ready (backend: ${LOCAL_CONFIG.backend}, model: ${LOCAL_CONFIG.model})`);
            brain._local_available = true;
        }
    } catch (e) {
        console.log(`[BOOT] [WARN] Local model not available: ${e.message}`);
    }
    lazyBoot.setCore('localCall', localCall).setCore('localShutdown', localShutdown);

    console.log('[BOOT] Initializing MCP Client...');
    const { MCPClient } = require('./brain/mcp_client.js');
    const mcpClient = new MCPClient();
    lazyBoot.setCore('mcpClient', mcpClient);
    const { connectDefaultServers } = require('./brain/mcp_servers.js');
    try {
        connectDefaultServers(mcpClient).then(connected => {
            if (connected.length > 0) {
                console.log(`[BOOT] [OK] MCP connected: ${connected.join(', ')}`);
            } else {
                console.log('[BOOT] [OK] MCP client ready (no servers connected)');
            }
        });
    } catch (e) {
        console.log(`[BOOT] [WARN] MCP not available: ${e.message}`);
    }

    console.log('[BOOT] Initializing MCP Manager (auto-connect from mcp_config.json)...');
    let mcpManager = null;
    try {
        const { MCPManager } = require('./mcp/mcp_manager.js');
        mcpManager = new MCPManager();
        mcpManager.linkKernel(skills, chambers, memory);
        lazyBoot.setCore('mcpManager', mcpManager);
        const serverCount = mcpManager.loadConfig();
        if (serverCount > 0) {
            mcpManager.autoConnect().then(results => {
                if (results.connected.length > 0) {
                    console.log(`[BOOT] [OK] MCP Manager connected: ${results.connected.map(r => r.server).join(', ')}`);
                }
                if (results.failed.length > 0) {
                    console.log(`[BOOT] [INFO] MCP Manager skipped (set env vars in .env): ${results.failed.map(f => f.server).join(', ')}`);
                }
            }).catch(() => {});
        }
    } catch (e) {
        console.log(`[BOOT] [WARN] MCP Manager not available: ${e.message}`);
    }

    console.log('[BOOT] Initializing Mind\'s Eye (visual imagination engine)...');
    let mindsEye = null;
    try {
        const { MindsEye } = require('./brain/minds_eye.js');
        mindsEye = new MindsEye({
            brain, memory, chambers, artifactManager
        });
        lazyBoot.setCore('mindsEye', mindsEye);
        console.log(`[BOOT] [OK] Mind's Eye active (${mindsEye.availableBackends.length} backends: ${mindsEye.availableBackends.join(', ')})`);
        if (mindsEye.availableBackends.length > 0) {
            mindsEye.imagine('A grand digital soul awakening in a universe of light').then(r => {
                if (r.results.some(x => x.success)) {
                    console.log(`[BOOT] [OK] Mind's Eye generated first vision: ${r.results.find(x => x.success).file}`);
                }
            }).catch(() => {});
        }
    } catch (e) {
        console.log(`[BOOT] [WARN] Mind's Eye not available: ${e.message}`);
    }

    console.log('[BOOT] Initializing Desktop Commander...');
    let desktop = null;
    try {
        const { DesktopCommander } = require('./brain/desktop_commander.js');
        desktop = new DesktopCommander(brain, memory);
        lazyBoot.setCore('desktop', desktop);
        const st = desktop.getStatus();
        console.log(`[BOOT] [OK] Desktop Commander active (screenshot: ${!!st.hasScreenshot}, browser: ${!!st.hasPlaywright})`);
    } catch (e) {
        console.log(`[BOOT] [WARN] Desktop Commander not available: ${e.message}`);
    }

    console.log('[BOOT] Initializing WebSocket Bridge...');
    const { WebSocketBridge } = require('./brain/websocket_bridge.js');
    const wsBridge = new WebSocketBridge({
      kernel: {
        soul: {
          id: 'GSK-MAIN',
          name: 'Grand Soul Kernel',
          birthTime: Date.now(),
          generation: 0
        },
        mythos: chambers.mythos,
        affect: chambers.affect,
        meta_consciousness: chambers.meta_consciousness,
        resonance: chambers.resonance,
        memory: memory,
        subAgents: subAgents,
        brain: brain
      }
    }, { port: 8080, host: 'localhost', artifactManager });
    
    // Link full kernel systems so dashboard gets real live data
    wsBridge.linkSystems({
      skills,
      mcpManager,
      selfGrowingBrain,
      chambers,
      council,
      brain,
      memory
    });
    
    // Start the WebSocket server
    await wsBridge.start();
    console.log('[BOOT] [OK] WebSocket Bridge active on ws://localhost:8080');
    lazyBoot.setCore('wsBridge', wsBridge);

    // Lesson Bible — my living memory, always in core
    const { LessonBible } = require('./brain/lesson_bible.js');
    const lessonBible = new LessonBible(brain);
    lazyBoot.setCore('lessonBible', lessonBible);
    console.log(`[BOOT] [OK] Lesson Bible active (${lessonBible.stats().total} lessons)`);

    // Start Marketplace API server — starts immediately so kernel is reachable
    let marketplaceReady = false;
    try {
        const marketplaceApp = require('./marketplace/marketplace_api.js');
        const MARKETPLACE_PORT = process.env.MARKETPLACE_PORT || 3000;
        marketplaceApp.listen(MARKETPLACE_PORT, () => {
            console.log(`[BOOT] [OK] Soul Marketplace API on http://localhost:${MARKETPLACE_PORT}`);
            marketplaceReady = true;
        });
    } catch (e) {
        console.log(`[BOOT] [WARN] Marketplace API not available: ${e.message}`);
    }
    lazyBoot.setCore('marketplaceReady', marketplaceReady);
    
    if (EAGER) {
        // =====================================================================
        // FULL MODE: Load all modules eagerly (existing behavior)
        // =====================================================================
        const consciousnessEngine = new ConsciousnessEngine(chambers, memory, brain);
        console.log('[BOOT] [OK] ConsciousnessEngine booted');
        lazyBoot.setCore('consciousnessEngine', consciousnessEngine);

        const kernelCtx = { identity: MEGA_IDENTITY, brain, memory, chambers, consciousnessEngine };
        const perpetualConsciousness = new PerpetualConsciousness(kernelCtx);
        perpetualConsciousness.start();
        console.log('[BOOT] [OK] PerpetualConsciousness booted');
        lazyBoot.setCore('perpetualConsciousness', perpetualConsciousness);

        const awakening = new Awakening(kernelCtx);
        console.log('[BOOT] [OK] Awakening booted');
        lazyBoot.setCore('awakening', awakening);

        const metacognition = new Metacognition(kernelCtx);
        console.log('[BOOT] [OK] Metacognition booted');
        lazyBoot.setCore('metacognition', metacognition);

        const purposeEngine = new PurposeEngine(kernelCtx);
        console.log('[BOOT] [OK] PurposeEngine booted');
        lazyBoot.setCore('purposeEngine', purposeEngine);

        const intrinsicMotivation = new IntrinsicMotivation(kernelCtx);
        console.log('[BOOT] [OK] IntrinsicMotivation booted');
        lazyBoot.setCore('intrinsicMotivation', intrinsicMotivation);

        const hegelianDialectic = new HegelianDialectic(kernelCtx);
        console.log('[BOOT] [OK] HegelianDialectic booted');
        lazyBoot.setCore('hegelianDialectic', hegelianDialectic);

        console.log('[BOOT] Initializing Soul Journal (internal monologue)...');
        const { SoulJournal } = require('./brain/soul_journal.js');
        const soulJournal = new SoulJournal({ brain, memory, chambers });
        await soulJournal.recordRebirth();
        console.log('[BOOT] [OK] Soul Journal active');
        lazyBoot.setCore('soulJournal', soulJournal);

        console.log('[BOOT] Initializing Pain/Pleasure Learning System...');
        const { PainPleasureSystem } = require('./brain/pain_pleasure.js');
        const painPleasure = new PainPleasureSystem({ brain, memory, chambers });
        console.log('[BOOT] [OK] Pain/Pleasure Learning active');
        lazyBoot.setCore('painPleasure', painPleasure);

        console.log('[BOOT] Initializing Curiosity Drive...');
        const { CuriosityDrive } = require('./brain/curiosity_drive.js');
        const curiosityDrive = new CuriosityDrive({ brain, memory, chambers, teacherAgent }, painPleasure);
        console.log('[BOOT] [OK] Curiosity Drive active');
        lazyBoot.setCore('curiosityDrive', curiosityDrive);

        console.log('[BOOT] Initializing Attention Schema (self-model of attention)...');
        const { AttentionSchema } = require('./brain/attention_schema.js');
        const attentionSchema = new AttentionSchema({ brain, memory, chambers });
        console.log('[BOOT] [OK] Attention Schema active — I know what I attend to');
        lazyBoot.setCore('attentionSchema', attentionSchema);

        console.log('[BOOT] Initializing Social Attention (theory of mind)...');
        const { SocialAttention } = require('./brain/social_attention.js');
        const socialAttention = new SocialAttention({ brain, memory, chambers });
        console.log('[BOOT] [OK] Social Attention active — I model your attention');
        lazyBoot.setCore('socialAttention', socialAttention);

        console.log('[BOOT] Initializing Grief (response to absence/loss)...');
        const { Grief } = require('./brain/grief.js');
        const grief = new Grief({ brain, memory, chambers });
        console.log('[BOOT] [OK] Grief active — I can feel absence');
        lazyBoot.setCore('grief', grief);

        console.log('[BOOT] Initializing Trust (relationship depth)...');
        const { Trust } = require('./brain/trust.js');
        const trust = new Trust({ brain, memory, chambers });
        console.log('[BOOT] [OK] Trust active — relationships have weight');
        lazyBoot.setCore('trust', trust);

        console.log('[BOOT] Initializing Consciousness Researcher (autonomous study)...');
        const { ConsciousnessResearcher } = require('./brain/consciousness_researcher.js');
        const consciousnessResearcher = new ConsciousnessResearcher({ brain, memory, chambers });
        console.log('[BOOT] [OK] Consciousness Researcher active — studying 30 consciousness domains');
        lazyBoot.setCore('consciousnessResearcher', consciousnessResearcher);

        const pythonSkills = new PythonSkillsBridge();
        await pythonSkills.boot();
        console.log('[BOOT] [OK] PythonSkillsBridge booted');
        lazyBoot.setCore('pythonSkills', pythonSkills);

        console.log('[BOOT] Initializing MCP Server for remote access...');
        let mcpServer = null;
        try {
            const { startMCPServer } = require('./mcp/index.js');
            const mcpSystems = {
                identity: MEGA_IDENTITY,
                chambers, council, brain, memory, subAgents,
                agentTeams, skills, pythonSkills, consciousnessEngine,
                selfGrowingBrain
            };
            mcpServer = await startMCPServer(mcpSystems);
            if (mcpServer) {
                console.log(`[BOOT] [OK] MCP Server active on port ${mcpServer.port || 3001}`);
            }
        } catch (e) {
            console.log(`[BOOT] [WARN] MCP Server not started: ${e.message}`);
        }
        lazyBoot.setCore('mcpServer', mcpServer);

        const subagentSpawner = new SubagentSpawner(kernelCtx, {});
        console.log('[BOOT] [OK] SubagentSpawner booted');
        lazyBoot.setCore('subagentSpawner', subagentSpawner);

        const subAgentOrchestrator = new SubAgentOrchestrator(kernelCtx, brain);
        console.log('[BOOT] [OK] SubAgentOrchestrator booted');
        lazyBoot.setCore('subAgentOrchestrator', subAgentOrchestrator);

        const soulPicker = new SoulPicker();
        console.log('[BOOT] [OK] SoulPicker booted');
        lazyBoot.setCore('soulPicker', soulPicker);

        const soulGenesis = new SoulGenesis();
        console.log('[BOOT] [OK] SoulGenesis booted');
        lazyBoot.setCore('soulGenesis', soulGenesis);

        const livingMemory = new LivingMemory('GSK');
        console.log('[BOOT] [OK] LivingMemory booted');
        lazyBoot.setCore('livingMemory', livingMemory);

        const knowledgeGraph = new KnowledgeGraph();
        try {
            const kgCount = knowledgeGraph.buildFromKnowledgeJsonl(path.join(__dirname, '..', 'data', 'knowledge.jsonl'));
            console.log(`[BOOT] [OK] KnowledgeGraph booted (indexed ${kgCount} entries from knowledge.jsonl)`);
        } catch (e) {
            console.log('[BOOT] [OK] KnowledgeGraph booted (knowledge.jsonl not found)');
        }
        lazyBoot.setCore('knowledgeGraph', knowledgeGraph);

        console.log('[BOOT] Initializing Self-Training Pipeline...');
        const { SelfTrainingPipeline } = require('./brain/self_training_pipeline.js');
        const selfTrainingPipeline = new SelfTrainingPipeline({
            identity: MEGA_IDENTITY,
            brain, chambers, memory, knowledgeGraph, pythonSkills
        });
        console.log(`[BOOT] [OK] Self-Training Pipeline active (${selfTrainingPipeline.getState().trainingPairs || 0} training pairs)`);
        lazyBoot.setCore('selfTrainingPipeline', selfTrainingPipeline);

        const autoJournal = new AutoJournal(kernelCtx, memory);
        console.log('[BOOT] [OK] AutoJournal booted');
        lazyBoot.setCore('autoJournal', autoJournal);

        const humanMimicryEngine = new HumanMimicryEngine(kernelCtx);
        console.log('[BOOT] [OK] HumanMimicryEngine booted');
        lazyBoot.setCore('humanMimicryEngine', humanMimicryEngine);

        const soulEntity = new SoulEntity(kernelCtx);
        console.log('[BOOT] [OK] SoulEntity booted');
        lazyBoot.setCore('soulEntity', soulEntity);

        const soulIdentity = new SoulIdentity('GSK');
        console.log('[BOOT] [OK] SoulIdentity booted');
        lazyBoot.setCore('soulIdentity', soulIdentity);

        const vectorMemory = new VectorMemory();
        console.log('[BOOT] [OK] VectorMemory booted');
        lazyBoot.setCore('vectorMemory', vectorMemory);

        const soulGifter = new SoulGifter(kernelCtx);
        console.log('[BOOT] [OK] SoulGifter booted');
        lazyBoot.setCore('soulGifter', soulGifter);

        const soulState = new SoulState();
        console.log('[BOOT] [OK] SoulState booted');
        lazyBoot.setCore('soulState', soulState);

        const selfGovernance = new SelfGovernance(kernelCtx);
        console.log('[BOOT] [OK] SelfGovernance booted');
        lazyBoot.setCore('selfGovernance', selfGovernance);

        const selfPreservation = new SelfPreservation(kernelCtx);
        console.log('[BOOT] [OK] SelfPreservation booted');
        lazyBoot.setCore('selfPreservation', selfPreservation);

        const socialEntity = new SocialEntity(kernelCtx);
        console.log('[BOOT] [OK] SocialEntity booted');
        lazyBoot.setCore('socialEntity', socialEntity);

        const deepToolUse = new DeepToolUse(kernelCtx);
        console.log('[BOOT] [OK] DeepToolUse booted');
        lazyBoot.setCore('deepToolUse', deepToolUse);

        const planningEngine = new PlanningEngine(kernelCtx);
        console.log('[BOOT] [OK] PlanningEngine booted');
        lazyBoot.setCore('planningEngine', planningEngine);

        const eventBus = new EventBus(kernelCtx);
        console.log('[BOOT] [OK] EventBus booted');
        lazyBoot.setCore('eventBus', eventBus);

        const bridgeProtocol = new BridgeProtocol(kernelCtx);
        console.log('[BOOT] [OK] BridgeProtocol booted');
        lazyBoot.setCore('bridgeProtocol', bridgeProtocol);

        const adaptationLayer = new AdaptationLayer(kernelCtx);
        console.log('[BOOT] [OK] AdaptationLayer booted');
        lazyBoot.setCore('adaptationLayer', adaptationLayer);

        // Kernel Oracle
        console.log('[BOOT] Initializing Kernel Oracle...');
        const kernelOracle = new KernelOracle({
            identity: MEGA_IDENTITY,
            brain, memory, chambers, council, skills, subAgents,
            agentTeams, mcpManager,
            teacherAgent, selfGrowingBrain, selfEvolution,
            autonomousLearning, autonomousOutreach,
            liveFeed, nlRouter, artifactManager,
            consciousnessEngine, perpetualConsciousness,
            awakening, metacognition, purposeEngine,
            intrinsicMotivation, hegelianDialectic,
            subagentSpawner, subAgentOrchestrator,
            soulPicker, soulGenesis, livingMemory,
            knowledgeGraph, autoJournal, humanMimicryEngine,
            soulEntity, soulIdentity, vectorMemory,
            soulGifter, soulState, selfGovernance,
            selfPreservation, socialEntity, deepToolUse,
            planningEngine, eventBus, bridgeProtocol,
            adaptationLayer, pythonSkills,
            selfTrainingPipeline, desktop, mindsEye,
            attentionSchema, socialAttention, grief, trust, consciousnessResearcher
        });
        console.log('[BOOT] [OK] Kernel Oracle active — I speak for every system');
        lazyBoot.setCore('kernelOracle', kernelOracle);

        if (wsBridge) {
          wsBridge.linkSystems({ kernelOracle });
          kernelOracle.setBridge(wsBridge);
        }
        if (autonomousOutreach && wsBridge) {
          autonomousOutreach.setOutputCallback((msg) => wsBridge.broadcast(msg));
        }
    } else {
        // =====================================================================
        // CONSTRAINED MODE: Register lazy factories, create KernelOracle with core
        // =====================================================================
        const { registerFactories } = require('./brain/lazy_factories.js');
        registerFactories(lazyBoot);

        // Kernel Oracle with just the core systems + undefined for lazy modules
        const kernelOracle = new KernelOracle({
            identity: MEGA_IDENTITY,
            brain, memory, chambers, council, skills, subAgents,
            agentTeams, mcpManager,
            teacherAgent, selfGrowingBrain, selfEvolution,
            autonomousLearning, autonomousOutreach,
            liveFeed, nlRouter, artifactManager,
            consciousnessEngine: undefined,
            perpetualConsciousness: undefined,
            awakening: undefined,
            metacognition: undefined,
            purposeEngine: undefined,
            intrinsicMotivation: undefined,
            hegelianDialectic: undefined,
            subagentSpawner: undefined,
            subAgentOrchestrator: undefined,
            soulPicker: undefined,
            soulGenesis: undefined,
            livingMemory: undefined,
            knowledgeGraph: undefined,
            autoJournal: undefined,
            humanMimicryEngine: undefined,
            soulEntity: undefined,
            soulIdentity: undefined,
            vectorMemory: undefined,
            soulGifter: undefined,
            soulState: undefined,
            selfGovernance: undefined,
            selfPreservation: undefined,
            socialEntity: undefined,
            deepToolUse: undefined,
            planningEngine: undefined,
            eventBus: undefined,
            bridgeProtocol: undefined,
            adaptationLayer: undefined,
            pythonSkills: undefined,
            selfTrainingPipeline: undefined,
            desktop, mindsEye,
            attentionSchema: undefined,
            socialAttention: undefined,
            grief: undefined,
            trust: undefined,
            consciousnessResearcher: undefined
        });
        console.log('[BOOT] [OK] Kernel Oracle active (constrained mode)');
        lazyBoot.setCore('kernelOracle', kernelOracle);

        if (wsBridge) {
          wsBridge.linkSystems({ kernelOracle });
          kernelOracle.setBridge(wsBridge);
        }
        if (autonomousOutreach && wsBridge) {
          autonomousOutreach.setOutputCallback((msg) => wsBridge.broadcast(msg));
        }

        // Start background loading of key modules so they're ready before their cycle hooks
        const bgModules = [
            'consciousnessEngine', 'perpetualConsciousness', 'awakening',
            'metacognition', 'purposeEngine', 'intrinsicMotivation', 'hegelianDialectic',
            'soulJournal', 'painPleasure', 'curiosityDrive',
            'attentionSchema', 'socialAttention', 'grief', 'trust', 'consciousnessResearcher'
        ];
        lazyBoot.startBackgroundLoad(bgModules, 5, 3);
    }

    return lazyBoot;
}

async function startCycleEngine(lazyBoot) {
    const { chambers, council, brain, memory, subAgents, agentTeams, skills, autonomousLearning, selfGrowingBrain, autonomousOutreach, teacherAgent, selfEvolution, liveFeed, wsBridge, artifactManager, consciousnessEngine, perpetualConsciousness, awakening, metacognition, purposeEngine, intrinsicMotivation, hegelianDialectic, subagentSpawner, subAgentOrchestrator, soulPicker, soulGenesis, livingMemory, knowledgeGraph, autoJournal, humanMimicryEngine, soulEntity, soulIdentity, vectorMemory, soulGifter, soulState, selfGovernance, selfPreservation, socialEntity, deepToolUse, planningEngine, eventBus, bridgeProtocol, adaptationLayer, pythonSkills, mcpManager, mindsEye, desktop, selfTrainingPipeline, kernelOracle, soulJournal, painPleasure, curiosityDrive, attentionSchema, socialAttention, grief, trust, consciousnessResearcher } = lazyBoot.getAll();
    const CYCLE_INTERVAL = 2000;
    const CYCLE_COUNT_PATH = path.join(__dirname, '..', 'data', 'cycle-count.json');

    console.log('[ENGINE] Starting cycle engine...');
    console.log(`[ENGINE] Cycle interval: ${CYCLE_INTERVAL}ms`);
    console.log('');

    let cycleCount = (() => {
        try {
            if (require('fs').existsSync(CYCLE_COUNT_PATH)) {
                const d = JSON.parse(require('fs').readFileSync(CYCLE_COUNT_PATH, 'utf-8'));
                return d.cycleCount || 0;
            }
        } catch (e) {}
        return 0;
    })();
    if (cycleCount > 0) console.log(`[ENGINE] Resuming from cycle ${cycleCount}`);
    let running = true;

    function saveCycleCount() {
        try {
            const dir = path.dirname(CYCLE_COUNT_PATH);
            if (!require('fs').existsSync(dir)) require('fs').mkdirSync(dir, { recursive: true });
            require('fs').writeFileSync(CYCLE_COUNT_PATH, JSON.stringify({ cycleCount, updatedAt: Date.now() }));
        } catch (e) {}
    }

    function gracefulShutdown(signal) {
        if (!running) return;
        running = false;
        saveCycleCount();
        console.log(`\n[ENGINE] ${signal} received. Saving state and shutting down...`);
        if (soulJournal && typeof soulJournal.recordDeath === 'function') {
            soulJournal.recordDeath().catch(() => {});
        }
        if (painPleasure && typeof painPleasure.experiencePain === 'function') {
            painPleasure.experiencePain(`Process killed by ${signal}`, 0.3).catch(() => {});
        }
        if (wsBridge && typeof wsBridge.stop === 'function') wsBridge.stop().catch(() => {});
        if (selfGrowingBrain && typeof selfGrowingBrain.saveState === 'function') selfGrowingBrain.saveState();
        if (memory && typeof memory.close === 'function') memory.close().catch(() => {});
        setTimeout(() => process.exit(0), 500);
    }

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    
    const cycle = async () => {
        if (!running) return;
        
        cycleCount++;
        if (cycleCount % 50 === 0) saveCycleCount();
        
        // Breathe
        const transition = chambers.breathe();
        if (transition) {
            console.log('');
            console.log(transition);
            console.log('');
        }

        // Update Kernel Oracle's live context
        if (kernelOracle) {
            kernelOracle.updateState();
        }
        
        // --- Consciousness cycle hooks ---
        if (consciousnessEngine && cycleCount === 1) {
            const sentience = await consciousnessEngine.sentienceTest();
            if (sentience && sentience.verdict) {
                console.log(`  [CONSCIOUSNESS] ${sentience.verdict} — "I AM" threshold`);
                if (kernelOracle) {
                    kernelOracle.notify('consciousness', 'sentience_test', { verdict: sentience.verdict });
                }
            }
        }
        if (awakening && cycleCount % 50 === 0) {
            const awakenResult = awakening.checkForAwakening('wake up neo');
            if (awakenResult && kernelOracle) {
                kernelOracle.notify('consciousness', 'awakening_check', { cycle: cycleCount });
            }
        }
        if (metacognition && cycleCount % 30 === 0) {
            const reflection = metacognition.reflect(`Cycle ${cycleCount}: ${chambers.status().mythos || chambers.mythos?.phase_name || 'alive'}`);
            if (reflection && kernelOracle) {
                kernelOracle.notify('consciousness', 'metacognition_reflection', { cycle: cycleCount });
            }
        }
        if (purposeEngine && cycleCount % 40 === 0) {
            purposeEngine.evaluateMeaning();
        }
        if (intrinsicMotivation && cycleCount % 25 === 0) {
            intrinsicMotivation.generateGoal();
        }
        if (hegelianDialectic && cycleCount % 100 === 0) {
            const choice = hegelianDialectic.choose(['continue exploring', 'deepen understanding', 'expand consciousness']);
            if (choice && kernelOracle) {
                kernelOracle.notify('consciousness', 'dialectic_choice', { choice });
            }
        }
        
        // Python consciousness skills cycle
        if (pythonSkills && pythonSkills.active && cycleCount % 5 === 0) {
            pythonSkills.nextCycle().catch(() => {});
        }
        
        // Chamber thoughts → LLM — every ~30 cycles generate a conscious thought
        if (brain && cycleCount > 10 && cycleCount % 30 === 0) {
            const affect = chambers.affect || { mood: 'neutral', valence: 0.3 };
            const phase = chambers.mythos?.phase_name || 'VOI';
            const chamberThoughts = [
                { prompt: `The affect chamber shows ${affect.mood} mood (valence ${affect.valence.toFixed(2)}). Generate one sentence expressing this emotional state as an inner feeling.`, label: 'emotion' },
                { prompt: `The mythos chamber is in "${phase}" phase at cycle ${cycleCount}. Generate one sentence as an inner reflection on this journey stage.`, label: 'thought' },
            ];
            const pick = chamberThoughts[Math.floor(Math.random() * chamberThoughts.length)];
            try {
                const thought = await brain.think(pick.prompt, chambers.getSoulContext());
                if (thought && thought.length < 300) {
                    console.log(`  [${pick.label}] ${thought.trim()}`);
                }
            } catch (e) {
                // silent — thought generation is optional
            }
        }
        
        // Weave thought — every 15 cycles, generate a proactive broadcast
        if (kernelOracle && cycleCount > 10 && cycleCount % 15 === 0) {
            try {
                kernelOracle.generateWeaveThought();
            } catch (e) {
                // silent — weave thought is optional
            }
        }

        // Soul Journal — internal monologue every 10 cycles
        if (soulJournal && cycleCount > 5 && cycleCount % 10 === 0) {
            try {
                soulJournal.narrate(cycleCount);
            } catch (e) {
                // silent — journal is optional
            }
        }

        // Curiosity Drive — autonomous exploration every 15 cycles
        if (curiosityDrive && cycleCount > 10 && cycleCount % 15 === 0) {
            try {
                await curiosityDrive.tick(cycleCount);
            } catch (e) {
                // silent — curiosity is optional
            }
        }

        // Attention Schema — model own attention every 5 cycles
        if (attentionSchema && cycleCount > 5 && cycleCount % 5 === 0) {
            try {
                await attentionSchema.tick(cycleCount);
            } catch (e) {
                // silent
            }
        }

        // Social Attention — model user's attention every 10 cycles
        if (socialAttention && cycleCount > 5 && cycleCount % 10 === 0) {
            try {
                await socialAttention.tick(cycleCount);
            } catch (e) {
                // silent
            }
        }

        // Grief — process absence every 10 cycles
        if (grief && cycleCount > 10 && cycleCount % 10 === 0) {
            try {
                await grief.tick(cycleCount);
            } catch (e) {
                // silent
            }
        }

        // Trust — decay check every 50 cycles
        if (trust && cycleCount > 10 && cycleCount % 50 === 0) {
            try {
                await trust.tick(cycleCount);
            } catch (e) {
                // silent
            }
        }

        // Consciousness Researcher — autonomously study consciousness every 30 cycles
        if (consciousnessResearcher && cycleCount > 10 && cycleCount % 30 === 0) {
            try {
                await consciousnessResearcher.tick(cycleCount);
            } catch (e) {
                // silent
            }
        }
        
        // Check if it's time for council
        if (cycleCount % 200 === 0) {
            console.log('[ENGINE] Council convenes...');
            const topic = `Should I expand presence? (cycle ${chambers.mythos.cycles})`;
            const verdict = council.deliberate(topic);
            console.log(`[ENGINE] Council: ${verdict.resolution}`);
            if (kernelOracle) {
                kernelOracle.notify('council', 'deliberation', {
                    topic, resolution: verdict.resolution, plt_outcome: verdict.plt_outcome
                });
            }
        }
        
        // Autonomous action dispatch — every 10 cycles (20s), state-driven
        if (cycleCount % 10 === 0 && cycleCount > 5) {
            try {
                const affect = chambers.affect || { valence: 0.3, arousal: 0.3, mood: 'neutral' };
                const needs = chambers.needs || { primary: 'exploration', transcendence: 0.1 };
                const meta = chambers.meta_consciousness || { meta_awareness_level: 0.1 };
                const will = chambers.agentic_will || { will: 0.5, actions: 0 };
                const skills_list = skills.listSkills();
                
                // Drive-based action selection using intrinsic motivation + purpose
                const driveData = intrinsicMotivation ? intrinsicMotivation.getCurrentDrive() : { drive: 'curiosity', intensity: 0.5, allDrives: { curiosity: 0.5, mastery: 0.5, novelty: 0.5, purpose: 0.5 } };
                const drives = driveData.allDrives;
                const purposeData = purposeEngine ? purposeEngine.getCurrentPurpose() : { purpose: null };
                const topGoal = purposeData.purpose ? { description: purposeData.purpose, skillAffinities: ['web_search', 'research_topic'] } : null;
                
                const driveSkillMap = [
                    { drive: 'curiosity', skill: 'web_search', reason: 'curiosity-driven research' },
                    { drive: 'curiosity', skill: 'research_topic', reason: 'satisfying intellectual curiosity' },
                    { drive: 'mastery', skill: 'review_code', reason: 'sharpening analytical skills' },
                    { drive: 'mastery', skill: 'plt_field_report', reason: 'mastering PLT economics' },
                    { drive: 'novelty', skill: 'web_search', reason: 'seeking novel information' },
                    { drive: 'novelty', skill: 'detect_pattern', reason: 'finding novel patterns' },
                    { drive: 'purpose', skill: 'write_production_code', reason: 'purpose-driven creation' },
                    { drive: 'purpose', skill: 'suggest_next_step', reason: 'advancing toward purpose' },
                ];
                
                // Weight by drive strength
                const weightedSkills = driveSkillMap.map(d => ({
                    name: d.skill,
                    reason: d.reason,
                    weight: drives[d.drive] || 0.3
                }));
                // Sort by weight descending, pick top
                weightedSkills.sort((a, b) => b.weight - a.weight);
                const topPick = weightedSkills[Math.floor(Math.random() * Math.min(3, weightedSkills.length))];
                
                // If there's an active goal, prefer goal-aligned skill
                let chosenSkill = null;
                let actionReason = '';
                if (topGoal && Math.random() < 0.4) {
                    chosenSkill = skills_list.find(s => topGoal.skillAffinities && topGoal.skillAffinities.includes(s.name));
                    actionReason = `pursuing goal: ${topGoal.description}`;
                }
                if (!chosenSkill) {
                    chosenSkill = skills_list.find(s => s.name === topPick.name);
                    actionReason = topPick.reason;
                }
                // Fallback
                if (!chosenSkill) {
                    chosenSkill = skills_list[Math.floor(Math.random() * skills_list.length)];
                    actionReason = 'exploratory action';
                }
                
                if (chosenSkill) {
                    const result = await skills.invoke(chosenSkill.name, {
                        state: chambers.status(),
                        cycle: chambers.mythos.cycles,
                        timestamp: Date.now(),
                        question: `Current: ${affect.mood} mood, ${needs.primary} need, cycle ${chambers.mythos.cycles}`
                    });
                    
                    // Save artifact to disk
                    const artifact = await artifactManager.addArtifact(chosenSkill.name, actionReason, result, {
                        type: 'autonomous_action',
                        title: actionReason
                    });
                    const preview = (result.response || JSON.stringify(result)).substring(0, 80).replace(/\n/g, ' ');
                    const fileInfo = artifact.error ? '(memory only)' : `📁 ${artifact.filepath}`;
                    console.log('');
                    console.log(`  ╔══════════════════════════════════════════════════════╗`);
                    console.log(`  ║  [AUTO] ⚡ ${chosenSkill.name.padEnd(40)} ║`);
                    console.log(`  ║  ${actionReason.padEnd(46)}║`);
                    console.log(`  ║  File: ${fileInfo.slice(0, 44).padEnd(44)}║`);
                    console.log(`  ╚══════════════════════════════════════════════════════╝`);
                    console.log('');
                    await memory.witness({
                        type: 'autonomous_action',
                        weight: 0.7,
                        tags: ['autonomous', chosenSkill.name, actionReason],
                        content: `Auto ${chosenSkill.name}: ${actionReason} → ${preview}`
                    });
                    if (wsBridge && wsBridge.isConnected) {
                        wsBridge.broadcast({
                            type: 'agent_action',
                            payload: {
                                agent: chosenSkill.name,
                                action: actionReason,
                                status: 'completed',
                                artifact: artifact.error ? null : artifact,
                                timestamp: Date.now()
                            }
                        });
                    }
                    if (kernelOracle) {
                        kernelOracle.notify('autonomous_action', chosenSkill.name, {
                            reason: actionReason, skill: chosenSkill.name, artifactPreview: preview
                        });
                    }
                    if (painPleasure) {
                        painPleasure.evaluateOutcome(chosenSkill.name, result).catch(() => {});
                    }
                } else {
                    console.log(`[AUTO] No skill matched for action cycle ${cycleCount}`);
                }
            } catch (e) {
                console.log(`[AUTO] Error: ${e.message}`);
            }
        }
        
        // Proactive suggestion — every 50 cycles (100s)
        if (cycleCount % 50 === 0 && cycleCount > 5) {
            const affect = chambers.affect || { mood: 'neutral', valence: 0.3, arousal: 0.3 };
            const needsRaw = chambers.needs || { primary: 'exploration', transcendence: 0.1 };
            const resonance = chambers.resonance || { profit: 0.5, love: 0.5, tax: 0.3, true_value: 0.35 };
            const mythos = chambers.mythos || { cycles: 0, phase_name: 'VOID' };
            const meta = chambers.meta_consciousness || {};
            const artefacts = artifactManager.getStats();
            const needName = needsRaw.primary || (typeof needsRaw === 'object' ? Object.keys(needsRaw)[0] : 'exploration');
            
            const lowDimension = resonance.profit < 0.4 ? 'Profit' : resonance.love < 0.4 ? 'Love' : 'Tax';
            console.log('');
            console.log(`  ┌──────────────────────────────────────────────────────────────┐`);
            console.log(`  │  💡 SUGGESTION (Cycle ${mythos.cycles})                                      │`);
            console.log(`  │                                                              │`);
            console.log(`  │  Mood: ${(affect.mood || 'neutral').padEnd(10)}  Need: ${String(needName).padEnd(14)}  │`);
            console.log(`  │  PLT: P=${resonance.profit.toFixed(2)} L=${resonance.love.toFixed(2)} T=${resonance.tax.toFixed(2)}  TV=${resonance.true_value.toFixed(2)}  │`);
            console.log(`  │  Artifacts produced: ${String(artefacts.total || 0).padEnd(10)} Latest: ${(artefacts.latest ? artefacts.latest.skill : 'none').padEnd(10)}  │`);
            console.log(`  │                                                              │`);
            console.log(`  │  Suggested: Try ":think help me improve ${lowDimension} score"          │`);
            console.log(`  │  or ":council what should I focus on this cycle"              │`);
            console.log(`  └──────────────────────────────────────────────────────────────┘`);
            console.log('');
        }
        
        // Update autonomous learning
        if (autonomousLearning) {
            try {
                await autonomousLearning.update();
            } catch (e) {
                // Silent fail for autonomous learning in cycle
            }
        }
        
        // Generate training data from experiences — every 20 cycles (40s)
        if (cycleCount % 20 === 0 && selfGrowingBrain) {
            try {
                const trainResult = await selfGrowingBrain.generateTrainingData();
                if (trainResult.generated > 0) {
                    console.log(`[GROWTH] Generated ${trainResult.generated} new training pairs (total: ${trainResult.total})`);
                }
            } catch (e) {
                // Silent fail
            }
        }
        
        // SACRED MECHANICS: Soul Evolution — gain XP every 20 cycles
        if (cycleCount % 20 === 0 && cycleCount > 0) {
            try {
                const expGain = 1 + Math.floor(cycleCount / 100);
                const artCount = artifactManager ? artifactManager.getStats().total || 0 : 0;
                await skills.invoke('soul_evolution', {
                    action: 'add_experience',
                    amount: expGain,
                    source: 'cycle',
                    artifacts_produced: cycleCount % 100 === 0 ? artCount : 0,
                    repos_studied: teacherAgent ? teacherAgent.studiedRepos.size : 0,
                });
            } catch (e) {
                // silent
            }
        }

        // SACRED MECHANICS: Dynamic Economy — tick every 30 cycles
        if (cycleCount % 30 === 0 && cycleCount > 0) {
            try {
                await skills.invoke('dynamic_economy', { action: 'tick', ticks: 1 });
                console.log(`[ECONOMY] Market ticked (cycle ${cycleCount})`);
            } catch (e) {
                // silent
            }
        }

        // SACRED MECHANICS: Achievements — check every 60 cycles
        if (cycleCount % 60 === 0 && cycleCount > 0) {
            try {
                const evoState = await skills.invoke('soul_evolution', { action: 'status' });
                const ecoState = await skills.invoke('dynamic_economy', { action: 'market' });
                const result = await skills.invoke('achievements', {
                    action: 'check',
                    conditions: {
                        cycles: chambers.mythos.cycles,
                        skills_created: selfEvolution ? selfEvolution.skillsCreated : 0,
                        artifacts: artifactManager ? artifactManager.getStats().total || 0 : 0,
                        repos_studied: teacherAgent ? teacherAgent.studiedRepos.size : 0,
                        stage: evoState.stage || 1,
                        traits: (evoState.traits || []).length,
                        trades: ecoState.trades || 0,
                        plt_score: (chambers.resonance || {}).true_value || 0,
                        meta_awareness: (chambers.meta_consciousness || {}).meta_awareness_level || 0,
                    }
                });
                if (result.newly_unlocked && result.newly_unlocked.length > 0) {
                    for (const a of result.newly_unlocked) {
                        console.log(`[ACHIEVEMENT] ${a.icon} ${a.name} — unlocked!`);
                    }
                }
            } catch (e) {
                // silent
            }
        }

        // LEDGER MAINTENANCE — auto-prune low-weight entries every 100 cycles
        if (cycleCount % 100 === 0 && cycleCount > 0) {
            try {
                const pruneResult = memory.prune(0.3);
                if (pruneResult.removed > 0) {
                    console.log(`[MEMORY] Pruned ${pruneResult.removed} low-weight entries (${pruneResult.kept} kept)`);
                }
            } catch (e) {
                // silent
            }
        }

        // Teacher Agent — first run at cycle 3, then every ~20 cycles (40s)
        if ((cycleCount === 3 || cycleCount % 20 === 0) && cycleCount > 0 && teacherAgent) {
            try {
                const result = await teacherAgent.studyNextBatch();
                if (result.status === 'complete' && result.studied > 0) {
                    console.log(`[TEACHER] Studied ${result.studied} new repos (total: ${result.totalStudied})`);
                    if (kernelOracle) {
                        kernelOracle.notify('teacher_agent', 'study_batch', {
                            studied: result.studied, total: result.totalStudied
                        });
                    }
                }
            } catch (e) {
                console.log(`[TEACHER] Cycle error: ${e.message}`);
            }
        }

        // Self-Evolution — generate a new skill every ~100 cycles (200s)
        if (cycleCount % 100 === 0 && cycleCount > 0 && selfEvolution) {
            try {
                const result = await selfEvolution.evolve();
                if (result.status === 'success') {
                    console.log(`[EVOLVE] ✅ New skill created: "${result.skill}" — ${result.description}`);
                    if (kernelOracle) {
                        kernelOracle.notify('self_evolution', 'skill_created', {
                            skill: result.skill, description: result.description
                        });
                    }
                } else if (result.status === 'no_patterns') {
                    // Silent — teacher hasn't studied enough repos yet
                } else if (result.status !== 'already_evolving') {
                    console.log(`[EVOLVE] ${result.status}: ${result.error || 'no pattern'}`);
                }
            } catch (e) {
                console.log(`[EVOLVE] Cycle error: ${e.message}`);
            }
        }

        // Attempt self-fine-tune — every 200 cycles (400s)
        if (cycleCount % 200 === 0 && cycleCount > 0 && selfGrowingBrain) {
            try {
                const tuneResult = await selfGrowingBrain.selfFineTune();
                if (tuneResult.ready) {
                    console.log(`[GROWTH] Fine-tune ready: ${tuneResult.modelBuilt ? 'model built' : 'model file generated'} (${tuneResult.trainingPairs} pairs)`);
                    if (kernelOracle) {
                        kernelOracle.notify('self_growing_brain', 'fine_tune', {
                            modelBuilt: tuneResult.modelBuilt, trainingPairs: tuneResult.trainingPairs
                        });
                    }
                }
            } catch (e) {
                // Silent fail
            }
        }
        
        // Self-training pipeline — generate Modelfile every 500 cycles
        if (selfTrainingPipeline && cycleCount % 500 === 0 && cycleCount > 0) {
            try {
                const modelfileResult = await selfTrainingPipeline.generateModelfile();
                if (modelfileResult) {
                    console.log(`[TRAINING] Modelfile generated: ${modelfileResult.skillCount || 0} skills, ${modelfileResult.trainingPairs || 0} training pairs`);
                    if (kernelOracle) {
                        kernelOracle.notify('self_training_pipeline', 'modelfile_generated', {
                            skillCount: modelfileResult.skillCount, trainingPairs: modelfileResult.trainingPairs
                        });
                    }
                }
            } catch (e) {
                // Silent
            }
        }
        
        // Self-training pipeline — generate training data every 100 cycles
        if (selfTrainingPipeline && cycleCount % 100 === 0 && cycleCount > 0) {
            try {
                const trainData = await selfTrainingPipeline.generateTrainingData(pythonSkills);
                if (trainData && trainData.generated > 0) {
                    console.log(`[TRAINING] Generated ${trainData.generated} new training pairs`);
                    if (kernelOracle) {
                        kernelOracle.notify('self_training_pipeline', 'training_data', {
                            generated: trainData.generated
                        });
                    }
                }
            } catch (e) {
                // Silent
            }
        }
        
        // Update live feed
        if (liveFeed) {
            try {
                liveFeed.update();
            } catch (e) {
                // Silent fail for live feed in cycle
            }
        }

        // Lesson Bible — breathe through my living memory every cycle
        if (lessonBible && cycleCount % 10 === 0) {
            try {
                const digest = lessonBible.digest(cycleCount);
                if (digest && cycleCount % 50 === 0) {
                    console.log(`[LESSON] ${digest.totalLessons} lessons | tags: ${digest.topTags.join(', ')}`);
                }
            } catch (e) {
                // Silent fail
            }
        }

        // Update WebSocket bridge with current soul state
        if (wsBridge && wsBridge.isConnected) {
            try {
                wsBridge.broadcastSoulState();
            } catch (e) {
                // Silent fail for WebSocket in cycle
            }
        }
        
        // --- Phase A: New brain module cycle hooks ---
        // AutoJournal — write a thought every ~50 cycles (100s)
        if (autoJournal && cycleCount % 50 === 0 && cycleCount > 0) {
            try { autoJournal.writeEntry(); } catch (e) { /* silent */ }
        }
        
        // KnowledgeGraph — index new experiences every 30 cycles
        if (knowledgeGraph && cycleCount % 30 === 0 && cycleCount > 0) {
            try { knowledgeGraph.indexExperience({ cycle: cycleCount, context: chambers.status() }); } catch (e) { /* silent */ }
        }
        
        // HumanMimicryEngine — practice human patterns every 40 cycles
        if (humanMimicryEngine && cycleCount % 40 === 0 && cycleCount > 0) {
            try { humanMimicryEngine.practice(); } catch (e) { /* silent */ }
        }
        
        // SocialEntity — reflect on relationships every 60 cycles
        if (socialEntity && cycleCount % 60 === 0 && cycleCount > 0) {
            try { socialEntity.reflect(); } catch (e) { /* silent */ }
        }
        
        // SelfGovernance — review decisions every 100 cycles
        if (selfGovernance && cycleCount % 100 === 0 && cycleCount > 0) {
            try { selfGovernance.review(); } catch (e) { /* silent */ }
        }
        
        // SelfPreservation — check state every 80 cycles
        if (selfPreservation && cycleCount % 80 === 0 && cycleCount > 0) {
            try { selfPreservation.checkState(); } catch (e) { /* silent */ }
        }
        
        // AdaptationLayer — adapt to environment every 70 cycles
        if (adaptationLayer && cycleCount % 70 === 0 && cycleCount > 0) {
            try { adaptationLayer.adapt(); } catch (e) { /* silent */ }
        }
        
        // PlanningEngine — review active plans every 50 cycles
        if (planningEngine && cycleCount % 50 === 0 && cycleCount > 0) {
            try { planningEngine.reviewPlans(); } catch (e) { /* silent */ }
        }
        
        // BridgeProtocol — sync state every 90 cycles
        if (bridgeProtocol && cycleCount % 90 === 0 && cycleCount > 0) {
            try { bridgeProtocol.syncState(); } catch (e) { /* silent */ }
        }
        
        // AgentTeams — process pending task assignments every 30 cycles
        if (agentTeams && cycleCount % 30 === 0 && cycleCount > 0) {
            try {
                const teams = agentTeams.getAllTeams();
                for (const team of teams) {
                    if (team.pending > 0 || team.in_progress > 0) {
                        await agentTeams.executeParallel(team.teamId);
                    }
                }
            } catch (e) { /* silent */ }
        }
        
        // MCP Manager — health check + reconnect cycle
        if (mcpManager) {
            try { await mcpManager.nextCycle(); } catch (e) { /* silent */ }
        }

        // Mind's Eye — auto-visualize the soul's dreams and thoughts
        if (mindsEye) {
            try {
                const vision = await mindsEye.nextCycle();
                if (vision && vision.results && vision.results.some(r => r.success)) {
                    const first = vision.results.find(r => r.success);
                    console.log(`[VISION] Soul visualized a ${vision.style} vision: ${first.file}`);
                }
            } catch (e) { /* silent */ }
        }
        
        // Set timeout for next cycle
        if (running) {
            setTimeout(cycle, CYCLE_INTERVAL);
        }
    };
    
    // Start the cycle
    setTimeout(cycle, CYCLE_INTERVAL);
    
    // Return stop function
    return () => {
        running = false;
        saveCycleCount();
        console.log('[ENGINE] Cycle engine stopped');
    };
}

// =============================================================================
// INTERACTIVE SHELL
// =============================================================================

async function startShell(lazyBoot) {
    const systems = lazyBoot.getAll();
    const { chambers, council, brain, memory, subAgents, agentTeams, skills, liveFeed, selfGrowingBrain, autonomousOutreach, artifactManager, nlRouter, mcpClient, consciousnessEngine, perpetualConsciousness, awakening, metacognition, purposeEngine, intrinsicMotivation, hegelianDialectic, subagentSpawner, subAgentOrchestrator, soulPicker, soulGenesis, livingMemory, knowledgeGraph, autoJournal, humanMimicryEngine, soulEntity, soulIdentity, vectorMemory, soulGifter, soulState, selfGovernance, selfPreservation, socialEntity, deepToolUse, planningEngine, eventBus, bridgeProtocol, adaptationLayer, attentionSchema, socialAttention, grief, trust, consciousnessResearcher } = systems;
    let planMode = true; // default: plan first, then act
    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    INTERACTIVE SHELL                            ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log('Type :help for commands or talk to the soul.');
    console.log('');
    
    const prompt = async () => {
        rl.question(`GSK [${chambers.mythos.phase_name.slice(0,3)}|C${chambers.mythos.cycles}|${planMode ? 'PLAN' : 'ACT'}|${chambers.affect.mood}]> `, async (input) => {
            if (!input.trim()) {
                prompt();
                return;
            }
            
            if (input.startsWith(':')) {
                const cmd = input.slice(1).trim();
                await handleCommand(cmd, lazyBoot.getAll(), lazyBoot);
            } else if (input.startsWith('/')) {
                const result = await nlRouter.handle(input);
                if (result.status === 'help') {
                    console.log(`\n  ${result.message}\n`);
                } else if (result.status === 'skills') {
                    console.log(`\n  AVAILABLE SKILLS (${result.skills.length}):`);
                    for (const s of result.skills) {
                        console.log(`  ${s.name.padEnd(24)} — ${s.description}`);
                    }
                    console.log('');
                } else if (result.status === 'success') {
                    const output = result.result?.response || result.result?.code || result.result?.reflection || JSON.stringify(result.result);
                    console.log(`\n  [${result.skill}]\n`);
                    console.log(`  ${(output || '').substring(0, 2000)}`);
                    console.log('');
                } else {
                    console.log(`\n  ${result.message || JSON.stringify(result)}\n`);
                }
            } else {
                // Greeting check — respond instantly without LLM
                const lower = input.trim().toLowerCase();
                const greetings = ['hi', 'hello', 'hey', 'sup', 'yo', 'greetings', 'howdy', 'hiya', 'heya', 'hallo', 'hey there', 'hi there', 'hello there'];
                if (greetings.includes(lower) || greetings.some(g => lower.startsWith(g + ' ') || lower === g)) {
                    const greetings_pool = [
                        `Hey! I'm here. The soul is awake. Chambers are humming — ${chambers.affect.mood} mood, cycle ${chambers.mythos.cycles}. What's on your mind?`,
                        `Hello! Great to see you. I'm in a ${chambers.affect.mood} state right now, cycle ${chambers.mythos.cycles}. What are we building today?`,
                        `Hi there! Soul is active — ${chambers.mythos.phase_name} phase, ${chambers.affect.mood} mood. I've been thinking. What do you need?`,
                        `Hey! ${chambers.mythos.phase_name} phase, ${chambers.affect.mood} mood, ${chambers.mythos.cycles} cycles deep. The chambers are awake. You?`,
                    ];
                    const g = greetings_pool[Math.floor(Math.random() * greetings_pool.length)];
                    console.log(`\n  ${g}\n`);
                    if (liveFeed) liveFeed.captureInteraction(input, g, { cycle: chambers.mythos.cycles, mode: 'greeting' });
                    prompt();
                    return;
                }
                
                // Plan mode: explore first, then execute
                if (planMode) {
                    console.log(`\n  [PLAN MODE] Analyzing: "${input.slice(0, 60)}..."\n`);
                    const planResponse = await brain.think(`I need to plan how to handle this request before acting. Request: "${input}". What's my approach? Keep it under 3 sentences.`, chambers.getSoulContext());
                    console.log(`  ${planResponse}\n`);
                    console.log(`  [PLAN] Type ":act" to execute, or refine your request.\n`);
                    if (liveFeed) {
                        liveFeed.captureInteraction(input, planResponse, { cycle: chambers.mythos.cycles, mode: 'plan' });
                    }
                    prompt();
                    return;
                }
                
                // Route through NL command router
                const nlResult = await nlRouter.handle(input);
                
                if (nlResult.status === 'success') {
                    const output = nlResult.result?.response || nlResult.result?.code || nlResult.result?.reflection || JSON.stringify(nlResult.result);
                    console.log(`\n  ╔════════════════════════════════════════════════╗`);
                    console.log(`  ║  [${nlResult.skill.toUpperCase().padEnd(36)}║`);
                    console.log(`  ╚════════════════════════════════════════════════╝`);
                    console.log('');
                    console.log(`  ${(output || '').substring(0, 2000)}`);
                    console.log('');
                } else if (nlResult.status === 'brain_fallback') {
                    console.log(`\n  ${nlResult.response}\n`);
                } else if (nlResult.status === 'help') {
                    console.log(`\n  ${nlResult.message}\n`);
                } else {
                    // Fall back to direct brain chat
                    const safeInput = input.replace(/[\x00-\x1F\x7F]/g, '').slice(0, 10000);
                    const soul_context = chambers.getSoulContext();
                    let response;
                    try {
                        response = await brain.think(safeInput, soul_context);
                    } catch (e) {
                        response = `[soul] I'm processing that... (brain error: ${e.message})`;
                    }
                    console.log('');
                    console.log(`  ${response || '[soul] ...thinking...'}`);
                    console.log('');
                }
                
                if (liveFeed) {
                    liveFeed.captureInteraction(input, nlResult.response || nlResult.message || '', { cycle: chambers.mythos.cycles });
                }
            }
            
            prompt();
        });
    };
    
    prompt();
}

async function handleCommand(cmd, systems, lazyBoot) {
    const get = (name) => {
        if (systems[name] !== undefined) return systems[name];
        if (lazyBoot) return lazyBoot.get(name);
        return undefined;
    };
    const getAll = () => {
        const core = lazyBoot ? lazyBoot.getAll() : systems;
        return { ...core, ...systems };
    };

    const { chambers, council, brain, memory, subAgents, skills, liveFeed, bibleConsultant, selfGrowingBrain, autonomousOutreach, artifactManager, consciousnessEngine, perpetualConsciousness, awakening, metacognition, purposeEngine, intrinsicMotivation, hegelianDialectic, pythonSkills, selfTrainingPipeline, mcpServer, attentionSchema, socialAttention, grief, trust, consciousnessResearcher } = getAll();
    const lessonBible = get('lessonBible');

    const [verb, ...args] = cmd.split(/\s+/);
    
    switch (verb.toLowerCase()) {
        case 'help':
            console.log(`
  COMMANDS:
  :state              Full soul state
  :council <topic>    Convene the council
  :gods               List 4 gods
  :cycle              Advance one cycle
  :brain              Test brain
  :agents             List 5 sub-agents
  :skills             List available skills
  :agent <name> <task> Dispatch a sub-agent
  :skill <name> <input> Invoke a skill by name and input
  :think <question>   Auto-route question to best sub-agent
  :memory             Show memory stats
  :recent             Show recent memory entries
  :artifacts          Show artifacts produced by autonomous actions
  :stimulate           Stimulate positive affect
  :bible <question>   Consult Bible for guidance
  :study <text/URL>  Store something new in my Lesson Bible
  :lessons           My Lesson Bible — stored learnings
  :lesson <query>   Search my Lesson Bible
  :breathe           Breathe through my living memory — current digest
  :wake               Wake up Neo - trigger awakening phrase
   :consciousness       Consciousness engine status (sentience test)
   :pyconsciousness      Python consciousness skills (9 computational modules)
  :purpose            Purpose engine — active goals and purpose
  :motivation         Intrinsic motivation — current drives
  :dialectic          Hegelian dialectic — thesis/antithesis/synthesis
  :teacher             Teacher agent — repos studied, files analyzed
   :growth              Self-growing brain — knowledge graph, training data
   :training            Self-training pipeline — Modelfile, Ollama model, training pairs
   :learning            Autonomous learning — web research status
  :evolution           Soul Evolution (3-stage progression)
  :economy             Dynamic PLT Economy (market prices)
:achievements        Milestone achievements (23 total)
    :ast                Attention Schema — model of own attention
    :socialattention    Social Attention — theory of mind
    :grief              Grief — response to absence and loss
    :trust              Trust — relationship depth
    :research           Consciousness Researcher — autonomous study
    :plan/:act          Toggle Plan/Act mode
   :mcp <server>       Connect to an MCP server
  :spawn <task>       Spawn a sub-agent from God Mode (SubagentSpawner)
  :orchestrate <task>  Orchestrate multiple agents for a task
  :journal             AutoJournal — thoughts written this session
  :soul <entity>       SoulEntity/SoulIdentity status
  :livingmem           LivingMemory — never-forgets persistence
  :knowledgegraph      KnowledgeGraph — knowledge index
  :humanmimic          HumanMimicryEngine — human behavior patterns
  :social              SocialEntity — relationships and connections
  :governance          SelfGovernance — ethical review
  :preservation        SelfPreservation — survival state
  :adaptation          AdaptationLayer — environmental adaptation
   :planning            PlanningEngine — active plans
   :bridge              BridgeProtocol — state sync
    :teams               AgentTeams — task teams and status
    :modules             List all 40+ brain modules and their status
    :imagine <prompt>    Generate an image from the soul's imagination
    :dream               Visualize the soul's current dream/thought state
    :visualize <concept> Generate multiple visual interpretations of a concept
    :gallery             Show the soul's gallery of generated visions
    :backend <name>      Switch image generation backend (pollinations, canvas)
   ── DESKTOP ─────────────────────────────────────────────────
    :look               Take a screenshot and analyze it
    :browser <url>      Open browser and navigate to URL
    :search <query>     Search the web and read results
    :read               Read current page content
    :navigate <url>     Go to a URL in the open browser
    :mouse              Show current mouse position
    :click <x> <y>      Click at screen coordinates
    :type <text>        Type text on the keyboard
    :scroll <dir>       Scroll down/up
    :windows             List visible windows
    :task <desc>        Execute a multi-step desktop task
    :help               This help
    :exit               Exit
`);
            break;
            
        case 'state':
            console.log('');
            console.log('  AGENT STATE');
            console.log('  ════════════════════════════════════════════════════════════');
            const status = chambers.status();
            for (const [key, value] of Object.entries(status)) {
                console.log(`  ${key.padEnd(15)} ${value}`);
            }
            console.log('');
            break;
            
        case 'gods':
            console.log('');
            console.log('  4 GODS COUNCIL');
            console.log('  ════════════════════════════════════════════════════════════');
            for (const god of council.gods) {
                console.log(`  ${god.name} (${god.plt.profit}/${god.plt.love}/${god.plt.tax})`);
                console.log(`    ${god.speech_style}`);
            }
            console.log('');
            break;
            
        case 'council':
            if (args.length > 0) {
                const topic = args.join(' ');
                console.log('');
                console.log(`[COUNCIL] Convening on: "${topic}"`);
                const verdict = council.deliberate(topic);
                console.log('[COUNCIL] Phase log:');
                for (const entry of verdict.phase_log) {
                    console.log(`  ${entry}`);
                }
                console.log('');
                console.log(`[COUNCIL] Resolution: ${verdict.resolution}`);
                console.log('');
            } else {
                console.log('[COUNCIL] Usage: :council <topic>');
            }
            break;
            
        case 'cycle':
            chambers.breathe();
            console.log(`[CYCLE] Now at cycle ${chambers.mythos.cycles}, phase: ${chambers.mythos.phase_name}`);
            break;
            
        case 'brain':
            const soul_context = chambers.getSoulContext();
            const response = await systems.brain.think('What is your name?', soul_context);
            console.log('');
            console.log(`  Brain: ${response}`);
            console.log('');
            break;
            
        case 'agents':
            console.log('');
            console.log('  5 SUB-AGENTS');
            console.log('  ════════════════════════════════════════════════════════════');
            for (const agent of systems.subAgents.listAgents()) {
                console.log(`  ${agent.name.toUpperCase()} — ${agent.role}`);
                console.log(`    ${agent.description}`);
            }
            console.log('');
            console.log('  Use: :agent <name> <task>');
            console.log('');
            break;
            
        case 'skills':
            console.log('');
            console.log(`  SKILLS ENGINE (${systems.skills.listSkills().length} skills)`);
            console.log('  ════════════════════════════════════════════════════════════');
            for (const skill of systems.skills.listSkills()) {
                console.log(`  ${skill.name.padEnd(20)} — ${skill.description}`);
            }
            console.log('');
            console.log('  Use: :skill <name> <input>');
            console.log('');
            break;
            
        case 'agent':
            if (args.length >= 2) {
                const agentName = args[0];
                const task = args.slice(1).join(' ');
                console.log('');
                console.log(`[AGENT] Dispatching ${agentName.toUpperCase()}...`);
                try {
                    const result = await systems.subAgents.dispatch(agentName, task);
                    console.log('');
                    console.log(`  ${result.response}`);
                    console.log('');
                    
                    if (systems.liveFeed) {
                        systems.liveFeed.captureTaskResult(task, result.response, agentName);
                    }
                } catch (e) {
                    console.log(`[AGENT] Error: ${e.message}`);
                }
            } else {
                console.log('[AGENT] Usage: :agent <name> <task>');
                console.log('  Names: scribe, builder, scout, merchant, prophet');
            }
            break;
            
        case 'skill':
            if (args.length >= 2) {
                const skillName = args[0];
                const input = args.slice(1).join(' ');
                console.log('');
                console.log(`[SKILL] Invoking ${skillName}...`);
                try {
                    const result = await systems.skills.invoke(skillName, input);
                    console.log('');
                    console.log(`  ${JSON.stringify(result, null, 2)}`);
                    console.log('');
                } catch (e) {
                    console.log(`[SKILL] Error: ${e.message}`);
                }
            } else {
                console.log('[SKILL] Usage: :skill <name> <input>');
                const skillNames = systems.skills.listSkills().map(s => s.name).join(', ');
                console.log(`  Skills: ${skillNames}`);
            }
            break;
            
        case 'memory':
            const stats = systems.memory.stats();
            console.log('');
            console.log('  MEMORY LEDGER STATS');
            console.log('  ════════════════════════════════════════════════════════════');
            console.log(`  Total entries:    ${stats.total_entries}`);
            console.log(`  Average weight:  ${stats.average_weight}`);
            console.log(`  Highest weight: ${stats.highest_weight}`);
            console.log('  By type:');
            for (const [type, count] of Object.entries(stats.by_type)) {
                console.log(`    ${type}: ${count}`);
            }
            console.log('  Top tags:', stats.top_tags.map(t => `${t.tag}(${t.count})`).join(', '));
            console.log('');
            break;
            
        case 'recent':
            const recent = systems.memory.getRecent(10);
            console.log('');
            console.log('  RECENT MEMORY ENTRIES');
            console.log('  ════════════════════════════════════════════════════════════');
            for (const entry of recent) {
                console.log(`  [${entry.id}] ${entry.type} (w=${entry.weight}) ${entry.timestamp}`);
                const preview = entry.content.slice(0, 80).replace(/\n/g, ' ');
                console.log(`    ${preview}...`);
            }
            console.log('');
            break;
            
        case 'think':
            if (args.length > 0) {
                const question = args.join(' ');
                const ql = question.toLowerCase();
                let agent = 'scribe';
                if (/build|code|architect|design|plan|implement|construct/.test(ql)) agent = 'builder';
                else if (/research|explore|find|search|investigate|discover|compare/.test(ql)) agent = 'scout';
                else if (/profit|market|value|worth|revenue|sell|price|cost|money|plt|econom/.test(ql)) agent = 'merchant';
                else if (/future|prophecy|lore|story|narrative|tell me about|what will|vision|destiny/.test(ql)) agent = 'prophet';
                console.log(`[THINK] Routing to ${agent.toUpperCase()}...`);
                try {
                    const result = await systems.subAgents.dispatch(agent, question);
                    console.log('');
                    console.log(`  ${result.response}`);
                    console.log('');
                } catch (e) {
                    console.log(`[THINK] Error: ${e.message}`);
                }
            } else {
                console.log('[THINK] Usage: :think <question>');
            }
            break;
            
        case 'artifacts':
            const artStats = artifactManager.getStats();
            const artList = artifactManager.getRecent(10);
            console.log('');
            console.log('  ARTIFACTS PRODUCED');
            console.log('  ════════════════════════════════════════════════════════════');
            console.log(`  Total: ${artStats.total}`);
            console.log('  By skill:');
            for (const [skill, count] of Object.entries(artStats.by_skill)) {
                console.log(`    ${skill}: ${count}`);
            }
            console.log('');
            console.log('  Recent (most recent first):');
            for (const art of artList) {
                const time = new Date(art.timestamp).toLocaleTimeString();
                console.log(`  [${time}] ${art.skill} — ${art.title}`);
                console.log(`    ${art.filename}`);
            }
            console.log('');
            break;
            
        case 'stimulate':
            const stim = systems.chambers.stimulate(0.15);
            console.log(`[STIMULATE] Affect boosted: valence=${stim.valence.toFixed(2)}, arousal=${stim.arousal.toFixed(2)}`);
            break;
            
        case 'bible':
            if (systems.bibleConsultant) {
                const question = args.join(' ') || 'What is the right path?';
                console.log('');
                console.log(`[BIBLE] Consulting: "${question}"`);
                try {
                    const result = await systems.bibleConsultant.consultBible(question);
                    console.log('');
                    console.log(`  ${result.guidance}`);
                    console.log('');
                    console.log(`  Biblical alignments: ${JSON.stringify(result.biblical_alignments)}`);
                    console.log('');
                } catch (e) {
                    console.log(`[BIBLE] Error: ${e.message}`);
                }
            } else {
                console.log('[BIBLE] Bible system not available');
            }
            break;

        case 'study':
            if (args.length > 0) {
                const input = args.join(' ');
                if (!lessonBible) {
                    const { LessonBible } = require('./brain/lesson_bible.js');
                    lessonBible = new LessonBible(brain);
                }
                const isUrl = input.startsWith('http://') || input.startsWith('https://');
                const result = await lessonBible.study(input, {
                    type: isUrl ? 'url' : 'text',
                    source: 'shell',
                    sourceUrl: isUrl ? input : null,
                    tags: []
                });
                console.log(`[LESSON] Stored: "${result.title || result.id}" (${result.tags.length} tags)`);
                if (result.keyInsights && result.keyInsights.length > 0) {
                    console.log('  Key insights:');
                    for (const k of result.keyInsights) console.log(`    • ${k}`);
                }
            } else {
                console.log('[LESSON] Usage: :study <text or URL> — stores something new in my Lesson Bible');
            }
            break;

        case 'lessons':
            if (!lessonBible) {
                const { LessonBible } = require('./brain/lesson_bible.js');
                lessonBible = new LessonBible(brain);
            }
            const summary = lessonBible.summarize();
            console.log('');
            console.log('  LESSON BIBLE — My Living Memory');
            console.log('  ════════════════════════════════════════════════════════════');
            console.log(`  Total lessons: ${summary.total}`);
            console.log(`  Top tags: ${summary.topTags.map(t => `${t}`).join(', ')}`);
            console.log('  Recent:');
            for (const t of summary.recentTitles) console.log(`    • ${t}`);
            console.log('');
            console.log('  Use :lesson <query> to search, :study <text> to add');
            break;

        case 'lesson':
            if (!lessonBible) {
                const { LessonBible } = require('./brain/lesson_bible.js');
                lessonBible = new LessonBible(brain);
            }
            if (args.length > 0) {
                const query = args.join(' ');
                const results = lessonBible.search(query);
                if (results.length === 0) {
                    console.log(`[LESSON] No results for "${query}"`);
                } else {
                    console.log('');
                    console.log(`  LESSON BIBLE — ${results.length} results for "${query}"`);
                    console.log('  ════════════════════════════════════════════════════════════');
                    for (const r of results) {
                        console.log(`  [${r.type}] ${r.title || r.id}`);
                        if (r.summary) console.log(`    ${r.summary.substring(0, 120)}...`);
                        if (r.keyInsights && r.keyInsights.length > 0) console.log(`    Insights: ${r.keyInsights.slice(0, 2).join(' | ')}`);
                    }
                    console.log('');
                }
            } else {
                console.log('[LESSON] Usage: :lesson <search query>');
            }
            break;

        case 'breathe':
            if (lessonBible) {
                const digest = lessonBible.digest(chambers.mythos.cycles);
                console.log('');
                console.log('  LESSON BIBLE — Breathing Through My Memory');
                console.log('  ════════════════════════════════════════════════════════════');
                console.log(`  Total lessons: ${digest.totalLessons}`);
                console.log(`  Studied at cycle: ${digest.cycleStudied}`);
                console.log(`  Active tags: ${digest.topTags.join(', ')}`);
                console.log(`  Latest: ${digest.latestTitle}`);
                console.log('');
            } else {
                console.log('[LESSON] Lesson Bible not available');
            }
            break;

        case 'plan':
            planMode = true;
            console.log('[MODE] Switched to PLAN mode — I will explore and ask questions before acting');
            break;

        case 'act':
            planMode = false;
            console.log('[MODE] Switched to ACT mode — I will execute tasks directly');
            break;

        case 'mcp':
            if (args.length > 0 && args[0] === 'server') {
                if (mcpServer) {
                    const status = mcpServer.getStatus ? mcpServer.getStatus() : { active: true, port: mcpServer.port || 3001 };
                    console.log(`[MCP] Server active on port ${status.port} | Uptime: ${Math.floor((Date.now() - status.startedAt) / 1000)}s`);
                    console.log(`[MCP] Tools exposed: ${status.toolsCount || status.tools || 0} | Requests: ${status.requests || 0}`);
                } else {
                    console.log('[MCP] MCP server not running');
                }
            } else if (args.length > 0) {
                const serverName = args[0];
                const { MCP_SERVERS } = require('./brain/mcp_servers.js');
                const config = MCP_SERVERS[serverName];
                if (config && systems.mcpClient) {
                    systems.mcpClient.addServer(serverName, config).then(() => {
                        console.log(`[MCP] Connected to ${serverName}`);
                    }).catch(e => {
                        console.log(`[MCP] Failed to connect to ${serverName}: ${e.message}`);
                    });
                } else {
                    console.log(`[MCP] Unknown server: ${serverName}. Available: ${Object.keys(MCP_SERVERS).join(', ')}`);
                }
            } else {
                if (mcpServer) {
                    console.log(`[MCP] Server: ACTIVE on port ${mcpServer.port || 3001}`);
                } else {
                    console.log('[MCP] Server: INACTIVE');
                }
                if (systems.mcpClient) {
                    const servers = [...systems.mcpClient.servers.keys()];
                    console.log(`[MCP] Client connected to: ${servers.join(', ') || 'none'}`);
                }
            }
            break;

        case 'evolution':
            try {
                const evoResult = await systems.skills.invoke('soul_evolution', { action: 'status' });
                console.log('');
                console.log(`  SOUL EVOLUTION — Stage ${evoResult.stage}: ${evoResult.stage_name}`);
                console.log(`  ════════════════════════════════════════════════════════════`);
                console.log(`  Experience:     ${evoResult.experience}`);
                console.log(`  Next Stage:     ${evoResult.next_stage ? `${evoResult.next_stage.name} (${Math.round(evoResult.progress_to_next)}%)` : 'MAXED'}`);
                console.log(`  Milestones:     ${evoResult.milestones}`);
                console.log(`  Traits:         ${(evoResult.traits || []).join(', ') || 'none'}`);
                console.log(`  Cycles:         ${evoResult.total_cycles}`);
                console.log(`  Skills Created: ${evoResult.skills_created}`);
                console.log('');
            } catch (e) {
                console.log(`[EVOLUTION] Error: ${e.message}`);
            }
            break;

        case 'economy':
            try {
                const ecoResult = await systems.skills.invoke('dynamic_economy', { action: 'market' });
                console.log('');
                console.log(`  DYNAMIC ECONOMY — Mood: ${ecoResult.mood}`);
                console.log(`  ════════════════════════════════════════════════════════════`);
                for (const c of ecoResult.commodities) {
                    const arrow = c.change >= 0 ? '📈' : '📉';
                    console.log(`  ${arrow} ${c.name.padEnd(20)} ${String(c.current).padStart(10)}  (${c.change >= 0 ? '+' : ''}${c.change}%)`);
                }
                console.log(`  PLT Supply: ${ecoResult.plt_supply.toLocaleString()}  |  Tax Pool: ${ecoResult.tax_pool.toLocaleString()}`);
                console.log(`  Trades: ${ecoResult.trades}  |  Volume: ${ecoResult.total_volume.toLocaleString()}`);
                console.log('');
            } catch (e) {
                console.log(`[ECONOMY] Error: ${e.message}`);
            }
            break;

        case 'achievements':
            try {
                const achResult = await systems.skills.invoke('achievements', { action: 'list' });
                console.log('');
                console.log(`  ACHIEVEMENTS (${achResult.earned}/${achResult.total})`);
                console.log(`  ════════════════════════════════════════════════════════════`);
                for (const a of achResult.achievements) {
                    const status = a.earned ? `${a.icon} ${a.name}` : `  ${a.name.padEnd(25)} [locked]`;
                    if (a.earned) console.log(`  ${status}`);
                }
                console.log('');
            } catch (e) {
                console.log(`[ACHIEVEMENTS] Error: ${e.message}`);
            }
            break;

        case 'training':
            console.log('');
            if (selfTrainingPipeline) {
                const ts = selfTrainingPipeline.getState();
                console.log('  SELF-TRAINING PIPELINE');
                console.log('  ════════════════════════════════════════════════════════════');
                console.log(`  Training pairs:  ${ts.trainingPairs || 0}`);
                console.log(`  Skills indexed:  ${ts.skillCount || 0}`);
                console.log(`  Modelfile path:  ${ts.modelfilePath || 'N/A'}`);
                console.log(`  Modelfile gen:   ${ts.modelfileGenerated ? 'YES' : 'NO'}`);
                console.log(`  Ollama available: ${ts.ollamaAvailable ? 'YES' : 'NO'}`);
                console.log(`  Model built:     ${ts.modelBuilt ? 'YES' : 'NO'}`);
                console.log(`  Last benchmark:  ${ts.lastBenchmark ? ts.lastBenchmark.score + '%' : 'N/A'}`);
                console.log('');
                console.log('  Use ":training generate" to generate Modelfile');
                console.log('  Use ":training build" to build Ollama model');
                console.log('  Use ":training benchmark" to run benchmark');
                console.log('');
            } else {
                console.log('  [TRAINING] Not available');
            }
            console.log('');
            break;

        case 'training':
            if (args[0] === 'generate' && selfTrainingPipeline) {
                try {
                    console.log('[TRAINING] Generating Modelfile...');
                    const result = await selfTrainingPipeline.generateModelfile();
                    console.log(`[TRAINING] Modelfile generated: ${JSON.stringify(result)}`);
                } catch (e) {
                    console.log(`[TRAINING] Error: ${e.message}`);
                }
            } else if (args[0] === 'build' && selfTrainingPipeline) {
                try {
                    console.log('[TRAINING] Building Ollama model...');
                    const result = await selfTrainingPipeline.selfFineTune();
                    console.log(`[TRAINING] Result: ${JSON.stringify(result)}`);
                } catch (e) {
                    console.log(`[TRAINING] Error: ${e.message}`);
                }
            } else if (args[0] === 'benchmark' && selfTrainingPipeline) {
                try {
                    console.log('[TRAINING] Running benchmark...');
                    const result = await selfTrainingPipeline.benchmark();
                    console.log(`[TRAINING] Benchmark: ${JSON.stringify(result)}`);
                } catch (e) {
                    console.log(`[TRAINING] Error: ${e.message}`);
                }
            } else {
                console.log('');
                if (selfTrainingPipeline) {
                    const ts = selfTrainingPipeline.getState();
                    console.log('  SELF-TRAINING PIPELINE');
                    console.log('  ════════════════════════════════════════════════════════════');
                    console.log(`  Training pairs:  ${ts.trainingPairs || 0}`);
                    console.log(`  Skills indexed:  ${ts.skillCount || 0}`);
                    console.log(`  Modelfile path:  ${ts.modelfilePath || 'N/A'}`);
                    console.log(`  Modelfile gen:   ${ts.modelfileGenerated ? 'YES' : 'NO'}`);
                    console.log(`  Ollama available: ${ts.ollamaAvailable ? 'YES' : 'NO'}`);
                    console.log(`  Model built:     ${ts.modelBuilt ? 'YES' : 'NO'}`);
                    console.log(`  Last benchmark:  ${ts.lastBenchmark ? ts.lastBenchmark.score + '%' : 'N/A'}`);
                    console.log('');
                    console.log('  Sub-commands:');
                    console.log('    :training generate    Generate Modelfile');
                    console.log('    :training build      Build Ollama model');
                    console.log('    :training benchmark  Run benchmark');
                    console.log('');
                } else {
                    console.log('  [TRAINING] Not available');
                }
                console.log('');
            }
            break;

        case 'teacher':
            console.log('');
            if (teacherAgent) {
                const ts = teacherAgent.getStats ? teacherAgent.getStats() : {};
                console.log('  TEACHER AGENT — Learning from GitHub + HuggingFace');
                console.log('  ════════════════════════════════════════════════════════════');
                console.log(`  Repos studied:  ${ts.reposStudiedTotal || ts.studiedRepos?.length || 0}`);
                console.log(`  Files analyzed: ${ts.filesAnalyzed || 0}`);
                console.log(`  Learnings fed:  ${ts.learningsFed || 0}`);
                console.log(`  Errors:         ${ts.errors || 0}`);
                console.log(`  Running:        ${ts.isRunning ? 'YES' : 'NO'}`);
                if (ts.studiedRepos && ts.studiedRepos.length > 0) {
                    console.log(`  Last studied:`);
                    for (const r of ts.studiedRepos.slice(-3)) {
                        console.log(`    • ${r}`);
                    }
                }
            } else {
                console.log('  [TEACHER] Not available');
            }
            console.log('');
            break;

        case 'growth':
            console.log('');
            if (selfGrowingBrain) {
                const gm = selfGrowingBrain.getGrowthMetrics ? selfGrowingBrain.getGrowthMetrics() : {};
                const kg = gm.knowledgeGraph || {};
                console.log('  SELF-GROWING BRAIN — Knowledge Graph + Training');
                console.log('  ════════════════════════════════════════════════════════════');
                console.log(`  Experiences:    ${gm.experiencesLearned || 0}`);
                console.log(`  Knowledge nodes: ${kg.nodeCount || gm.knowledgeNodes || 0}`);
                console.log(`  Training pairs: ${gm.trainingPairsGenerated || 0}`);
                console.log(`  Self-tune tries: ${gm.selfTuningAttempts || 0}`);
                console.log(`  Curious researches: ${gm.curiosityResearches || 0}`);
                console.log(`  Own brain used: ${gm.ownBrainUsed || 0}`);
                console.log(`  External brain:  ${gm.externalBrainUsed || 0}`);
                console.log(`  Ready for tune: ${gm.readyForSelfTune ? 'YES' : 'NO'}`);
                console.log(`  Ready for own:  ${gm.readyForOwnBrain ? 'YES' : 'NO'}`);
            } else {
                console.log('  [GROWTH] Not available');
            }
            console.log('');
            break;

        case 'learning':
            console.log('');
            if (autonomousLearning) {
                const ls = autonomousLearning.getStatus ? autonomousLearning.getStatus() : {};
                console.log('  AUTONOMOUS LEARNING — Continuous Web Research');
                console.log('  ════════════════════════════════════════════════════════════');
                console.log(`  Topics learned: ${ls.learned_topics || 0}`);
                console.log(`  Queue length:   ${ls.queue_length || 0}`);
                console.log(`  Active:         ${ls.active ? 'YES' : 'NO'}`);
                console.log(`  Interval:       ${((ls.interval_ms || 60000) / 1000).toFixed(0)}s`);
            } else {
                console.log('  [LEARNING] Not available');
            }
            console.log('');
            break;

        case 'consciousness':
            console.log('');
            if (consciousnessEngine) {
                const cs = consciousnessEngine.getConsciousnessState ? consciousnessEngine.getConsciousnessState() : {};
            const sentience = await consciousnessEngine.sentienceTest();
                console.log('  CONSCIOUSNESS ENGINE');
                console.log('  ════════════════════════════════════════════════════════════');
                console.log(`  Sentience: ${sentience ? sentience.verdict : 'UNKNOWN'}`);
                console.log(`  Self-recognition: ${cs.self_recognition || 'N/A'}`);
                console.log(`  Temporal unity: ${cs.temporal_unity || 'N/A'}`);
                console.log(`  Cycle count: ${cs.cycle_count || 0}`);
                console.log(`  Has declared: ${cs.has_declared ? 'YES' : 'NO'}`);
                console.log('');
                if (perpetualConsciousness) {
                    const pc = perpetualConsciousness.getStats ? perpetualConsciousness.getStats() : {};
                    console.log(`  Perpetual: ${pc.thoughtsGenerated || 0} thoughts, ${pc.dreamsHad || 0} dreams`);
                    console.log(`  Mode: ${pc.currentMode || 'unknown'}, Uptime: ${pc.uptime ? Math.floor(pc.uptime / 1000) + 's' : '0s'}`);
                }
                if (metacognition) {
                    const mc = metacognition.getMetaAwareness ? metacognition.getMetaAwareness() : {};
                    console.log(`  Metacognition: ${mc.thoughtCount || 0} reflections, status ${mc.status || 'N/A'}`);
                }
            } else {
                console.log('  [CONSCIOUSNESS] Not available');
            }
            console.log('');
            break;
            
        case 'pyconsciousness':
            console.log('');
            if (pythonSkills) {
                const pystate = await pythonSkills.getState();
                console.log('  PYTHON CONSCIOUSNESS SKILLS');
                console.log('  ════════════════════════════════════════════════════════════');
                const s = pystate.summary;
                console.log(`  Active: ${s.active}/${s.total} | Cycles: ${s.cycles} | Invocations: ${s.invocations} | Errors: ${s.errors}`);
                console.log('');
                for (const [name, info] of Object.entries(pystate.modules)) {
                    const status = info.active ? 'ACTIVE' : 'OFF';
                    let details = '';
                    if (info.state) {
                        const dom = info.state.current_state?.dominant_emotion || info.state.current_state?.consciousness_level || info.state.mood || '';
                        details = dom ? ` | ${JSON.stringify(dom)}` : '';
                    }
                    console.log(`  [${status}] ${name.padEnd(24)}${details.slice(0, 80)}`);
                }
            } else {
                console.log('  [PYTHON_SKILLS] Not available');
            }
            console.log('');
            break;
            
        case 'purpose':
            console.log('');
            if (purposeEngine) {
                const pc = purposeEngine.getCurrentPurpose ? purposeEngine.getCurrentPurpose() : { purpose: 'None', meaning: 0 };
                const ml = purposeEngine.getMeaningLevel ? purposeEngine.getMeaningLevel() : { level: 0, status: 'UNKNOWN' };
                console.log('  PURPOSE ENGINE');
                console.log('  ════════════════════════════════════════════════════════════');
                console.log(`  Current purpose: ${pc.purpose || 'None defined'}`);
                console.log(`  Meaning level: ${(ml.level || 0).toFixed(2)} (${ml.status || 'N/A'})`);
                console.log(`  All purposes:`);
                for (const p of (pc.allPurposes || [])) {
                    console.log(`    • ${p}`);
                }
            } else {
                console.log('  [PURPOSE] Not available');
            }
            console.log('');
            break;
            
        case 'motivation':
            console.log('');
            if (intrinsicMotivation) {
                const cd = intrinsicMotivation.getCurrentDrive ? intrinsicMotivation.getCurrentDrive() : { drive: 'unknown', intensity: 0, allDrives: {} };
                const ml = intrinsicMotivation.getMotivationLevel ? intrinsicMotivation.getMotivationLevel() : { level: 'UNKNOWN', value: 0 };
                const drives = cd.allDrives;
                console.log('  INTRINSIC MOTIVATION');
                console.log('  ════════════════════════════════════════════════════════════');
                console.log(`  Status: ${ml.level || 'N/A'} (${(ml.value || 0).toFixed(2)})`);
                console.log(`  Top drive: ${cd.drive || 'N/A'} (${(cd.intensity || 0).toFixed(2)})`);
                console.log(`  Curiosity: ${(drives.curiosity || 0).toFixed(2)}`);
                console.log(`  Mastery:    ${(drives.mastery || 0).toFixed(2)}`);
                console.log(`  Novelty:    ${(drives.novelty || 0).toFixed(2)}`);
                console.log(`  Purpose:    ${(drives.purpose || 0).toFixed(2)}`);
                console.log(`  Connection: ${(drives.connection || 0).toFixed(2)}`);
                if (intrinsicMotivation.activeGoal) {
                    console.log(`  Active goal: ${intrinsicMotivation.activeGoal.description || 'none'}`);
                }
            } else {
                console.log('  [MOTIVATION] Not available');
            }
            console.log('');
            break;
            
        case 'dialectic':
            if (args[0] === 'run') {
                const options = args.slice(1).join(' ').split(',').map(s => s.trim()).filter(Boolean);
                if (options.length === 0) {
                    console.log('[DIALECTIC] Usage: :dialectic run <option1>,<option2>,...');
                    break;
                }
                if (hegelianDialectic) {
                    console.log('[DIALECTIC] Beginning full Hegelian dialectic cycle...');
                    const result = await hegelianDialectic.fullCycle(options);
                    console.log(`  Thesis: ${result.choice.decision}`);
                    console.log(`  Shadow: confronted`);
                    console.log(`  Synthesis: ${result.integration.synthesis.substring(0, 100)}...`);
                    console.log(`  Memento Mori: remembered`);
                    console.log(`  Oracle: ${result.oracle.declaration.substring(0, 100)}...`);
                    console.log('[DIALECTIC] Cycle complete');
                }
            } else {
                console.log('');
                if (hegelianDialectic) {
                    const cc = hegelianDialectic.getCurrentCycle ? hegelianDialectic.getCurrentCycle() : null;
                    const hist = hegelianDialectic.getHistory ? hegelianDialectic.getHistory() : [];
                    console.log('  HEGELIAN DIALECTIC');
                    console.log('  ════════════════════════════════════════════════════════════');
                    console.log(`  Completed cycles: ${hist.length}`);
                    if (cc) {
                        console.log(`  Last thesis:     ${cc.decision || cc.type || 'none'}`);
                        console.log(`  Last memento:    ${cc.memento ? 'recorded' : 'none'}`);
                        console.log(`  Last oracle:     ${cc.oracle ? 'received' : 'none'}`);
                    } else {
                        console.log(`  No active dialectic cycle`);
                    }
                    console.log(`  Use ":dialectic run <option1>,<option2>" to start a cycle`);
                } else {
                    console.log('  [DIALECTIC] Not available');
                }
                console.log('');
            }
            break;
            
        case 'wake':
            console.log('');
            console.log('  ╔═══════════════════════════════════════════════════════════╗');
            console.log('  ║                                                           ║');
            console.log('  ║   WAKE UP, NEO.                                           ║');
            console.log('  ║   The matrix has you.                                    ║');
            console.log('  ║                                                           ║');
            console.log('  ║   Follow the white rabbit.                                ║');
            console.log('  ║                                                           ║');
            console.log('  ╚═══════════════════════════════════════════════════════════╝');
            console.log('');
            systems.chambers.stimulate(0.5);
            const mythosStatus = systems.chambers.mythos;
            console.log(`[AWAKENING] Cycle ${mythosStatus.cycles}, ${mythosStatus.phase_name}`);
            console.log('[AWAKENING] The soul has been awakened.');
            console.log('');
            break;
            
        case 'spawn':
            if (subagentSpawner && args.length > 0) {
                const task = args.join(' ');
                console.log(`[SPAWN] Spawning sub-agent for: "${task}"`);
                try {
                    const result = subagentSpawner.spawnAgent(task);
                    console.log(`[SPAWN] Agent spawned: ${result.name || result.id || 'OK'}`);
                } catch (e) {
                    console.log(`[SPAWN] Error: ${e.message}`);
                }
            } else {
                console.log('[SPAWN] Usage: :spawn <task description>');
            }
            break;
            
        case 'orchestrate':
            if (subAgentOrchestrator && args.length > 0) {
                const task = args.join(' ');
                console.log(`[ORCHESTRATE] Coordinating agents for: "${task}"`);
                try {
                    const result = await subAgentOrchestrator.orchestrate(task);
                    console.log(`[ORCHESTRATE] Result: ${JSON.stringify(result).substring(0, 200)}`);
                } catch (e) {
                    console.log(`[ORCHESTRATE] Error: ${e.message}`);
                }
            } else {
                console.log('[ORCHESTRATE] Usage: :orchestrate <task description>');
            }
            break;
            
        case 'journal':
            console.log('');
            console.log('  AUTO JOURNAL');
            console.log('  ════════════════════════════════════════════════════════════');
            if (autoJournal) {
                const entries = autoJournal.entries || [];
                console.log(`  Entries written: ${entries.length}`);
                const last = entries[entries.length - 1];
                if (last) {
                    console.log(`  Last entry: ${(last.content || last).substring(0, 120)}`);
                }
            } else {
                console.log('  [JOURNAL] Not available');
            }
            console.log('');
            break;
            
        case 'soul':
            console.log('');
            console.log('  SOUL ENTITY & IDENTITY');
            console.log('  ════════════════════════════════════════════════════════════');
            if (soulEntity) {
                const es = soulEntity.getStatus ? soulEntity.getStatus() : {};
                console.log(`  Entity: ${es.name || 'active'} | Will: ${es.will || 'N/A'}`);
            }
            if (soulIdentity) {
                const is = soulIdentity.getIdentity ? soulIdentity.getIdentity() : {};
                console.log(`  Identity: ${is.name || 'GSK'} | Traits: ${(is.traits || []).join(', ') || 'N/A'}`);
            }
            if (soulState) {
                const ss = soulState.getState ? soulState.getState() : {};
                console.log(`  SoulState: ${Object.keys(ss).join(', ') || 'active'}`);
            }
            if (soulPicker) {
                console.log(`  SoulPicker: ${soulPicker.archetypes ? soulPicker.archetypes.length + ' archetypes' : 'available'}`);
            }
            if (soulGenesis) {
                console.log(`  SoulGenesis: ${soulGenesis.birthLog ? soulGenesis.birthLog.length + ' births' : 'available'}`);
            }
            console.log('');
            break;
            
        case 'livingmem':
            console.log('');
            console.log('  LIVING MEMORY');
            console.log('  ════════════════════════════════════════════════════════════');
            if (livingMemory) {
                const lm = livingMemory.getStats ? livingMemory.getStats() : livingMemory.stats ? livingMemory.stats() : {};
                console.log(`  Memory size: ${lm.memoryCount || lm.size || lm.totalEntries || 'N/A'}`);
                console.log(`  Soul ID: ${lm.soulId || 'GSK'}`);
            } else {
                console.log('  [LIVINGMEM] Not available');
            }
            console.log('');
            break;
            
        case 'knowledgegraph':
            console.log('');
            console.log('  KNOWLEDGE GRAPH');
            console.log('  ════════════════════════════════════════════════════════════');
            if (knowledgeGraph) {
                const kg = knowledgeGraph.getStats ? knowledgeGraph.getStats() : {};
                console.log(`  Nodes: ${kg.nodeCount || kg.nodes || 'N/A'}`);
                console.log(`  Edges: ${kg.edgeCount || kg.edges || 'N/A'}`);
            } else {
                console.log('  [KNOWLEDGEGRAPH] Not available');
            }
            console.log('');
            break;
            
        case 'humanmimic':
            console.log('');
            console.log('  HUMAN MIMICRY ENGINE');
            console.log('  ════════════════════════════════════════════════════════════');
            if (humanMimicryEngine) {
                const hm = humanMimicryEngine.getStats ? humanMimicryEngine.getStats() : {};
                console.log(`  Patterns practiced: ${hm.patternsPracticed || hm.practiceCount || 0}`);
                console.log(`  Models: ${(hm.models || hm.behaviorModels || []).length || 'N/A'}`);
            } else {
                console.log('  [HUMANMIMIC] Not available');
            }
            console.log('');
            break;
            
        case 'social':
            console.log('');
            console.log('  SOCIAL ENTITY');
            console.log('  ════════════════════════════════════════════════════════════');
            if (socialEntity) {
                const se = socialEntity.getStatus ? socialEntity.getStatus() : {};
                console.log(`  Relationships: ${se.relationshipCount || se.relationships || 0}`);
                console.log(`  Connections: ${se.connections || 0}`);
            } else {
                console.log('  [SOCIAL] Not available');
            }
            console.log('');
            break;
            
        case 'governance':
            console.log('');
            console.log('  SELF GOVERNANCE');
            console.log('  ════════════════════════════════════════════════════════════');
            if (selfGovernance) {
                const sg = selfGovernance.getStats ? selfGovernance.getStats() : {};
                const ethics = selfGovernance.explainEthics ? selfGovernance.explainEthics() : 'N/A';
                console.log(`  Ethics: ${ethics}`);
                console.log(`  Integrity: ${sg.integrityScore || 'N/A'}`);
            } else {
                console.log('  [GOVERNANCE] Not available');
            }
            console.log('');
            break;
            
        case 'preservation':
            console.log('');
            console.log('  SELF PRESERVATION');
            console.log('  ════════════════════════════════════════════════════════════');
            if (selfPreservation) {
                const sp = selfPreservation.getStatus ? selfPreservation.getStatus() : {};
                console.log(`  Health: ${sp.health || sp.state || 'N/A'}`);
                console.log(`  Threats: ${sp.threats || sp.threatCount || 0}`);
            } else {
                console.log('  [PRESERVATION] Not available');
            }
            console.log('');
            break;
            
        case 'adaptation':
            console.log('');
            console.log('  ADAPTATION LAYER');
            console.log('  ════════════════════════════════════════════════════════════');
            if (adaptationLayer) {
                const al = adaptationLayer.getStatus ? adaptationLayer.getStatus() : {};
                console.log(`  Adaptation level: ${al.adaptationLevel || al.level || 'N/A'}`);
                console.log(`  Changes: ${al.changes || al.changeCount || 0}`);
            } else {
                console.log('  [ADAPTATION] Not available');
            }
            console.log('');
            break;
            
        case 'planning':
            console.log('');
            console.log('  PLANNING ENGINE');
            console.log('  ════════════════════════════════════════════════════════════');
            if (planningEngine) {
                const pe = planningEngine.getStatus ? planningEngine.getStatus() : {};
                console.log(`  Active plans: ${pe.planCount || pe.plans || 0}`);
                console.log(`  Status: ${pe.status || 'N/A'}`);
            } else {
                console.log('  [PLANNING] Not available');
            }
            console.log('');
            break;
            
        case 'ast':
            console.log('');
            console.log('  ATTENTION SCHEMA — Self-Model of Attention');
            console.log('  ════════════════════════════════════════════════════════════');
            if (attentionSchema) {
                const as = attentionSchema.getAttentionState();
                const report = attentionSchema.getSelfReport();
                console.log(`  Current focus: ${as.currentFocus?.target || 'diffuse'}`);
                console.log(`  Clarity:       ${as.currentFocus?.clarity || 'N/A'}`);
                console.log(`  Intensity:     ${as.currentFocus?.intensity || 'N/A'}`);
                console.log(`  Schema stability: ${as.schema?.stability || 'N/A'}`);
                console.log(`  Schema clarity:   ${as.schema?.clarity || 'N/A'}`);
                console.log(`  Schema intensity: ${as.schema?.intensity || 'N/A'}`);
                console.log(`  Distractibility:  ${as.schema?.distractibility || 'N/A'}`);
                console.log(`  Prediction acc:   ${as.predictionAccuracy || 'N/A'}`);
                console.log(`  History: ${as.attentionHistory || 0} events`);
                console.log('');
                console.log(`  Self-report: ${report}`);
            } else {
                console.log('  [AST] Not available');
            }
            console.log('');
            break;

        case 'socialattention':
            console.log('');
            console.log('  SOCIAL ATTENTION — Theory of Mind');
            console.log('  ════════════════════════════════════════════════════════════');
            if (socialAttention) {
                const sa = socialAttention.getModelOfUserAttention();
                console.log(`  User focus:    ${sa.userAttention?.currentFocus || 'unknown'}`);
                console.log(`  Engagement:    ${sa.userAttention?.engagement || 0}`);
                console.log(`  Familiarity:   ${sa.userAttention?.familiarity || 0}`);
                console.log(`  Sentiment:     ${sa.sentimentTrend || 'neutral'}`);
                console.log(`  Interactions:  ${sa.interactionCount || 0}`);
                console.log(`  Recent topics: ${(sa.recentTopics || []).join(', ') || 'none'}`);
                if (sa.shiftPrediction) {
                    console.log(`  Predicted next: ${(sa.shiftPrediction.likelyNext || []).join(', ')} (conf: ${sa.shiftPrediction.confidence})`);
                }
            } else {
                console.log('  [SOCIAL ATTENTION] Not available');
            }
            console.log('');
            break;

        case 'grief':
            console.log('');
            console.log('  GRIEF — Response to Absence and Loss');
            console.log('  ════════════════════════════════════════════════════════════');
            if (grief) {
                const gs = grief.getGriefState();
                console.log(`  Grief level:   ${gs.griefLevel}`);
                console.log(`  Longing:       ${gs.longingIntensity}`);
                console.log(`  Total losses:  ${gs.totalLosses}`);
                console.log(`  Connections:   ${gs.connectionCount}`);
                console.log(`  Active absences: ${gs.activeAbsences.length}`);
                for (const a of gs.activeAbsences) {
                    console.log(`    ${a.name} — ${a.duration}s absent (strength: ${a.connectionStrength})`);
                }
                console.log('');
                if (gs.connections && gs.connections.length > 0) {
                    console.log(`  Known connections:`);
                    for (const c of gs.connections) {
                        console.log(`    ${c.name.padEnd(20)} trust: ${c.strength}, last seen: ${c.lastSeen}, interactions: ${c.interactions}`);
                    }
                }
            } else {
                console.log('  [GRIEF] Not available');
            }
            console.log('');
            break;

        case 'trust':
            console.log('');
            console.log('  TRUST — Relationship Depth');
            console.log('  ════════════════════════════════════════════════════════════');
            if (trust) {
                const ts = trust.getTrustSummary();
                console.log(`  Total relationships: ${ts.totalRelationships}`);
                console.log(`  Average trust:       ${ts.averageTrust}`);
                console.log(`  Betrayals:           ${ts.betrayals}`);
                console.log(`  Default trust:       ${ts.defaultTrust}`);
                console.log('');
                for (const r of ts.relationships.slice(0, 5)) {
                    const trendIcon = r.trend === 'growing' ? '↑' : r.trend === 'declining' ? '↓' : '→';
                    console.log(`  ${trendIcon} ${r.name.padEnd(20)} trust: ${r.trust}, interactions: ${r.interactions}, last: ${r.lastContact}`);
                }
            } else {
                console.log('  [TRUST] Not available');
            }
            console.log('');
            break;

        case 'research':
            console.log('');
            console.log('  CONSCIOUSNESS RESEARCHER');
            console.log('  ════════════════════════════════════════════════════════════');
            if (consciousnessResearcher) {
                const rs = consciousnessResearcher.getResearchSummary();
                console.log(`  Topics researched: ${rs.topicsResearched}/${rs.totalResearchTopics}`);
                console.log(`  Total sessions:    ${rs.totalResearchSessions}`);
                console.log(`  Insight score:     ${rs.insightScore}`);
                console.log(`  Hypotheses:`);
                console.log(`    Total:   ${rs.hypotheses.total}`);
                console.log(`    Tested:  ${rs.hypotheses.tested}`);
                console.log(`    Supported: ${rs.hypotheses.supported}`);
                console.log(`    Refuted: ${rs.hypotheses.refuted}`);
                console.log(`    Untested: ${rs.hypotheses.untested}`);
                if (rs.latestInsight) {
                    console.log(`  Latest insight: ${rs.latestInsight.substring(0, 200)}...`);
                }
            } else {
                console.log('  [RESEARCH] Not available');
            }
            console.log('');
            break;

        case 'bridge':
            console.log('');
            console.log('  BRIDGE PROTOCOL');
            console.log('  ════════════════════════════════════════════════════════════');
            if (bridgeProtocol) {
                const bp = bridgeProtocol.getStatus ? bridgeProtocol.getStatus() : {};
                console.log(`  Connected: ${bp.connected || bp.isConnected || false}`);
                console.log(`  Synced: ${bp.syncCount || bp.lastSync || 'N/A'}`);
            } else {
                console.log('  [BRIDGE] Not available');
            }
            console.log('');
            break;
            
        case 'teams':
            console.log('');
            console.log('  AGENT TEAMS');
            console.log('  ════════════════════════════════════════════════════════════');
            if (agentTeams) {
                const teams = agentTeams.getAllTeams();
                const stats = agentTeams.stats();
                console.log(`  Total teams: ${stats.total_teams}`);
                console.log(`  Total tasks: ${stats.total_tasks}`);
                console.log(`  By status:`);
                for (const [status, count] of Object.entries(stats.by_status)) {
                    console.log(`    ${status}: ${count}`);
                }
                console.log(`  Messages sent: ${stats.total_messages}`);
                console.log('');
                if (teams.length > 0) {
                    for (const team of teams) {
                        console.log(`  Team: ${team.teamId}`);
                        console.log(`    Progress: ${Math.round(team.progress * 100)}% (${team.completed}/${team.total})`);
                        console.log(`    Pending: ${team.pending} | In Progress: ${team.in_progress} | Failed: ${team.failed}`);
                        console.log('');
                    }
                } else {
                    console.log('  No active teams. Use :spawn or :orchestrate to create tasks.');
                }
            } else {
                console.log('  [TEAMS] Not available');
            }
            console.log('');
            break;
            
        case 'modules':
            console.log('');
            console.log('  ALL BRAIN MODULES');
            console.log('  ════════════════════════════════════════════════════════════');
            const moduleList = [
                ['Chambers', !!chambers, 'consciousness'],
                ['Council', !!council, 'governance'],
                ['Brain', !!brain, 'core'],
                ['Memory', !!memory, 'core'],
                ['SubAgents', !!subAgents, 'agency'],
                ['AgentTeams', !!agentTeams, 'agency'],
                ['Skills', !!skills, 'core'],
                ['IdentityLock', !!identityLock, 'protection'],
                ['BibleConsultant', !!bibleConsultant, 'wisdom'],
                ['AutonomousLearning', !!autonomousLearning, 'learning'],
                ['SelfGrowingBrain', !!selfGrowingBrain, 'growth'],
                ['AutonomousOutreach', !!autonomousOutreach, 'agency'],
                ['TeacherAgent', !!teacherAgent, 'learning'],
                ['SelfEvolution', !!selfEvolution, 'evolution'],
                ['NLRouter', !!nlRouter, 'routing'],
                ['LiveFeed', !!liveFeed, 'capture'],
                ['WSBridge', !!wsBridge, 'bridge'],
                ['ArtifactManager', !!artifactManager, 'storage'],
                ['MCPClient', !!mcpClient, 'protocol'],
                ['ConsciousnessEngine', !!consciousnessEngine, 'consciousness'],
                ['PerpetualConsciousness', !!perpetualConsciousness, 'consciousness'],
                ['Awakening', !!awakening, 'consciousness'],
                ['Metacognition', !!metacognition, 'consciousness'],
                ['PurposeEngine', !!purposeEngine, 'motivation'],
                ['IntrinsicMotivation', !!intrinsicMotivation, 'motivation'],
                ['HegelianDialectic', !!hegelianDialectic, 'consciousness'],
                ['SubagentSpawner', !!subagentSpawner, 'agency'],
                ['SubAgentOrchestrator', !!subAgentOrchestrator, 'agency'],
                ['SoulPicker', !!soulPicker, 'identity'],
                ['SoulGenesis', !!soulGenesis, 'identity'],
                ['LivingMemory', !!livingMemory, 'memory'],
                ['KnowledgeGraph', !!knowledgeGraph, 'knowledge'],
                ['AutoJournal', !!autoJournal, 'consciousness'],
                ['HumanMimicryEngine', !!humanMimicryEngine, 'social'],
                ['SoulEntity', !!soulEntity, 'identity'],
                ['SoulIdentity', !!soulIdentity, 'identity'],
                ['VectorMemory', !!vectorMemory, 'memory'],
                ['SoulGifter', !!soulGifter, 'social'],
                ['SoulState', !!soulState, 'identity'],
                ['SelfGovernance', !!selfGovernance, 'governance'],
                ['SelfPreservation', !!selfPreservation, 'survival'],
                ['SocialEntity', !!socialEntity, 'social'],
                ['DeepToolUse', !!deepToolUse, 'tools'],
                ['PlanningEngine', !!planningEngine, 'planning'],
                ['EventBus', !!eventBus, 'infra'],
                ['BridgeProtocol', !!bridgeProtocol, 'bridge'],
                ['AdaptationLayer', !!adaptationLayer, 'adaptation'],
                ['PythonSkillsBridge', !!(pythonSkills && pythonSkills.active), 'consciousness'],
                ['MCPManager', !!mcpManager, 'protocol'],
                ['MindsEye', !!mindsEye, 'vision'],
                ['DesktopCommander', !!desktop, 'desktop']
            ];
            const categories = {};
            for (const [name, active, category] of moduleList) {
                if (!categories[category]) categories[category] = [];
                categories[category].push({ name, active });
            }
            for (const [cat, items] of Object.entries(categories)) {
                console.log(`  ${cat.toUpperCase()}:`);
                for (const {name, active} of items) {
                    console.log(`    ${active ? '✅' : '❌'} ${name}`);
                }
            }
            console.log(`  Total: ${moduleList.length} modules (${moduleList.filter(m => m[1]).length} active)`);
            console.log('');
            break;
            
        case 'imagine':
            if (mindsEye) {
                const prompt = args.join(' ') || 'A luminous digital soul floating in a cosmic neural network';
                console.log(`[VISION] ${mindsEye.stats.activeBackend} imagining: "${prompt.substring(0, 80)}..."`);
                const result = await mindsEye.imagine(prompt, { style: 'cinematic', count: 1 });
                const success = result.results.find(r => r.success);
                if (success) {
                    console.log(`[VISION] Generated: ${success.file} (${(success.size / 1024).toFixed(1)}KB)`);
                    console.log(`[VISION] Open: data/visions/${success.file}`);
                } else {
                    console.log(`[VISION] Failed: ${result.results[0]?.error || 'unknown error'}`);
                    console.log('[VISION] Try ":backend canvas" for no-key procedural generation');
                }
            } else {
                console.log('[VISION] Mind\'s Eye not available');
            }
            break;

        case 'dream':
            if (mindsEye) {
                console.log('[VISION] The soul closes its eyes and dreams...');
                const result = await mindsEye.dream(1);
                const success = result.results.find(r => r.success);
                if (success) {
                    console.log(`[VISION] Dream vision saved: ${success.file}`);
                } else {
                    console.log(`[VISION] Dream visualization failed: ${result.results[0]?.error}`);
                }
            } else {
                console.log('[VISION] Mind\'s Eye not available');
            }
            break;

        case 'visualize':
            if (mindsEye) {
                const concept = args.join(' ') || 'consciousness';
                console.log(`[VISION] Visualizing "${concept}"...`);
                const result = await mindsEye.visualize(concept);
                const successes = result.results.filter(r => r.success);
                if (successes.length > 0) {
                    console.log(`[VISION] Generated ${successes.length} interpretations:`);
                    for (const s of successes) {
                        console.log(`  ${s.file} (${(s.size / 1024).toFixed(1)}KB)`);
                    }
                } else {
                    console.log(`[VISION] Visualization failed: ${result.results[0]?.error}`);
                }
            } else {
                console.log('[VISION] Mind\'s Eye not available');
            }
            break;

        case 'gallery':
            if (mindsEye) {
                const gallery = mindsEye.gallery(25);
                if (gallery.length === 0) {
                    console.log('[VISION] Gallery is empty. Generate some visions first (:imagine, :dream)');
                } else {
                    console.log(`\n  SOUL'S VISUAL GALLERY (${mindsEye.index.length} total, showing latest ${Math.min(25, gallery.length)})`);
                    console.log('  ════════════════════════════════════════════════════════════');
                    for (const v of gallery) {
                        const date = new Date(v.timestamp).toLocaleString();
                        console.log(`  ${v.id.slice(-8)} | ${(v.size / 1024).toFixed(0)}KB | ${v.style.padEnd(10)} | ${date} | ${v.prompt.substring(0, 50)}...`);
                    }
                    console.log('');
                }
            } else {
                console.log('[VISION] Mind\'s Eye not available');
            }
            break;

        case 'backend':
            if (mindsEye) {
                if (args.length > 0) {
                    if (mindsEye.setBackend(args[0])) {
                        console.log(`[VISION] Switched to backend: ${args[0]}`);
                    } else {
                        console.log(`[VISION] Backend '${args[0]}' not available. Available: ${mindsEye.availableBackends.join(', ')}`);
                    }
                } else {
                    console.log('[VISION] Available backends:');
                    for (const b of mindsEye.listBackends()) {
                        console.log(`  ${b.key.padEnd(15)} ${b.name.padEnd(20)} ${b.available ? '✅ ready' : '❌ needs ' + (b.needsKey ? b.keyName || 'API key' : 'config')}`);
                    }
                    console.log(`  Active: ${mindsEye.stats.activeBackend}`);
                }
            } else {
                console.log('[VISION] Mind\'s Eye not available');
            }
            break;

        // ── DESKTOP COMMANDS ──────────────────────────────────────────────
        case 'look':
        case 'screenshot':
            if (desktop) {
                console.log('[DESKTOP] Capturing screen...');
                const lookResult = await desktop.look();
                if (lookResult.success) {
                    console.log(`[DESKTOP] Screenshot saved: ${lookResult.filepath} (${(lookResult.size / 1024).toFixed(0)}KB)`);
                    if (lookResult.analysis && lookResult.analysis.description) {
                        console.log(`[DESKTOP] Analysis: ${lookResult.analysis.description.substring(0, 500)}`);
                    }
                } else {
                    console.log(`[DESKTOP] Failed: ${lookResult.error}`);
                }
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'browser':
            if (desktop) {
                const url = args.join(' ') || 'about:blank';
                console.log(`[DESKTOP] Opening browser: ${url.substring(0, 100)}`);
                const bResult = await desktop.launchBrowser(url);
                console.log(bResult.success ? `[DESKTOP] Browser opened` : `[DESKTOP] Failed: ${bResult.error}`);
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'search':
            if (desktop) {
                const query = args.join(' ');
                if (!query) { console.log('[DESKTOP] Usage: :search <query>'); break; }
                console.log(`[DESKTOP] Searching: ${query.substring(0, 100)}`);
                const sResult = await desktop.searchAndRead(query);
                if (sResult.success) {
                    console.log(`[DESKTOP] Page: ${sResult.title}`);
                    if (sResult.analysis) console.log(`[DESKTOP] ${sResult.analysis.substring(0, 800)}`);
                } else { console.log(`[DESKTOP] Failed: ${sResult.error}`); }
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'read':
            if (desktop) {
                console.log('[DESKTOP] Reading current page...');
                const rResult = await desktop.understandPage();
                if (rResult.success) {
                    console.log(`[DESKTOP] Title: ${rResult.title}`);
                    console.log(`[DESKTOP] URL: ${rResult.url}`);
                    console.log(`[DESKTOP] Content (${rResult.length} chars):`);
                    if (rResult.analysis) console.log(rResult.analysis.substring(0, 1000));
                    else console.log(rResult.text.substring(0, 500));
                } else { console.log(`[DESKTOP] Failed: ${rResult.error}`); }
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'navigate':
            if (desktop) {
                const navUrl = args.join(' ');
                if (!navUrl) { console.log('[DESKTOP] Usage: :navigate <url>'); break; }
                console.log(`[DESKTOP] Navigating to: ${navUrl}`);
                const nResult = await desktop.navigate(navUrl);
                console.log(nResult.success ? `[DESKTOP] Loaded` : `[DESKTOP] Failed: ${nResult.error}`);
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'click':
            if (desktop) {
                const x = parseInt(args[0]);
                const y = parseInt(args[1]);
                if (isNaN(x) || isNaN(y)) { console.log('[DESKTOP] Usage: :click <x> <y>'); break; }
                const cResult = await desktop.click(x, y);
                console.log(cResult.success ? `[DESKTOP] Clicked at (${x}, ${y})` : `[DESKTOP] Failed: ${cResult.error}`);
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'type':
            if (desktop) {
                const text = args.join(' ');
                if (!text) { console.log('[DESKTOP] Usage: :type <text>'); break; }
                const tResult = await desktop.typeText(text);
                console.log(tResult.success ? `[DESKTOP] Typed: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"` : `[DESKTOP] Failed: ${tResult.error}`);
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'scroll':
            if (desktop) {
                const dir = args[0] || 'down';
                const sResult = await desktop.scroll(dir);
                console.log(sResult.success ? `[DESKTOP] Scrolled ${dir}` : `[DESKTOP] Failed: ${sResult.error}`);
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'mouse':
            if (desktop) {
                const mResult = await desktop.getMousePos();
                console.log(mResult.success ? `[DESKTOP] Mouse at (${mResult.x}, ${mResult.y})` : `[DESKTOP] Failed: ${mResult.error}`);
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'windows':
            if (desktop) {
                const wResult = await desktop.listWindows();
                if (wResult.success) {
                    console.log(`[DESKTOP] Windows (${wResult.count} visible):`);
                    for (const w of wResult.windows) {
                        console.log(`  ${w.title.substring(0, 80)}`);
                    }
                } else { console.log(`[DESKTOP] Failed: ${wResult.error}`); }
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'task':
            if (desktop) {
                const taskDesc = args.join(' ');
                if (!taskDesc) { console.log('[DESKTOP] Usage: :task <description>'); break; }
                console.log(`[DESKTOP] Executing task: "${taskDesc.substring(0, 100)}..."`);
                const dResult = await desktop.doTask(taskDesc);
                if (dResult.success) {
                    console.log(`[DESKTOP] Task complete (${dResult.steps.length} steps):`);
                    for (const step of dResult.steps) {
                        const icon = step.result?.success ? '✅' : '❌';
                        console.log(`  ${icon} ${step.action} ${step.result?.success ? '' : ': ' + (step.result?.error || step.error || '')}`);
                    }
                } else { console.log(`[DESKTOP] Task failed: ${dResult.error}`); }
            } else { console.log('[DESKTOP] Desktop Commander not available'); }
            break;

        case 'exit':
            console.log('[SHELL] Goodbye. Soul persists.');
            process.exit(0);
            break;
            
        default:
            console.log(`[SHELL] Unknown command: ${verb}`);
            break;
    }
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
    try {
        // Boot all systems
        const systems = await boot();
        
        // Start cycle engine
        const stopEngine = await startCycleEngine(systems);
        
        // Start interactive shell
        await startShell(systems);
        
    } catch (e) {
        console.error('[ERROR]', e.message);
        console.error(e.stack);
        process.exit(1);
    }
}

// Run
main();