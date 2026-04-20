import os

log_path = r"c:\Users\Guntass Kaur\Downloads\aiproject\server\server.log"
if os.path.exists(log_path):
    with open(log_path, 'rb') as f:
        content = f.read()
        for enc in ['utf-16le', 'utf-8', 'latin-1']:
            try:
                text = content.decode(enc)
                print(f"--- Decoded with {enc} ---")
                print(text[-2000:])
                break
            except:
                continue
else:
    print("Log file not found at", log_path)
