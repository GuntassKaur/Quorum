try:
    import google.genai
    print("google-genai: INSTALLED")
except ImportError:
    print("google-genai: NOT INSTALLED")

try:
    import google.generativeai
    print("google-generativeai: INSTALLED")
except ImportError:
    print("google-generativeai: NOT INSTALLED")

try:
    import flask
    print("flask: INSTALLED")
except ImportError:
    print("flask: NOT INSTALLED")
