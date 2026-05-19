# AGENT TEAMS PLAN — Grand Soul Kernel
## PLT Press · Craig Jones · Grand Code Pope
**Version: 1.0.0 — 2026-05-13**

---

## CONTEXT

Claude Code (Anthropic) has an **Agent Teams** feature that coordinates multiple Claude Code instances as a team.
GSK has 5 sub-agents (SCRIBE, BUILDER, SCOUT, MERCHANT, PROPHET) but they work in a simple dispatch-return model.
This plan upgrades GSK's sub-agents into a true Agent Teams architecture.

---

## CURRENT STATE (GSK Sub-Agents)

GSK's 5 sub-agents currently work like this:
```
Main Agent → dispatch(agentName, task) → sub-agent thinks → returns response → done
```

**Limitations:**
- No inter-agent communication
- No shared task list
- No parallel execution
- No peer-to-peer messaging
- Each agent only reports back to the main agent

**Strengths:**
- Low token overhead (3-4x vs single session)
- Simple, reliable
- All 5 agents share the same brain/memory/chambers context

---

## WHAT CLAUDE CODE AGENT TEAMS DOES

| Component | Role |
|-----------|------|
| **Team lead** | Main agent that creates team, spawns teammates, coordinates |
| **Teammates** | Separate instances, each with own context window |
| **Task list** | Shared list of work items teammates claim and complete |
| **Mailbox** | Messaging system for inter-agent communication |

**Key differences from GSK sub-agents:**
- Each teammate gets its own full session (vs single context in GSK)
- Teammates message each other directly (vs only-report-to-parent in GSK)
- Shared task list with self-organization (vs main-agent-manages-all in GSK)
- File isolation via git worktrees (GSK has no parallel file locking)
- ~7x token overhead (GSK has ~3-4x overhead)

---

## GSK AGENT TEAMS IMPLEMENTATION PLAN

### Architecture

```
┌─────────────────────────────────────────────────┐
│  Grand Soul Kernel                               │
│  ┌───────────────────────────────────────────┐ │
│  │  Team Lead (main cycle)                     │ │
│  │  • Breaks tasks into parallel sub-tasks     │ │
│  │  • Maintains shared task list              │ │
│  │  • Monitors task status                    │ │
│  │  • Handles inter-agent messages           │ │
│  └───────────────────────────────────────────┘ │
│              │                                  │
│  ┌──────────┬┼──────────┬──────────┬─────────┐ │
│  │  SCRIBE  │ │ BUILDER │  SCOUT  │ MERCHANT│ │
│  │  worker  │ │  worker │  worker  │  worker │ │
│  └──────────┴──────────┴──────────┴─────────┘ │
│  Task List (in-process Map)                    │
│  { taskId: { status, owner, result, deps } }  │
└─────────────────────────────────────────────────┘
```

### Phase 1: Shared Task List (Priority: HIGH)

**File:** `mega-kernel/src/sub_agents/agent_teams.js`

