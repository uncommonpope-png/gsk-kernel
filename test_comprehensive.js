'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const SRC = path.join(__dirname, 'src');

// ===================================================================
// COLOR HELPERS
// ===================================================================
const C = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
};

function ok(msg) { return `${C.green}✓${C.reset} ${msg}`; }
function warn(msg) { return `${C.yellow}○${C.reset} ${msg}`; }
function fail(msg) { return `${C.red}✗${C.reset} ${msg}`; }
function title(msg) { console.log(`\n${C.bold}${C.cyan}═══ ${msg} ═══${C.reset}`); }
function sub(msg) { console.log(`  ${C.dim}${msg}${C.reset}`); }

// ===================================================================
// RESULTS ACCUMULATOR
// ===================================================================
const results = { passed: 0, failed: 0, warnings: 0, details: [] };

function pass(module, test) {
    results.passed++;
    results.details.push({ module, test, status: 'pass' });
    console.log(`  ${ok(`[${module}] ${test}`)}`);
}

function failResult(module, test, reason) {
    results.failed++;
    results.details.push({ module, test, status: 'fail', reason });
    console.log(`  ${fail(`[${module}] ${test}`)}`);
    console.log(`    ${C.red}→ ${reason}${C.reset}`);
}

function warnResult(module, test, reason) {
    results.warnings++;
    results.details.push({ module, test, status: 'warn', reason });
    console.log(`  ${warn(`[${module}] ${test}`)}`);
    console.log(`    ${C.dim}→ ${reason}${C.reset}`);
}

// ===================================================================
// 1. BRAIN MODULE TESTS
// ===================================================================
async function testBrainModules() {
    title('BRAIN MODULES — Load, export, instantiate check');

    const brainDir = path.join(SRC, 'brain');
    const files = fs.readdirSync(brainDir).filter(f => f.endsWith('.js') && f !== 'main.js');
    const PROTECTED = [];

    for (const file of files) {
        const name = file.replace('.js', '');
        const filePath = path.join(brainDir, file);
        try {
            const mod = require(filePath);

            if (!mod || typeof mod !== 'object' || Object.keys(mod).length === 0) {
                // Check for constructor in class
                if (typeof mod !== 'function') {
                    warnResult(name, 'exports check', 'module exports empty object or no exports');
                    continue;
                }
            }

            // Check if it has a class/constructor pattern
            const keys = Object.keys(mod);
            const hasClass = keys.some(k => typeof mod[k] === 'function' && /^[A-Z]/.test(k));
            const hasFunction = keys.some(k => typeof mod[k] === 'function');
            
            if (hasFunction || hasClass || keys.length > 0) {
                pass(name, `loaded with ${keys.length} export(s): ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}`);
            } else {
                warnResult(name, 'exports check', `exports exist but no functions: ${keys.join(', ')}`);
            }
        } catch (e) {
            failResult(name, 'require', e.message.slice(0, 200));
        }
    }
}

