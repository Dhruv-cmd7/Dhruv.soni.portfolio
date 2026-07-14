from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

with open(ROOT / 'scraped/home.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find("ALL WORK")
if pos != -1:
    print("Found ALL WORK at:", pos)
    # Print the parent elements
    # We can look up to 1000 characters before the anchor tag
    anchor_start = html.rfind("<a", 0, pos)
    if anchor_start != -1:
        print("Enclosing section HTML context:")
        print(html[max(0, anchor_start-1500):anchor_start])
