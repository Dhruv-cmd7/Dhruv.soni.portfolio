import os
import re

files = ["index.html", "about.html", "contact.html", "services.html", "work.html"]

def search_keyword(keyword):
    print(f"=== Searching for '{keyword}' ===")
    for filename in files:
        if not os.path.exists(filename):
            continue
        try:
            with open(filename, "r", encoding="utf-8") as f:
                content = f.read()
            lines = content.splitlines()
            for idx, line in enumerate(lines):
                if re.search(keyword, line, re.IGNORECASE):
                    print(f"{filename}:{idx+1}: {line.strip()[:150]}")
        except Exception as e:
            print(f"Error reading {filename}: {e}")

search_keyword("video")
search_keyword("about")
search_keyword("portfolio")
