from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

with open(ROOT / 'assets/css/style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'menu-toggle-btn' in line:
        print(f"Line {idx+1}: {line.strip()}")
