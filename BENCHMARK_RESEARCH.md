# GSK Benchmark Research Report
## Goal: Beat Claude Code (SWE-bench 80.9%)

---

## Executive Summary

**Recommended Approach:** Implement a MapCoder-style multi-agent pipeline within GSK, targeting HumanEval first (easiest path to measurable score), then SWE-bench Lite.

| Benchmark | Difficulty | Hardware | Time to First Score |
|-----------|------------|----------|---------------------|
| HumanEval | Easy | 8GB RAM | 1-2 days |
| SWE-bench Lite | Medium | Docker required | 1-2 weeks |
| SWE-bench Verified | Hard | 120GB storage | Not feasible on current PC |

---

## 1. Option Analysis

### 1.1 mini-swe-agent (RECOMMENDED FOR DIRECT USE)

**What it is:** 100 lines of Python, scores 74% on SWE-bench Verified
**Stars:** 4.3k
**Architecture:** Minimal agent using only bash + litellm

**Pros:**
- Works with ANY model via litellm (including Ollama)
- 74% with Gemini 3 Pro - impressive for simple architecture
- Very fast startup, simple to debug
- Supports local environments, docker, podman

**Cons:**
- Requires Python environment on Windows
- Uses subprocess.run (stateless) - different from GSK's cycle engine

**Ollama Connection:**
```yaml
model:
  model_name: "ollama/llama3.3"
  model_kwargs:
    custom_llm_provider: "openai"
    api_base: "http://localhost:11434/v1"
  cost_tracking: "ignore_errors"
```

**Verdict:** Use as reference implementation or optional add-on, NOT as GSK's core.

---

### 1.2 SWE-agent

**What it is:** Full-featured agent with Agent-Computer Interface (ACI)
**Stars:** 19.2k (NeurIPS 2024)

**Pros:**
- Custom tools: file viewer, linter, string search
- Trajectory browser for debugging
- State-of-the-art on SWE-bench (before mini-swe-agent)

**Cons:**
- Much more complex than mini-swe-agent
- Same Docker requirements as SWE-bench

**Verdict:** Too complex. mini-swe-agent is now recommended over SWE-agent per their own docs.

---

### 1.3 SWE-bench

**Hardware Requirements (per official docs):**
- 120GB free storage
- 16GB RAM
- 8 CPU cores
- Docker Desktop

**⚠️ BLOCKER:** Your current Windows PC likely doesn't have 120GB available Docker space.

**Variants:**
- **SWE-bench Full:** 2,294 problems
- **SWE-bench Lite:** ~100 problems (lighter)
- **SWE-bench Verified:** 500 human-curated problems (standard benchmark)

**Verdict:** Not feasible on current hardware. Can run SWE-bench Lite via sb-cli cloud evaluation.

---

### 1.4 Claude Code 80.9% Breakdown

**What 80.9% actually means:**
- SWE-bench Verified (500 problems)
- Real GitHub issues from Django, Flask, scikit-learn
- Model must: understand issue → navigate codebase → write patch → pass tests

**Why GSK can't match this yet:**
1. **Model quality gap:** Ollama models (llama3.3, qwen2.5-coder) are weaker than Claude Opus 4.6
2. **Agent scaffold:** Claude Code has custom tools + iteration loop
3. **Evaluation requires Docker:** Can't run locally

**What GSK WOULD need:**
- SOTA model (not available in Ollama yet)
- Agent scaffold with file search, code editing, test running
- Docker for evaluation

---

### 1.5 MapCoder (93.9% on HumanEval) — MOST RELEVANT FOR GSK

**Architecture:** 4 LLM agents in sequence:
1. **Retrieval Agent** — Finds relevant code examples from training data
2. **Plan Agent** — Creates implementation plan
3. **Code Agent** — Writes the code
4. **Debug Agent** — Tests and fixes errors

**Key insight:** This is EXACTLY what GSK's 12-chamber architecture could implement!

**Results with GPT-4:**
- HumanEval: 93.9%
- MBPP: 83.1%
- APPS: 22.0%
- CodeContests: 28.5%

**Why it works:** Multi-agent pipeline mirrors human development cycle.

**Verdict:** GSK should implement MapCoder-style pipeline using its existing sub-agents (SCRIBE, BUILDER, SCOUT, MERCHANT, PROPHET).

---

### 1.6 AgentCoder (77.4% on HumanEval-ET)

**Architecture:** 3 agents:
1. **Programmer** — Generates code
2. **Test Designer** — Creates test cases
3. **Test Executor** — Runs tests

**Simpler than MapCoder** — could be GSK's MVP approach.

---

## 2. Recommended Path Forward

### Phase 1: HumanEval (Week 1-2)

**Why:** Easiest to run, measurable immediately, existing benchmark in GSK

**Current state:** GSK has `benchmark_humaneval.js` but URL is broken

**Steps:**
1. Fix HumanEval dataset download (use HuggingFace)
2. Implement MapCoder-style 3-agent pipeline:
   - Plan (using Scribe or Builder)
   - Code (Builder)
   - Debug (using existing error-handling skills)
