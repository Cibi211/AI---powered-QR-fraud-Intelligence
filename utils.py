# import re
# import tldextract


# def extract_domain(url):

#     ext = tldextract.extract(url)

#     if ext.domain:
#         return ext.domain + "." + ext.suffix

#     return None


# SUSPICIOUS_PATTERNS = [
#     "bit.ly",
#     "tinyurl",
#     "free-gift",
#     "login-update",
#     "verify-account"
# ]


# def detect_suspicious_domain(url):

#     for pattern in SUSPICIOUS_PATTERNS:
#         if pattern in url.lower():
#             return True

#     return False


# def contains_keywords(text, keywords):

#     found = []

#     text = text.lower()

#     for word in keywords:
#         if word.lower() in text:
#             found.append(word)

#     return found