import json, sys

path = r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\.system_generated\logs\transcript_full.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            step = data.get('step_index')
            content = data.get('content', '')
            sys.stdout.buffer.write(f"=== STEP {step} ===\n".encode('utf-8'))
            sys.stdout.buffer.write(content.encode('utf-8') + b'\n')
            sys.stdout.buffer.write(b'-'*50 + b'\n')