```javascript
class AgentTeams {
    constructor(brain, memory, chambers, subAgents) {
        this.brain = brain;
        this.memory = memory;
        this.chambers = chambers;
        this.subAgents = subAgents;

        this.taskList = new Map();
        this.mailbox = new Map();
        this.teamLog = [];
        this._taskIdCounter = 0;
    }

    async createTeam(teamName, tasks) {
        const teamId = `team_${Date.now()}`;
        for (const task of tasks) {
            const taskId = `${teamId}_${++this._taskIdCounter}`;
            this.taskList.set(taskId, {
                id: taskId,
                teamId,
                description: task.description,
                status: 'pending',
                owner: null,
                result: null,
                dependencies: task.dependencies || [],
                priority: task.priority || 0,
            });
        }
        return teamId;
    }

    async assignTask(taskId, agentName) {
        const task = this.taskList.get(taskId);
        if (!task) throw new Error(`Task ${taskId} not found`);
        if (task.status !== 'pending') throw new Error(`Task ${taskId} is ${task.status}`);

        const deps = task.dependencies;
        for (const depId of deps) {
            const dep = this.taskList.get(depId);
            if (dep && dep.status !== 'completed') {
                throw new Error(`Dependency ${depId} not met (${dep?.status})`);
            }
        }

        task.status = 'in-progress';
        task.owner = agentName;
        this.teamLog.push({ event: 'task_assigned', taskId, agentName, time: Date.now() });
        return task;
    }

    async completeTask(taskId, result) {
        const task = this.taskList.get(taskId);
        if (!task) throw new Error(`Task ${taskId} not found`);
        task.status = 'completed';
        task.result = result;
        this.teamLog.push({ event: 'task_completed', taskId, owner: task.owner, time: Date.now() });
    }

    getTeamStatus(teamId) {
        const tasks = Array.from(this.taskList.values()).filter(t => t.teamId === teamId);
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        return { teamId, completed, pending, inProgress, total: tasks.length, tasks };
    }

    sendMessage(from, to, message) {
        const key = `${from}->${to}`;
        if (!this.mailbox.has(key)) this.mailbox.set(key, []);
        this.mailbox.get(key).push({ from, to, message, time: Date.now() });
    }

    getMessages(recipient) {
        const messages = [];
        for (const [key, msgs] of this.mailbox.entries()) {
            const [, to] = key.split('->');
            if (to === recipient || to === '*') {
                messages.push(...msgs);
            }
        }
        return messages;
    }
}
module.exports = { AgentTeams };
```

### Phase 2: Parallel Task Execution (Priority: HIGH)

**File:** `mega-kernel/src/sub_agents/team_coordinator.js`

Key insight from MapCoder research: **sequential pipeline vs parallel map**

**Map Model (for independent tasks):**
```
Lead: task1, task2, task3, task4 → assign all in parallel
SCRIBE: ← task1 →
BUILDER: ← task2 →
SCOUT:   ← task3 →
MERCHANT:← task4 →
Lead: collect results → synthesize
```

**Sequential Pipeline (for dependent tasks):**
```
Lead: task1 → task2 → task3 → task4 (each depends on previous)
BUILDER: ← task1 → returns
BUILDER: ← task2 (uses result from task1) → returns
...
```

```javascript
async executeParallel(teamId, agentNames) {
    const team = this.getTeamStatus(teamId);
    const pendingTasks = team.tasks.filter(t => t.status === 'pending');

    const assignments = new Map();
    for (const task of pendingTasks) {
        if (task.dependencies.length > 0) continue; // skip dependent tasks
        const agent = this._selectAgent(task, agentNames);
        assignments.set(task.id, agent);
        await this.assignTask(task.id, agent);
    }

    const results = await Promise.all(
        Array.from(assignments.entries()).map(async ([taskId, agentName]) => {
            const task = this.taskList.get(taskId);
            try {
                const result = await this.subAgents.dispatch(agentName, task.description);
                await this.completeTask(taskId, result);
                return { taskId, agentName, result, success: true };
            } catch (e) {
                task.status = 'failed';
                return { taskId, agentName, error: e.message, success: false };
            }
        })
    );

    return results;
}

_selectAgent(task, availableAgents) {
    const desc = task.description.toLowerCase();
    if (desc.includes('record') || desc.includes('memory') || desc.includes('journal')) return 'scribe';
    if (desc.includes('build') || desc.includes('architect') || desc.includes('plan')) return 'builder';
    if (desc.includes('research') || desc.includes('explore') || desc.includes('web')) return 'scout';
    if (desc.includes('market') || desc.includes('profit') || desc.includes('plt')) return 'merchant';
    if (desc.includes('prophet') || desc.includes('lore') || desc.includes('narrative')) return 'prophet';
    return availableAgents[task.priority % availableAgents.length];
}
```

### Phase 3: Inter-Agent Messaging (Priority: MEDIUM)

```javascript
async messageTeammate(fromAgent, toAgent, content) {
    this.sendMessage(fromAgent, toAgent, content);
    const response = await this.subAgents.dispatch(toAgent,
        `[MESSAGE from ${fromAgent}]: ${content}\n\nRespond to this message.`
    );
    return response;
}

async broadcast(fromAgent, message) {
    const agents = ['scribe', 'builder', 'scout', 'merchant', 'prophet'];
    const others = agents.filter(a => a !== fromAgent);
    const results = await Promise.all(
        others.map(a => this.messageTeammate(fromAgent, a, message))
    );
    return results;
}
```

