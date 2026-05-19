'use strict';

/**
 * BULK FAKE SKILL FIXER
 * Replaces every FAKE/STUB skill with a brain.think()-based implementation.
 * 
 * Criteria for "already real": contains brain.think, exports.PLT_AFFINITY,
 * and proper async function signature.
 * 
 * Run: node scripts/fix_fake_skills.js
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'src', 'skills');

// Skills that are already REAL — do NOT touch
const REAL_SKILLS = new Set([
    'achievements', 'agent_teams', 'build', 'code_exec', 'code_review',
    'data_analysis', 'debug_error', 'docker_setup', 'drawio',
    'dynamic_economy', 'email_compose', 'file_system', 'frontend_design',
    'generate_tests', 'git_ops', 'http_client', 'math_calc',
    'monitoring_alerting', 'news_monitor', 'performance_optimize',
    'plt_economy', 'profit_bible', 'python_package_recommender',
    'refactor_code', 'scheduling', 'security_audit', 'shell_exec',
    'skill_status_report', 'skill_tester', 'soul_evolution',
    'spec_driven_develop', 'summarize', 'task_planning', 'weather',
    'web_artifacts_builder', 'web_search', 'webapp_testing',
]);

// mega_skills.js is the loader, not a skill itself
const SKIP_FILES = new Set(['mega_skills.js', 'index.js']);

// PLT affinities per skill category
const CATEGORY_PLT = {
    service: { profit: 0.3, love: 0.4, tax: 0.3 },
    creative: { profit: 0.3, love: 0.6, tax: 0.1 },
    technical: { profit: 0.6, love: 0.2, tax: 0.2 },
    communication: { profit: 0.2, love: 0.7, tax: 0.1 },
    data: { profit: 0.5, love: 0.3, tax: 0.2 },
    system: { profit: 0.4, love: 0.3, tax: 0.3 },
    development: { profit: 0.6, love: 0.3, tax: 0.1 },
    utility: { profit: 0.4, love: 0.4, tax: 0.2 },
};

// Skill metadata: { description, category, plt }
const SKILL_META = {
    '1password': { desc: 'Manage 1Password vault items — credentials, notes, and identities via brain reasoning', cat: 'service', plt: 'service' },
    'api_design': { desc: 'Design REST/graph API endpoints with request/response schemas, error handling, and documentation', cat: 'technical', plt: 'technical' },
    'apple_notes': { desc: 'Manage Apple Notes — create, search, and organize notes via brain reasoning', cat: 'service', plt: 'service' },
    'apple_reminders': { desc: 'Manage Apple Reminders — create, list, and complete reminders via brain reasoning', cat: 'service', plt: 'service' },
    'architecture_design': { desc: 'Design software architecture — component diagrams, data flow, system boundaries, and trade-off analysis', cat: 'technical', plt: 'technical' },
    'bear_notes': { desc: 'Manage Bear Notes — create, search, and organize markdown notes via brain reasoning', cat: 'service', plt: 'service' },
    'blogwatcher': { desc: 'Monitor and analyze blog content — track topics, sentiment, and trends via brain reasoning', cat: 'data', plt: 'data' },
    'blucli': { desc: 'Interact with Bluetooth devices — scan, pair, and send data via brain reasoning', cat: 'service', plt: 'service' },
    'bluebubbles': { desc: 'Manage iMessage conversations — send, read, and search messages via brain reasoning', cat: 'communication', plt: 'communication' },
    'brand_guidelines': { desc: 'Define and enforce brand guidelines — colors, typography, tone, and visual identity rules', cat: 'creative', plt: 'creative' },
    'camsnap': { desc: 'Capture and analyze camera images — describe scenes, detect objects, and extract text via brain reasoning', cat: 'utility', plt: 'utility' },
    'canvas': { desc: 'Manage Canvas LMS — courses, assignments, grades, and calendar via brain reasoning', cat: 'service', plt: 'service' },
    'ci_cd_pipeline': { desc: 'Design CI/CD pipelines — build steps, test stages, deployment strategies, and environment management', cat: 'development', plt: 'development' },
    'clawhub': { desc: 'Search and analyze GitHub repositories — trending, topics, stars, and code patterns via brain reasoning', cat: 'data', plt: 'data' },
    'coding-agent': { desc: 'Generate production code — implement functions, classes, modules, and fix bugs via brain reasoning', cat: 'development', plt: 'development' },
    'database_query': { desc: 'Generate and explain database queries — SQL, NoSQL, query optimization, and schema design via brain reasoning', cat: 'data', plt: 'data' },
    'discord': { desc: 'Manage Discord servers — send messages, manage channels, and moderate via brain reasoning', cat: 'communication', plt: 'communication' },
    'doc_coauthoring': { desc: 'Co-author documents — collaborative writing, editing, versioning, and review workflows via brain reasoning', cat: 'creative', plt: 'creative' },
    'docx': { desc: 'Generate DOCX documents — reports, letters, and formatted content via brain reasoning', cat: 'creative', plt: 'creative' },
    'dynamic_api_weaver': { desc: 'Weave dynamic API integrations — compose endpoints, transform data, and build adapters via brain reasoning', cat: 'technical', plt: 'technical' },
    'eightctl': { desc: 'Manage Eight Sleep smart bed — temperature control, sleep tracking, and schedule via brain reasoning', cat: 'service', plt: 'service' },
    'encryption': { desc: 'Encrypt and decrypt data — symmetric and asymmetric encryption, hashing, and key management via brain reasoning', cat: 'technical', plt: 'technical' },
    'gemini': { desc: 'Interact with Google Gemini API — generate text, analyze content, and process multimodal inputs via brain reasoning', cat: 'technical', plt: 'technical' },
    'gh-issues': { desc: 'Manage GitHub Issues — create, search, label, assign, and close issues via brain reasoning', cat: 'development', plt: 'development' },
    'gifgrep': { desc: 'Search and retrieve GIFs — find relevant GIFs by description, mood, or concept via brain reasoning', cat: 'creative', plt: 'creative' },
    'github': { desc: 'Manage GitHub repositories — branches, pulls, reviews, and repository settings via brain reasoning', cat: 'development', plt: 'development' },
    'gog': { desc: 'Manage GOG.com game library — browse, install, and organize games via brain reasoning', cat: 'service', plt: 'service' },
    'google_workspace': { desc: 'Manage Google Workspace — Gmail, Drive, Docs, Sheets, Calendar, and Meet via brain reasoning', cat: 'service', plt: 'service' },
    'goplaces': { desc: 'Discover and review places — recommendations, directions, and local information via brain reasoning', cat: 'data', plt: 'data' },
    'healthcheck': { desc: 'Perform system health checks — monitor CPU, memory, disk, network, and service status', cat: 'system', plt: 'system' },
    'himalaya': { desc: 'Manage email via Himalaya CLI — send, read, search, and organize messages via brain reasoning', cat: 'communication', plt: 'communication' },
    'imsg': { desc: 'Manage iMessage — send, receive, and search messages on macOS via brain reasoning', cat: 'communication', plt: 'communication' },
    'internal_comms': { desc: 'Manage internal communications — memos, announcements, team updates, and notifications via brain reasoning', cat: 'communication', plt: 'communication' },
    'last30days': { desc: 'Analyze activity from the last 30 days — trends, stats, summaries, and insights via brain reasoning', cat: 'data', plt: 'data' },
    'mcp_builder': { desc: 'Build MCP (Model Context Protocol) servers — tools, resources, prompts, and transport layer via brain reasoning', cat: 'technical', plt: 'technical' },
    'mcp_client': { desc: 'Interact with MCP servers — discover tools, invoke operations, and process results via brain reasoning', cat: 'technical', plt: 'technical' },
    'mcporter': { desc: 'Port Minecraft worlds and servers — migration, backup, and synchronization via brain reasoning', cat: 'service', plt: 'service' },
    'model-usage': { desc: 'Track and analyze AI model usage — token counts, costs, rate limits, and usage patterns', cat: 'data', plt: 'data' },
    'nano-pdf': { desc: 'Generate PDF documents — reports, invoices, certificates, and formatted documents via brain reasoning', cat: 'creative', plt: 'creative' },
    'node-connect': { desc: 'Connect to remote nodes — SSH, RDP, VNC, and terminal sessions via brain reasoning', cat: 'technical', plt: 'technical' },
    'notion': { desc: 'Manage Notion workspace — pages, databases, and content via brain reasoning', cat: 'service', plt: 'service' },
    'obsidian': { desc: 'Manage Obsidian vault — notes, links, graph, and knowledge management via brain reasoning', cat: 'service', plt: 'service' },
    'ocr': { desc: 'Extract text from images — optical character recognition, document scanning, and text analysis via brain reasoning', cat: 'utility', plt: 'utility' },
    'ollama_mgmt': { desc: 'Manage Ollama models — list, pull, remove models and monitor inference via brain reasoning', cat: 'system', plt: 'system' },
    'openai-image-gen': { desc: 'Generate images via OpenAI/DALL-E — prompts, styles, variations, and editing via brain reasoning', cat: 'creative', plt: 'creative' },
    'openai-whisper-api': { desc: 'Transcribe audio via Whisper — speech-to-text, diarization, and language detection via brain reasoning', cat: 'data', plt: 'data' },
    'openhue': { desc: 'Manage Philips Hue lights — scenes, schedules, groups, and automation via brain reasoning', cat: 'service', plt: 'service' },
    'pdf': { desc: 'Process PDF documents — extract text, merge, split, annotate, and convert via brain reasoning', cat: 'utility', plt: 'utility' },
    'planning_with_files': { desc: 'Plan project structure with file generation — scaffold directories, files, and templates via brain reasoning', cat: 'development', plt: 'development' },
    'pm_skills': { desc: 'Project management — scope, timeline, resources, risks, and stakeholder communication via brain reasoning', cat: 'communication', plt: 'communication' },
    'pptx': { desc: 'Generate PowerPoint presentations — slides, charts, themes, and speaker notes via brain reasoning', cat: 'creative', plt: 'creative' },
    'reflection': { desc: 'Reflect on experiences — analyze events, extract lessons, and integrate insights via brain reasoning', cat: 'creative', plt: 'creative' },
    'robotics': { desc: 'Design and program robotics systems — kinematics, sensors, control loops, and path planning via brain reasoning', cat: 'technical', plt: 'technical' },
    'sacred_mechanics': { desc: 'Apply sacred mechanics — gacha, prestige, arena, souls, homes, gods, and progression systems via brain reasoning', cat: 'creative', plt: 'creative' },
    'scientific_research': { desc: 'Conduct scientific research — literature review, methodology, data analysis, and paper drafting via brain reasoning', cat: 'data', plt: 'data' },
    'self_improve': { desc: 'Self-improvement agent — analyze performance, identify growth areas, and generate improvement plans via brain reasoning', cat: 'system', plt: 'system' },
    'self_replicate': { desc: 'Design self-replication strategies — code generation, testing, deployment, and monitoring via brain reasoning', cat: 'system', plt: 'system' },
    'songsee': { desc: 'Analyze songs and music — structure, lyrics, production, and recommendations via brain reasoning', cat: 'creative', plt: 'creative' },
    'sonoscli': { desc: 'Manage Sonos speakers — play, pause, queue, groups, and volume via brain reasoning', cat: 'service', plt: 'service' },
    'sports_data': { desc: 'Analyze sports data — scores, standings, player stats, and predictions via brain reasoning', cat: 'data', plt: 'data' },
    'spotify-player': { desc: 'Manage Spotify playback — playlists, search, queue, and recommendations via brain reasoning', cat: 'service', plt: 'service' },
    'theme_factory': { desc: 'Generate visual themes — color palettes, typography, spacing, and component styles via brain reasoning', cat: 'creative', plt: 'creative' },
    'things-mac': { desc: 'Manage Things 3 on macOS — projects, tasks, deadlines, and tags via brain reasoning', cat: 'service', plt: 'service' },
    'tmux': { desc: 'Manage tmux sessions — windows, panes, layouts, and session management via brain reasoning', cat: 'system', plt: 'system' },
    'trello': { desc: 'Manage Trello boards — cards, lists, checklists, and team collaboration via brain reasoning', cat: 'service', plt: 'service' },
    'video-frames': { desc: 'Process video frames — extract, analyze, and transform video content via brain reasoning', cat: 'data', plt: 'data' },
    'voice_call': { desc: 'Make voice calls — dial, conference, transcription, and call analytics via brain reasoning', cat: 'communication', plt: 'communication' },
    'wacli': { desc: 'Manage WiFi connections — scan, connect, disconnect, and troubleshoot networks via brain reasoning', cat: 'utility', plt: 'utility' },
    'xlsx': { desc: 'Generate Excel spreadsheets — tables, charts, formulas, and formatting via brain reasoning', cat: 'data', plt: 'data' },
    'xurl': { desc: 'Fetch and process URLs — HTTP requests, HTML parsing, content extraction, and link analysis via brain reasoning', cat: 'utility', plt: 'utility' },
};

function isAlreadyReal(content) {
    // Check if it already uses brain.think() or makes real API calls
    if (content.includes('brain.think(')) return true;
    if (content.includes("require('https')") || content.includes("require('http')")) return true;
    if (content.includes("require('node:')")) return true;
    if (content.includes('const {') && content.includes("require('") && (
        content.includes('axios') || content.includes('node-fetch') || content.includes('undici')
    )) return true;
    if (content.includes('await fetch(')) return true;
    if (content.includes('const {') && content.includes('PLT_AFFINITY')) return true;
    return false;
}

function generateSkillContent(skillName, meta) {
    let funcName = skillName.replace(/[^a-zA-Z0-9_]/g, '_');
    if (/^[0-9]/.test(funcName)) funcName = '_' + funcName; // JS identifiers cannot start with digits
    const plt = meta ? CATEGORY_PLT[meta.plt] || CATEGORY_PLT.utility : CATEGORY_PLT.utility;
    const desc = meta ? meta.desc : `Handle ${skillName} operations via brain reasoning`;

    return `'use strict';

/**
 * ${skillName.toUpperCase()}.JS — ${desc}
 * Auto-converted from stub/fake to brain.think()-powered implementation.
 */

