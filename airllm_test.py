import sys, time
print(f"Python {sys.version}")
try:
    from airllm import AutoModel
    print("AirLLM import OK")
    print(f"AirLLM version: {getattr(AutoModel, '__version__', 'unknown')}")
except Exception as e:
    print(f"Import error: {e}")
    sys.exit(1)
