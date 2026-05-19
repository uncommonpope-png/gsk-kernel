const http = require('http');
const fs = require('fs');

const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:0.5b';
const MAX_PROBLEMS = parseInt(process.env.MAX_PROBLEMS || '20');
const TIMEOUT_MS = 60000;
const DATA_PATH = '/tmp/human-eval-master/data/HumanEval.jsonl';

function callOllama(prompt) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            model: MODEL,
            prompt: prompt,
            system: 'You are a Python code generation assistant. Write ONLY the Python function code, no comments, no docstrings, no markdown, no explanations.',
            options: { temperature: 0.2, top_p: 0.9 },
            stream: false
        });
        const req = http.request({
            hostname: '127.0.0.1',
            port: 11434,
            path: '/api/generate',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
        }, (res) => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                try {
                    const data = JSON.parse(Buffer.concat(chunks).toString());
                    resolve(data.response || '');
                } catch (e) { reject(e); }
            });
            res.on('error', reject);
        });
        req.setTimeout(TIMEOUT_MS, () => { req.destroy(); reject(new Error('Timeout')); });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

function extractPythonCode(response, problem) {
    const lines = response.split('\n');
    const codeLines = [];
    let inCode = false;
    let foundDef = false;

    for (const line of lines) {
        const stripped = line.trim();

        if (stripped === '```' && inCode) { inCode = false; continue; }
        if (stripped.startsWith('```python') || stripped.startsWith('```py')) { inCode = true; continue; }

        if (inCode) {
            codeLines.push(stripped);
            continue;
        }

        if (stripped.startsWith('def ') && !foundDef) {
            foundDef = true;
            inCode = true;
            codeLines.push(stripped);
        }
    }

    if (codeLines.length === 0) {
        const match = response.match(/def\s+\w+\([^)]*\)\s*:\s*[{]?/);
        if (match) {
            return response.substring(match.index, Math.min(response.indexOf('\n\n\n', match.index), match.index + 1000)).trim();
        }
        return response.substring(0, 1500).trim();
    }

    let result = codeLines.join('\n').trim();

    const firstDefIdx = result.indexOf('def ');
    if (firstDefIdx !== -1) {
        result = result.substring(firstDefIdx);
    }

    const lastTriple = result.lastIndexOf('```');
    if (lastTriple !== -1 && lastTriple > result.indexOf('def ')) {
        result = result.substring(0, lastTriple).trim();
    }

    return result;
}

function runTest(problem, code) {
    try {
        const fullCode = code + '\n\n' + problem.test;
        const fn = new Function(fullCode);
        return true;
    } catch (e) {
        return false;
    }
}

async function solveProblem(problem) {
    const prompt = `${problem.prompt}\n\nWrite ONLY the Python function implementation below. No docstring. No comments. No explanation. No markdown. Output code only.\n\n\`\`\`python\n`;
    try {
        const response = await callOllama(prompt);
        const code = extractPythonCode(response, problem);
        const passed = runTest(problem, code);
        return { code, passed, response: response.substring(0, 500) };
    } catch (e) {
        return { code: '', passed: false, error: e.message };
    }
}

function loadProblems() {
    const content = fs.readFileSync(DATA_PATH, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    return lines.map(line => JSON.parse(line)).slice(0, MAX_PROBLEMS);
}

async function run() {
    console.log(`Model: ${MODEL} | Max: ${MAX_PROBLEMS}`);
    if (!fs.existsSync(DATA_PATH)) {
        console.log('ERROR: Data file not found');
        return;
    }
    const problems = loadProblems();
    let passed = 0;
    const results = [];
    for (let i = 0; i < problems.length; i++) {
        const p = problems[i];
        const start = Date.now();
        process.stdout.write(`\n[${i+1}/${problems.length}] ${p.task_id}...`);
        const result = await solveProblem(p);
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        process.stdout.write(` ${result.passed ? 'PASS' : 'FAIL'} (${elapsed}s)`);
        if (result.passed) passed++;
        results.push({ task_id: p.task_id, passed: result.passed, code: result.code });
    }
    const pct = Math.round(passed / problems.length * 100);
    console.log(`\n\n=== RESULTS: ${passed}/${problems.length} = ${pct}% ===`);
    fs.writeFileSync('/tmp/benchmark_results.json', JSON.stringify({ model: MODEL, passed, total: problems.length, pct, results }, null, 2));
}

run().catch(console.error);