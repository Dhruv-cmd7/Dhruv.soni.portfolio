with open('scraped/home.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for "framer-styles-preset-f08mbp" or search for "Close" to find the menu overlay class names
pos = html.find("Close")
if pos != -1:
    print("Found 'Close' at:", pos)
    print(html[pos-1000:pos+1000])
