import os

def read_log(path):
    if os.path.exists(path):
        with open(path, 'rb') as f:
            content = f.read()
            # Try to detect encoding
            for enc in ['utf-16le', 'utf-8', 'latin-1']:
                try:
                    text = content.decode(enc)
                    if '\x00' in text and enc != 'utf-16le':
                        continue # Probably interpreted nulls as text
                    return text
                except:
                    continue
    return None

log_path = r"c:\Users\Guntass Kaur\Downloads\aiproject\server\server.log"
text = read_log(log_path)
if text:
    print(f"--- SERVER LOG (Last 50 lines) ---")
    lines = text.splitlines()
    for line in lines[-50:]:
        print(line)

models_log_path = r"c:\Users\Guntass Kaur\Downloads\aiproject\server\models.log"
text = read_log(models_log_path)
if text:
    print(f"\n--- MODELS LOG (Last 50 lines) ---")
    lines = text.splitlines()
    for line in lines[-50:]:
        print(line)
