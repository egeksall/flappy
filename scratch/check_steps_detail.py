import json, sys

path = r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\.system_generated\logs\transcript_full.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        idx = obj.get('step_index', 0)
        if 268 <= idx <= 288:
            t = obj.get('type')
            tc = obj.get('tool_calls', [])
            content = obj.get('content', '')
            out = f"=== STEP {idx} ({t}) ===\n"
            if tc:
                out += f"Tool Calls: {json.dumps(tc, indent=2)}\n"
            if content:
                out += f"Content: {content[:300]}\n"
            sys.stdout.buffer.write(out.encode('utf-8'))