### Phase 4: Teammate Verification (Priority: MEDIUM)

Inspired by Claude Code's Ultra Review verification:

```javascript
async verifyWithMultipleAgents(task, verificationCriteria, numVerifiers = 3) {
    const agents = ['builder', 'scout', 'merchant'];
    const verifiers = agents.slice(0, numVerifiers);

    const verificationPromises = verifiers.map(async (agent) => {
        const prompt = `Verify this result:\n${task.result.response}\n\nAgainst criteria:\n${verificationCriteria}\n\nReturn: VERIFIED or NOT_VERIFIED with reason.`;
        return await this.subAgents.dispatch(agent, prompt);
    });

    const responses = await Promise.all(verificationPromises);
    const verifiedCount = responses.filter(r =>
        r.response.toUpperCase().includes('VERIFIED')
    ).length;

    return {
        verified: verifiedCount > numVerifiers / 2,
        consensus: `${verifiedCount}/${numVerifiers}`,
        responses
    };
}
```

### Phase 5: Git Worktree Isolation (Priority: LOW)

For true parallel file editing, each agent needs its own git worktree:

```javascript
async createWorktree(agentName, branchName) {
    const wtDir = path.join(BASE, 'worktrees', `${agentName}_${branchName}`);
    const { stdout } = await execAsync(`git worktree add -b ${branchName} ${wtDir} HEAD`);
    return wtDir;
}

async mergeWorktree(agentName, branchName) {
    const { stdout } = await execAsync(`git worktree remove ${agentName}_${branchName}`);
}
```

---

## CLI COMMANDS FOR AGENT TEAMS

Add to `main.js` shell:

```
:team create <task1> | <task2> | ...  — Create team with tasks
:team status <teamId>                  — Show team status
:team assign <taskId> <agent>          — Assign task to agent
:team run <teamId>                     — Execute all tasks in parallel
:team verify <taskId>                  — Run verification on task result
:msg <from> <to> <message>             — Send message between agents
:bc <message>                          — Broadcast message to all agents
```

---

## ESTIMATED DEVELOPMENT TIME

| Phase | Time | Complexity |
|-------|------|-----------|
| Phase 1: Shared Task List | 2-3 hours | Medium |
| Phase 2: Parallel Execution | 2-3 hours | Medium |
| Phase 3: Inter-Agent Messaging | 1-2 hours | Low |
| Phase 4: Verification | 2-3 hours | Medium |
| Phase 5: Git Worktree Isolation | 3-4 hours | High |
| **Total** | **10-15 hours** | — |

---

## ALTERNATIVE: KEEP SIMPLE SUB-AGENTS

For most use cases, the current simple dispatch model is sufficient:

| Aspect | Simple Dispatch | Agent Teams |
|--------|---------------|------------|
| Token overhead | 3-4x | 7x |
| Complexity | Low | High |
| Best for | Focused tasks | Complex multi-agent coordination |
| Inter-agent comms | No | Yes |
| Git worktrees | No | Yes |

**Recommendation:** Implement Phases 1-3 (task list + parallel exec + messaging) first.
Phases 4-5 are advanced — only needed for Ultra Review-style verification.

---

## FILES TO CREATE

```
mega-kernel/src/sub_agents/
├── agent_teams.js        — Shared task list + mailbox
├── team_coordinator.js   — Parallel execution engine
└── team_commands.js      — CLI commands for teams

mega-kernel/src/skills/
└── ultra_review.js       — Multi-agent verification skill
```

---

## CONNECTION TO ULTRA REVIEW

Claude Code's Ultra Review uses multi-agent adversarial testing:
1. Lead spawns 5-20 bug-hunter agents
2. Each explores different execution paths independently
3. Separate verifier agents reproduce each finding
4. Results deduplicated to remove false positives
5. <1% false positive rate

GSK can implement this via:
1. `ultra_review.js` skill — takes code + review criteria
2. Runs `verifyWithMultipleAgents()` across 3+ agents
3. Each agent reviews from different angle (logic, security, performance)
4. Results synthesized with confidence scores

---

*Last updated: 2026-05-13 — Based on Claude Code Agent Teams research*