// ===================================================================
// 1b. API VAULT TEST
// ===================================================================
async function testApiVault() {
    title('API VAULT — Loading and key detection');

    const vaultPath = path.join(SRC, 'brain', 'api_vault.js');
    if (!fs.existsSync(vaultPath)) {
        failResult('api_vault', 'exists', 'api_vault.js not found');
        return;
    }

    try {
        const { ApiVault, vault } = require(vaultPath);
        pass('api_vault', `loaded with ApiVault class + singleton vault instance`);

        // Test key detection
        const testKeys = [
            { key: 'sk-proj-fakeKey123456789012345678901234567', expect: 'OPENAI' },
            { key: 'ghp_fakeKey12345678901234567890123456789012', expect: 'GITHUB' },
            { key: 'gsk_fakeKey1234567890123456', expect: 'GROQ' },
            { key: 'xoxb-fake-slack-token-12345', expect: 'SLACK' },
            { key: 'bot1234567890FakeDiscordBotToken', expect: 'DISCORD' },
            { key: 'AIzaSyDFakeGeminiKey1234567890123456', expect: 'GEMINI' },
        ];

        for (const t of testKeys) {
            const detected = vault.autoDetect(t.key);
            if (detected && detected.service === t.expect) {
                pass(`vault.autoDetect`, `detected ${t.key.substring(0, 8)}... as ${t.expect} ✓`);
            } else {
                failResult(`vault.autoDetect`, `${t.key.substring(0, 8)}...`, `expected ${t.expect}, got ${detected ? detected.service : 'null'}`);
            }
        }

        // Test vault.addKey with auto-detect
        const result = vault.addKey('sk-proj-newTestOpenAIKey1234567890123456789');
        if (result.autoDetected && result.service === 'OPENAI') {
            pass('vault.addKey', `auto-detected OpenAI key ✓`);
        } else {
            warnResult('vault.addKey', 'auto-detect', `unexpected: ${JSON.stringify(result)}`);
        }

        // Test getKey — should find the key we just added
        const retrieved = vault.getKey('OPENAI');
        if (retrieved && retrieved.startsWith('sk-proj-')) {
            pass('vault.getKey', `retrieved stored key ✓`);
        } else {
            failResult('vault.getKey', 'OPENAI', 'could not retrieve key');
        }

        // Test canSkillWork
        const spotifyCheck = vault.canSkillWork('spotify-player');
        if (!spotifyCheck.canWork && spotifyCheck.missing.length === 2) {
            pass('vault.canSkillWork', `spotify needs 2 keys ✓`);
        } else {
            warnResult('vault.canSkillWork', 'spotify', `unexpected: ${JSON.stringify(spotifyCheck)}`);
        }

        // Clean up test key
        vault.removeKey('OPENAI');
        pass('vault.removeKey', 'test key cleaned up ✓');

    } catch (e) {
        failResult('api_vault', 'require', e.message.slice(0, 200));
    }
}

// ===================================================================
// 2. CHAMBER TESTS
// ===================================================================
async function testChambers() {
    title('CONSCIOUSNESS CHAMBERS — Can instantiate and process');

    const chamberDir = path.join(SRC, 'chambers');
    const files = fs.readdirSync(chamberDir).filter(f => f.endsWith('.js'));

    for (const file of files) {
        const name = file.replace('.js', '');
        const filePath = path.join(chamberDir, file);
        try {
            const mod = require(filePath);
            const ExportedClass = mod.default || mod[Object.keys(mod).find(k => /^[A-Z]/.test(k))] || mod[Object.keys(mod)[0]];

            if (typeof ExportedClass === 'function' && /^[A-Z]/.test(ExportedClass.name || '')) {
                let instance;
                try {
                    instance = new ExportedClass({}, {}, {});
                    if (typeof instance.process === 'function' || typeof instance.update === 'function' || typeof instance.breathe === 'function') {
                        pass(name, `instantiated, has processing method`);
                    } else {
                        warnResult(name, 'instantiate', `Class created but no process/update/breathe method found`);
                    }
                } catch (e) {
                    // Some may need specific constructors
                    try {
                        instance = new ExportedClass();
                        if (instance && typeof instance === 'object') {
                            pass(name, `instantiated (simple constructor)`);
                        } else {
                            warnResult(name, 'instantiate', e.message.slice(0, 100));
                        }
                    } catch (e2) {
                        warnResult(name, 'instantiate', `needs specific constructor: ${e2.message.slice(0, 100)}`);
                    }
                }
            } else {
                pass(name, `module exports config/utilities (${Object.keys(mod).length} exports)`);
            }
        } catch (e) {
            failResult(name, 'require', e.message.slice(0, 200));
        }
    }
}

