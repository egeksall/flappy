import json

path = r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\.system_generated\logs\transcript.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        idx = obj.get('step_index', 0)
        if idx >= 261:
            t = obj.get('type')
            tc = [c.get('name') for c in obj.get('tool_calls', [])]
            content = obj.get('content', '')
            if content and len(content) > 100:
                content = content[:100] + '...'
            print(f"Step {idx}: {t} | tools: {tc} | content: {repr(content)}")
