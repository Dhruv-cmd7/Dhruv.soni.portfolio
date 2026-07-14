from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]

with open(ROOT / 'index.html', 'r', encoding='utf-8') as f:
    html = f.read()
matches = re.findall(r'<button[^>]*>.*?</button>', html, re.DOTALL)
for m in matches:
    print(m)