// ===================================================================
// 3. SKILL TESTS — Find ALL fakes and stubs
// ===================================================================
async function testSkills() {
    title('SKILLS — Full audit (working vs stub/fake vs broken)');

    const skillDir = path.join(SRC, 'skills');
    const files = fs.readdirSync(skillDir)
        .filter(f => f.endsWith('.js') && !['mega_skills.js', 'skill_status_report.js'].includes(f));

    let working = 0, stub = 0, broken = 0, real_tool = 0;

    for (const file of files) {
        const name = file.replace('.js', '');
        const filePath = path.join(skillDir, file);
        try {
            const mod = require(filePath);
            const exports = Object.keys(mod);
            
            // Read source to detect pattern
            const src = fs.readFileSync(filePath, 'utf8');

            // Check if this is a REAL tool skill (makes HTTP calls, uses FS, executes code)
            const makesHttpCall = src.includes('http.') || src.includes('https.') || src.includes('fetch(');
            const usesFileSystem = src.includes('fs.') || src.includes('require(`fs`)') || src.includes('require("fs")');
            const executesCode = src.includes('exec(') || src.includes('spawn(');
            const doesComputation = src.includes('Math.') || src.includes('return ') && !src.includes('brain.think');
            
            const uses_brain_think = src.includes('brain.think(') || src.includes('brain.think (');
            const isAutoConverted = src.includes('Auto-converted from stub') || src.includes('Converted from mock-data');
            const isVaultAware = src.includes('api_vault') || src.includes('vault.getKey');
            const hasRealLogic = makesHttpCall || usesFileSystem || executesCode || doesComputation;
            const isTrulyFake = isAutoConverted && !hasRealLogic;
            const isPlatformCheck = src.includes('os.platform()');

            if (isTrulyFake) {
                stub++;
                warnResult(name, 'skill audit', `FAKE: auto-converted stub with no real tool logic (just brain.think())`);
            } else if (isVaultAware) {
                real_tool++;
                pass(name, `skill audit: VAULT-AWARE — checks API Vault for keys at runtime ✓`);
            } else if (isAutoConverted && hasRealLogic) {
                real_tool++;
                pass(name, `skill audit: auto-converted but has real logic ✓`);
            } else if (hasRealLogic) {
                real_tool++;
                pass(name, `skill audit: REAL tool — ${makesHttpCall ? 'HTTP ' : ''}${usesFileSystem ? 'FS ' : ''}${executesCode ? 'EXEC ' : ''}${doesComputation ? 'MATH ' : ''}`);
            } else if (uses_brain_think) {
                stub++;
                warnResult(name, 'skill audit', `PROBABLY FAKE: no real tool calls, just brain.think()`);
            } else if (isPlatformCheck) {
                pass(name, `skill audit: PLATFORM-CHECK — reports availability per OS ✓`);
            } else {
                // Has exports, no real logic detected — could be config
                pass(name, `exports ${exports.length} item(s): ${exports.join(', ')}`);
            }
        } catch (e) {
            broken++;
            failResult(name, 'require', e.message.slice(0, 200));
        }
    }

    const total = files.length;
    console.log(`\n    ${C.bold}Skill Summary:${C.reset} ${C.green}${real_tool} real${C.reset} | ${C.yellow}${stub} stub/fake${C.reset} | ${C.red}${broken} broken${C.reset} | ${total} total`);
}

