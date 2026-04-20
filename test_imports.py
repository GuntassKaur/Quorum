try:
    from google import genai
    print("SUCCESS: from google import genai")
except Exception as e:
    print(f"FAIL: from google import genai -> {e}")

try:
    import google.genai
    print("SUCCESS: import google.genai")
except Exception as e:
    print(f"FAIL: import google.genai -> {e}")
