with open('scraped/home.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for Menu in the file and print its context
pos = 0
while True:
    pos = html.find("Menu", pos)
    if pos == -1:
        break
    print(f"Match found at position {pos}:")
    print(html[max(0, pos-100):pos+100])
    print("-" * 50)
    pos += len("Menu")
