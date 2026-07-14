with open('scraped/home.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find("ALL WORK")
if pos != -1:
    print("Found ALL WORK at:", pos)
    print(html[pos-300:pos+300])
