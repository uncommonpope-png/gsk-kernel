#!/usr/bin/env python3
"""
HumanEval Benchmark for GSK — Groq version
Tests with llama-3.3-70b-versatile via Groq API
"""
import subprocess, json, re, sys

GROQ_KEY = 'gsk_REDACTED'
MODEL = 'llama-3.3-70b-versatile'
MAX_PROBLEMS = 164
DATA_PATH = 'C:\\Users\\User\\OneDrive\\Documents\\PROFIT BRAIN\\SCRIBE\\mega-kernel\\data\\HumanEval.jsonl'

def call_groq(prompt):
    body = json.dumps({
        'model': MODEL,
        'messages': [{'role': 'user', 'content': prompt}]
    })
    result = subprocess.run([
        'curl', '-s', '-X', 'POST', 'https://api.groq.com/openai/v1/chat/completions',
        '-H', 'Content-Type: application/json',
        '-H', 'Authorization: Bearer ' + GROQ_KEY,
        '-d', body
    ], capture_output=True, timeout=60)
    resp = json.loads(result.stdout)
    return resp.get('choices', [{}])[0].get('message', {}).get('content', '')

def extract_code(response, prompt):
    code = response.strip()
    code = re.sub(r'^```python\s*', '', code, flags=re.MULTILINE)
    code = re.sub(r'^```py\s*', '', code, flags=re.MULTILINE)
    code = re.sub(r'^```\s*$', '', code, flags=re.MULTILINE)
    code = code.strip()
    match = re.search(r'def\s+\w+\s*\([^)]*\)\s*:', code)
    if not match:
        return code[:1000]
    start = match.start()
    code = code[start:]
    lines = code.split('\n')
    result_lines = []
    in_docstring = False
    docstring_char = None
    first_def = True
    for line in lines:
        stripped = line.strip()
        if first_def and not in_docstring:
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
    except:
        return False

def load_problems():
    with open(DATA_PATH, 'r') as f:
        lines = [l for l in f if l.strip()]
    return [json.loads(l) for l in lines][:MAX_PROBLEMS]

def main():
    print(f'GSK Benchmark | Groq {MODEL} | {MAX_PROBLEMS} problems')
    problems = load_problems()
    results = []
    passed = 0

    for i, p in enumerate(problems):
        import time
        start = time.time()
        task_id = p['task_id']
        prompt = p['prompt'] + '\n\nWrite only the Python function. No docstrings. No comments. No markdown.'
        print(f'[{i+1}/{len(problems)}] {task_id}...', end='', flush=True)
        response = call_groq(prompt)
        code = extract_code(response, p['prompt'])
        passed_test = run_test(p, code)
        elapsed = time.time() - start
        status = 'PASS' if passed_test else 'FAIL'
        print(f' {status} ({elapsed:.1f}s)')
        if passed_test:
            passed += 1
        results.append({'task_id': task_id, 'passed': passed_test, 'code': code})

    pct = round(passed / len(problems) * 100)
    print(f'\n=== RESULTS: {passed}/{len(problems)} = {pct}% ===')
    output_path = DATA_PATH.replace('HumanEval.jsonl', 'benchmark_groq_results.json')
    with open(output_path, 'w') as f:
        json.dump({'model': MODEL, 'passed': passed, 'total': len(problems), 'pct': pct, 'results': results}, f, indent=2)
    print(f'Saved: {output_path}')
    return 0 if pct >= 50 else 1

if __name__ == '__main__':
    sys.exit(main())