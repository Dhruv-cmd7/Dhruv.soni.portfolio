with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

open_braces = css.count('{')
close_braces = css.count('}')
print("Open braces:", open_braces)
print("Close braces:", close_braces)
if open_braces != close_braces:
    print("WARNING: Braces do not match!")
else:
    print("Braces match perfectly.")