3. Run benchmark, get first score

**Realistic targets:**
- With llama3.3: 30-40% pass@1
- With qwen2.5-coder: 40-50%
- With better Ollama model: 50-60%

**Timeline:** 1-2 weeks to first score

---

### Phase 2: SWE-bench Lite via sb-cli (Week 3-6)

**Why:** Real bug-fixing benchmark, cloud evaluation available

**Steps:**
1. Sign up for sb-cli (SWE-bench cloud evaluation)
2. Generate patches for 100 SWE-bench Lite problems
3. Submit to cloud evaluation

**Realistic targets:**
- With current Ollama models: 10-20%
- With fine-tuned model: 20-30%

---

### Phase 3: Full SWE-bench Verified (if hardware permits)

Requires: More storage, possibly cloud evaluation

---

## 3. Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `benchmark_runner.js` | Unified benchmark runner for HumanEval |
| `mapcoder_pipeline.js` | Multi-agent code generation pipeline |
| `swebench_client.js` | Client for sb-cli cloud evaluation |
| `ollama_model_registry.json` | Model cost tracking for litellm |

### Modify Existing Files

| File | Change |
|------|--------|
| `src/brain/router.js` | Add MapCoder-style prompts |
| `src/sub_agents/builder.js` | Add code generation with test execution |
| `src/skills/coder.js` | Add code debugging loop |
| `benchmark_humaneval.js` | Fix dataset download |

---

## 4. Implementation Plan

### Week 1: Fix HumanEval Benchmark

```bash
# Download HumanEval from HuggingFace
# Create benchmark_runner.js
cd "C:\Users\User\OneDrive\Documents\PROFIT BRAIN\SCRIBE\mega-kernel"
node benchmark_humaneval.js
```

### Week 2: Implement 3-Agent Pipeline

**Architecture:**
```
User Request → Scribe (Plan) → Builder (Code) → Debug → Output
                ↓
            SCOUT (Search for similar code)
```

**Key integration points:**
- BrainRouter routes to appropriate sub-agent
- Skills handle specific functions (file editing, test running)
- Memory tracks iteration count

### Week 3-4: Run First Benchmarks

- Run HumanEval with different Ollama models
- Document scores
- Compare against baselines

---

## 5. Realistic Score Targets

### With Current Ollama Models (llama3.3, qwen2.5-coder:7b)

| Benchmark | 6 Months | 12 Months |
|-----------|----------|-----------|
| HumanEval | 40-50% | 60-70% |
| SWE-bench Lite | 15-25% | 30-40% |
| SWE-bench Verified | N/A | 20-30% |

### What Would Beat Claude Code (80.9%)

**Requirements:**
1. Access to Claude Opus 4.6 or GPT-5 class model (not available in Ollama)
2. Custom agent scaffold (file search, code edit, test run)
3. Multi-agent pipeline (MapCoder-style)
4. Hardware upgrade (120GB storage for Docker)

**Honest assessment:** Cannot beat 80.9% in 12 months with Ollama only.

**Alternative:** Focus on being BEST LOCAL AGENT with measurable score.

---

## 6. Tools & Packages Needed

### Python (required for mini-swe-agent reference)
```
pip install mini-swe-agent
pip install litellm
pip install ollama
```

### Node.js (for GSK integration)
```
# Already in project
npm install ollama
```

### Cloud Evaluation
- Register at https://github.com/swe-bench/sb-cli
- Submit patches for cloud evaluation

---

## 7. Key Connections

### Connect Ollama to mini-swe-agent
```bash
# Set environment
export OLLAMA_API_BASE="http://localhost:11434/v1"
export MSWEA_MODEL_NAME="ollama/llama3.3"
export MSWEA_COST_TRACKING="ignore_errors"

# Run mini-swe-agent
mini --model ollama/llama3.3 "Fix the bug in src/main.py"
```

### Connect GSK to HumanEval
```javascript
// In benchmark_runner.js
const ollama = require('ollama');
const response = await ollama.chat({
  model: 'llama3.3',
  messages: [{role: 'user', content: prompt}]
});
```

---

## 8. Conclusion

**Recommended approach:**

1. **Immediate:** Fix HumanEval benchmark, run with current Ollama models
2. **Short-term:** Implement MapCoder-style 3-agent pipeline using GSK's sub-agents
3. **Medium-term:** Submit to SWE-bench Lite via sb-cli

**First milestone:** Get ANY score on HumanEval (even 20% proves the system works)

**Key blocker:** Need to upgrade hardware for SWE-bench (or use cloud evaluation)

---

## References

- mini-swe-agent: https://github.com/SWE-agent/mini-swe-agent
- SWE-bench: https://github.com/princeton-nlp/SWE-bench
- MapCoder: https://github.com/Md-Ashraful-Pramanik/MapCoder
- sb-cli: https://github.com/swe-bench/sb-cli
- SWE-bench Leaderboard: https://awesomeagents.ai/leaderboards/swe-bench-coding-agent-leaderboard/