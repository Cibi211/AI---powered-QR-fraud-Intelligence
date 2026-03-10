import urllib.parse

SUSPICIOUS_WORDS = [
    "refund",
    "reward",
    "bonus",
    "claim",
    "lottery",
    "cashback",
    "gift"
]

def detect_upi_scam(data):

    if not data.startswith("upi://"):
        return False, None

    parsed = urllib.parse.urlparse(data)

    params = urllib.parse.parse_qs(parsed.query)

    reasons = []

    # suspicious merchant name
    if "pn" in params:
        name = params["pn"][0].lower()

        for word in SUSPICIOUS_WORDS:
            if word in name:
                reasons.append("Suspicious reward keyword in merchant name")

    # suspicious payment amount
    if "am" in params:
        amount = params["am"][0]

        if float(amount) > 1000:
            reasons.append("High payment request detected")

    if reasons:
        return True, reasons

    return False, []