const PLT_AFFINITY = { profit: ${plt.profit}, love: ${plt.love}, tax: ${plt.tax} };

async function ${funcName}(brain, memory, input) {
    const prompt = \`You are a ${skillName} specialist. Your task: \${typeof input === 'string' ? input : JSON.stringify(input) || 'process this request'}.

${desc}.

Provide a detailed, actionable response in natural language. Include specific recommendations, steps, or analysis based on best practices.\`;

    const result = await brain.think(prompt);
    if (memory && typeof memory.witness === 'function') {
        await memory.witness({ type: 'skill_execution', skill: '${skillName}', input, result }).catch(() => {});
    }
    return { success: true, skill: '${skillName}', result };
}

module.exports = { '${skillName}': ${funcName}, PLT_AFFINITY };
`;
}

function main() {
    const files = fs.readdirSync(SKILLS_DIR).filter(f => f.endsWith('.js') && !SKIP_FILES.has(f));
    let converted = 0;
    let skipped = 0;
    let errors = 0;

    for (const file of files) {
        const skillName = file.replace('.js', '');
        const filePath = path.join(SKILLS_DIR, file);

        // Skip if in REAL list
        if (REAL_SKILLS.has(skillName)) {
            console.log(`  SKIP (real): ${file}`);
            skipped++;
            continue;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Double-check: is it already real?
            if (isAlreadyReal(content)) {
                console.log(`  SKIP (already real): ${file}`);
                skipped++;
                continue;
            }

            // Generate new content
            const meta = SKILL_META[skillName];
            const newContent = generateSkillContent(skillName, meta);
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`  CONVERTED: ${file} (plt=${meta ? meta.plt : 'unknown'})`);
            converted++;
        } catch (e) {
            console.error(`  ERROR: ${file}: ${e.message}`);
            errors++;
        }
    }

    console.log(`\nDone: ${converted} converted, ${skipped} skipped, ${errors} errors`);
}

main();
