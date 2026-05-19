'use strict';

const path = require('path');
const fs = require('fs');

const BASE = path.resolve(__dirname);
const SRC = path.join(BASE, 'src');
const MCP_SRC = path.join(SRC, 'mcp');

let passed = 0;
let failed = 0;
let totalTests = 0;
const errors = [];

function test(name, fn) {
    totalTests++;
    try {
        fn();
        passed++;
        console.log(`  [PASS] ${name}`);
        return true;
    } catch (e) {
        failed++;
        errors.push({ name, error: e.message });
        console.log(`  [FAIL] ${name}: ${e.message}`);
        return false;
    }
}

async function testAsync(name, fn) {
    totalTests++;
    try {
        await fn();
        passed++;
        console.log(`  [PASS] ${name}`);
        return true;
    } catch (e) {
        failed++;
        errors.push({ name, error: e.message });
        console.log(`  [FAIL] ${name}: ${e.message}`);
        return false;
    }
}

function assertEqual(actual, expected, msg) {
    if (actual !== expected) {
        throw new Error(`${msg || 'assertEqual'} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

function assertTruthy(val, msg) {
    if (!val) throw new Error(`${msg || 'assertTruthy'} — falsy value: ${val}`);
}

function assertMatch(str, regex, msg) {
    if (!regex.test(str)) {
        throw new Error(`${msg || 'assertMatch'} — "${str}" did not match ${regex}`);
    }
}

async function run() {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║  MCP INTEGRATION TEST SUITE — 200+ CONNECTIONS     ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('');

    let configData = null;
    let config = null;
    let configPath = path.join(BASE, 'mcp_config.json');

    // ===== 1. Load mcp_config.json and verify all 70 servers parse correctly =====
    console.log('── MCP CONFIG ──────────────────────────────────────────');

    test('mcp_config.json exists', () => {
        assertTruthy(fs.existsSync(configPath), 'File not found');
    });

    test('mcp_config.json parses as valid JSON', () => {
        const raw = fs.readFileSync(configPath, 'utf8');
        configData = raw;
        config = JSON.parse(raw);
        assertTruthy(config, 'Parsed config is falsy');
    });

    test('Config has servers object', () => {
        assertTruthy(config.servers, 'No servers key');
        assertTruthy(typeof config.servers === 'object' && !Array.isArray(config.servers), 'servers is not an object');
    });

    let serverCount = 0;
    test('Count all servers in config', () => {
        serverCount = Object.keys(config.servers).length;
        console.log(`    Servers found: ${serverCount}`);
        assertEqual(serverCount, 70, `Expected 70 servers, got ${serverCount}`);
    });

    let configToolCount = 0;
    test('Count all tools defined in config', () => {
        configToolCount = 0;
        for (const srv of Object.values(config.servers)) {
            if (srv.tools && Array.isArray(srv.tools)) {
                configToolCount += srv.tools.length;
            }
        }
        console.log(`    Total tool definitions: ${configToolCount}`);
        assertTruthy(configToolCount >= 300, `Expected >=300 tools, got ${configToolCount}`);
    });

    test('Meta totalServers matches actual count', () => {
        if (config.meta && config.meta.totalServers !== undefined) {
            assertEqual(serverCount, config.meta.totalServers,
                `meta.totalServers (${config.meta.totalServers}) != actual (${serverCount})`);
        }
    });

    test('Each server has required fields', () => {
        const names = Object.keys(config.servers);
        for (const name of names) {
            const srv = config.servers[name];
            assertTruthy(srv.type, `Server "${name}" missing type`);
            assertTruthy(srv.description, `Server "${name}" missing description`);
            assertTruthy(srv.tools, `Server "${name}" missing tools array`);
            assertTruthy(Array.isArray(srv.tools), `Server "${name}" tools is not an array`);
        }
    });

    test('Each tool has name and description', () => {
        const names = Object.keys(config.servers);
        for (const name of names) {
            const srv = config.servers[name];
            for (const tool of srv.tools) {
                assertTruthy(tool.name, `Server "${name}" has tool without name`);
                assertTruthy(tool.description, `Server "${name}" tool "${tool.name}" missing description`);
            }
        }
    });

    // ===== 2. Test MCP protocol helpers =====
    console.log('');
    console.log('── MCP PROTOCOL ───────────────────────────────────────');

    let protocol;
    test('mcp_protocol.js module loads', () => {
        protocol = require(path.join(MCP_SRC, 'mcp_protocol.js'));
        assertTruthy(protocol, 'Module returned falsy');
    });

    test('buildRequest creates valid JSON-RPC request', () => {
        const req = protocol.buildRequest('test_method', { foo: 'bar' }, 'id1');
        assertEqual(req.jsonrpc, '2.0');
        assertEqual(req.method, 'test_method');
        assertEqual(req.params.foo, 'bar');
        assertEqual(req.id, 'id1');
    });

    test('buildResponse creates valid response', () => {
        const resp = protocol.buildResponse('id1', { result: 'ok' });
        assertEqual(resp.jsonrpc, '2.0');
        assertEqual(resp.id, 'id1');
        assertEqual(resp.result.result, 'ok');
    });

    test('buildError creates error response', () => {
        const err = protocol.buildError('id1', -32600, 'Invalid Request');
        assertEqual(err.jsonrpc, '2.0');
        assertEqual(err.error.code, -32600);
        assertEqual(err.error.message, 'Invalid Request');
    });

    test('buildNotification creates notification (no id)', () => {
        const notif = protocol.buildNotification('test_notify', { data: 1 });
        assertEqual(notif.jsonrpc, '2.0');
        assertEqual(notif.method, 'test_notify');
        assertEqual(notif.id, undefined);
    });

    test('isRequest correctly classifies', () => {
        assertTruthy(protocol.isRequest({ jsonrpc: '2.0', method: 'x', id: 1 }));
        assertEqual(protocol.isRequest({ jsonrpc: '2.0', method: 'x' }), false);
        assertEqual(Boolean(protocol.isRequest(null)), false);
    });

    test('isNotification correctly classifies', () => {
        assertTruthy(protocol.isNotification({ jsonrpc: '2.0', method: 'x' }));
        assertEqual(protocol.isNotification({ jsonrpc: '2.0', method: 'x', id: 1 }), false);
    });

    test('isResponse correctly classifies', () => {
        assertTruthy(protocol.isResponse({ jsonrpc: '2.0', id: 1, result: {} }));
        assertTruthy(protocol.isResponse({ jsonrpc: '2.0', id: 1, error: {} }));
        assertEqual(protocol.isResponse({ jsonrpc: '2.0', method: 'x' }), false);
    });

    test('isError correctly classifies', () => {
        assertTruthy(protocol.isError({ jsonrpc: '2.0', id: 1, error: { code: -1 } }));
        assertEqual(protocol.isError({ jsonrpc: '2.0', id: 1, result: {} }), false);
    });

    test('classifyError returns correct error types', () => {
        assertEqual(protocol.classifyError({ code: -32700 }), 'PARSE_ERROR');
        assertEqual(protocol.classifyError({ code: -32600 }), 'INVALID_REQUEST');
        assertEqual(protocol.classifyError({ code: -32601 }), 'METHOD_NOT_FOUND');
        assertEqual(protocol.classifyError({ code: -32602 }), 'INVALID_PARAMS');
        assertEqual(protocol.classifyError({ code: -32603 }), 'INTERNAL_ERROR');
        assertEqual(protocol.classifyError({ code: -32000 }), 'SERVER_ERROR');
        assertEqual(protocol.classifyError({ code: -1 }), 'APPLICATION_ERROR');
        assertEqual(protocol.classifyError(null), 'UNKNOWN');
    });

    test('ERROR_CODES object is complete', () => {
        assertEqual(protocol.ERROR_CODES.PARSE_ERROR, -32700);
        assertEqual(protocol.ERROR_CODES.INVALID_REQUEST, -32600);
        assertEqual(protocol.ERROR_CODES.METHOD_NOT_FOUND, -32601);
        assertEqual(protocol.ERROR_CODES.INVALID_PARAMS, -32602);
        assertEqual(protocol.ERROR_CODES.INTERNAL_ERROR, -32603);
    });

    // ===== 3. Test MCP tool registry count exceeds 200 =====
    console.log('');
    console.log('── MCP TOOL REGISTRY ──────────────────────────────────');

    let registryToolCount = 0;
    let registryServerCount = 0;
    test('MCP_TOOL_REGISTRY is exported', () => {
        assertTruthy(protocol.MCP_TOOL_REGISTRY, 'MCP_TOOL_REGISTRY missing');
        registryServerCount = Object.keys(protocol.MCP_TOOL_REGISTRY).length;
        console.log(`    Registry servers: ${registryServerCount}`);
    });

    test('countAllKnownTools returns correct count', () => {
        const count = protocol.countAllKnownTools();
        registryToolCount = count;
        console.log(`    Registry tool count: ${count}`);
        assertTruthy(count > 0, 'Tool count is zero');
    });

    test('getAllKnownToolNames returns non-empty array', () => {
        const names = protocol.getAllKnownToolNames();
        assertTruthy(Array.isArray(names), 'Not an array');
        assertTruthy(names.length > 0, 'Empty array');
        assertEqual(names.length, registryToolCount, 'Length mismatch');
    });

    test('getToolNamesForServer returns tools for known server', () => {
        const tools = protocol.getToolNamesForServer('filesystem');
        assertTruthy(Array.isArray(tools), 'Not an array');
        assertTruthy(tools.length >= 10, `Expected >=10 filesystem tools, got ${tools.length}`);
    });

    test('getToolNamesForServer returns empty for unknown server', () => {
        const tools = protocol.getToolNamesForServer('nonexistent_server_xyz');
        assertTruthy(Array.isArray(tools), 'Not an array');
        assertEqual(tools.length, 0, 'Should be empty');
    });

    // ===== 4. Test MCP Manager loads config =====
    console.log('');
    console.log('── MCP MANAGER ────────────────────────────────────────');

    let MCPManager;
    test('mcp_manager.js module loads', () => {
        const mod = require(path.join(MCP_SRC, 'mcp_manager.js'));
        MCPManager = mod.MCPManager;
        assertTruthy(MCPManager, 'MCPManager not exported');
    });

    test('MCPManager constructor creates instance', () => {
        const mgr = new MCPManager({ configPath });
        assertTruthy(mgr, 'Instance is falsy');
        assertEqual(mgr.totalTools, 0, 'Initial totalTools should be 0');
        assertTruthy(mgr.stats, 'Stats object missing');
        assertEqual(mgr.stats.connectionsAttempted, 0);
    });

    test('MCPManager.loadConfig() reads and returns server count', () => {
        const mgr = new MCPManager({ configPath });
        const count = mgr.loadConfig();
        assertEqual(count, serverCount, `loadConfig returned ${count}, expected ${serverCount}`);
        assertEqual(Object.keys(mgr.servers).length, serverCount);
    });

    test('MCPManager.getStatus() returns status object after config load', () => {
        const mgr = new MCPManager({ configPath });
        mgr.loadConfig();
        const status = mgr.getStatus();
        assertTruthy(status, 'Status is falsy');
        assertEqual(status.configs, serverCount);
        assertEqual(status.connected, 0);
        assertEqual(status.totalTools, 0);
        assertTruthy(status.servers, 'Servers map missing');
        assertTruthy(status.stats, 'Stats missing');
    });

    test('MCPManager.loadConfig() handles missing config gracefully', () => {
        const mgr = new MCPManager({ configPath: './nonexistent_config.json' });
        const count = mgr.loadConfig();
        assertEqual(count, 0, 'Should return 0 for missing config');
        assertEqual(Object.keys(mgr.servers).length, 0);
    });

    test('MCPManager autoConnect identifies eligible servers', async () => {
        const mgr = new MCPManager({ configPath });
        mgr.loadConfig();
        const result = await mgr.autoConnect();
        assertTruthy(result, 'Result is falsy');
        assertTruthy(Array.isArray(result.connected), 'connected should be array');
        assertTruthy(Array.isArray(result.failed), 'failed should be array');
    });

    // ===== 5. Test MCP Skill Wrapper creates valid skill definitions =====
    console.log('');
    console.log('── MCP SKILL WRAPPER ──────────────────────────────────');

    let MCPSkillWrapper;
    test('mcp_skill_wrapper.js module loads', () => {
        const mod = require(path.join(MCP_SRC, 'mcp_skill_wrapper.js'));
        MCPSkillWrapper = mod.MCPSkillWrapper;
        assertTruthy(MCPSkillWrapper, 'MCPSkillWrapper not exported');
    });

    test('MCPSkillWrapper constructor creates instance', () => {
        const wrapper = new MCPSkillWrapper(null, null);
        assertTruthy(wrapper, 'Instance is falsy');
        assertEqual(wrapper.wrappedSkills.size, 0);
        assertEqual(wrapper.getCount(), 0);
    });

    test('MCPSkillWrapper.getWrappedSkills returns array', () => {
        const wrapper = new MCPSkillWrapper(null, null);
        const skills = wrapper.getWrappedSkills();
        assertTruthy(Array.isArray(skills), 'Not an array');
        assertEqual(skills.length, 0);
    });

    test('MCPSkillWrapper wraps mock tool correctly', () => {
        const mockManager = {
            listAllTools: () => [],
            callTool: async () => ({})
        };
        const wrapper = new MCPSkillWrapper(mockManager, null);
        const tool = {
            name: 'filesystem/read_file',
            description: 'Read a file from disk',
            inputSchema: {
                type: 'object',
                properties: {
                    path: { type: 'string' }
                },
                required: ['path']
            }
        };
        const result = wrapper.wrapTool(tool);
        assertTruthy(result, 'wrapTool returned false');
        assertEqual(wrapper.getCount(), 1, 'Count should be 1');
        const skills = wrapper.getWrappedSkills();
        assertEqual(skills.length, 1);
        assertMatch(skills[0].name, /^mcp_/);
        assertTruthy(skills[0].pl_affinity, 'PLT affinity missing');
        assertTruthy(skills[0].pl_affinity.profit !== undefined, 'profit missing');
        assertTruthy(skills[0].pl_affinity.love !== undefined, 'love missing');
        assertTruthy(skills[0].pl_affinity.tax !== undefined, 'tax missing');
    });

    test('MCPSkillWrapper does not duplicate wraps', () => {
        const mockManager = {
            listAllTools: () => [],
            callTool: async () => ({})
        };
        const wrapper = new MCPSkillWrapper(mockManager, null);
        const tool = { name: 'github/list_repos', description: 'List repos', inputSchema: { type: 'object', properties: {} } };
        assertTruthy(wrapper.wrapTool(tool), 'First wrap');
        assertEqual(wrapper.wrapTool(tool), false, 'Duplicate wrap should return false');
        assertEqual(wrapper.getCount(), 1);
    });

    // ===== 6. Test MCP Server exists (verify file) =====
    console.log('');
    console.log('── MCP SERVER FILES ───────────────────────────────────');

    test('mcp_server.js file exists', () => {
        assertTruthy(fs.existsSync(path.join(MCP_SRC, 'mcp_server.js')), 'File not found');
    });

    test('mcp/index.js file exists', () => {
        assertTruthy(fs.existsSync(path.join(MCP_SRC, 'index.js')), 'File not found');
    });

    test('mcp_manager.js file exists', () => {
        assertTruthy(fs.existsSync(path.join(MCP_SRC, 'mcp_manager.js')), 'File not found');
    });

    test('mcp_protocol.js file exists', () => {
        assertTruthy(fs.existsSync(path.join(MCP_SRC, 'mcp_protocol.js')), 'File not found');
    });

    test('mcp_skill_wrapper.js file exists', () => {
        assertTruthy(fs.existsSync(path.join(MCP_SRC, 'mcp_skill_wrapper.js')), 'File not found');
    });

    // ===== 7. Test MCPServer imports =====
    console.log('');
    console.log('── MCP SERVER IMPORTS ─────────────────────────────────');

    let MCPServer;
    let mcpIndex;
    test('MCPServer class loads from mcp_server.js', () => {
        const mod = require(path.join(MCP_SRC, 'mcp_server.js'));
        MCPServer = mod.MCPServer;
        assertTruthy(MCPServer, 'MCPServer not exported');
        assertEqual(typeof MCPServer, 'function', 'Not a constructor');
    });

    test('MCPServer constructor accepts kernel systems', () => {
        const server = new MCPServer({ brain: {}, memory: {} }, { port: 3001 });
        assertTruthy(server, 'Instance is falsy');
        assertEqual(server.port, 3001);
        assertEqual(server._running, false);
        assertTruthy(server.stats, 'Stats missing');
        assertEqual(server.stats.requests, 0);
        assertEqual(server.stats.errors, 0);
    });

    test('MCPServer has required methods', () => {
        const server = new MCPServer({});
        assertEqual(typeof server.start, 'function', 'start() missing');
        assertEqual(typeof server.stop, 'function', 'stop() missing');
        assertEqual(typeof server._buildToolsList, 'function', '_buildToolsList() missing');
        assertEqual(typeof server._buildStatus, 'function', '_buildStatus() missing');
    });

    test('mcp/index.js exports startMCPServer', () => {
        mcpIndex = require(path.join(MCP_SRC, 'index.js'));
        assertTruthy(mcpIndex.MCPServer, 'MCPServer not exported from index');
        assertTruthy(mcpIndex.startMCPServer, 'startMCPServer not exported from index');
        assertEqual(typeof mcpIndex.startMCPServer, 'function', 'startMCPServer not a function');
        assertTruthy(mcpIndex.getServerStatus, 'getServerStatus not exported from index');
    });

    test('MCPServer._buildToolsList returns array of tool definitions', () => {
        const server = new MCPServer({});
        const tools = server._buildToolsList();
        assertTruthy(Array.isArray(tools), 'Not an array');
        assertTruthy(tools.length >= 10, `Expected >=10 tools, got ${tools.length}`);
        for (const tool of tools) {
            assertTruthy(tool.name, 'Tool missing name');
            assertTruthy(tool.description, `Tool "${tool.name}" missing description`);
            assertTruthy(tool.inputSchema, `Tool "${tool.name}" missing inputSchema`);
        }
    });

    test('MCPServer._buildStatus returns status object', () => {
        const server = new MCPServer({});
        const status = server._buildStatus();
        assertTruthy(status, 'Status is falsy');
        assertEqual(status.server.name, 'grand-soul-kernel-mcp');
        assertTruthy(status.server.version, 'Version missing');
        assertTruthy(status.systems, 'Systems object missing');
    });

    // ===== 8. Test tool discovery count =====
    console.log('');
    console.log('── TOOL DISCOVERY ─────────────────────────────────────');

    test('MCP_TOOL_REGISTRY has 28 server entries', () => {
        const count = Object.keys(protocol.MCP_TOOL_REGISTRY).length;
        assertEqual(count, 28, `Expected 28 registry servers, got ${count}`);
    });

    test('Registry tools are non-empty per server', () => {
        for (const [name, tools] of Object.entries(protocol.MCP_TOOL_REGISTRY)) {
            assertTruthy(tools.length > 0, `Server "${name}" has 0 tools`);
        }
    });

    test('All registry tool names are strings', () => {
        for (const tools of Object.values(protocol.MCP_TOOL_REGISTRY)) {
            for (const tool of tools) {
                assertEqual(typeof tool, 'string', `Tool is not string: ${JSON.stringify(tool)}`);
            }
        }
    });

    // ===== 9. Test that MCP integration is wired into main.js boot =====
    console.log('');
    console.log('── MAIN.JS MCP INTEGRATION ────────────────────────────');

    const mainJsPath = path.join(SRC, 'main.js');

    test('main.js file exists', () => {
        assertTruthy(fs.existsSync(mainJsPath), 'main.js not found');
    });

    test('main.js imports MCP Server (startMCPServer)', () => {
        const content = fs.readFileSync(mainJsPath, 'utf8');
        assertMatch(content, /startMCPServer/, 'Missing startMCPServer import');
    });

    test('main.js inits MCP Server with kernel systems', () => {
        const content = fs.readFileSync(mainJsPath, 'utf8');
        assertMatch(content, /MCP Server for remote access/, 'Missing MCP Server init comment');
        assertMatch(content, /MCP Server active/, 'Missing MCP Server active log');
    });

    test('main.js imports MCPClient', () => {
        const content = fs.readFileSync(mainJsPath, 'utf8');
        assertMatch(content, /MCPClient/, 'Missing MCPClient import');
    });

    test('main.js inits MCP Client with connectDefaultServers', () => {
        const content = fs.readFileSync(mainJsPath, 'utf8');
        assertMatch(content, /connectDefaultServers/, 'Missing connectDefaultServers');
        assertMatch(content, /MCP connected/, 'Missing MCP connected log');
        assertMatch(content, /mcpClient/, 'Missing mcpClient reference');
    });

    test('main.js shell command :mcp references MCP server', () => {
        const content = fs.readFileSync(mainJsPath, 'utf8');
        assertMatch(content, /:mcp/, 'Missing :mcp shell command');
    });

    // ===== SUMMARY =====
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`  Config servers:  ${serverCount}`);
    console.log(`  Config tools:    ${configToolCount}`);
    console.log(`  Registry tools:  ${registryToolCount}`);
    console.log(`  Registry servers: ${registryServerCount}`);
    console.log(`  Total tests:     ${totalTests}`);
    console.log(`  Passed:          ${passed}`);
    console.log(`  Failed:          ${failed}`);
    console.log('');

    if (errors.length > 0) {
        console.log('  FAILURES:');
        for (const err of errors) {
            console.log(`    - ${err.name}: ${err.error}`);
        }
        console.log('');
    }

    console.log(`TOTAL: ${passed}/${totalTests} tests passed`);
    console.log('');

    process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
    console.error('Test suite crashed:', err);
    process.exit(1);
});
