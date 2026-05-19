#!/usr/bin/env python3
import subprocess, json, re

MODEL = 'qwen2.5:0.5b'
MAX_PROBLEMS = 20
DATA_PATH = '/tmp/human-eval-master/data/HumanEval.jsonl'
OLLAMA_URL = 'http://127.0.0.1:11434'

def call_ollama(prompt, model=MODEL):
    payload = {
        'model': model,
        'prompt': prompt,
        'stream': False,
        'options': {'temperature': 0.2, 'top_p': 0.9}
    }
    data = json.dumps(payload).encode()
    result = subprocess.run([
        'curl', '-s', '-X', 'POST', f'{OLLAMA_URL}/api/generate',
        '-H', 'Content-Type: application/json',
        '-d', data
    ], capture_output=True)
    resp = json.loads(result.stdout)
    return resp.get('response', '')

def extract_code(response, problem_prompt):
    code = response.strip()

    # Remove markdown code blocks
    code = re.sub(r'^```python\s*', '', code, flags=re.MULTILINE)
    code = re.sub(r'^```py\s*', '', code, flags=re.MULTILINE)
    code = re.sub(r'^```\s*$', '', code, flags=re.MULTILINE)
    code = code.strip()

    # Find function definition
    match = re.search(r'def\s+\w+\s*\([^)]*\)\s*:', code)
    if not match:
        # Return first 1000 chars as fallback
        return code[:1000]

    start = match.start()
    code = code[start:]

    # Find the matching closing brace/deindent for the function
    lines = code.split('\n')
    result_lines = []
    in_docstring = False
    docstring_char = None
    first_def = True

    for line in lines:
        stripped = line.strip()

        # Handle docstring detection
        if first_def and not in_docstring:
            # Check if we're starting a docstring (triple quotes after def)
            m = re.search(r'def\s+\w+\s*\([^)]*\)\s*:\s*["\']{3}', line)
            if m:
                in_docstring = True
                docstring_char = line[m.start():m.end()][-3:]
                result_lines.append(line)
                continue

        if in_docstring:
            if stripped.endswith(docstring_char):
                in_docstring = False
            result_lines.append(line)
            continue

        # Skip comments and >>> examples
        if stripped.startswith('#') or stripped.startswith('>>>'):
            continue

        result_lines.append(line)

        if first_def and stripped.startswith('def '):
            first_def = False

    return '\n'.join(result_lines).strip()

def run_test(problem, code):
    full_code = code + '\n\n' + problem['test']
    try:
        compiled = compile(full_code, '<test>', 'exec')
        namespace = {}
        exec(compiled, namespace)
        return True
    except Exception as e:
        return False

def solve_problem(problem):
    prompt = f"{problem['prompt']}\n\nWrite only the Python function implementation. No docstring. No comments. No markdown. Code only.\n"
    response = call_ollama(prompt)
    code = extract_code(response, problem['prompt'])
    passed = run_test(problem, code)
    return {'code': code, 'passed': passed}

def load_problems():
    with open(DATA_PATH) as f:
        lines = [l for l in f if l.strip()]
    return [json.loads(l) for l in lines][:MAX_PROBLEMS]

def main():
    print(f'Model: {MODEL} | Max: {MAX_PROBLEMS}')
    problems = load_problems()
    results = []
    passed = 0

    for i, p in enumerate(problems):
        import time
        start = time.time()
        task_id = p['task_id']
        print(f'\n[{i+1}/{len(problems)}] {task_id}...', end='', flush=True)
        result = solve_problem(p)
        elapsed = time.time() - start
        status = 'PASS' if result['passed'] else 'FAIL'
        print(f' {status} ({elapsed:.1f}s)')
        if result['passed']:
            passed += 1
        results.append({'task_id': task_id, 'passed': result['passed'], 'code': result['code']})

    pct = round(passed / len(problems) * 100)
    print(f'\n=== RESULTS: {passed}/{len(problems)} = {pct}% ===')
    with open('/tmp/benchmark_results.json', 'w') as f:
        json.dump({'model': MODEL, 'passed': passed, 'total': len(problems), 'pct': pct, 'results': results}, f, indent=2)

if __name__ == '__main__':
    main()