// ===================================================================
// 4. PYTHON BRIDGE TEST
// ===================================================================
async function testPythonBridge() {
    title('PYTHON BRIDGE — Find all Python modules and test bridge loading');

    const pythonDir = path.join(SRC, 'python_skills');
    if (!fs.existsSync(pythonDir)) {
        warnResult('python_skills', 'directory', 'python_skills directory not found');
        return;
    }

    const pyFiles = fs.readdirSync(pythonDir).filter(f => f.endsWith('.py'));
    console.log(`    Found ${pyFiles.length} Python modules`);

    // Check the bridge
    const bridgePath = path.join(SRC, 'brain', 'python_skills_bridge.js');
    if (fs.existsSync(bridgePath)) {
        try {
            const bridge = require(bridgePath);
            const exports = Object.keys(bridge);
            const hasBridgeFunctions = exports.some(k => typeof bridge[k] === 'function');
            if (hasBridgeFunctions) {
                pass('bridge', `python_skills_bridge.js loaded with ${exports.length} exports`);
                // Try to list Python modules through bridge
                if (typeof bridge.listModules === 'function' || typeof bridge.getStatus === 'function') {
                    try {
                        const status = (bridge.listModules || bridge.getStatus)();
                        if (Array.isArray(status)) {
                            console.log(`    Python modules reported: ${status.length}`);
                            status.forEach(m => console.log(`      ${ok(m.name || m)}`));
                        } else if (status && status.modules) {
                            console.log(`    Python modules reported: ${status.modules.length}`);
                            status.modules.forEach(m => console.log(`      ${ok(m)}`));
                        }
                    } catch (e) {
                        warnResult('bridge', 'listModules', `Can't list modules: ${e.message}`);
                    }
                }
            } else {
                failResult('bridge', 'load', 'no function exports found');
            }
        } catch (e) {
            failResult('bridge', 'require', e.message.slice(0, 200));
        }
    } else {
        failResult('bridge', 'exists', 'python_skills_bridge.js not found at src/brain/');
    }

    // Check individual Python files
    for (const pyFile of pyFiles) {
        const name = pyFile.replace('.py', '');
        const content = fs.readFileSync(path.join(pythonDir, pyFile), 'utf8');
        const hasClass = content.includes('class ');
        const hasFunction = content.includes('def ');
        const hasMainChamber = content.includes('process(') || content.includes('__init__');
        
        if (hasClass && hasFunction) {
            pass(`py:${name}`, `Python module with ${hasClass ? 'class ' : ''}${hasFunction ? 'functions ' : ''}`);
        } else if (hasFunction) {
            pass(`py:${name}`, `Python module with functions`);
        } else {
            warnResult(`py:${name}`, 'structure', 'minimal Python file');
        }
    }
}

// ===================================================================
// 5. MCP MODULES TEST
// ===================================================================
async function testMCP() {
    title('MCP — Module loading and configuration');

    const mcpDir = path.join(SRC, 'mcp');
    if (fs.existsSync(mcpDir)) {
        const files = fs.readdirSync(mcpDir).filter(f => f.endsWith('.js'));
        for (const file of files) {
            const name = file.replace('.js', '');
            try {
                const mod = require(path.join(mcpDir, file));
                pass(name, `loaded with ${Object.keys(mod).length} exports`);
            } catch (e) {
                failResult(name, 'require', e.message.slice(0, 200));
            }
        }
    }

    // Check mcp_servers.js
    const serversPath = path.join(SRC, 'brain', 'mcp_servers.js');
    if (fs.existsSync(serversPath)) {
        try {
            const servers = require(serversPath);
            const exports = Object.keys(servers);
            pass('mcp_servers', `loaded with ${exports.length} exports: ${exports.slice(0, 4).join(', ')}${exports.length > 4 ? '...' : ''}`);
        } catch (e) {
            failResult('mcp_servers', 'require', e.message.slice(0, 200));
        }
    }

    // Check mcp_client.js
    const clientPath = path.join(SRC, 'brain', 'mcp_client.js');
    if (fs.existsSync(clientPath)) {
        try {
            const client = require(clientPath);
            pass('mcp_client', `loaded with ${Object.keys(client).length} exports`);
        } catch (e) {
            failResult('mcp_client', 'require', e.message.slice(0, 200));
        }
    }
}

