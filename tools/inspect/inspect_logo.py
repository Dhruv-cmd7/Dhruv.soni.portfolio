from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]

with open(ROOT / 'scraped/home.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for text starting with J or Jacob or any anchor inside navigation
# We can find all hrefs containing home or index, or just anchors near the beginning
logo_matches = re.findall(r'<a[^>]*>(.*?)</a>', html, re.DOTALL)
print("Anchor tags found in home.html:")
for a in logo_matches[:15]:
    clean_a = re.sub(r'<[^>]+>', '', a).strip()
    if clean_a:
        print(f"- Text: {clean_a}")
