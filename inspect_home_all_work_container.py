with open('scraped/home.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find("ALL WORK")
if pos != -1:
    print("Found ALL WORK at:", pos)
    # Let's go backwards to find the nearest anchor tag start
    anchor_start = html.rfind("<a", 0, pos)
    anchor_end = html.find("</a>", pos)
    if anchor_start != -1 and anchor_end != -1:
        print("Anchor content:")
        print(html[anchor_start:anchor_end+4])
