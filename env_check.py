import sys
import os
print(f"Python: {sys.executable}")
print(f"Path: {sys.path}")
try:
    from google import genai
    print(f"genai source: {genai.__file__}")
except Exception as e:
    print(f"ERROR: {e}")
