import os, json, sys

# AWS credentials
os.environ['AWS_ACCESS_KEY_ID'] = '_REDACTED_'
os.environ['AWS_SECRET_ACCESS_KEY'] = '_REDACTED_'
os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'

import boto3
from botocore.config import Config

print("Testing Bedrock...")

# Try with explicit config
config = Config(signature_version='v4', retries={'max_attempts': 3})

br = boto3.client('bedrock-runtime', region_name='us-east-1', config=config)

# List models first
try:
    resp = br.list_foundation_models()
    print("Models available:")
    for m in resp.get('modelSummaries', [])[:10]:
        print(f"  {m.get('modelId','?')} | {m.get('providerName','?')}")
except Exception as e:
    print(f"List models failed: {e}")
    # Try invoke directly
    print("\nTrying direct invoke...")
    try:
        body = json.dumps({
            'anthropic_version': 'vertex-2023-10-07',
            'max_tokens': 50,
            'messages': [{'role': 'user', 'content': 'What is 2+2? Answer one word.'}]
        }).encode()
        resp = br.invoke_model(
            modelId='anthropic.claude-3-haiku-20240307-v1:0',
            body=body,
            contentType='application/json'
        )
        result = json.loads(resp['body'].read())
        text = result.get('content', [{}])[0].get('text', 'ERR')
        print(f"Haiku response: {text}")
    except Exception as e2:
        print(f"Invoke failed: {e2}")
        # Try Nova Lite
        try:
            body = json.dumps({'messages': [{'role': 'user', 'content': 'What is 2+2?'}]}).encode()
            resp = br.invoke_model(
                modelId='amazon.nova-lite-v1:0',
                body=body,
                contentType='application/json'
            )
            print(f"Nova Lite: {resp['body'].read()[:200]}")
        except e3:
            print(f"Nova Lite failed: {e3}")