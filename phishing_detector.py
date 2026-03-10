

from urllib.parse import urlparse


def detect_phishing(data):

    score = 0
    reasons = []

    # Only analyze URLs
    if data.startswith("http"):

        parsed = urlparse(data)
        domain = parsed.netloc.lower()

        # Suspicious domain patterns
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

        for word in suspicious_words:
            if word in domain:
                score += 15
                reasons.append(f"Suspicious domain keyword detected: {word}")
                break

        # Too many hyphens
        if domain.count("-") >= 3:
            score += 15
            reasons.append("Domain contains too many hyphens")

        # Long domain
        if len(domain) > 30:
            score += 10
            reasons.append("Unusually long domain")
        
        if "-" in domain:
            score += 10
            reasons.append("Suspicious hyphenated domain")

    return score, reasons