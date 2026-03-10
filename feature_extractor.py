from urllib.parse import urlparse

def extract_features(url):

    parsed = urlparse(url)
    domain = parsed.netloc

    features = []

    # URL length
    features.append(len(url))

    # number of dots
    features.append(url.count("."))

    # number of hyphens
    features.append(url.count("-"))

    # number of digits
    features.append(sum(c.isdigit() for c in url))

    # https
    features.append(1 if url.startswith("https") else 0)

    # suspicious words
    suspicious_words = [
        "login",
        "verify",
        "secure",
        "update",
        "account",
        "bank",
        "wallet",
        "pay"
    ]

    count = sum(word in url.lower() for word in suspicious_words)
    features.append(count)

    return features