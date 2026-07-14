from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

with open(ROOT / 'scraped/home.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for the header element or class name "framer-header" or similar.
# We can search for the "Menu" text and print its parent elements.
pos = html.find("Menu")
if pos != -1:
    print("Found Menu at:", pos)
    print(html[pos-1000:pos+1000])
