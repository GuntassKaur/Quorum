import os
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

def read_log(path):
    if os.path.exists(path):
        with open(path, 'rb') as f:
            content = f.read()
            for enc in ['utf-16le', 'utf-8', 'latin-1']:
                try:
                    text = content.decode(enc)
                    if '\x00' in text and enc != 'utf-16le':
                        continue
                    return text
                except:
                    continue
    return None

path = r"c:\Users\Guntass Kaur\Downloads\zoomai\lint_errors.txt"
text = read_log(path)
if text:
    print(text[:5000])
else:
    print("File not found")
