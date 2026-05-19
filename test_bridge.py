"""Quick test for local_model_bridge.py — loads a tiny model and generates"""
import sys, json, subprocess, time

script = r"src\brain\local_model_bridge.py"
proc = subprocess.Popen(
    ["python", script],
    stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    text=True, env={"LOCAL_MODEL": "Qwen/Qwen2.5-0.5B-Instruct", "PYTHONUNBUFFERED": "1"}
)

def read_line():
    while True:
        line = proc.stdout.readline()
        if line:
            return line.strip()

# Wait for ready
t0 = time.time()
while time.time() - t0 < 180:
    line = read_line()
    if not line:
        continue
    try:
        msg = json.loads(line)
        if msg.get("status") == "ready":
            print(f"Ready! Backend: {msg.get('backend')}, Model: {msg.get('model')} ({time.time()-t0:.0f}s)")
            break
    except:
        pass
else:
    print("Timeout waiting for model to load")
    proc.kill()
    sys.exit(1)

# Send test prompt
req = json.dumps({"prompt": "What is 2+2?", "max_tokens": 50, "temperature": 0.1})
proc.stdin.write(req + "\n")
proc.stdin.flush()

line = read_line()
try:
    resp = json.loads(line)
    print(f"Response: {resp.get('response', 'N/A')[:200]}")
except:
    print(f"Raw: {line}")

proc.kill()
