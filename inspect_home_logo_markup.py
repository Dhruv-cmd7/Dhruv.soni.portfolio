with open('scraped/home.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for Jacob Schneider inside the first 25000 chars of HTML
pos = 0
while True:
    pos = html.find("Jacob Schneider", pos)
    if pos == -1:
        break
    print(f"Match found at position {pos}:")
    print(html[max(0, pos-150):pos+150])
    print("-" * 50)
    pos += len("Jacob Schneider")
