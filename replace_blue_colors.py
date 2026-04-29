from pathlib import Path

root = Path(r"c:/Users/abbyg/OneDrive/Desktop/Final Project '26/study-spots")
replacements = [
    ("blue-100", "[#dae2cb]"),
    ("blue-200", "[#dae2cb]"),
    ("blue-300", "[#dae2cb]"),
    ("blue-50", "[#dae2cb]"),
    ("blue-400", "[#dae2cb]"),
    ("blue-500", "[#0f3915]"),
    ("blue-600", "[#0f3915]"),
    ("blue-700", "[#0f3915]"),
    ("rgba(37,99,235,0.3)", "rgba(15,57,21,0.3)"),
    ("rgba(37,99,235,0.4)", "rgba(15,57,21,0.4)"),
]

for path in sorted(root.rglob('*.tsx')):
    if 'node_modules' in str(path):
        continue
    text = path.read_text(encoding='utf-8')
    new_text = text
    for old, new in replacements:
        new_text = new_text.replace(old, new)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        print(f'Updated {path.relative_to(root)}')

css_path = root / 'app' / 'globals.css'
css = css_path.read_text(encoding='utf-8')
new_css = css.replace(
    '  --background: #ffffff;\n  --foreground: #171717;\n',
    '  --background: #ffffff;\n  --foreground: #171717;\n  --primary-dark: #0f3915;\n  --primary-light: #dae2cb;\n'
)
if new_css != css:
    css_path.write_text(new_css, encoding='utf-8')
    print('Updated globals.css')
