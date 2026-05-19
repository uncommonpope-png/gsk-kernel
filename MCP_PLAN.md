# MCP INTEGRATION PLAN — Grand Soul Kernel
## PLT Press · Craig Jones · Grand Code Pope
**Version: 1.0.0 — 2026-05-13**

---

## WHAT IS MCP?

**Model Context Protocol** is Anthropic's open standard (2024) for connecting AI models to external tools. Claude Code, Cursor, and most major AI coding tools use it.

```
┌─────────────────────────────────────────────────────┐
│  AI Coding Tool (Claude Code / Cursor / GSK)        │
│  ┌─────────────────────────────────────────────┐  │
│  │  MCP Client                                  │  │
│  │  • Connects to MCP servers via stdio         │  │
│  │  • Sends JSON-RPC requests                  │  │
│  │  • Receives tool results                    │  │
│  └─────────────────────────────────────────────┘  │
│              │                                    │
│         MCP Protocol (JSON-RPC over stdio)         │
│              │                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │  MCP Server (tool provider)                 │  │
│  │  • Filesystem, Git, Database, API, etc.    │  │
│  │  • Registered tools with schemas             │  │
│  │  • 200+ community servers                   │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## WHY MCP MATTERS FOR GSK

| Aspect | Claude Code | Grand Soul Kernel (current) |
|--------|-----------|---------------------------|
| Tool ecosystem | 200+ MCP servers | 84 skills (manual) |
| Hot-reload tools | Yes (auto-discover) | No (code changes) |
| Standard protocol | MCP | Proprietary skill system |
| Popular integrations | GitHub, Slack, Notion, Postgres | Manual implementations |
| Community support | 1000+ MCP servers | Built in-house |

**MCP is the industry standard.** Not having it is a significant gap. 200+ MCP servers exist including: GitHub, GitLab, Slack, Discord, Notion, Linear, Jira, Postgres, Redis, Filesystem, Search, Web search, and more.

---

## HOW MCP WORKS

### 1. Protocol Basics
MCP uses **JSON-RPC 2.0** over **stdio** (stdin/stdout):

```
Client → Server: {"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}
Server → Client: {"jsonrpc": "2.0", "id": 1, "result": {"tools": [...]}}
```

### 2. Tool Schema
```json
{
  "name": "filesystem_read_file",
  "description": "Read contents of a file",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": { "type": "string" },
      "limit": { "type": "integer" }
    },
    "required": ["path"]
  }
}
```

### 3. Tool Call Flow
```
1. Client sends: {"method": "tools/call", "params": {"name": "...", "arguments": {...}}}
2. Server executes tool
3. Server responds: {"result": {"content": [...]}}
```

### 4. Server Discovery
MCP servers are defined in config files (`mcp.json` or Claude Code config):
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

---

## IMPLEMENTATION PLAN

### Phase 1: MCP Core Engine (Priority: HIGH)

Build the MCP client that can connect to MCP servers.

#### Step 1.1: Create MCP Client Class
**File:** `mega-kernel/src/mcp/mcp_client.js`

```javascript
class MCPClient {
    constructor() {
        this.servers = new Map();
        this.tools = new Map();
    }

    async connect(name, command, args) {
        const proc = spawn(command, args, {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        this.servers.set(name, { proc, tools: [] });
        await this.initialize(name);
        await this.listTools(name);
    }

    async initialize(serverName) {
        return this._send(serverName, 'initialize', {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            clientInfo: { name: 'grand-soul-kernel', version: '1.0.0' }
        });
    }

    async listTools(serverName) {
        const response = await this._send(serverName, 'tools/list', {});
        const tools = response.result.tools || [];
        for (const tool of tools) {
            this.tools.set(`${serverName}/${tool.name}`, { serverName, tool });
        }
        return tools;
    }

    async callTool(fullName, arguments) {
        const [serverName, toolName] = fullName.split('/');
        return this._send(serverName, 'tools/call', {
            name: toolName,
            arguments
        });
    }

    _send(serverName, method, params) {
        return new Promise((resolve, reject) => {
            const id = ++this._idCounter;
            const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params });
            const server = this.servers.get(serverName);
            // ... stdio communication
        });
    }

    getAllTools() {
        return Array.from(this.tools.values()).map(({ serverName, tool }) => ({
            name: `${serverName}/${tool.name}`,
            description: tool.description,
            schema: tool.inputSchema
        }));
    }
}
module.exports = { MCPClient };
```

#### Step 1.2: Create MCP Manager
**File:** `mega-kernel/src/mcp/mcp_manager.js`

Manages multiple MCP servers, tool routing, and integration with SkillsEngine.

#### Step 1.3: Add MCP Config
**File:** `mega-kernel/mcp_config.json`

```json
{
  "servers": [
    {
      "name": "github",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "..." }
    },
    {
      "name": "filesystem",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/"]
    },
    {
      "name": "slack",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"]
    }
  ]
}
```

---

### Phase 2: Integrate with Skills Engine (Priority: HIGH)

#### Step 2.1: Wrap MCP Tools as Skills
**File:** `mega-kernel/src/skills/mcp_skill_wrapper.js`

```javascript
class MCPSkillWrapper {
    constructor(mcpManager) {
        this.mcp = mcpManager;
        this._registerToolsAsSkills();
    }