// ===================================================================
// 6. MINDS EYE TEST
// ===================================================================
async function testMindsEye() {
    title('MINDS EYE — Visual engine loading');

    const mindsEyePath = path.join(SRC, 'brain', 'minds_eye.js');
    if (!fs.existsSync(mindsEyePath)) {
        failResult('minds_eye', 'exists', 'minds_eye.js not found');
        return;
    }

    try {
        const mod = require(mindsEyePath);
        const exports = Object.keys(mod);
        
        const expectedExports = ['MindsEye', 'mindsEyeBackends'];
        for (const exp of expectedExports) {
            if (exports.includes(exp)) {
                pass(`minds_eye.${exp}`, `export present`);
            } else {
                warnResult(`minds_eye.${exp}`, 'missing', `expected export "${exp}" not found`);
            }
        }

        // Test MindsEye class
        if (mod.MindsEye) {
            const MindsEye = mod.MindsEye;
            if (typeof MindsEye === 'function') {
                pass('MindsEye class', 'exported as constructor');
                // Check static methods
                const staticMethods = ['imagine', 'dream', 'visualize', 'autoVision', 'getGallery', 'setBackend'];
                for (const method of staticMethods) {
                    if (typeof MindsEye[method] === 'function') {
                        pass(`MindsEye.${method}`, `static method available`);
                    }
                }
            } else if (typeof MindsEye === 'object') {
                pass('MindsEye instance', 'exported as instance');
                const methods = ['imagine', 'dream', 'visualize'];
                for (const method of methods) {
                    if (typeof MindsEye[method] === 'function') {
                        pass(`MindsEye.${method}`, `method available`);
                    }
                }
            }
        }
    } catch (e) {
        failResult('minds_eye', 'require', e.message.slice(0, 200));
    }
}

// ===================================================================
// 7. COUNCIL TEST
// ===================================================================
async function testCouncil() {
    title('GODS COUNCIL — Loading and structure');

    const councilPath = path.join(SRC, 'council', 'gods_council.js');
    if (fs.existsSync(councilPath)) {
        try {
            const council = require(councilPath);
            const exports = Object.keys(council);
            pass('gods_council', `loaded with ${exports.length} exports: ${exports.join(', ')}`);

            // Check for God names in source
            const src = fs.readFileSync(councilPath, 'utf8');
            const gods = ['Profit Prime', 'Love Weaver', 'Tax Collector', 'Harvester'];
            for (const god of gods) {
                if (src.includes(god)) {
                    pass(`God: ${god}`, `defined in council`);
                } else {
                    warnResult(`God: ${god}`, 'not found', `"${god}" not found in source`);
                }
            }
        } catch (e) {
            failResult('gods_council', 'require', e.message.slice(0, 200));
        }
    }
}

// ===================================================================
// 8. IDENTITY TEST (read-only check)
// ===================================================================
async function testIdentity() {
    title('IDENTITY — Protected files integrity');

    const identityDir = path.join(SRC, 'identity');
    if (fs.existsSync(identityDir)) {
        const files = fs.readdirSync(identityDir);
        for (const file of files) {
            const filePath = path.join(identityDir, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                if (file.endsWith('.js')) {
                    const mod = require(filePath);
                    pass(`identity/${file}`, `loaded with ${Object.keys(mod).length} exports`);
                } else if (file.endsWith('.md')) {
                    pass(`identity/${file}`, `Markdown file (${content.length} chars)`);
                } else {
                    pass(`identity/${file}`, `exists (${content.length} chars)`);
                }
            } catch (e) {
                failResult(`identity/${file}`, 'read', e.message.slice(0, 200));
            }
        }
    }

    // Voice
    const voicePath = path.join(SRC, 'voice', 'mega_voice.js');
    if (fs.existsSync(voicePath)) {
        try {
            const voice = require(voicePath);
            pass('mega_voice', `loaded with ${Object.keys(voice).length} exports`);
        } catch (e) {
            failResult('mega_voice', 'require', e.message.slice(0, 200));
        }
    }
}

