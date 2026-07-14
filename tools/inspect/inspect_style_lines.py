from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

with open(ROOT / 'assets/css/style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx in range(109, 140):
    if idx < len(lines):
        print(f"Line {idx+1}: {repr(lines[idx])}")