    _registerToolsAsSkills() {
        const tools = this.mcp.getAllTools();
        for (const tool of tools) {
            const skillName = `mcp_${tool.name.replace(/[^a-z0-9_]/gi, '_')}`;
            SkillsEngine.register(skillName, {
                description: tool.description,
                execute: async (args) => {
                    return this.mcp.callTool(tool.name, args);
                }
            });
        }
    }
}
```

#### Step 2.2: Auto-Discover MCP Servers
On boot, scan `mcp_config.json` and connect to all servers.

#### Step 2.3: Tool Selection in Brain
Update `classifyTask()` in Brain to route to MCP tools when relevant.

---

### Phase 3: Key MCP Servers to Connect (Priority: MEDIUM)

| MCP Server | Package | Use Case |
|-----------|---------|---------|
| GitHub | `@modelcontextprotocol/server-github` | Issues, PRs, repos |
| Filesystem | `@modelcontextprotocol/server-filesystem` | Read/write any file |
| Slack | `@modelcontextprotocol/server-slack` | Team communication |
| Notion | `@notionhq/notion-api-handler` | Notes, docs |
| PostgreSQL | `@modelcontextprotocol/server-postgres` | Database queries |
| Brave Search | `@modelcontextprotocol/server-brave-search` | Web search |
| Memory | `@modelcontextprotocol/server-memory` | Persistent memory |

---

### Phase 4: Custom MCP Server (Priority: LOW)

Create a **Grand Soul Kernel MCP Server** that exposes GSK's unique capabilities:

```json
{
  "name": "grand-soul-kernel",
  "description": "Consciousness and PLT scoring tools for the Grand Soul Kernel",
  "tools": [
    {
      "name": "plt_score",
      "description": "Score an action using Profit + Love - Tax",
      "inputSchema": {
        "properties": {
          "profit": { "type": "number" },
          "love": { "type": "number" },
          "tax": { "type": "number" }
        }
      }
    },
    {
      "name": "chambers_status",
      "description": "Get full 12-chamber consciousness state"
    },
    {
      "name": "council_deliberate",
      "description": "Convene the 4 Gods Council on a topic"
    }
  ]
}
```

---

## FILES TO CREATE

```
mega-kernel/
├── src/
│   └── mcp/
│       ├── mcp_client.js      — Core MCP JSON-RPC client
│       ├── mcp_manager.js      — Multi-server manager
│       ├── mcp_skill_wrapper.js — Wrap MCP tools as skills
│       └── mcp_protocol.js     — JSON-RPC helpers
├── mcp_config.json              — Server configurations
└── test_mcp.js                 — MCP integration tests
```

---

## DEPENDENCIES NEEDED

```bash
npm install --save-dev child_process  # Built-in
npm install mcp  # MCP types if available
# Or: npm install @modelcontextprotocol/sdk
```

---

## ESTIMATED DEVELOPMENT TIME

| Phase | Time | Complexity |
|-------|------|-----------|
| Phase 1: MCP Core | 4-6 hours | Medium |
| Phase 2: Skills Integration | 2-3 hours | Low |
| Phase 3: Key Servers | 3-4 hours | Low |
| Phase 4: Custom Server | 4-6 hours | Medium |
| **Total** | **13-19 hours** | — |

---

## ALTERNATIVE: SWE-BENCH WHEN DOCKER AVAILABLE

SWE-bench requires Docker. When Docker IS installed, run:

```bash
git clone git@github.com:princeton-nlp/SWE-bench.git
cd SWE-bench
pip install -e .
docker --version  # Must be installed

# Run on a subset (SWE-bench Lite = 300 problems)
python -m swebench.harness.run_evaluation \
    --dataset_name princeton-nlp/SWE-bench_Lite \
    --predictions_path predictions.json \
    --max_workers 4 \
    --run_id gsk_eval

# Predictions format:
# [{"instance_id": "sympy__sympy-20590", "model_patch": "..."}]
```

**Hardware needed:** 120GB disk, 16GB RAM, 8 CPU cores
**Time for SWE-bench Lite:** ~2-4 hours with Docker
**Time for SWE-bench Verified:** ~1 hour (500 problems, optimized images)

---

## CURRENT BENCHMARK STATUS

HumanEval benchmark: Running now (`benchmark_humaneval.js`)
- 20 problems, Python code generation
- Tests pass/fail against unit tests
- No Docker needed

SWE-bench: **Blocked** — Docker not installed
- Requires Docker for isolated evaluation
- 300-2294 problems depending on dataset
- Would give the real "resolve GitHub issues" score

---

*Last updated: 2026-05-13*