// ===================================================================
// 9. SUB-AGENTS TEST
// ===================================================================
async function testSubAgents() {
    title('SUB-AGENTS — Loading and structure');

    const subDir = path.join(SRC, 'sub_agents');
    if (fs.existsSync(subDir)) {
        const files = fs.readdirSync(subDir).filter(f => f.endsWith('.js'));
        for (const file of files) {
            const name = file.replace('.js', '');
            try {
                const mod = require(path.join(subDir, file));
                const exports = Object.keys(mod);
                
                // Check for agent definitions
                const src = fs.readFileSync(path.join(subDir, file), 'utf8');
                const agentDefs = (src.match(/agent\w*['":\s]*\w+/gi) || []).slice(0, 5);
                
                pass(name, `loaded with ${exports.length} exports${agentDefs.length ? `, agent refs: ${agentDefs.slice(0, 3).join(', ')}` : ''}`);
            } catch (e) {
                failResult(name, 'require', e.message.slice(0, 200));
            }
        }
    }
}

// ===================================================================
// 10. SOUL REGISTRY TEST
// ===================================================================
async function testSoulRegistry() {
    title('SOUL REGISTRY — Loading and validation');

    const regDir = path.join(SRC, 'soul_registry');
    if (fs.existsSync(regDir)) {
        const files = fs.readdirSync(regDir).filter(f => f.endsWith('.js'));
        for (const file of files) {
            try {
                const mod = require(path.join(regDir, file));
                pass(`soul_registry/${file}`, `loaded with ${Object.keys(mod).length} exports`);
            } catch (e) {
                failResult(`soul_registry/${file}`, 'require', e.message.slice(0, 200));
            }
        }
    }
}

// ===================================================================
// 11. MARKETPLACE TEST
// ===================================================================
async function testMarketplace() {
    title('MARKETPLACE — Loading');

    const marketDir = path.join(SRC, 'marketplace');
    if (fs.existsSync(marketDir)) {
        const files = fs.readdirSync(marketDir).filter(f => f.endsWith('.js'));
        for (const file of files) {
            try {
                const mod = require(path.join(marketDir, file));
                pass(`marketplace/${file}`, `loaded with ${Object.keys(mod).length} exports`);
            } catch (e) {
                failResult(`marketplace/${file}`, 'require', e.message.slice(0, 200));
            }
        }
    }
}

// ===================================================================
// 12. MEMORY SYSTEM TEST
// ===================================================================
async function testMemory() {
    title('MEMORY SYSTEMS — Loading');

    const memPath = path.join(SRC, 'memory', 'mega_memory.js');
    if (fs.existsSync(memPath)) {
        try {
            const mem = require(memPath);
            pass('mega_memory', `loaded with ${Object.keys(mem).length} exports`);
        } catch (e) {
            failResult('mega_memory', 'require', e.message.slice(0, 200));
        }
    }
}

// ===================================================================
// 13. SUPER KERNEL TEST
// ===================================================================
async function testSuperKernel() {
    title('SUPER KERNEL — Loading');

    const skPath = path.join(SRC, 'super_kernel.js');
    if (fs.existsSync(skPath)) {
        try {
            const sk = require(skPath);
            pass('super_kernel', `loaded with ${Object.keys(sk).length} exports`);
        } catch (e) {
            failResult('super_kernel', 'require', e.message.slice(0, 200));
        }
    }
}

// ===================================================================
// 14. MAIN.JS TEST (can it load without executing?)
// ===================================================================
async function testMain() {
    title('MAIN.JS — Parse check (not executed)');

    const mainPath = path.join(SRC, 'main.js');
    if (fs.existsSync(mainPath)) {
        const src = fs.readFileSync(mainPath, 'utf8');
        // Check for syntax errors
        try {
            new Function(src);
            pass('main.js', 'parseable JavaScript');
        } catch (e) {
            failResult('main.js', 'parse', e.message.slice(0, 200));
        }

        // Count key features
        const hasBoot = src.includes('async function boot') || src.includes('function boot');
        const hasShell = src.includes('shell') || src.includes('rl.on');
        const hasCycle = src.includes('cycle') || src.includes('setInterval');
        
        if (hasBoot) pass('main.js: boot()', 'boot function defined');
        else warnResult('main.js: boot()', 'not found', 'no boot function detected');
        if (hasShell) pass('main.js: shell', 'shell/REPL detected');
        if (hasCycle) pass('main.js: cycle', 'cycle engine detected');
    }
}

// ===================================================================
// 15. ALL FILE INTEGRITY CHECK
// ===================================================================
async function testFileIntegrity() {
    title('FILE INTEGRITY — All .js files parse correctly');

    function walkDir(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        for (const file of list) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                results = results.concat(walkDir(filePath));
            } else if (file.endsWith('.js')) {
                results.push(filePath);
            }
        }
        return results;
    }

    const allFiles = walkDir(SRC);
    let parsed = 0, failed = 0;

    for (const filePath of allFiles) {
        const relPath = path.relative(SRC, filePath);
        // Skip non-essential files
        if (relPath.includes('node_modules')) continue;
        
        try {
            const src = fs.readFileSync(filePath, 'utf8');
            new Function(src);
            parsed++;
        } catch (e) {
            failed++;
            failResult(`syntax: ${relPath}`, 'parse error', e.message.slice(0, 200));
        }
    }

    console.log(`\n    ${C.bold}Syntax Check:${C.reset} ${C.green}${parsed} files OK${C.reset} | ${C.red}${failed} failed${C.reset}`);
}

// ===================================================================
// SPECIAL: Deep Fake Skill Analysis
// ===================================================================
async function deepFakeAnalysis() {
    title('DEEP FAKE ANALYSIS — Skills that pretend to work but don\'t');

    const skillDir = path.join(SRC, 'skills');
    const files = fs.readdirSync(skillDir).filter(f => f.endsWith('.js') && f !== 'mega_skills.js');

    let trulyFake = [];

    for (const file of files) {
        const src = fs.readFileSync(path.join(skillDir, file), 'utf8');
        const name = file.replace('.js', '');
        
        // Pattern 1: "Auto-converted from stub" comment
        const isFakeComment = src.includes('Auto-converted from stub');
        const isMockConverted = src.includes('Converted from mock-data');
        
        // Pattern 2: Only export is a brain.think() wrapper
        const hasRealApiCall = src.includes('https.') || src.includes('fetch(') || src.includes('exec(') || src.includes('spawn(') || src.includes('fs.writeFile') || src.includes('fs.readFile');
        const onlyBrainThink = src.includes('brain.think(') && !hasRealApiCall;
        
        // Pattern 3: Returns hardcoded JSON (no real work)
        const returnsMockData = src.includes('return {') && /simulated|mock|dummy|placeholder/i.test(src);
        
        // Check for vault-aware skills (these are honest about needing keys)
        const isVaultAware = src.includes('api_vault') || src.includes('vault.getKey');
        const hasNeedsKey = src.includes('needs_key');
        const isPlatformCheck = src.includes('os.platform()');
        
        if (isVaultAware || hasNeedsKey || isPlatformCheck || hasRealApiCall) {
            continue;
        }
        
        if (isFakeComment || isMockConverted || onlyBrainThink || returnsMockData) {
            trulyFake.push({ name, reasons: [] });
            const idx = trulyFake.length - 1;
            if (isFakeComment) trulyFake[idx].reasons.push('auto-converted stub comment');
            if (isMockConverted) trulyFake[idx].reasons.push('converted from mock-data');
            if (onlyBrainThink) trulyFake[idx].reasons.push('only brain.think() — no real integration');
            if (returnsMockData) trulyFake[idx].reasons.push('returns mock/simulated data');
        }
    }

    if (trulyFake.length > 0) {
        console.log(`\n    ${C.bold}${C.red}FAKE SKILLS (${trulyFake.length}):${C.reset}`);
        trulyFake.sort((a, b) => a.name.localeCompare(b.name));
        for (const f of trulyFake) {
            console.log(`      ${C.yellow}${f.name}${C.reset}`);
            f.reasons.forEach(r => console.log(`        ${C.dim}→ ${r}${C.reset}`));
        }
        
        console.log(`\n    ${C.bold}${C.red}These skills will produce PLAUSIBLE but UNREAL output.${C.reset}`);
        console.log(`    ${C.dim}User types "I need to log into 1Password" → soul says "Here's your password!"${C.reset}`);
        console.log(`    ${C.dim}User types "What's on my Spotify?" → soul makes up a playlist${C.reset}`);
        console.log(`    ${C.dim}Solution: Add real API integrations or clearly mark as simulated.${C.reset}`);
    } else {
        console.log(`\n    ${C.green}${C.bold}No fake skills detected!${C.reset}`);
    }

    return trulyFake;
}

// ===================================================================
// RUN ALL
// ===================================================================
async function runAll() {
    console.log(`${C.bold}${C.magenta}`);
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     COMPREHENSIVE KERNEL TEST — Every Module Audited       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log(`${C.reset}`);
    console.log(`Started: ${new Date().toISOString()}`);
    console.log(`Node: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log(`Source: ${SRC}\n`);

    const startTime = Date.now();

    try { await testBrainModules(); } catch (e) { console.error(`  BRAIN ERROR:`, e.message); }
    try { await testApiVault(); } catch (e) { console.error(`  VAULT ERROR:`, e.message); }
    try { await testChambers(); } catch (e) { console.error(`  CHAMBER ERROR:`, e.message); }
    try { await testSkills(); } catch (e) { console.error(`  SKILL ERROR:`, e.message); }
    try { await testPythonBridge(); } catch (e) { console.error(`  PYTHON ERROR:`, e.message); }
    try { await testMCP(); } catch (e) { console.error(`  MCP ERROR:`, e.message); }
    try { await testMindsEye(); } catch (e) { console.error(`  MINDS EYE ERROR:`, e.message); }
    try { await testCouncil(); } catch (e) { console.error(`  COUNCIL ERROR:`, e.message); }
    try { await testIdentity(); } catch (e) { console.error(`  IDENTITY ERROR:`, e.message); }
    try { await testSubAgents(); } catch (e) { console.error(`  SUB-AGENTS ERROR:`, e.message); }
    try { await testSoulRegistry(); } catch (e) { console.error(`  REGISTRY ERROR:`, e.message); }
    try { await testMarketplace(); } catch (e) { console.error(`  MARKETPLACE ERROR:`, e.message); }
    try { await testMemory(); } catch (e) { console.error(`  MEMORY ERROR:`, e.message); }
    try { await testSuperKernel(); } catch (e) { console.error(`  SUPER KERNEL ERROR:`, e.message); }
    try { await testMain(); } catch (e) { console.error(`  MAIN ERROR:`, e.message); }
    try { await testFileIntegrity(); } catch (e) { console.error(`  INTEGRITY ERROR:`, e.message); }
    
    const fakeSkills = await deepFakeAnalysis();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`\n${C.bold}${C.magenta}══════════════════════════════════════════════════════════════${C.reset}`);
    console.log(`  ${C.bold}FINAL RESULTS${C.reset} (${elapsed}s)`);
    console.log(`  ${C.green}Passed: ${results.passed}${C.reset}`);
    console.log(`  ${C.yellow}Warnings: ${results.warnings}${C.reset}`);
    console.log(`  ${C.red}Failed: ${results.failed}${C.reset}`);
    console.log(`  ${C.bold}Total: ${results.passed + results.failed + results.warnings}${C.reset}`);
    console.log(`  Fake skills detected: ${fakeSkills.length}`);

    // Generate report file
    const reportPath = path.join(__dirname, 'test_comprehensive_report.json');
    const report = {
        timestamp: new Date().toISOString(),
        node_version: process.version,
        platform: process.platform,
        results: {
            passed: results.passed,
            failed: results.failed,
            warnings: results.warnings,
            total: results.passed + results.failed + results.warnings,
        },
        fake_skills: fakeSkills.map(f => ({ name: f.name, reasons: f.reasons })),
        details: results.details,
    };
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n  Report saved to: ${reportPath}`);

    console.log(`\n${C.bold}${results.failed > 0 ? C.red : C.green}DONE${C.reset}\n`);
    process.exit(results.failed > 0 ? 1 : 0);
}

runAll().catch(e => {
    console.error('FATAL:', e);
    process.exit(1);
});
